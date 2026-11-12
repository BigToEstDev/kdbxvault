/**
 * The languages of the site and their strings. One URL for all: every text is put into the HTML in each language,
 * the visible one is chosen by `data-lang` on <html> (src/scripts/locale.ts). The keys are checked at build time.
 */
import { APP_NAME } from '../config/brand';
import en from './locales/en.json';
import ru from './locales/ru.json';

/** The single source of the languages - the detection, the menu and the CSS are built from it. */
export const LOCALES = [
  { code: 'en', nativeName: 'English' },
  { code: 'ru', nativeName: 'Русский' },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'locale';
export const LOCALE_CODES: readonly Locale[] = LOCALES.map((locale) => locale.code);

type Messages = typeof en;

/** The dotted paths to the strings of a dictionary: `locale.label`. */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<Messages>;

/** Where a string names the app: the name is not written in the dictionaries - it is put in here. */
const APP_PLACEHOLDER = '{app}';

function flatten(node: unknown, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof node !== 'object' || node === null) return out;
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value.replaceAll(APP_PLACEHOLDER, APP_NAME));
    else for (const [k, v] of flatten(value, path)) out.set(k, v);
  }
  return out;
}

const FLAT: Record<Locale, Map<string, string>> = {
  en: flatten(en),
  ru: flatten(ru),
};

// A language without a key of the default one, or with a key it does not have - the build fails here.
for (const { code } of LOCALES) {
  const reference = FLAT[DEFAULT_LOCALE];
  const own = FLAT[code];
  const missing = [...reference.keys()].filter((key) => !own.has(key));
  const extra = [...own.keys()].filter((key) => !reference.has(key));
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `i18n: "${code}" does not match "${DEFAULT_LOCALE}" - missing: [${missing.join(', ')}], extra: [${extra.join(', ')}]`,
    );
  }
}

export function t(locale: Locale, key: MessageKey): string {
  const value = FLAT[locale].get(key);
  if (value === undefined) throw new Error(`i18n: no "${key}" in "${locale}"`);
  return value;
}

/** A string in every language - what the client script swaps in attributes and the title. */
export function translations(key: MessageKey): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map(({ code }) => [code, t(code, key)])) as Record<
    Locale,
    string
  >;
}

/**
 * Attributes that CSS cannot swap (`aria-label`, `title`, …): the default language now, every language in
 * `data-i18n-attrs` for src/scripts/locale.ts. Spread onto the element: `{...i18nAttrs({ 'aria-label': key })}`.
 */
export function i18nAttrs(attrs: Record<string, MessageKey>): Record<string, string> {
  const out: Record<string, string> = {};
  const all: Record<string, Record<Locale, string>> = {};
  for (const [name, key] of Object.entries(attrs)) {
    out[name] = t(DEFAULT_LOCALE, key);
    all[name] = translations(key);
  }
  out['data-i18n-attrs'] = JSON.stringify(all);
  return out;
}

/** The text of an element that cannot hold the spans of every language (`<title>`): swapped by the script. */
export function i18nText(key: MessageKey): Record<string, string> {
  return { 'data-i18n-text': JSON.stringify(translations(key)) };
}

/** Hides what is not in the current language: `html[data-lang=X]` shows only `[data-i18n-lang=X]`. */
export const LOCALE_CSS = LOCALES.map(
  ({ code }) =>
    `html[data-lang='${code}'] [data-i18n-lang]:not([data-i18n-lang='${code}']){display:none}`,
).join('');
