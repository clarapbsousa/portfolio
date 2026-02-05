import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

export async function GET() {
    const scriptPath = path.join(
        process.cwd(),
        "src",
        "api",
        "goodreads",
        "goodreads.py"
    );
    const pythonExecutable = process.env.PYTHON_EXECUTABLE ?? "python3";

    try {
        const { stdout } = await execFileAsync(pythonExecutable, [scriptPath], {
            env: process.env,
            timeout: 20000,
            maxBuffer: 1024 * 1024,
        });
        const payload = JSON.parse(stdout);

        if (payload?.error) {
            return NextResponse.json(payload, { status: 500 });
        }

        return NextResponse.json(payload, { status: 200 });
    } catch (error) {
        const details =
            error && typeof error === "object" && "stderr" in error
                ? String(error.stderr)
                : error instanceof Error
                  ? error.message
                  : "Unknown error";

        return NextResponse.json(
            {
                error: "Failed to fetch Goodreads data.",
                details: process.env.NODE_ENV === "production" ? undefined : details,
            },
            { status: 500 }
        );
    }
}
