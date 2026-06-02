import { readFile } from 'fs/promises';
import { join } from 'path';

export function decimalToStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? '½' : '';
    return '★'.repeat(full) + half;
}

export async function loadLocalJson<T>(fileName: string, fallback: T): Promise<{ data: T; error: boolean }> {
    try {
        const filePath = join(process.cwd(), 'public/data', fileName);
        const raw = await readFile(filePath, 'utf8');
        const data = JSON.parse(raw) as T;
        return { data, error: false };
    } catch {
        return { data: fallback, error: true };
    }
}
