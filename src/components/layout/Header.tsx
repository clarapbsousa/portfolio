"use client";

import { SectionId } from "@/types";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale } from "@/i18n/config";

type HeaderProps = {
	name: string;
	roleLineOne: string;
	roleLineTwo: string;
	navItems: Array<{ id: SectionId; label: string }>;
	activeSection: SectionId;
	isMenuOpen: boolean;
	onToggleMenu: () => void;
	onNavClick: (id: SectionId) => void;
	locale: Locale;
	onChangeLocale: (locale: Locale) => void;
	toggleLabel: string;
	closeLabel: string;
	githubTitle: string;
	linkedinTitle: string;
	letterboxdTitle: string;
	goodreadsTitle: string;
};

export default function Header({
	name,
	roleLineOne,
	roleLineTwo,
	navItems,
	activeSection,
	isMenuOpen,
	onToggleMenu,
	onNavClick,
	locale,
	onChangeLocale,
	toggleLabel,
	closeLabel,
	githubTitle,
	linkedinTitle,
	letterboxdTitle,
	goodreadsTitle,
}: HeaderProps) {
	return (
		<>
			<div className="mobile-header">
				<div className="mobile-header__name">{name}</div>
				<div className="mobile-header__actions">
					<LanguageSwitcher
						currentLocale={locale}
						onChangeLocale={onChangeLocale}
					/>
					<button
						className="mobile-menu-btn"
						onClick={onToggleMenu}
						aria-label={toggleLabel}
						aria-expanded={isMenuOpen}
					>
						☰
					</button>
				</div>
			</div>

			<aside className={`sidebar${isMenuOpen ? " open" : ""}`}>
				<button
					className="sidebar-close"
					onClick={onToggleMenu}
					aria-label={closeLabel}
					type="button"
				>
					✕
				</button>
				<div className="sidebar-header">
					<div className="sidebar-name">{name}</div>
					<div className="sidebar-role">
						{roleLineOne}
						<br />
						{roleLineTwo}
					</div>
				</div>

				<nav>
					<ul className="nav-menu">
						{navItems.map((item) => (
							<li className="nav-item" key={item.id}>
								<a
									href={`#${item.id}`}
									className={`nav-link${
										activeSection === item.id ? " active" : ""
									}`}
									onClick={() => onNavClick(item.id)}
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="sidebar-footer">
					<div className="social-links">
						<a href="https://github.com/clarapbsousa" className="social-link" title={githubTitle}>
							Gh
						</a>
						<a href="https://linkedin.com/in/clarapbsousa" className="social-link" title={linkedinTitle}>
							Li
						</a>
						<a href="https://boxd.it/bItH7" className="social-link" title={letterboxdTitle}>
							Lb
						</a>
            			<a href="https://www.goodreads.com/clarapbsousa" className="social-link" title={goodreadsTitle}> 
            				Gr
            			</a>
					</div>
					<div className="sidebar-email">clara.barros.sousa@gmail.com</div>
				</div>
			</aside>
		</>
	);
}
