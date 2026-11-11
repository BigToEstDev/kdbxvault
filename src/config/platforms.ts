/**
 * The platforms of the app and their state (pass-app README: Platforms). One place for the home page sections.
 * Names are brands - not translated.
 */
import type { MessageKey } from '../i18n/locales';

export type PlatformStatus = 'tested' | 'untested';

export interface Platform {
  id: 'android' | 'windows' | 'macos' | 'linux';
  name: string;
  icon: string;
  status: PlatformStatus;
  /** What it needs - a key of the dictionaries. */
  requirement: MessageKey;
}

export const PLATFORMS: readonly Platform[] = [
  {
    id: 'android',
    name: 'Android',
    icon: 'simple-icons:android',
    status: 'tested',
    requirement: 'home.platforms.androidReq',
  },
  {
    id: 'windows',
    name: 'Windows',
    icon: 'simple-icons:windows',
    status: 'tested',
    requirement: 'home.platforms.desktopReq',
  },
  {
    id: 'macos',
    name: 'macOS',
    icon: 'simple-icons:apple',
    status: 'untested',
    requirement: 'home.platforms.desktopReq',
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: 'simple-icons:linux',
    status: 'untested',
    requirement: 'home.platforms.desktopReq',
  },
];

/** The apps that open the same file (pass-app README: Compatibility). */
export const COMPATIBLE_APPS = ['KeePassXC', 'KeePass', 'KeePassDX'] as const;
