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

async function fetchGoodreads(scraperUrl: string | undefined) {
    if (!scraperUrl) {
        return { data: emptyGoodreads, error: true };
    }

    try {
        const response = await fetch(`${scraperUrl}/goodreads`);
        if (!response.ok) {
            throw new Error("Failed Goodreads fetch");
        }
        const data = (await response.json()) as GoodreadsPayload;
        return { data, error: false };
    } catch {
        return { data: emptyGoodreads, error: true };
    }
}

async function fetchLetterboxd(scraperUrl: string | undefined) {
    if (!scraperUrl) {
        return { data: emptyLetterboxd, error: true };
    }

    try {
        const response = await fetch(`${scraperUrl}/letterboxd`);
        if (!response.ok) {
            throw new Error("Failed Letterboxd fetch");
        }
        const data = (await response.json()) as LetterboxdPayload;
        return { data, error: false };
    } catch {
        return { data: emptyLetterboxd, error: true };
    }
}

export default async function Home() {
    const scraperUrl = process.env.SCRAPER_SERVICE_URL;

    const [goodreadsResult, letterboxdResult] = await Promise.all([
        fetchGoodreads(scraperUrl),
        fetchLetterboxd(scraperUrl),
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
