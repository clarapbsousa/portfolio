"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import "./global.css";

type SectionId = "about" | "projects" | "skills" | "media" | "contact";

const navItems: Array<{ id: SectionId; label: string; icon: string }> = [
    { id: "about", label: "About", icon: "01" },
    { id: "projects", label: "Projects", icon: "02" },
    { id: "skills", label: "Skills", icon: "03" },
    { id: "media", label: "Books & Films", icon: "04" },
    { id: "contact", label: "Contact", icon: "05" },
];

export default function Home() {
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
        setIsMenuOpen(false);
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
                                        href="mailto:clara.barros.sousa@gmail.com"
                                        className="btn btn-primary"
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
                            <a href="https://github.com/claras" className="section-link">
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
                                Technical Skills <span className="section-number">(03)</span>
                            </h2>
                        </div>

                        <div className="skills-container">
                            <div className="skill-category">
                                <h3>Frontend</h3>
                                <ul className="skill-list">
                                    <li>
                                        TypeScript & React <span className="skill-level">Expert</span>
                                    </li>
                                    <li>
                                        Next.js & SSR <span className="skill-level">Advanced</span>
                                    </li>
                                    <li>
                                        CSS Architecture
                                        <span className="skill-level">Advanced</span>
                                    </li>
                                    <li>
                                        Accessibility (a11y)
                                        <span className="skill-level">Intermediate</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="skill-category">
                                <h3>Backend</h3>
                                <ul className="skill-list">
                                    <li>
                                        Node.js & Python
                                        <span className="skill-level">Advanced</span>
                                    </li>
                                    <li>
                                        Go <span className="skill-level">Intermediate</span>
                                    </li>
                                    <li>
                                        PostgreSQL & Redis
                                        <span className="skill-level">Advanced</span>
                                    </li>
                                    <li>
                                        System Design
                                        <span className="skill-level">Intermediate</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="skill-category">
                                <h3>DevOps & Tools</h3>
                                <ul className="skill-list">
                                    <li>
                                        Docker & Kubernetes
                                        <span className="skill-level">Intermediate</span>
                                    </li>
                                    <li>
                                        AWS & GCP
                                        <span className="skill-level">Intermediate</span>
                                    </li>
                                    <li>
                                        CI/CD Pipelines
                                        <span className="skill-level">Advanced</span>
                                    </li>
                                    <li>
                                        Git & Testing <span className="skill-level">Expert</span>
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
                                Influences <span className="section-number">(04)</span>
                            </h2>
                            <span className="section-note">What shapes my thinking</span>
                        </div>

                        <div className="media-grid">
                            <div className="media-category">
                                <h3>
                                    <span className="media-icon">📚</span> Currently Reading
                                </h3>
                                <div className="book-list">
                                    <div className="media-item">
                                        <div className="media-thumb">BOOK</div>
                                        <div className="media-info">
                                            <h4>Designing Data-Intensive Applications</h4>
                                            <div className="media-creator">Martin Kleppmann</div>
                                            <div className="media-note">
                                                &quot;The bible for understanding trade-offs in distributed
                                                systems&quot;
                                            </div>
                                        </div>
                                    </div>

                                    <div className="media-item">
                                        <div className="media-thumb media-thumb--rust">BOOK</div>
                                        <div className="media-info">
                                            <h4>The Soul of a New Machine</h4>
                                            <div className="media-creator">Tracy Kidder</div>
                                            <div className="media-note">
                                                &quot;On the human drama of engineering teams under
                                                pressure&quot;
                                            </div>
                                        </div>
                                    </div>

                                    <div className="media-item">
                                        <div className="media-thumb">BOOK</div>
                                        <div className="media-info">
                                            <h4>Thinking in Systems</h4>
                                            <div className="media-creator">Donella Meadows</div>
                                            <div className="media-note">
                                                &quot;Essential for understanding feedback loops in software
                                                architecture&quot;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="media-category">
                                <h3>
                                    <span className="media-icon media-icon--forest">🎬</span>
                                    Films That Matter
                                </h3>
                                <div className="movie-list">
                                    <div className="media-item">
                                        <div className="media-thumb movie-thumb">FILM</div>
                                        <div className="media-info">
                                            <h4>Solaris (1972)</h4>
                                            <div className="media-creator">Andrei Tarkovsky</div>
                                            <div className="media-note">
                                                &quot;Explores the limits of human understanding when
                                                building systems beyond our comprehension&quot;
                                            </div>
                                        </div>
                                    </div>

                                    <div className="media-item">
                                        <div className="media-thumb movie-thumb">FILM</div>
                                        <div className="media-info">
                                            <h4>Primer</h4>
                                            <div className="media-creator">Shane Carruth</div>
                                            <div className="media-note">
                                                &quot;The ultimate film about debugging—complex, recursive,
                                                and intellectually honest&quot;
                                            </div>
                                        </div>
                                    </div>

                                    <div className="media-item">
                                        <div className="media-thumb movie-thumb">FILM</div>
                                        <div className="media-info">
                                            <h4>The Social Network</h4>
                                            <div className="media-creator">David Fincher</div>
                                            <div className="media-note">
                                                &quot;A cautionary tale about technical debt in relationships
                                                and code&quot;
                                            </div>
                                        </div>
                                    </div>
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
                              <a href="mailto:clara.barros.sousa@gmail.com" className="contact-link">
                                clara.barros.sousa@gmail.com
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