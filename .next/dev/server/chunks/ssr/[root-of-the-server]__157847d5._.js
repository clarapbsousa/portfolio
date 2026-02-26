module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/homeClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/app/homeClient.tsx'\n\nExpected '</', got 'ident'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$homeClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/homeClient.tsx [app-rsc] (ecmascript)");
;
;
;
const revalidate = 86400;
const emptyGoodreads = {
    currentlyReading: [],
    recentlyRead: []
};
const emptyLetterboxd = {
    films: []
};
async function fetchGoodreads(scraperUrl) {
    if (!scraperUrl) {
        return {
            data: emptyGoodreads,
            error: true
        };
    }
    try {
        const response = await fetch(`${scraperUrl}/goodreads`);
        if (!response.ok) {
            throw new Error("Failed Goodreads fetch");
        }
        const data = await response.json();
        return {
            data,
            error: false
        };
    } catch  {
        return {
            data: emptyGoodreads,
            error: true
        };
    }
}
async function fetchLetterboxd(scraperUrl) {
    if (!scraperUrl) {
        return {
            data: emptyLetterboxd,
            error: true
        };
    }
    try {
        const response = await fetch(`${scraperUrl}/letterboxd`);
        if (!response.ok) {
            throw new Error("Failed Letterboxd fetch");
        }
        const data = await response.json();
        return {
            data,
            error: false
        };
    } catch  {
        return {
            data: emptyLetterboxd,
            error: true
        };
    }
}
async function Home() {
    const scraperUrl = process.env.SCRAPER_SERVICE_URL;
    const [goodreadsResult, letterboxdResult] = await Promise.all([
        fetchGoodreads(scraperUrl),
        fetchLetterboxd(scraperUrl)
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$homeClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        goodreadsBooks: goodreadsResult.data.currentlyReading,
        recentlyReadBooks: goodreadsResult.data.recentlyRead,
        letterboxdFilms: letterboxdResult.data.films,
        goodreadsError: goodreadsResult.error,
        letterboxdError: letterboxdResult.error
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 75,
        columnNumber: 9
    }, this);
}
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__157847d5._.js.map