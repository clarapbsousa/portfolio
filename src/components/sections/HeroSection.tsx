const emailAddress = "clara.barros.sousa@gmail.com";
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`;

export default function HeroSection() {
    return (
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
    );
}
