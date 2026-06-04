"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Locale, locales } from "@/i18n/config";

const STORAGE_KEY = "portfolio-locale";

function getStoredLocale(): Locale {
    if (typeof window === "undefined") return "en-us";
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && locales.includes(stored)) return stored;
    return "en-us";
}

export function useLocale() {
    const [locale, setLocaleState] = useState<Locale>("en-us");

    useEffect(() => {
        setLocaleState(getStoredLocale());
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        localStorage.setItem(STORAGE_KEY, newLocale);
        setLocaleState(newLocale);
        // Reload to apply new locale messages
        window.location.reload();
    }, []);

    return { locale, setLocale };
}
