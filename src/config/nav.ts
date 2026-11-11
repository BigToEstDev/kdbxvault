/**
 * The navigation of the site - one place for the top bar, the drawer and the footer.
 * «Download» and «GitHub» lead to their panels on the home page (anchors), not to pages of their own.
 */
import type { MessageKey } from '../i18n/locales';

export interface NavItem {
  href: string;
  label: MessageKey;
  icon: string;
}

export const ROUTES = {
  home: '/',
  screenshots: '/screenshots',
  releases: '/releases',
  donate: '/donate',
  privacy: '/privacy',
  terms: '/terms',
  download: '/#download',
  github: '/#github',
} as const;

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
  { href: ROUTES.donate, label: 'nav.donate', icon: 'material-symbols:favorite-outline-rounded' },
];

/** The links of the footer. */
export const FOOTER_NAV: readonly NavItem[] = [
  {
    href: ROUTES.privacy,
    label: 'footer.privacy',
    icon: 'material-symbols:shield-lock-outline-rounded',
  },
  { href: ROUTES.terms, label: 'footer.terms', icon: 'material-symbols:gavel-rounded' },
  { href: ROUTES.github, label: 'footer.source', icon: 'simple-icons:github' },
];

export const ICONS = {
  download: 'material-symbols:download-rounded',
  github: 'simple-icons:github',
  menu: 'material-symbols:menu-rounded',
  close: 'material-symbols:close-rounded',
  locale: 'material-symbols:translate-rounded',
  theme: 'material-symbols:contrast',
  themeSystem: 'material-symbols:brightness-auto-outline-rounded',
  themeLight: 'material-symbols:light-mode-outline-rounded',
  themeDark: 'material-symbols:dark-mode-outline-rounded',
} as const;

/** The item of a route - its label and icon for the heading of its page. */
export function navItem(href: string): NavItem {
  const item = [...MAIN_NAV, ...FOOTER_NAV].find((entry) => entry.href === href);
  if (!item) throw new Error(`nav: no item for "${href}"`);
  return item;
}
