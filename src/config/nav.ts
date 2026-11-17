/**
 * The navigation of the site - one place for the top bar, the drawer and the footer.
 * «Download» leads to its panel on the home page (an anchor); «GitHub» - straight to the repository of the app
 * (`external` - a new tab).
 */
import type { MessageKey } from '../i18n/locales';
import { withBase } from './base';
import { SITE } from './site';

export interface NavItem {
  href: string;
  label: MessageKey;
  icon: string;
  /** Out of the site - a new tab. */
  external?: boolean;
}

export const ICONS = {
  download: 'material-symbols:download-rounded',
  github: 'simple-icons:github',
  external: 'material-symbols:open-in-new-rounded',
  menu: 'material-symbols:menu-rounded',
  close: 'material-symbols:close-rounded',
  locale: 'material-symbols:translate-rounded',
  theme: 'material-symbols:contrast',
  themeSystem: 'material-symbols:brightness-auto-outline-rounded',
  themeLight: 'material-symbols:light-mode-outline-rounded',
  themeDark: 'material-symbols:dark-mode-outline-rounded',
} as const;

/** The pages of the site - with the prefix of the site (`withBase`). */
export const ROUTES = {
  home: withBase('/'),
  screenshots: withBase('/screenshots'),
  releases: withBase('/releases'),
  donate: withBase('/donate'),
  privacy: withBase('/privacy'),
  download: withBase('/#download'),
};

/** The repository of the app on GitHub - the top bar, the drawer. */
export const GITHUB: NavItem = {
  href: SITE.githubAppUrl,
  label: 'nav.github',
  icon: ICONS.github,
  external: true,
};

/** The pages of the main navigation - the center of the top bar, the list of the drawer. */
export const MAIN_NAV: readonly NavItem[] = [
  {
    href: ROUTES.screenshots,
    label: 'nav.screenshots',
    icon: 'material-symbols:photo-library-outline-rounded',
  },
  {
    href: ROUTES.releases,
    label: 'nav.releases',
    icon: 'material-symbols:deployed-code-history-outline-rounded',
  },
  { href: ROUTES.donate, label: 'nav.donate', icon: 'material-symbols:coffee-outline-rounded' },
];

/** The links of the footer. */
export const FOOTER_NAV: readonly NavItem[] = [
  {
    href: ROUTES.privacy,
    label: 'footer.privacy',
    icon: 'material-symbols:shield-lock-outline-rounded',
  },
  { ...GITHUB, label: 'footer.source' },
];

/** The item of a route - its label and icon for the heading of its page. */
export function navItem(href: string): NavItem {
  const item = [...MAIN_NAV, ...FOOTER_NAV].find((entry) => entry.href === href);
  if (!item) throw new Error(`nav: no item for "${href}"`);
  return item;
}
