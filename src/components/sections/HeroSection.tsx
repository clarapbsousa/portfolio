"use client";

import { useTranslations } from "next-intl";

const emailAddress = "clara.barros.sousa@gmail.com";
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`;

export default function HeroSection() {
    const t = useTranslations("Hero");

    return (
        <section id="about" className="hero">
            <div className="container">
                <div className="hero-grid">
                    <div>
                        <h1>{t("title")}</h1>
                        <p className="hero-subtitle">
                            {t("subtitle")}
                        </p>
                        <div className="quick-info">
                          <div className="contact-actions">
                            <a
                                href={gmailComposeUrl}
                                className="btn btn-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >{t("sendEmail")}</a>
                              <a
                                href="/CV_ClaraSousa.pdf"
                                className="btn"
                                download="CV_ClaraSousa.pdf"
                                aria-label="Download Clara Sousa CV"
                              >
                                {t("myResume")}
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
                              <span className="code-string">&quot;{t("codeName")}&quot;</span>;<br />
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
                                &quot;{t("codeSeeking")}&quot;
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
    );
}
