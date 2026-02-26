"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/Header";

type SectionId = "about" | "projects" | "skills" | "media" | "contact";

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

type HomeClientProps = {
    goodreadsBooks: GoodreadsBook[];
    recentlyReadBooks: GoodreadsBook[];
    letterboxdFilms: LetterboxdFilm[];
    goodreadsError: boolean;
    letterboxdError: boolean;
};

const navItems: Array<{ id: SectionId; label: string; icon: string }> = [
    { id: "about", label: "About", icon: "01" },
    { id: "projects", label: "Projects", icon: "02" },
    { id: "skills", label: "Skills", icon: "03" },
    { id: "media", label: "Books & Films", icon: "04" },
    { id: "contact", label: "Contact", icon: "05" },
];

const emailAddress = "clara.barros.sousa@gmail.com";
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`;

export default function HomeClient({
    goodreadsBooks,
    recentlyReadBooks,
    letterboxdFilms,
    goodreadsError,
    letterboxdError,
}: HomeClientProps) {
    const [activeSection, setActiveSection] = useState<SectionId>("about");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const sections = Array.from(
            document.querySelectorAll<HTMLElement>("section[id]")
        );

        if (!("IntersectionObserver" in window) || sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("id") as SectionId | null;
                        if (id) {
                            setActiveSection(id);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: "-50% 0px -50% 0px",
                threshold: 0,
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const handleNavClick = (id: SectionId) => {
        setActiveSection(id);
        if (window.matchMedia("(max-width: 1024px)").matches) {
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="portfolio-page">
            <Header
                name="Clara Sousa"
                roleLineOne="Computer Engineering Student"
                roleLineTwo="Software Engineer"
                navItems={navItems}
                activeSection={activeSection}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
                onNavClick={handleNavClick}
            />

            <main className="main-content">
                <section id="about" className="hero">
                    <div className="container">
                        <div className="hero-grid">
                            <div>
                                <h1>Building software with intention</h1>
                                <p className="hero-subtitle">
                                  Computer Engineering student @FEUP with experience building accessible, 
                                  maintainable user interfaces, and a strong interest in data, machine learning, 
                                  and AI to create smarter, user-centered products.
                                </p>
                                <div className="quick-info">
                                  <div className="contact-actions">
                                    <a
                                        href={gmailComposeUrl}
                                        className="btn btn-primary"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >Send Email</a>
                                      <a
                                        href="/CV_ClaraSousa.pdf"
                                        className="btn"
                                        download="CV_ClaraSousa.pdf"
                                        aria-label="Download Clara Sousa CV"
                                      >
                                        My Resume
                                      </a>
                                  </div>
                                </div>
                            </div>

                            <div className="code-window">
                                <div className="code-header">
                                    <div className="dot dot-red" />
                                    <div className="dot dot-yellow" />
                                    <div className="dot dot-green" />
                                </div>
                                <div className="code-content">
                                    <span className="code-keyword">class</span> Engineer {"{"}
                                    <br />
                                    &nbsp;&nbsp;constructor() {"{"}
                                    <br />
                                      &nbsp;&nbsp;&nbsp;&nbsp;this.name ={" "}
                                      <span className="code-string">&quot;Clara&quot;</span>;<br />
                                      &nbsp;&nbsp;&nbsp;&nbsp;this.stack = [{" "}
                                      <span className="code-string">&quot;TypeScript&quot;</span>,{" "}
                                      <span className="code-string">&quot;C++&quot;</span>,{" "}
                                      <span className="code-string">&quot;Python&quot;</span>];
                                    <br />
                                      &nbsp;&nbsp;&nbsp;&nbsp;this.interests = [{" "}
                                      <span className="code-string">&quot;ux & ui&quot;</span>,{" "}
                                      <span className="code-string">&quot;data&quot;</span>,{" "}
                                      <span className="code-string">&quot;ai & ml&quot;</span>];
                                    <br />
                                    &nbsp;&nbsp;{"}"}
                                    <br />
                                    &nbsp;&nbsp;<span className="code-keyword">seeking</span>() {"{"}
                                    <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                      <span className="code-keyword">return</span>{" "}
                                    <span className="code-string">
                                        &quot;Opportunities to grow&quot;
                                    </span>;
                                    <br />
                                    &nbsp;&nbsp;{"}"}
                                    <br />
                                    {"}"}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="projects">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                Selected Projects <span className="section-number">(03)</span>
                            </h2>
                            <a href="https://github.com/clarapbsousa" className="section-link">
                                View All on GitHub →
                            </a>
                        </div>

                        <div className="projects-grid">
                          <article className="project-card">
                            <div className="project-content">
                              <h3>CherryPick</h3>
                              <p className="project-desc">
                                Cross-format cultural recommendation platform. Users input a
                                book, movie, show, or album and receive curated picks across
                                media types. Hackathon prototype with a full redesign in
                                progress.
                              </p>
                              <div className="project-tech">
                                <span className="tech-tag">TypeScript</span>
                                <span className="tech-tag">React</span>
                                <span className="tech-tag">Node.js</span>
                                <span className="tech-tag">Appwrite</span>
                              </div>
                            </div>
                            <div className="project-meta">
                              <span className="project-year">2025</span>
                              <div className="project-links">
                                <a href="https://github.com/HenriqueSFernandes/CherryPick" className="project-link">
                                  Source
                                </a>
                              </div>
                            </div>
                            </article>

                            <article className="project-card">
                                <div className="project-content">
                                    <h3>2Auction</h3>
                                    <p className="project-desc">
                                        Web application that brings live auction dynamics online,
                                        enabling users to buy and sell items with a secure,
                                        interactive experience for bidders and sellers.
                                    </p>
                                    <div className="project-tech">
                                        <span className="tech-tag">PHP</span>
                                        <span className="tech-tag">Laravel</span>
                                        <span className="tech-tag">Blade</span>
                                        <span className="tech-tag">PostgreSQL</span>
                                    </div>
                                </div>
                                <div className="project-meta">
                                    <span className="project-year">2025</span>
                                    <div className="project-links">
                                        <a
                                            href="https://github.com/clarapbsousa/2Auction"
                                            className="project-link"
                                        >
                                            Source
                                        </a>
                                    </div>
                                </div>
                            </article>

                            <article className="project-card">
                                <div className="project-content">
                                    <h3>Study@</h3>
                                    <p className="project-desc">
                                        Flutter app to help FEUP students find sustainable study
                                        spots with maps, reviews, achievements, and personalized
                                        profiles. Built as a team project for Software Engineering 2023/2024.
                                    </p>
                                    <div className="project-tech">
                                        <span className="tech-tag">Dart</span>
                                        <span className="tech-tag">Flutter</span>
                                        <span className="tech-tag">SQLite</span>
                                    </div>
                                </div>
                                <div className="project-meta">
                                    <span className="project-year">2024</span>
                                    <div className="project-links">
                                        <a
                                            href="https://github.com/FEUP-LEIC-ES-2023-24/2LEIC18T4"
                                            className="project-link"
                                        >
                                            Source
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                <section id="skills">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                Skills Snapshot <span className="section-number">(03)</span>
                            </h2>
                            <span className="section-note">What I use to build and learn</span>
                        </div>

                        <div className="skills-container">
                            <div className="skill-category">
                                <h3>Core Stack</h3>
                                <ul className="skill-list">
                                    <li>
                                        TypeScript & React <span className="skill-level">Strong</span>
                                    </li>
                                    <li>
                                        Next.js <span className="skill-level">Growing</span>
                                    </li>
                                    <li>
                                        CSS & UI Design <span className="skill-level">Strong</span>
                                    </li>
                                    <li>
                                        Accessibility (a11y) <span className="skill-level">Learning</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="skill-category">
                                <h3>Data & Backend</h3>
                                <ul className="skill-list">
                                    <li>
                                        Python & C++ <span className="skill-level">Strong</span>
                                    </li>
                                    <li>
                                        Node.js <span className="skill-level">Comfortable</span>
                                    </li>
                                    <li>
                                        SQL & Data Modeling <span className="skill-level">Growing</span>
                                    </li>
                                    <li>
                                        APIs & Integration <span className="skill-level">Comfortable</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="skill-category">
                                <h3>Workflow</h3>
                                <ul className="skill-list">
                                    <li>
                                        Git & Collaboration <span className="skill-level">Strong</span>
                                    </li>
                                    <li>
                                        Testing & QA <span className="skill-level">Learning</span>
                                    </li>
                                    <li>
                                        Documentation <span className="skill-level">Strong</span>
                                    </li>
                                    <li>
                                        CI/CD Basics <span className="skill-level">Learning</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

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
                                        goodreadsBooks.slice(0, 3).map((book, index) => (
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

                <section id="contact">
                    <div className="container">
                        <div className="contact">
                              <h2>Let&apos;s work together</h2>
                            <p className="contact-text">
                              Feel free to reach out at{" "}
                              <a href={`mailto:${emailAddress}`} className="contact-link">
                                {emailAddress}
                              </a>
                            </p>
                            <p className="contact-text">
                              Check out my GitHub and LinkedIn to see my work, or visit my 
                              Goodreads and Letterboxd to see what movies and books I&apos;m enjoying.
                            </p>
                            <div className="contact-links-row">
                                <a href="https://github.com/clarapbsousa" className="contact-link">
                                    GitHub
                                </a>
                                <a href="https://linkedin.com/in/clarapbsousa" className="contact-link">
                                    Linkedin
                                </a>
                                <a href="https://boxd.it/bItH7" className="contact-link">
                                    Letterboxd
                                </a>
                                <a href="https://goodreads.com/clarapbsousa" className="contact-link">
                                  Goodreads
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="site-footer">
                    <p>© 2026 Clara Sousa</p>
                </footer>
            </main>
        </div>
    );
}