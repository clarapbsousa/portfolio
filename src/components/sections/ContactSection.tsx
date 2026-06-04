"use client";

import { useTranslations } from "next-intl";

const emailAddress = "clara.barros.sousa@gmail.com";

export default function ContactSection() {
    const t = useTranslations("Contact");

    return (
        <section id="contact">
            <div className="container">
                <div className="contact">
                      <h2>{t("title")}</h2>
                    <p className="contact-text">
                      {t("reachOut")}{" "}
                      <a href={`mailto:${emailAddress}`} className="contact-link">
                        {emailAddress}
                      </a>
                    </p>
                    <p className="contact-text">
                      {t("checkOut")}
                    </p>
                    <div className="contact-links-row">
                        <a href="https://github.com/clarapbsousa" className="contact-link">
                            {t("github")}
                        </a>
                        <a href="https://linkedin.com/in/clarapbsousa" className="contact-link">
                            {t("linkedin")}
                        </a>
                        <a href="https://boxd.it/bItH7" className="contact-link">
                            {t("letterboxd")}
                        </a>
                        <a href="https://goodreads.com/clarapbsousa" className="contact-link">
                          {t("goodreads")}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
