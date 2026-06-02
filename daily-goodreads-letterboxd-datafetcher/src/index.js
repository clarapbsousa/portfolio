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
    
    // Log first few items for debugging
    if (i < 3) {
      console.log(`Item ${i} raw fields:`, {
        title: item.title ? item.title.substring(0, 50) : 'MISSING',
        author_name: item.author_name || 'MISSING',
        shelves: item.shelves || 'MISSING',
        book_large_image_url: item.book_large_image_url ? 'PRESENT' : 'MISSING'
      });
    }

    const book = parseGoodreadsItem(item);
    const shelves = (item.shelves || '').toLowerCase();
    
    // Check multiple shelf patterns
    const isCurrentlyReading = 
      shelves.includes('currently-reading') || 
      shelves.includes('currently reading');
    
    if (isCurrentlyReading) {
      currentlyReading.push(book);
    } else {
      recentlyRead.push(book);
    }
  }

  console.log(`Categorized: ${currentlyReading.length} currently reading, ${recentlyRead.length} recently read`);

  const data = { currentlyReading, recentlyRead };
  
  // Store in KV
  console.log('Storing goodreads data in KV...');
  await env.CACHE.put('goodreads', JSON.stringify(data), {
    expirationTtl: 172800, // 2 days
  });

  console.log(`=== Goodreads fetch complete: ${currentlyReading.length} currently reading, ${recentlyRead.length} recently read ===`);
  
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
  
  // Try multiple cover image fields
  const coverUrl =
    item.book_large_image_url ||
    item.book_image_url ||
    item.book_medium_image_url ||
    item.book_small_image_url ||
    extractImageFromDescription(item.description) ||
    null;
    
  return { title: title.trim(), author, coverUrl };
}

function extractImageFromDescription(description) {
  if (!description) return null;
  // Try to extract img src from HTML description
  const imgMatch = description.match(/<img[^>]*src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
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
        director: film.director,
        link: film.link ? 'PRESENT' : 'MISSING'
      });
    }
    
    // Scrape poster from film page (limit to first 10 to avoid worker timeout)
    if (film.link && i < 10) {
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
  
  // dc:creator in Letterboxd RSS is the USER, not the director
  // We'll set it to null and let the UI handle it
  const director = null;
  const link = item.link || null;

  const ratingRaw = item['letterboxd:memberRating'];
  let rating = null;
  if (ratingRaw !== undefined && ratingRaw !== null) {
    const num = parseFloat(ratingRaw);
    if (!isNaN(num)) {
      rating = decimalToStars(num);
    }
  }

  return { title: title.trim(), director, link, posterUrl: null, rating };
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
    
    // Extract channel info
    const channelMatch = xml.match(/<channel>([\s\S]*?)<\/channel>/);
    if (!channelMatch) {
      console.error('No <channel> found in XML');
      return result;
    }
    
    const channelXml = channelMatch[1];
    
    // Extract items using a more robust regex
    // Split by <item> tags instead of regex matching
    const parts = xml.split('<item>');
    
    for (let i = 1; i < parts.length; i++) {
      const itemXml = parts[i].split('</item>')[0];
      const item = {};
      
      // Extract all simple fields
      const tagRegex = /<([^>]+)>([^<]*)<\/\1>/g;
      let match;
      while ((match = tagRegex.exec(itemXml)) !== null) {
        const tagName = match[1].trim();
        // Handle namespaced tags by keeping the full name
        item[tagName] = match[2];
      }
      
      // Also try to extract fields with namespace prefixes
      // e.g., <letterboxd:filmTitle>...</letterboxd:filmTitle>
      const namespacedRegex = /<([\w:]+)>([^<]*)<\/\1>/g;
      while ((match = namespacedRegex.exec(itemXml)) !== null) {
        item[match[1]] = match[2];
      }
      
      // Extract CDATA content for description
      const cdataMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
      if (cdataMatch) {
        item.description = cdataMatch[1];
      }
      
      result.rss.channel.item.push(item);
    }
    
    console.log(`XMLParser: Extracted ${result.rss.channel.item.length} items`);
    
    return result;
  }
}
