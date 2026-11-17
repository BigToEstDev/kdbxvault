/**
 * The releases of the app for the pages - built once per build from GitHub (./github.ts): every published release
 * with its installers (`latest.json`), its changelog entry and its downloads. A release without `latest.json` or
 * without an entry in the changelog - an exception: the build fails.
 */
import { parseChangelog, type ChangelogEntry } from './changelog';
import { fetchAssetJson, fetchChangelog, fetchReleases, type GithubRelease } from './github';
import { LATEST_JSON, parseLatestJson, type ReleaseFile } from './latest-json';

export type { ReleaseFile } from './latest-json';
export type { ChangeKind, ChangelogEntry, ChangeSection } from './changelog';

export interface Release {
  version: string;
  tag: string;
  /** A release candidate (`rc`) - «test» on the site, never on the home page. */
  prerelease: boolean;
  /** When it was published - ISO date and time. */
  publishedAt: string;
  /** The page of the release on GitHub. */
  pageUrl: string;
  /** The tag of the core the release is built with. */
  core: string;
  /** SHA-256 of the certificate the APK is signed with. */
  apkCertSha256: string;
  files: ReleaseFile[];
  notes: ChangelogEntry;
  /** Downloads of the installers of this release. */
  downloads: number;
}

export interface Releases {
  /** Every published release, newest first. */
  all: Release[];
  /** The last final release (not `rc`); none yet - `undefined`. */
  latest: Release | undefined;
  /** Downloads of the installers of every release. */
  downloads: number;
}

async function toRelease(
  release: GithubRelease,
  changelog: Map<string, ChangelogEntry>,
): Promise<Release> {
  const latestJson = release.assets.find((asset) => asset.name === LATEST_JSON);
  if (!latestJson) throw new Error(`releases: ${release.tag_name} has no ${LATEST_JSON}`);
  const data = parseLatestJson(await fetchAssetJson(latestJson), release.tag_name);

  const notes = changelog.get(data.version);
  if (!notes) throw new Error(`releases: CHANGELOG.md has no ${data.version}`);
  if (!release.published_at) throw new Error(`releases: ${release.tag_name} is not published`);

  // Only the installers count - the files of latest.json, not mapping, licenses or checksums.
  const installers = new Set(data.files.map((file) => file.name));
  const downloads = release.assets
    .filter((asset) => installers.has(asset.name))
    .reduce((sum, asset) => sum + asset.download_count, 0);

  return {
    version: data.version,
    tag: data.tag,
    prerelease: release.prerelease,
    publishedAt: release.published_at,
    pageUrl: release.html_url,
    core: data.core,
    apkCertSha256: data.apkCertSha256,
    files: data.files,
    notes,
    downloads,
  };
}

async function load(): Promise<Releases> {
  const [releases, changelogText] = await Promise.all([fetchReleases(), fetchChangelog()]);
  const changelog = parseChangelog(changelogText);

  const all = (
    await Promise.all(
      releases.filter((release) => !release.draft).map((release) => toRelease(release, changelog)),
    )
  ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return {
    all,
    latest: all.find((release) => !release.prerelease),
    downloads: all.reduce((sum, release) => sum + release.downloads, 0),
  };
}

let cache: Promise<Releases> | undefined;

/** The releases - loaded once per build, every page takes the same. */
export function getReleases(): Promise<Releases> {
  cache ??= load();
  return cache;
}
