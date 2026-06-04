"use client";

import { useTranslations } from "next-intl";

export default function ProjectsSection() {
    const t = useTranslations("Projects");

    return (
        <section id="projects">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        {t("title")}
                    </h2>
                    <a href="https://github.com/clarapbsousa" className="section-link">
                        {t("viewAll")}
                    </a>
                </div>

                <div className="projects-grid">
                  <article className="project-card">
                    <div className="project-content">
                      <h3>Populi</h3>
                      <p className="project-desc">
                        {t("populiDesc")}
                      </p>
                      <div className="project-tech">
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">Next.js</span>
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">Python</span>
                      </div>
                    </div>
                    <div className="project-meta">
                      <span className="project-year">{t("year")}</span>
                      <div className="project-links">
                        <a href="https://populi.henriquesf.me/" className="project-link">
                          {t("website")}
                        </a>
                        <a href="https://github.com/Populi-Org/populi" className="project-link">
                          {t("source")}
                        </a>
                      </div>
                    </div>
                    </article>

                  <article className="project-card">
                    <div className="project-content">
                      <h3>CherryPick</h3>
                      <p className="project-desc">
                        {t("cherryPickDesc")}
                      </p>
                      <div className="project-tech">
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">Node.js</span>
                        <span className="tech-tag">Appwrite</span>
                      </div>
                    </div>
                    <div className="project-meta">
                      <span className="project-year">{t("year")}</span>
                      <div className="project-links">
                        <a href="https://github.com/HenriqueSFernandes/CherryPick" className="project-link">
                          {t("source")}
                        </a>
                      </div>
                    </div>
                    </article>

                    <article className="project-card">
                        <div className="project-content">
                            <h3>2Auction</h3>
                            <p className="project-desc">
                                {t("twoAuctionDesc")}
                            </p>
                            <div className="project-tech">
                                <span className="tech-tag">PHP</span>
                                <span className="tech-tag">Laravel</span>
                                <span className="tech-tag">Blade</span>
                                <span className="tech-tag">PostgreSQL</span>
                            </div>
                        </div>
                        <div className="project-meta">
                            <span className="project-year">{t("year")}</span>
                            <div className="project-links">
                                <a
                                    href="https://github.com/clarapbsousa/2Auction"
                                    className="project-link"
                                >
                                    {t("source")}
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
