/**
 * The screenshots of the app - the page /screenshots: a set per platform, the shots in their order. The files -
 * src/assets/screenshots/<set>/<shot>.png (PNG sources; the build makes AVIF / WebP of them); the captions - keys
 * `screenshots.<set>.<shot>` of the dictionaries. A missing file - the build fails.
 */
import type { ImageMetadata } from 'astro';
import type { MessageKey } from '../i18n/locales';

const FILES = import.meta.glob<{ default: ImageMetadata }>('../assets/screenshots/*/*.png', {
  eager: true,
});

export type ScreenshotSetId = 'desktop' | 'android';

export interface Screenshot {
  id: string;
  image: ImageMetadata;
  caption: MessageKey;
}

export interface ScreenshotSet {
  id: ScreenshotSetId;
  title: MessageKey;
  icon: string;
  shots: Screenshot[];
}

function shotsOf(set: ScreenshotSetId, ids: readonly string[]): Screenshot[] {
  return ids.map((id) => {
    const file = FILES[`../assets/screenshots/${set}/${id}.png`];
    if (!file) throw new Error(`screenshots: no ${set}/${id}.png`);
    return { id, image: file.default, caption: `screenshots.${set}.${id}` as MessageKey };
  });
}

export const SCREENSHOTS: readonly ScreenshotSet[] = [
  {
    id: 'desktop',
    title: 'screenshots.desktop.title',
    icon: 'simple-icons:windows',
    shots: shotsOf('desktop', [
      'welcome',
      'entries',
      'edit-entry',
      'recycle-bin',
      'settings-security',
      'settings-appearance',
      'about',
    ]),
  },
  {
    id: 'android',
    title: 'screenshots.android.title',
    icon: 'simple-icons:android',
    shots: shotsOf('android', [
      'unlock',
      'main-screen',
      'folder',
      'entry-read',
      'entry-history',
      'settings',
      'about',
    ]),
  },
];
