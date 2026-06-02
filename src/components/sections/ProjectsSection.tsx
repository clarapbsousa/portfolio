export default function ProjectsSection() {
    return (
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
                      <h3>Populi</h3>
                      <p className="project-desc">
                        A platform to help citizens find concise, structured, and unbiased information
                        about the politicians they elect. Features include deputy profiles, legislative
                        proposals, and an AI chat assistant for better-informed political opinions.
                      </p>
                      <div className="project-tech">
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">Next.js</span>
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">Python</span>
                      </div>
                    </div>
                    <div className="project-meta">
                      <span className="project-year">2025</span>
                      <div className="project-links">
                        <a href="https://github.com/Populi-Org/populi" className="project-link">
                          Source
                        </a>
                      </div>
                    </div>
                    </article>

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
                </div>
            </div>
        </section>
    );
}
