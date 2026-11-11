/**
 * The theme of the site: the system one (no attribute - CSS follows `prefers-color-scheme`) or a fixed one,
 * `data-theme` on <html>. The choice is kept in the browser. The first paint is set by ThemeInit (head).
 */
export const THEME_STORAGE_KEY = 'theme';

export const THEMES = ['system', 'light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = theme;
  }
}

export function setTheme(theme: Theme): void {
  applyTheme(theme);
  try {
    if (theme === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Storage is off (private mode) - the choice lives until the page is left.
  }
}
