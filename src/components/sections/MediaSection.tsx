import Image from "next/image";
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
    return (
        <section id="media" className="media-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Books & Movies <span className="section-number">(04)</span>
                    </h2>
                    <span className="section-note">What shapes my thinking</span>
                </div>

                <div className="media-grid">
                    <div className="media-category">
                        <h3>
                            <span className="media-icon">📚</span> Currently Reading
                        </h3>
                        <div className="book-list">
                            {goodreadsError && (
                                <div className="media-item">
                                    <div className="media-thumb">BOOK</div>
                                    <div className="media-info">
                                        <h4>Goodreads unavailable</h4>
                                        <div className="media-creator">
                                            Check your credentials or try again later
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!goodreadsError && goodreadsBooks.length === 0 && (
                                <div className="media-item">
                                    <div className="media-thumb">BOOK</div>
                                    <div className="media-info">
                                        <h4>No books found</h4>
                                        <div className="media-creator">
                                            Update your Goodreads shelf
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
                                            <div className="media-thumb">BOOK</div>
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

                        <h4 className="media-subtitle">Recently Read</h4>
                        <div className="book-list">
                            {!goodreadsError && recentlyReadBooks.length === 0 && (
                                <div className="media-item">
                                    <div className="media-thumb">BOOK</div>
                                    <div className="media-info">
                                        <h4>No recent reads yet</h4>
                                        <div className="media-creator">
                                            Update your Goodreads read shelf
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
                                            <div className="media-thumb">BOOK</div>
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
                            <span className="media-icon">🎬</span> Recently Watched
                        </h3>
                        <div className="movie-list">
                            {letterboxdError && (
                                <div className="media-item">
                                    <div className="media-thumb">FILM</div>
                                    <div className="media-info">
                                        <h4>Letterboxd unavailable</h4>
                                        <div className="media-creator">
                                            Check your RSS URL or try again later
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!letterboxdError && letterboxdFilms.length === 0 && (
                                <div className="media-item">
                                    <div className="media-thumb">FILM</div>
                                    <div className="media-info">
                                        <h4>No films found</h4>
                                        <div className="media-creator">
                                            Update your Letterboxd diary
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
                                            
                                            <div className="media-thumb media-thumb--movie">FILM</div>
                                        )}
                                        <div className="media-info">
                                            <div className="media-title-row">
                                                <h4>{film.title}</h4>
                                                {film.rating && (
                                                    <span className="media-rating">
                                                        {film.rating}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="media-creator">
                                                {film.director ?? "Director"}
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
