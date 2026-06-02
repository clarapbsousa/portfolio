export type GoodreadsBook = {
    title: string;
    author?: string | null;
    coverUrl?: string | null;
};

export type LetterboxdFilm = {
    title: string;
    link?: string | null;
    posterUrl?: string | null;
    rating?: string | null;
};

export type GoodreadsPayload = {
    currentlyReading: GoodreadsBook[];
    recentlyRead: GoodreadsBook[];
};

export type LetterboxdPayload = {
    films: LetterboxdFilm[];
};

export type SectionId = "about" | "projects" | "media" | "contact";

export type NavItem = { id: SectionId; label: string; icon: string };
