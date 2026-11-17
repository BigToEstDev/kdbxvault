/**
 * The requests to GitHub at build time: the releases of the app repository, a file of a release, the changelog.
 * The repository - from `PUBLIC_GITHUB_APP_URL`; `GITHUB_TOKEN` (optional, CI) lifts the limit of the API
 * (60 requests an hour without it); its answer is kept for an hour (./api-cache.ts) - the other files are not of the
 * API and have no such limit. No answer in time or a wrong one - an exception: the build fails, an empty page is
 * not published.
 */
import { GH_API_URL, GH_RAW_URL, GITHUB_TOKEN } from 'astro:env/server';
import { z } from 'astro/zod';
import { SITE } from '../../config/site';
import { cached } from './api-cache';

/** How long a request may take - milliseconds; GitHub hangs - the build fails, not hangs. */
const TIMEOUT_MS = 15_000;

const API_URL = GH_API_URL.replace(/\/+$/, '');
const RAW_URL = GH_RAW_URL.replace(/\/+$/, '');

/** The changelog of the app - in the default branch (`HEAD`), one file for every version. */
const CHANGELOG_PATH = 'CHANGELOG.md';

/** `owner/repo` of the app repository. */
const REPO = SITE.githubAppRepo;

const assetSchema = z.object({
  name: z.string(),
  size: z.number(),
  download_count: z.number(),
  browser_download_url: z.string(),
});

const releaseSchema = z.object({
  tag_name: z.string(),
  draft: z.boolean(),
  prerelease: z.boolean(),
  published_at: z.string().nullable(),
  html_url: z.string(),
  assets: z.array(assetSchema),
});

export type GithubAsset = z.infer<typeof assetSchema>;
export type GithubRelease = z.infer<typeof releaseSchema>;

async function request(url: string, accept: string): Promise<Response> {
  const headers: Record<string, string> = { Accept: accept };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) {
    const reason = (await response.text()).slice(0, 300);
    throw new Error(`releases: ${url} - ${response.status} ${response.statusText} ${reason}`);
  }
  return response;
}

/** The releases of the app repository, newest first; drafts are not given without the rights of the owner. */
export async function fetchReleases(): Promise<GithubRelease[]> {
  const json = await cached('github-releases', async () => {
    const response = await request(
      `${API_URL}/repos/${REPO}/releases?per_page=100`,
      'application/vnd.github+json',
    );
    return response.json();
  });
  return z.array(releaseSchema).parse(json);
}

/** A file of a release (`latest.json`) - parsed JSON. */
export async function fetchAssetJson(asset: GithubAsset): Promise<unknown> {
  const response = await request(asset.browser_download_url, 'application/json');
  return response.json();
}

/** `CHANGELOG.md` of the default branch - its text. */
export async function fetchChangelog(): Promise<string> {
  const response = await request(`${RAW_URL}/${REPO}/HEAD/${CHANGELOG_PATH}`, 'text/plain');
  return response.text();
}
