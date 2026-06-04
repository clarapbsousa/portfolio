export const locales = ["en-us", "pt-pt", "de-de", "da-dk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en-us";
