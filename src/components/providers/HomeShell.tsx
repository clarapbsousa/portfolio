"use client";

import { useState, useEffect } from "react";
import { SectionId, NavItem } from "@/types";
import Header from "@/components/layout/Header";

const navItems: NavItem[] = [
    { id: "about", label: "About", icon: "01" },
    { id: "projects", label: "Projects", icon: "02" },
    { id: "media", label: "Books & Films", icon: "03" },
    { id: "contact", label: "Contact", icon: "04" },
];

type HomeShellProps = {
    children: React.ReactNode;
};

export default function HomeShell({ children }: HomeShellProps) {
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
        if (window.matchMedia("(max-width: 1024px)").matches) {
            setIsMenuOpen(false);
        }
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
                {children}
                <footer className="site-footer">
                    <p>© 2026 Clara Sousa</p>
                </footer>
            </main>
        </div>
    );
}
