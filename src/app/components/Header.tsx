"use client";

type SectionId = "about" | "projects" | "skills" | "media" | "contact";

type NavItem = { id: SectionId; label: string; icon: string };

type HeaderProps = {
	name: string;
	roleLineOne: string;
	roleLineTwo: string;
	navItems: NavItem[];
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
									<span className="nav-icon">{item.icon}</span>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="sidebar-footer">
					<div className="social-links">
						<a href="#" className="social-link" title="GitHub">
							Gh
						</a>
						<a href="#" className="social-link" title="LinkedIn">
							Li
						</a>
						<a href="#" className="social-link" title="Twitter">
							Tw
						</a>
					</div>
					<div className="sidebar-email">clarasousa@gmail.com</div>
				</div>
			</aside>
		</>
	);
}
