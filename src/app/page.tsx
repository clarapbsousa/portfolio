import { readFile } from 'fs/promises';
import { join } from 'path';
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

async function loadGoodreadsData(): Promise<{ data: GoodreadsPayload; error: boolean }> {
    try {
        const filePath = join(process.cwd(), 'public/data/goodreads.json');
        const raw = await readFile(filePath, 'utf8');
        const data = JSON.parse(raw) as GoodreadsPayload;
        return { data, error: false };
    } catch {
        return { data: emptyGoodreads, error: true };
    }
}

async function loadLetterboxdData(): Promise<{ data: LetterboxdPayload; error: boolean }> {
    try {
        const filePath = join(process.cwd(), 'public/data/letterboxd.json');
        const raw = await readFile(filePath, 'utf8');
        const data = JSON.parse(raw) as LetterboxdPayload;
        return { data, error: false };
    } catch {
        return { data: emptyLetterboxd, error: true };
    }
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
