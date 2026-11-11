/**
 * The language of the page, on the client. The texts of every language are already in the HTML (src/i18n/T.astro)
 * - CSS shows the one of `data-lang` on <html>; here - that attribute, `lang`, and what CSS cannot reach: the
 * attributes (`data-i18n-attrs`) and the texts of `data-i18n-text` (the title). The first paint is set by
 * LocaleInit (head).
 */
import { DEFAULT_LOCALE, LOCALE_CODES, LOCALE_STORAGE_KEY, type Locale } from '../i18n/locales';

export const LOCALE_CHANGE_EVENT = 'localechange';

function isLocale(value: string | null | undefined): value is Locale {
  return value != null && (LOCALE_CODES as readonly string[]).includes(value);
}

/** The chosen one, else the first language of the browser the site has, else the default. */
export function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage is off - by the browser.
  }
  for (const tag of navigator.languages) {
    const code = tag.toLowerCase().split('-')[0];
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export function currentLocale(): Locale {
  const lang = document.documentElement.dataset.lang;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

export function applyLocale(locale: Locale): void {
  const root = document.documentElement;
  root.dataset.lang = locale;
  root.lang = locale;

  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n-attrs]')) {
    const attrs = JSON.parse(el.dataset.i18nAttrs ?? '{}') as Record<
      string,
      Record<Locale, string>
    >;
    for (const [name, values] of Object.entries(attrs)) el.setAttribute(name, values[locale]);
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n-text]')) {
    const values = JSON.parse(el.dataset.i18nText ?? '{}') as Record<Locale, string>;
    el.textContent = values[locale];
  }

  document.dispatchEvent(new CustomEvent<Locale>(LOCALE_CHANGE_EVENT, { detail: locale }));
}

export function setLocale(locale: Locale): void {
  applyLocale(locale);
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage is off - the choice lives until the page is left.
  }
}
