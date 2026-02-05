import { NextResponse } from "next/server";
export const runtime = "edge";

export async function GET() {
    const baseUrl = process.env.SCRAPER_SERVICE_URL;
    if (!baseUrl) {
        return NextResponse.json(
            { error: "Missing SCRAPER_SERVICE_URL." },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(`${baseUrl}/goodreads`, {
            cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok || payload?.error) {
            return NextResponse.json(payload, { status: 500 });
        }

        return NextResponse.json(payload, { status: 200 });
    } catch (error) {
        const details = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            {
                error: "Failed to fetch Goodreads data.",
                details: process.env.NODE_ENV === "production" ? undefined : details,
            },
            { status: 500 }
        );
    }
}
