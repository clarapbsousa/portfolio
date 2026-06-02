export default {
  async fetch(request, env, ctx) {
    // Manual trigger via HTTP GET
    if (request.method === 'GET') {
      const results = await runScrape(env);
      return new Response(JSON.stringify(results, null, 2), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response('Method not allowed', { status: 405 });
  },

  async scheduled(controller, env, ctx) {
    // Cron trigger (runs automatically)
    console.log('Running scheduled scrape at', new Date().toISOString());
    await runScrape(env);
  },
};

async function runScrape(env) {
  const results = {
    goodreads: { success: false, error: null, data: null },
    letterboxd: { success: false, error: null, data: null },
    deployHook: { success: false, error: null }
  };

  try {
    results.goodreads.data = await fetchGoodreads(env);
    results.goodreads.success = true;
    console.log('Goodreads scrape completed successfully');
  } catch (err) {
    results.goodreads.success = false;
    results.goodreads.error = err.message || String(err);
    console.error('Goodreads scrape failed:', err);
  }

  try {
    results.letterboxd.data = await fetchLetterboxd(env);
    results.letterboxd.success = true;
    console.log('Letterboxd scrape completed successfully');
  } catch (err) {
    results.letterboxd.success = false;
    results.letterboxd.error = err.message || String(err);
    console.error('Letterboxd scrape failed:', err);
  }

  // Trigger site rebuild
  try {
    await triggerDeployHook(env);
    results.deployHook.success = true;
  } catch (err) {
    results.deployHook.error = err.message || String(err);
    console.error('Deploy hook failed:', err);
  }

  return results;
}

// ─── Goodreads ───

async function fetchGoodreads(env) {
  console.log('=== Starting Goodreads fetch ===');
  
  if (!env.GOODREADS_RSS_URL) {
    throw new Error('GOODREADS_RSS_URL environment variable is not set');
  }

  console.log('Fetching RSS from:', env.GOODREADS_RSS_URL);

  const response = await fetch(env.GOODREADS_RSS_URL, {
    headers: {
      'Accept': 'application/rss+xml, application/xml; q=0.9, */*; q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.goodreads.com/',
      'Connection': 'keep-alive',
    },
  });

  console.log('Goodreads RSS response status:', response.status);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const xmlText = await response.text();
  console.log('Goodreads RSS response length:', xmlText.length, 'characters');

  // Parse XML
  const parser = new XMLParser();
  const parsed = parser.parse(xmlText);
  
  console.log('Parsed XML structure keys:', Object.keys(parsed || {}));
  
  if (!parsed || !parsed.rss || !parsed.rss.channel) {
    throw new Error('Invalid RSS structure: missing rss.channel');
  }

  const items = parsed.rss.channel.item;
  console.log('Number of items found:', items ? items.length : 0);

  if (!items || items.length === 0) {
    throw new Error('No items found in RSS feed');
  }

  let currentlyReading = [];
  let recentlyRead = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const book = parseGoodreadsItem(item);
    
    // Log first few items for debugging
    if (i < 3) {
      console.log(`Item ${i}:`, {
        title: book.title,
        shelves: book.shelves || 'MISSING',
        readAt: book.readAt || 'NOT READ',
        rating: book.rating || 'NO RATING'
      });
    }
    
    // Skip "to-read" books
    const shelves = (book.shelves || '').toLowerCase();
    if (shelves.includes('to-read') && !book.readAt && !book.rating) {
      console.log(`Skipping "to-read" book: ${book.title}`);
      continue;
    }
    
    // Check if currently reading (has currently-reading shelf but no read date)
    const isCurrentlyReading = shelves.includes('currently-reading') && !book.readAt;
    
    if (isCurrentlyReading) {
      currentlyReading.push(book);
    } else {
      recentlyRead.push(book);
    }
  }

  // Sort recentlyRead by read date (most recent first)
  recentlyRead.sort((a, b) => {
    if (!a.readAt) return 1;
    if (!b.readAt) return -1;
    return new Date(b.readAt) - new Date(a.readAt);
  });

  // Take only first currently-reading + 2 most recent read
  const limitedCurrentlyReading = currentlyReading.slice(0, 1);
  const limitedRecentlyRead = recentlyRead.slice(0, 2);

  console.log(`Categorized: ${limitedCurrentlyReading.length} currently reading, ${limitedRecentlyRead.length} recently read (skipped ${items.length - limitedCurrentlyReading.length - limitedRecentlyRead.length})`);

  const data = { currentlyReading: limitedCurrentlyReading, recentlyRead: limitedRecentlyRead };
  
  // Store in KV
  console.log('Storing goodreads data in KV...');
  await env.CACHE.put('goodreads', JSON.stringify(data), {
    expirationTtl: 172800, // 2 days
  });

  console.log(`=== Goodreads fetch complete: ${limitedCurrentlyReading.length} currently reading, ${limitedRecentlyRead.length} recently read ===`);
  
  return data;
}

function parseGoodreadsItem(item) {
  const titleRaw = item.title || '';
  const author = item.author_name || null;
  let title = titleRaw;
  
  // Remove " by Author" suffix if present
  if (author && titleRaw.toLowerCase().endsWith(` by ${author.toLowerCase()}`)) {
    title = titleRaw.slice(0, -(` by ${author}`.length));
  }
  
  // Parse description text for additional fields
  const description = item.description || '';
  const parsedDesc = parseGoodreadsDescription(description);
  
  // Get cover URL - prefer medium size (_SX98_)
  let coverUrl = parsedDesc.coverUrl || null;
  if (coverUrl) {
    // Upgrade to medium size if it's a small thumbnail
    coverUrl = coverUrl
      .replace('_SX50_', '_SX98_')
      .replace('_SY75_', '_SX98_')
      .replace('_SY475_', '_SX98_');
  }
    
  return { 
    title: title.trim(), 
    author, 
    coverUrl,
    shelves: parsedDesc.shelves,
    readAt: parsedDesc.readAt,
    rating: parsedDesc.rating
  };
}

function parseGoodreadsDescription(description) {
  if (!description) {
    return { shelves: null, readAt: null, rating: null, coverUrl: null };
  }
  
  const result = {
    shelves: null,
    readAt: null,
    rating: null,
    coverUrl: null
  };
  
  // Extract shelves
  const shelvesMatch = description.match(/shelves:\s*([^<\n]+)/i);
  if (shelvesMatch) {
    result.shelves = shelvesMatch[1].trim();
  }
  
  // Extract read at date
  const readAtMatch = description.match(/read at:\s*([^<\n]+)/i);
  if (readAtMatch) {
    const readAtStr = readAtMatch[1].trim();
    // Only set if it's not empty
    if (readAtStr && readAtStr.length > 0) {
      result.readAt = readAtStr;
    }
  }
  
  // Extract rating (user's rating, not average)
  const ratingMatch = description.match(/rating:\s*(\d+(?:\.\d+)?)/i);
  if (ratingMatch) {
    const ratingValue = parseFloat(ratingMatch[1]);
    if (ratingValue > 0) {
      result.rating = ratingValue;
    }
  }
  
  // Extract cover image from <img> tag
  const imgMatch = description.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) {
    result.coverUrl = imgMatch[1];
  }
  
  return result;
}

// ─── Letterboxd ───

async function fetchLetterboxd(env) {
  console.log('=== Starting Letterboxd fetch ===');
  
  if (!env.LETTERBOXD_RSS_URL) {
    throw new Error('LETTERBOXD_RSS_URL environment variable is not set');
  }

  console.log('Fetching RSS from:', env.LETTERBOXD_RSS_URL);

  const response = await fetch(env.LETTERBOXD_RSS_URL, {
    headers: { Accept: 'application/rss+xml' },
  });

  console.log('Letterboxd RSS response status:', response.status);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const xmlText = await response.text();
  console.log('Letterboxd RSS response length:', xmlText.length, 'characters');

  const parser = new XMLParser();
  const parsed = parser.parse(xmlText);
  
  if (!parsed || !parsed.rss || !parsed.rss.channel) {
    throw new Error('Invalid RSS structure: missing rss.channel');
  }

  const items = parsed.rss.channel.item;
  console.log('Number of film items found:', items ? items.length : 0);

  if (!items || items.length === 0) {
    throw new Error('No items found in RSS feed');
  }

  const films = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const film = parseLetterboxdItem(item);
    
    // Log first few items
    if (i < 3) {
      console.log(`Film ${i}:`, {
        title: film.title,
        description: film.description,
        link: film.link ? 'PRESENT' : 'MISSING'
      });
    }
    
    // Scrape poster from film page (only first 4 since site shows 4 movies)
    if (film.link && i < 4) {
      try {
        console.log(`Scraping poster for: ${film.title}`);
        const posterUrl = await scrapeLetterboxdPoster(film.link);
        if (posterUrl && !posterUrl.includes('empty-poster')) {
          film.posterUrl = posterUrl;
          console.log(`Found poster for ${film.title}: ${posterUrl}`);
        } else {
          console.log(`No real poster found for ${film.title}`);
        }
      } catch (err) {
        console.error(`Failed to scrape poster for ${film.title}:`, err.message);
      }
    }
    
    films.push(film);
  }

  const data = { films };
  
  console.log('Storing letterboxd data in KV...');
  await env.CACHE.put('letterboxd', JSON.stringify(data), {
    expirationTtl: 172800, // 2 days
  });

  console.log(`=== Letterboxd fetch complete: ${films.length} films ===`);
  
  return data;
}

function parseLetterboxdItem(item) {
  const filmTitle = item['letterboxd:filmTitle'] || '';
  const rawTitle = item.title || '';
  const title = filmTitle || rawTitle.split(' - ')[0] || rawTitle;
  
  // dc:creator in Letterboxd RSS is the USER, not the description
  // We'll set it to null and let the UI handle it
  const description = null;
  const link = item.link || null;

  const ratingRaw = item['letterboxd:memberRating'];
  let rating = null;
  if (ratingRaw !== undefined && ratingRaw !== null) {
    const num = parseFloat(ratingRaw);
    if (!isNaN(num)) {
      rating = decimalToStars(num);
    }
  }

  return { title: title.trim(), description, link, posterUrl: null, rating };
}

function decimalToStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? '½' : '';
  return '★'.repeat(full) + half;
}

async function scrapeLetterboxdPoster(filmUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

  try {
    const response = await fetch(filmUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Extract og:image meta tag - handle both quote styles
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogImageMatch) {
      return ogImageMatch[1];
    }

    // Fallback: look for film-poster class
    const posterMatch = html.match(/<div[^>]*class=["'][^"']*film-poster[^"']*["'][^>]*>.*?<img[^>]*src=["']([^"']+)["']/is);
    if (posterMatch) {
      return posterMatch[1];
    }

    return null;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ─── Deploy Hook ───

async function triggerDeployHook(env) {
  if (!env.PAGES_DEPLOY_HOOK_URL) {
    console.warn('PAGES_DEPLOY_HOOK_URL not set, skipping deploy trigger');
    return;
  }

  console.log('Triggering deploy hook...');

  try {
    const response = await fetch(env.PAGES_DEPLOY_HOOK_URL, { method: 'POST' });
    if (response.ok) {
      console.log('Deploy hook triggered successfully');
    } else {
      console.error(`Deploy hook failed: HTTP ${response.status}`);
    }
  } catch (err) {
    console.error('Failed to trigger deploy hook:', err);
  }
}

// ─── XML Parser ───

class XMLParser {
  constructor(options = {}) {
    this.options = options;
  }

  parse(xml) {
    const result = { rss: { channel: { item: [] } } };
    
    // Extract items by splitting on <item> tags
    const parts = xml.split('<item>');
    
    for (let i = 1; i < parts.length; i++) {
      const itemXml = parts[i].split('</item>')[0];
      const item = this.parseItem(itemXml);
      result.rss.channel.item.push(item);
    }
    
    console.log(`XMLParser: Extracted ${result.rss.channel.item.length} items`);
    
    return result;
  }

  parseItem(xml) {
    const item = {};
    
    // List of known fields to extract
    const fields = [
      'title',
      'link', 
      'author_name',
      'shelves',
      'book_large_image_url',
      'book_image_url', 
      'book_medium_image_url',
      'book_small_image_url',
      'description',
      'pubDate',
      'guid',
      'isbn',
      'isbn13'
    ];
    
    for (const field of fields) {
      const value = this.extractField(xml, field);
      if (value !== null) {
        item[field] = value;
      }
    }
    
    // Also extract namespaced fields (Letterboxd)
    const namespacedFields = [
      'letterboxd:filmTitle',
      'letterboxd:filmYear',
      'letterboxd:memberRating',
      'dc:creator'
    ];
    
    for (const field of namespacedFields) {
      const value = this.extractField(xml, field);
      if (value !== null) {
        item[field] = value;
      }
    }
    
    return item;
  }

  extractField(xml, fieldName) {
    // Match field with or without namespace
    const escapedName = fieldName.replace(/:/g, '\\:');
    const regex = new RegExp(`<${fieldName}>([\\s\\S]*?)<\\/${fieldName}>`, 'i');
    const match = xml.match(regex);
    
    if (match) {
      let value = match[1];
      
      // Remove CDATA wrapper if present
      if (value.startsWith('<![CDATA[') && value.endsWith(']]>')) {
        value = value.slice(9, -3);
      }
      
      // Trim whitespace
      value = value.trim();
      
      // Decode basic HTML entities
      value = value
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      return value;
    }
    
    return null;
  }
}
