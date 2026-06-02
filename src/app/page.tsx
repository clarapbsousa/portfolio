import { loadGoodreadsData } from "@/lib/goodreads";
import { loadLetterboxdData } from "@/lib/letterboxd";
import HomeShell from "@/components/providers/HomeShell";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import MediaSection from "@/components/sections/MediaSection";
import ContactSection from "@/components/sections/ContactSection";

export const revalidate = 86400;

export default async function Home() {
    const [goodreadsResult, letterboxdResult] = await Promise.all([
        loadGoodreadsData(),
        loadLetterboxdData(),
    ]);

    return (
        <HomeShell>
            <HeroSection />
            <ProjectsSection />
            <MediaSection
                goodreadsBooks={goodreadsResult.data.currentlyReading}
                recentlyReadBooks={goodreadsResult.data.recentlyRead}
                letterboxdFilms={letterboxdResult.data.films}
                goodreadsError={goodreadsResult.error}
                letterboxdError={letterboxdResult.error}
            />
            <ContactSection />
        </HomeShell>
    );
}
