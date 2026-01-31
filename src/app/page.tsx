import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="landing">
      <div className="landing-half landing-half--top" />
      <div className="landing-half landing-half--bottom" />

      <main className="landing-content">
        <div className="landing-title">Clara Sousa</div>
        <div className="landing-spacer" />
        <div className="landing-center">
          <div className="landing-avatar">
            <Image
              src="/avatar.jpeg"
              alt="Avatar"
              className="landing-avatar-image"
              fill
              priority
            />
          </div>

        </div>

        <div className="landing-bottom">
          <div className="landing-actions">
            <Link className="landing-button" href="/about">
              About me
            </Link>
            <button className="landing-button">Projects</button>
            <button className="landing-button">CV</button>
            <button className="landing-button">Contact me</button>
          </div>
        </div>
      </main>
    </div>
  );
}
