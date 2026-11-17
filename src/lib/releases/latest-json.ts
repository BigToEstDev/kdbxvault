/**
 * `latest.json` - a file of every release of the app, the contract with the site (pass-docs:
 * docs/dev/release-setup.md, «`latest.json` — договор с сайтом»). Its format changes only together with the site.
 */
import { z } from 'astro/zod';
import type { Platform } from '../../config/platforms';

/** The name of the file among the files of a release. */
export const LATEST_JSON = 'latest.json';

/** The platforms of `latest.json` and the platforms of the site (config/platforms.ts). */
const PLATFORM_OF = {
  android: 'android',
  'windows-x64': 'windows',
  'macos-arm64': 'macos',
  'linux-amd64': 'linux',
} as const satisfies Record<string, Platform['id']>;

const fileSchema = z.object({
  platform: z.enum(Object.keys(PLATFORM_OF) as [keyof typeof PLATFORM_OF]),
  name: z.string(),
  size: z.number().int().positive(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  url: z.string().startsWith('https://'),
});

const latestJsonSchema = z.object({
  version: z.string(),
  tag: z.string(),
  prerelease: z.boolean(),
  releasePage: z.string().startsWith('https://'),
  core: z.string(),
  apkCertSha256: z.string(),
  assets: z.array(fileSchema).min(1),
});

/** An installer of a release: where it runs, the file, its size and SHA-256. */
export interface ReleaseFile {
  platform: Platform['id'];
  /** The platform as `latest.json` names it - with the architecture (`windows-x64`). */
  target: keyof typeof PLATFORM_OF;
  name: string;
  size: number;
  sha256: string;
  url: string;
}

export interface LatestJson {
  version: string;
  tag: string;
  core: string;
  apkCertSha256: string;
  files: ReleaseFile[];
}

/** Checks and reads `latest.json`; a wrong format or another tag - an exception. */
export function parseLatestJson(json: unknown, tag: string): LatestJson {
  const data = latestJsonSchema.parse(json);
  if (data.tag !== tag) {
    throw new Error(`releases: latest.json of ${tag} names ${data.tag}`);
  }
  return {
    version: data.version,
    tag: data.tag,
    core: data.core,
    apkCertSha256: data.apkCertSha256,
    files: data.assets.map(({ platform, name, size, sha256, url }) => ({
      platform: PLATFORM_OF[platform],
      target: platform,
      name,
      size,
      sha256,
      url,
    })),
  };
}
