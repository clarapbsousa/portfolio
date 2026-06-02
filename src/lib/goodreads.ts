import { XMLParser } from 'fast-xml-parser';
import { GoodreadsBook, GoodreadsPayload } from '@/types';
import { loadLocalJson } from './utils';

const emptyGoodreads: GoodreadsPayload = { currentlyReading: [], recentlyRead: [] };

function parseGoodreadsItem(item: any): GoodreadsBook {
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

async function fetchGoodreadsRSS(): Promise<GoodreadsPayload> {
    const GOODREADS_RSS_URL = process.env.GOODREADS_RSS_URL;

    if (!GOODREADS_RSS_URL) {
        console.warn('GOODREADS_RSS_URL not set, skipping RSS fetch');
        return emptyGoodreads;
    }

    try {
        const response = await fetch(GOODREADS_RSS_URL, {
            headers: { Accept: 'application/rss+xml' },
        });

        if (!response.ok) {
            return emptyGoodreads;
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
        if (!items) return emptyGoodreads;

        const itemArray = Array.isArray(items) ? items : [items];

        let currentlyReading: GoodreadsBook[] = [];
        let recentlyRead: GoodreadsBook[] = [];

        for (const item of itemArray) {
            const book = parseGoodreadsItem(item);
            const shelves = (item.shelves || '').toLowerCase();
            
            if (shelves.includes('currently-reading')) {
                currentlyReading.push(book);
            } else {
                recentlyRead.push(book);
            }
        }

        return { currentlyReading, recentlyRead };
    } catch {
        return emptyGoodreads;
    }
}

export async function loadGoodreadsData(): Promise<{ data: GoodreadsPayload; error: boolean }> {
    const local = await loadLocalJson<GoodreadsPayload>('goodreads.json', emptyGoodreads);
    if (!local.error) {
        return local;
    }

    console.log('Goodreads local JSON not found, fetching RSS directly...');
    const data = await fetchGoodreadsRSS();
    const hasData = data.currentlyReading.length > 0 || data.recentlyRead.length > 0;
    return { data, error: !hasData };
}
