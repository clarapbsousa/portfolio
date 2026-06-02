export default {
  async fetch(request, env, ctx) {
    // Manual trigger via HTTP GET
    if (request.method === 'GET') {
      await runScrape(env);
      return new Response('Scrape completed successfully', { status: 200 });
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
  try {
    await fetchGoodreads(env);
  } catch (err) {
    console.error('Goodreads scrape failed:', err);
  }

  try {
    await fetchLetterboxd(env);
  } catch (err) {
    console.error('Letterboxd scrape failed:', err);
  }

  // Trigger site rebuild
  await triggerDeployHook(env);
}

// ─── Goodreads ───

async function fetchGoodreads(env) {
  if (!env.GOODREADS_RSS_URL) {
    console.warn('GOODREADS_RSS_URL not set');
    return;
  }

  const response = await fetch(env.GOODREADS_RSS_URL, {
    headers: { Accept: 'application/rss+xml' },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: false,
    textNodeName: '#text',
  });

  const xmlText = await response.text();
  const parsed = parser.parse(xmlText);
  const items = parsed?.rss?.channel?.item;
  if (!items) return;

  const itemArray = Array.isArray(items) ? items : [items];

  let currentlyReading = [];
  let recentlyRead = [];

  for (const item of itemArray) {
    const book = parseGoodreadsItem(item);
    const shelves = (item.shelves || '').toLowerCase();
    
    if (shelves.includes('currently-reading')) {
      currentlyReading.push(book);
    } else {
      recentlyRead.push(book);
    }
  }

  const data = { currentlyReading, recentlyRead };
  await env.CACHE.put('goodreads', JSON.stringify(data), {
    expirationTtl: 172800, // 2 days
  });

  console.log(`Stored goodreads: ${currentlyReading.length} currently reading, ${recentlyRead.length} recently read`);
}

function parseGoodreadsItem(item) {
  const titleRaw = item.title || '';
  const author = item.author_name || null;
  let title = titleRaw;
  if (author && titleRaw.toLowerCase().endsWith(` by ${author.toLowerCase()}`)) {
    title = titleRaw.slice(0, -(` by ${author}`.length));
  }
  const coverUrl =
    item.book_large_image_url ||
    item.book_image_url ||
    item.book_medium_image_url ||
    item.book_small_image_url ||
    null;
  return { title: title.trim(), author, coverUrl };
}

// ─── Letterboxd ───

async function fetchLetterboxd(env) {
  if (!env.LETTERBOXD_RSS_URL) {
    console.warn('LETTERBOXD_RSS_URL not set');
    return;
  }

  const response = await fetch(env.LETTERBOXD_RSS_URL, {
    headers: { Accept: 'application/rss+xml' },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: false,
    textNodeName: '#text',
  });

  const xmlText = await response.text();
  const parsed = parser.parse(xmlText);
  const items = parsed?.rss?.channel?.item;
  if (!items) return;

  const itemArray = Array.isArray(items) ? items : [items];

  const films = [];
  for (const item of itemArray) {
    const film = parseLetterboxdItem(item);
    
    // Scrape poster from film page
    if (film.link) {
      try {
        const posterUrl = await scrapeLetterboxdPoster(film.link);
        if (posterUrl) {
          film.posterUrl = posterUrl;
        }
      } catch (err) {
        console.error(`Failed to scrape poster for ${film.title}:`, err.message);
      }
    }
    
    films.push(film);
  }

  const data = { films };
  await env.CACHE.put('letterboxd', JSON.stringify(data), {
    expirationTtl: 172800, // 2 days
  });

  console.log(`Stored letterboxd: ${films.length} films`);
}

function parseLetterboxdItem(item) {
  const filmTitle = item['letterboxd:filmTitle'] || '';
  const rawTitle = item.title || '';
  const title = filmTitle || rawTitle.split(' - ')[0] || rawTitle;
  const director = item['dc:creator'] || null;
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
    
    // Extract og:image meta tag
    const ogImageMatch = html.match(/<<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
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

// Simple XMLParser for Worker environment (Cloudflare Workers don't have npm modules easily)
// If your worker already has fast-xml-parser, use that instead
class XMLParser {
  constructor(options = {}) {
    this.options = options;
  }

  parse(xml) {
    // Basic XML to object parser
    // For production, use a proper XML parser library
    const result = { rss: { channel: { item: [] } } };
    
    // Extract items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const item = {};
      
      // Extract fields
      const fields = ['title', 'link', 'author_name', 'shelves', 'book_large_image_url', 'book_image_url', 'book_medium_image_url', 'book_small_image_url', 'dc:creator', 'letterboxd:filmTitle', 'letterboxd:memberRating'];
      for (const field of fields) {
        const fieldMatch = itemXml.match(new RegExp(`<${field}>([^<]*)</${field}>`));
        if (fieldMatch) {
          item[field] = fieldMatch[1];
        }
      }
      
      result.rss.channel.item.push(item);
    }
    
    return result;
  }
}