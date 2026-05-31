import { readFile } from 'fs/promises';
import { join } from 'path';
import { XMLParser } from 'fast-xml-parser';
import HomeClient from "./homeClient";
import "./global.css";

export const revalidate = 86400;

type GoodreadsBook = {
    title: string;
    author?: string | null;
    coverUrl?: string | null;
};

type LetterboxdFilm = {
    title: string;
    director?: string | null;
    link?: string | null;
    posterUrl?: string | null;
    rating?: string | null;
};

type GoodreadsPayload = {
    currentlyReading: GoodreadsBook[];
    recentlyRead: GoodreadsBook[];
};

type LetterboxdPayload = {
    films: LetterboxdFilm[];
};

const emptyGoodreads: GoodreadsPayload = { currentlyReading: [], recentlyRead: [] };
const emptyLetterboxd: LetterboxdPayload = { films: [] };

const GOODREADS_RSS_URL = process.env.GOODREADS_RSS_URL || 'https://www.goodreads.com/review/list_rss/144450064';
const LETTERBOXD_RSS_URL = process.env.LETTERBOXD_RSS_URL || 'https://letterboxd.com/clarapbsousa/rss/';

async function loadLocalJson<T>(fileName: string, fallback: T): Promise<{ data: T; error: boolean }> {
    try {
        const filePath = join(process.cwd(), 'public/data', fileName);
        const raw = await readFile(filePath, 'utf8');
        const data = JSON.parse(raw) as T;
        return { data, error: false };
    } catch {
        return { data: fallback, error: true };
    }
}

function decimalToStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? '½' : '';
    return '★'.repeat(full) + half;
}

function parseGoodreadsItems(items: any[]): GoodreadsBook[] {
    return items.map((item: any) => {
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
    });
}

async function fetchGoodreadsRSS(): Promise<GoodreadsPayload> {
    const baseUrl = GOODREADS_RSS_URL.replace(/\/?$/, '');

    try {
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

        let currentlyReading: GoodreadsBook[] = [];
        let recentlyRead: GoodreadsBook[] = [];

        if (currentlyReadingRes.ok) {
            const parsed = parser.parse(await currentlyReadingRes.text());
            const items = parsed?.rss?.channel?.item;
            if (items) {
                currentlyReading = parseGoodreadsItems(Array.isArray(items) ? items : [items]);
            }
        }

        if (readRes.ok) {
            const parsed = parser.parse(await readRes.text());
            const items = parsed?.rss?.channel?.item;
            if (items) {
                recentlyRead = parseGoodreadsItems(Array.isArray(items) ? items : [items]);
            }
        }

        return { currentlyReading, recentlyRead };
    } catch {
        return emptyGoodreads;
    }
}

async function fetchLetterboxdRSS(): Promise<LetterboxdPayload> {
    try {
        const response = await fetch(LETTERBOXD_RSS_URL, {
            headers: { Accept: 'application/rss+xml' },
        });

        if (!response.ok) {
            return emptyLetterboxd;
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
        if (!items) return emptyLetterboxd;

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

            return { title: title.trim(), director, link, posterUrl: null, rating };
        });

        return { films };
    } catch {
        return emptyLetterboxd;
    }
}

async function loadGoodreadsData(): Promise<{ data: GoodreadsPayload; error: boolean }> {
    // Try local JSON first (from KV/build script)
    const local = await loadLocalJson<GoodreadsPayload>('goodreads.json', emptyGoodreads);
    if (!local.error) {
        return local;
    }

    // Fallback: fetch RSS directly at build time
    console.log('Goodreads local JSON not found, fetching RSS directly...');
    const data = await fetchGoodreadsRSS();
    const hasData = data.currentlyReading.length > 0 || data.recentlyRead.length > 0;
    return { data, error: !hasData };
}

async function loadLetterboxdData(): Promise<{ data: LetterboxdPayload; error: boolean }> {
    // Try local JSON first (from KV/build script)
    const local = await loadLocalJson<LetterboxdPayload>('letterboxd.json', emptyLetterboxd);
    if (!local.error) {
        return local;
    }

    // Fallback: fetch RSS directly at build time
    console.log('Letterboxd local JSON not found, fetching RSS directly...');
    const data = await fetchLetterboxdRSS();
    const hasData = data.films.length > 0;
    return { data, error: !hasData };
}

export default async function Home() {
    const [goodreadsResult, letterboxdResult] = await Promise.all([
        loadGoodreadsData(),
        loadLetterboxdData(),
    ]);

    return (
        <HomeClient
            goodreadsBooks={goodreadsResult.data.currentlyReading}
            recentlyReadBooks={goodreadsResult.data.recentlyRead}
            letterboxdFilms={letterboxdResult.data.films}
            goodreadsError={goodreadsResult.error}
            letterboxdError={letterboxdResult.error}
        />
    );
}
