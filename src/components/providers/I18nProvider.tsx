"use client";

import { useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Locale, defaultLocale, locales } from "@/i18n/config";

const STORAGE_KEY = "portfolio-locale";

function getStoredLocale(): Locale {
    if (typeof window === "undefined") return defaultLocale;
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && locales.includes(stored)) return stored;
    return defaultLocale;
}

type MessageModule = { default: Record<string, unknown> };

const messageModules: Record<Locale, () => Promise<MessageModule>> = {
    "en-us": () => import("../../../messages/en-us.json"),
    "pt-pt": () => import("../../../messages/pt-pt.json"),
    "de-de": () => import("../../../messages/de-de.json"),
    "da-dk": () => import("../../../messages/da-dk.json"),
};

export function setLocaleStorage(locale: Locale) {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, locale);
    }
}

export function getLocaleStorage(): Locale {
    return getStoredLocale();
}

type I18nProviderProps = {
    children: React.ReactNode;
};

export default function I18nProvider({ children }: I18nProviderProps) {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const [messages, setMessages] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        const stored = getStoredLocale();
        setLocale(stored);
        messageModules[stored]().then((mod) => {
            setMessages(mod.default || mod);
        });
    }, []);

    if (!messages) {
        // Prevent flash of untranslated content; could add a minimal loader here
        return null;
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
