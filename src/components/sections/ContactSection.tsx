const emailAddress = "clara.barros.sousa@gmail.com";

export default function ContactSection() {
    return (
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
    );
}
