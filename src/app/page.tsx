import Image from "next/image";

export default function Home() {
  return (
    <div className="landing">
      <div className="landing__half landing__half--top" />
      <div className="landing__half landing__half--bottom" />

      <main className="landing__content">
        <div className="landing__title">Clara Sousa</div>
        <div className="landing__spacer" />
        <div className="landing__center">
          <div className="landing__avatar">
            <Image
              src="/avatar.jpeg"
              alt="Avatar"
              className="landing__avatar-image"
              fill
              sizes="176px"
              priority
            />
          </div>

        </div>

        <div className="landing__bottom">
          <div className="landing__actions">
            <button className="landing__button">About me</button>
            <button className="landing__button">Projects</button>
            <button className="landing__button">CV</button>
            <button className="landing__button">Contact me</button>
          </div>
        </div>
      </main>
    </div>
  );
}
