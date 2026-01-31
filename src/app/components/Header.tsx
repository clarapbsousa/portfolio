import Link from "next/link";

type ActiveKey = "about" | "projects" | "cv" | "contact";

const navItems: Array<{ key: ActiveKey; label: string; href: string }> = [
  { key: "about", label: "About me", href: "/about" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "cv", label: "CV", href: "/cv" },
  { key: "contact", label: "Contact me", href: "/contact" },
];

export default function Header({ activeKey }: { activeKey: ActiveKey }) {
  return (
    <header className="header">
      <nav className="header-menu">
        {navItems.map((item) => (
          <Link
            key={item.key}
            className={`header-link${
              item.key === activeKey ? " header-link--active" : ""
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
