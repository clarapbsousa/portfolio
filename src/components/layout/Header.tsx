"use client";

import { SectionId } from "@/types";

type HeaderProps = {
	name: string;
	roleLineOne: string;
	roleLineTwo: string;
	navItems: Array<{ id: SectionId; label: string}>;
	activeSection: SectionId;
	isMenuOpen: boolean;
	onToggleMenu: () => void;
	onNavClick: (id: SectionId) => void;
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
}: HeaderProps) {
	return (
		<>
			<div className="mobile-header">
				<div className="mobile-header__name">{name}</div>
				<button
					className="mobile-menu-btn"
					onClick={onToggleMenu}
					aria-label="Toggle navigation"
					aria-expanded={isMenuOpen}
				>
					☰
				</button>
			</div>

			<aside className={`sidebar${isMenuOpen ? " open" : ""}`}>
				<button
					className="sidebar-close"
					onClick={onToggleMenu}
					aria-label="Close navigation"
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
						<a href="https://github.com/clarapbsousa" className="social-link" title="GitHub">
							Gh
						</a>
						<a href="https://linkedin.com/in/clarapbsousa" className="social-link" title="LinkedIn">
							Li
						</a>
						<a href="https://boxd.it/bItH7" className="social-link" title="Letterboxd">
							Lb
						</a>
            <a href="https://www.goodreads.com/clarapbsousa" className="social-link" title="Goodreads"> 
            Gr
            </a>
					</div>
					<div className="sidebar-email">clara.barros.sousa@gmail.com</div>
				</div>
			</aside>
		</>
	);
}
