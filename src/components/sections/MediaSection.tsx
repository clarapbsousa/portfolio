"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { GoodreadsBook, LetterboxdFilm } from "@/types";

type MediaSectionProps = {
    goodreadsBooks: GoodreadsBook[];
    recentlyReadBooks: GoodreadsBook[];
    letterboxdFilms: LetterboxdFilm[];
    goodreadsError: boolean;
    letterboxdError: boolean;
};

export default function MediaSection({
    goodreadsBooks,
    recentlyReadBooks,
    letterboxdFilms,
    goodreadsError,
    letterboxdError,
}: MediaSectionProps) {
    const t = useTranslations("Media");

    return (
        <section id="media" className="media-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        {t("title")}
                    </h2>
                    <span className="section-note">{t("subtitle")}</span>
                </div>

                <div className="media-grid">
                    <div className="media-category">
                        <h3>
                            <span className="media-icon">📚</span> {t("currentlyReading")}
                        </h3>
                        <div className="book-list">
                            {goodreadsError && (
                                <div className="media-item">
                                    <div className="media-thumb">{t("bookPlaceholder")}</div>
                                    <div className="media-info">
                                        <h4>{t("goodreadsUnavailable")}</h4>
                                        <div className="media-creator">
                                            {t("goodreadsUnavailableSub")}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!goodreadsError && goodreadsBooks.length === 0 && (
                                <div className="media-item">
                                    <div className="media-thumb">{t("bookPlaceholder")}</div>
                                    <div className="media-info">
                                        <h4>{t("noBooksFound")}</h4>
                                        <div className="media-creator">
                                            {t("updateGoodreads")}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!goodreadsError &&
                                goodreadsBooks.slice(0, 1).map((book, index) => (
                                    <div
                                        className="media-item"
                                        key={`${book.title}-${index}`}
                                    >
                                        {book.coverUrl ? (
                                            <Image
                                                className="media-thumb media-thumb--image"
                                                src={book.coverUrl}
                                                alt={`${book.title} cover`}
                                                width={50}
                                                height={70}
                                            />
                                        ) : (
                                            <div className="media-thumb">{t("bookPlaceholder")}</div>
                                        )}
                                        <div className="media-info">
                                            <h4>{book.title}</h4>
                                            <div className="media-creator">
                                                {book.author ?? "Goodreads"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="book-divider" />

                        <h4 className="media-subtitle">{t("recentlyRead")}</h4>
                        <div className="book-list">
                            {!goodreadsError && recentlyReadBooks.length === 0 && (
                                <div className="media-item">
                                    <div className="media-thumb">{t("bookPlaceholder")}</div>
                                    <div className="media-info">
                                        <h4>{t("noRecentReads")}</h4>
                                        <div className="media-creator">
                                            {t("updateReadShelf")}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!goodreadsError &&
                                recentlyReadBooks.slice(0, 2).map((book, index) => (
                                    <div
                                        className="media-item"
                                        key={`${book.title}-${index}-recent`}
                                    >
                                        {book.coverUrl ? (
                                            <Image
                                                className="media-thumb media-thumb--image"
                                                src={book.coverUrl}
                                                alt={`${book.title} cover`}
                                                width={50}
                                                height={70}
                                            />
                                        ) : (
                                            <div className="media-thumb">{t("bookPlaceholder")}</div>
                                        )}
                                        <div className="media-info">
                                            <h4>{book.title}</h4>
                                            <div className="media-creator">
                                                {book.author ?? "Goodreads"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="media-category">
                        <h3>
                            <span className="media-icon">🎬</span> {t("recentlyWatched")}
                        </h3>
                        <div className="movie-list">
                            {letterboxdError && (
                                <div className="media-item">
                                    <div className="media-thumb">{t("filmPlaceholder")}</div>
                                    <div className="media-info">
                                        <h4>{t("letterboxdUnavailable")}</h4>
                                        <div className="media-creator">
                                            {t("letterboxdUnavailableSub")}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!letterboxdError && letterboxdFilms.length === 0 && (
                                <div className="media-item">
                                    <div className="media-thumb">{t("filmPlaceholder")}</div>
                                    <div className="media-info">
                                        <h4>{t("noFilmsFound")}</h4>
                                        <div className="media-creator">
                                            {t("updateLetterboxd")}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!letterboxdError &&
                                letterboxdFilms.slice(0, 4).map((film, index) => (
                                    <div
                                        className="media-item media-item--movie"
                                        key={`${film.title}-${index}-film`}
                                    >
                                        {film.posterUrl ? (
                                            <Image
                                                className="media-thumb media-thumb--image media-thumb--movie"
                                                src={film.posterUrl}
                                                alt={`${film.title} poster`}
                                                width={40}
                                                height={56}
                                            />
                                            
                                        ) : (
                                            
                                            <div className="media-thumb media-thumb--movie">{t("filmPlaceholder")}</div>
                                        )}
                                        <div className="media-info">
                                            <div className="media-title-row">
                                                <h4>{film.title}</h4>
                                            </div>
                                            <div className="media-creator">
                                               {film.rating && (
                                                    <span className="media-rating">
                                                        {film.rating}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                 </div>
             </div>
         </section>
    );
}
