"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SectionId, NavItem, Locale } from "@/types";
import Header from "@/components/layout/Header";
import { locales, defaultLocale } from "@/i18n/config";
import { setLocaleStorage } from "@/components/providers/I18nProvider";

type HomeShellProps = {
	children: React.ReactNode;
};

const STORAGE_KEY = "portfolio-locale";

function getStoredLocale(): Locale {
	if (typeof window === "undefined") return defaultLocale;
	const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
	if (stored && locales.includes(stored)) return stored;
	return defaultLocale;
}

export default function HomeShell({ children }: HomeShellProps) {
	const t = useTranslations();
	const [activeSection, setActiveSection] = useState<SectionId>("about");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [locale, setLocaleState] = useState<Locale>(defaultLocale);

	useEffect(() => {
		setLocaleState(getStoredLocale());
	}, []);

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

	const handleChangeLocale = (newLocale: Locale) => {
		setLocaleStorage(newLocale);
		setLocaleState(newLocale);
		window.location.reload();
	};

	const navItems: NavItem[] = [
		{ id: "about", label: t("Nav.about") },
		{ id: "projects", label: t("Nav.projects") },
		{ id: "media", label: t("Nav.media") },
		{ id: "contact", label: t("Nav.contact") },
	];

	return (
		<div className="portfolio-page">
			<Header
				name="Clara Sousa"
				roleLineOne={t("Header.roleLineOne")}
				roleLineTwo={t("Header.roleLineTwo")}
				navItems={navItems}
				activeSection={activeSection}
				isMenuOpen={isMenuOpen}
				onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
				onNavClick={handleNavClick}
				locale={locale}
				onChangeLocale={handleChangeLocale}
				toggleLabel={t("Header.toggleNavigation")}
				closeLabel={t("Header.closeNavigation")}
				githubTitle={t("Header.github")}
				linkedinTitle={t("Header.linkedin")}
				letterboxdTitle={t("Header.letterboxd")}
				goodreadsTitle={t("Header.goodreads")}
			/>
			<main className="main-content">
				{children}
				<footer className="site-footer">
					<p>{t("Footer.copyright")}</p>
				</footer>
			</main>
		</div>
	);
}
