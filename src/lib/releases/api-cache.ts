/**
 * The answer of the GitHub API on disk for an hour: the API gives 60 requests an hour to an address without a token,
 * and `astro dev` renders the pages on every request. One file in `node_modules/.cache` (not in git); CI starts
 * without it - fresh data on every run. Unreadable or old - fetched again.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/** How long a saved answer serves - seconds. */
const MAX_AGE_SECONDS = 3600;

const CACHE_DIR = join(process.cwd(), 'node_modules', '.cache', 'pass-web');

interface Entry {
  savedAt: number;
  data: unknown;
}

function fileOf(key: string): string {
  return join(CACHE_DIR, `${key}.json`);
}

async function read(key: string): Promise<unknown> {
  try {
    const entry = JSON.parse(await readFile(fileOf(key), 'utf8')) as Entry;
    const fresh = Date.now() - entry.savedAt < MAX_AGE_SECONDS * 1000;
    return fresh ? entry.data : undefined;
  } catch {
    return undefined; // No file or a broken one - as if there were none
  }
}

async function write(key: string, data: unknown): Promise<void> {
  const file = fileOf(key);
  await mkdir(dirname(file), { recursive: true });
  const entry: Entry = { savedAt: Date.now(), data };
  await writeFile(file, JSON.stringify(entry));
}

/** The saved answer for `key` if it is younger than an hour; otherwise `load` - and it is saved. */
export async function cached(key: string, load: () => Promise<unknown>): Promise<unknown> {
  const saved = await read(key);
  if (saved !== undefined) return saved;
  const data = await load();
  await write(key, data);
  return data;
}
