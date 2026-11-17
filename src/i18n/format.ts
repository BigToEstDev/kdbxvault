/**
 * Numbers, sizes and dates in the manner of a language - at build time, a text per language (Localized.astro).
 * Dates - in UTC: the same day on every machine that builds the site.
 */
import { t, type Locale, type MessageKey } from './locales';

const MEBIBYTE = 1024 * 1024;

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** The size of a file - whole megabytes (as GitHub shows them). */
export function formatSize(locale: Locale, bytes: number): string {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 0,
  }).format(bytes / MEBIBYTE);
}

/** A date of an ISO string - day, month in words, year. */
export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(iso),
  );
}

/** The plural forms of the dictionaries: a group of keys `one`, `few`, `many`, `other`, each with `{n}`. */
export type PluralKey = 'download.count';

/** «1 download», «5 скачиваний»: the form by the rules of the language, the number in its manner. */
export function formatPlural(locale: Locale, key: PluralKey, value: number): string {
  const rule = new Intl.PluralRules(locale).select(value);
  const form = rule === 'one' || rule === 'few' || rule === 'many' ? rule : 'other';
  return t(locale, `${key}.${form}` as MessageKey).replace('{n}', formatNumber(locale, value));
}
