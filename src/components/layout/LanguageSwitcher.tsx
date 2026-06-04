"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Locale, locales } from "@/i18n/config";

const localeLabels: Record<Locale, string> = {
    "en-us": "English",
    "pt-pt": "Português",
    "de-de": "Deutsch",
    "da-dk": "Dansk",
};

type LanguageSwitcherProps = {
    currentLocale: Locale;
    onChangeLocale: (locale: Locale) => void;
};

export default function LanguageSwitcher({
    currentLocale,
    onChangeLocale,
}: LanguageSwitcherProps) {
    const t = useTranslations("LanguageSwitcher");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on Escape key
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSelect = (locale: Locale) => {
        onChangeLocale(locale);
        setIsOpen(false);
    };

    return (
        <div className="language-switcher" ref={dropdownRef}>
            <button
                type="button"
                className="language-switcher-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <span>{localeLabels[currentLocale]}</span>
                <svg
                    className={`language-switcher-chevron${isOpen ? " open" : ""}`}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                >
                    <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            {isOpen && (
                <ul className="language-switcher-dropdown" role="listbox">
                    {locales.map((locale) => (
                        <li key={locale} role="option" aria-selected={locale === currentLocale}>
                            <button
                                type="button"
                                className={`language-switcher-option${
                                    locale === currentLocale ? " active" : ""
                                }`}
                                onClick={() => handleSelect(locale)}
                            >
                                {localeLabels[locale]}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
