import { XMLParser } from 'fast-xml-parser';

export interface Env {
  PORTFOLIO_KV: KVNamespace;
  GOODREADS_RSS_URL: string;
  LETTERBOXD_RSS_URL: string;
  PAGES_DEPLOY_HOOK_URL: string;
}

type GoodreadsBook = {
  title: string;
  author: string | null;
  coverUrl: string | null;
};

type LetterboxdFilm = {
  title: string;
  director: string | null;
  link: string | null;
  posterUrl: string | null;
  rating: string | null;
};

type GoodreadsPayload = {
  currentlyReading: GoodreadsBook[];
  recentlyRead: GoodreadsBook[];
};

type LetterboxdPayload = {
  films: LetterboxdFilm[];
};

const TWO_DAYS_SECONDS = 172800; // 2 days TTL

function decimalToStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? '½' : '';
  return '★'.repeat(full) + half;
}

async function fetchGoodreads(env: Env): Promise<GoodreadsPayload> {
  const baseUrl = env.GOODREADS_RSS_URL.replace(/\/?$/, '');

  const [currentlyReadingRes, readRes] = await Promise.all([
    fetch(`${baseUrl}?shelf=currently-reading`, { headers: { Accept: 'application/rss+xml' } }),
    fetch(`${baseUrl}?shelf=read`, { headers: { Accept: 'application/rss+xml' } }),
  ]);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: false,
    textNodeName: '#text',
  });

  const parseItems = (xmlText: string): GoodreadsBook[] => {
    const parsed = parser.parse(xmlText);
    const items = parsed?.rss?.channel?.item;
    if (!items) return [];
    const itemArray = Array.isArray(items) ? items : [items];

    return itemArray.map((item: any) => {
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

      return {
        title: title.trim(),
        author,
        coverUrl,
      };
    });
  };

  const currentlyReading = currentlyReadingRes.ok ? parseItems(await currentlyReadingRes.text()) : [];
  const recentlyRead = readRes.ok ? parseItems(await readRes.text()) : [];

  return { currentlyReading, recentlyRead };
}

async function fetchLetterboxd(env: Env): Promise<LetterboxdPayload> {
  const response = await fetch(env.LETTERBOXD_RSS_URL, {
    headers: { Accept: 'application/rss+xml' },
  });

  if (!response.ok) {
    return { films: [] };
  }

  const xmlText = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: false,
    textNodeName: '#text',
  });

  const parsed = parser.parse(xmlText);
  const items = parsed?.rss?.channel?.item;
  if (!items) return { films: [] };
  const itemArray = Array.isArray(items) ? items : [items];

  const films: LetterboxdFilm[] = itemArray.map((item: any) => {
    const filmTitle = item['letterboxd:filmTitle'] || '';
    const rawTitle = item.title || '';
    const title = filmTitle || rawTitle.split(' - ')[0] || rawTitle;

    const director = item['dc:creator'] || null;
    const link = item.link || null;

    const ratingRaw = item['letterboxd:memberRating'];
    let rating: string | null = null;
    if (ratingRaw !== undefined && ratingRaw !== null) {
      const num = parseFloat(ratingRaw);
      if (!isNaN(num)) {
        rating = decimalToStars(num);
      }
    }

    return {
      title: title.trim(),
      director,
      link,
      posterUrl: null, // RSS does not include poster URLs; page.tsx handles missing gracefully
      rating,
    };
  });

  return { films };
}

async function triggerDeployHook(env: Env): Promise<void> {
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

export default {
  async fetch(_request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    return new Response('Portfolio scraper worker. Runs on cron schedule.', { status: 200 });
  },

  async scheduled(_controller: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
    console.log('Running scheduled scrape at', new Date().toISOString());

    try {
      const goodreadsData = await fetchGoodreads(env);
      await env.PORTFOLIO_KV.put('goodreads', JSON.stringify(goodreadsData), {
        expirationTtl: TWO_DAYS_SECONDS,
      });
      console.log(`Stored goodreads: ${goodreadsData.currentlyReading.length} currently reading, ${goodreadsData.recentlyRead.length} recently read`);
    } catch (err) {
      console.error('Goodreads scrape failed:', err);
    }

    try {
      const letterboxdData = await fetchLetterboxd(env);
      await env.PORTFOLIO_KV.put('letterboxd', JSON.stringify(letterboxdData), {
        expirationTtl: TWO_DAYS_SECONDS,
      });
      console.log(`Stored letterboxd: ${letterboxdData.films.length} films`);
    } catch (err) {
      console.error('Letterboxd scrape failed:', err);
    }

    // Trigger a new Cloudflare Pages build so the updated KV data is baked into static HTML
    await triggerDeployHook(env);
  },
};
