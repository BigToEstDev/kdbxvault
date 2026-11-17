/**
 * The requests to GitHub at build time: the releases of the app repository, a file of a release, the changelog.
 * The repository - from `PUBLIC_GITHUB_APP_URL`; `GITHUB_TOKEN` (optional, CI) lifts the limit of the API
 * (60 requests an hour without it). No answer or a wrong one - an exception: the build fails, an empty page is not
 * published.
 */
import { PUBLIC_GITHUB_APP_URL } from 'astro:env/client';
import { GITHUB_TOKEN } from 'astro:env/server';
import { z } from 'astro/zod';

/** The hosts of GitHub - fixed by GitHub, not settings of the site. */
const API_URL = 'https://api.github.com';
const RAW_URL = 'https://raw.githubusercontent.com';

/** The changelog of the app - in the default branch (`HEAD`), one file for every version. */
const CHANGELOG_PATH = 'CHANGELOG.md';

/** `owner/repo` of the app repository. */
const REPO = repoOf(PUBLIC_GITHUB_APP_URL);

function repoOf(url: string): string {
  const [owner, repo] = new URL(url).pathname.split('/').filter(Boolean);
  if (!owner || !repo) throw new Error(`releases: not a repository URL - ${url}`);
  return `${owner}/${repo}`;
}

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
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`releases: ${url} - ${response.status} ${response.statusText}`);
  }
  return response;
}

/** The releases of the app repository, newest first; drafts are not given without the rights of the owner. */
export async function fetchReleases(): Promise<GithubRelease[]> {
  const response = await request(
    `${API_URL}/repos/${REPO}/releases?per_page=100`,
    'application/vnd.github+json',
  );
  return z.array(releaseSchema).parse(await response.json());
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
