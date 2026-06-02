import { XMLParser } from 'fast-xml-parser';
import { LetterboxdPayload, LetterboxdFilm } from '@/types';
import { decimalToStars, loadLocalJson } from './utils';

const emptyLetterboxd: LetterboxdPayload = { films: [] };

async function fetchLetterboxdRSS(): Promise<LetterboxdPayload> {
    const LETTERBOXD_RSS_URL = process.env.LETTERBOXD_RSS_URL;

    if (!LETTERBOXD_RSS_URL) {
        console.warn('LETTERBOXD_RSS_URL not set, skipping RSS fetch');
        return emptyLetterboxd;
    }

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

export async function loadLetterboxdData(): Promise<{ data: LetterboxdPayload; error: boolean }> {
    const local = await loadLocalJson<LetterboxdPayload>('letterboxd.json', emptyLetterboxd);
    if (!local.error) {
        return local;
    }

    console.log('Letterboxd local JSON not found, fetching RSS directly...');
    const data = await fetchLetterboxdRSS();
    const hasData = data.films.length > 0;
    return { data, error: !hasData };
}
