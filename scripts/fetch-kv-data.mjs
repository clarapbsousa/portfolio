import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

const DATA_DIR = join(process.cwd(), 'public/data');

async function fetchFromKV(key) {
  if (!accountId || !namespaceId || !apiToken) {
    throw new Error('Missing Cloudflare credentials');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`KV fetch failed for "${key}": HTTP ${response.status}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`KV value for "${key}" is not valid JSON`);
  }
}

async function writeDataFile(key, data) {
  await mkdir(DATA_DIR, { recursive: true });
  const filePath = join(DATA_DIR, `${key}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Wrote ${filePath}`);
}

async function main() {
  if (!accountId || !namespaceId || !apiToken) {
    console.warn('⚠️  Missing Cloudflare KV credentials. Skipping KV fetch.');
    console.warn('   Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID, and CLOUDFLARE_API_TOKEN.');
    return;
  }

  const keys = ['goodreads', 'letterboxd'];

  for (const key of keys) {
    try {
      const data = await fetchFromKV(key);
      await writeDataFile(key, data);
    } catch (error) {
      console.error(`❌ Failed to fetch "${key}" from KV: ${error.message}`);
      
      const filePath = join(DATA_DIR, `${key}.json`);
      if (existsSync(filePath)) {
        console.log(`   Keeping existing ${key}.json`);
      } else {
        console.log(`   No local fallback for ${key}.json — page.tsx will use empty arrays`);
      }
    }
  }
}

// Always exit successfully so the build never fails because of this script
main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('Unexpected error in fetch-kv-data:', err);
  process.exit(0);
});
