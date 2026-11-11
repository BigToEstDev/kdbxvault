/**
 * The password generator of the home page - in the browser only, nothing is sent or kept. The same rule as the dice
 * of the app (pass-app: vault-domain, generator/PasswordGenerator.kt - GENERATED_PASSWORD): 16 characters, lower and
 * upper case letters, digits and symbols, each class present, without the characters that look alike.
 * Randomness - `crypto.getRandomValues`, without the bias of a modulo.
 */
export const PASSWORD_LENGTH = 16;

// Without the look-alikes: i I l L o O 0 1 and the quotes and the bar
const LOWER = 'abcdefghjkmnpqrstuvwxyz';
const UPPER = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const DIGITS = '23456789';
const SYMBOLS = '!#$%&()*+,-./:;<=>?@[]^_{}~';

const CLASSES = [LOWER, UPPER, DIGITS, SYMBOLS] as const;
const ALL = CLASSES.join('');

/** A uniform integer in [0, max): rejects the tail of the range that a modulo would skew. */
function randomBelow(max: number): number {
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buffer = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buffer);
    const value = buffer[0] ?? 0;
    if (value < limit) return value % max;
  }
}

function pick(chars: string): string {
  return chars.charAt(randomBelow(chars.length));
}

export function generatePassword(length: number = PASSWORD_LENGTH): string {
  const chars = CLASSES.map(pick);
  while (chars.length < length) chars.push(pick(ALL));
  // Fisher-Yates: the guaranteed ones are not always at the start
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1);
    [chars[i], chars[j]] = [chars[j] ?? '', chars[i] ?? ''];
  }
  return chars.join('');
}

/** The color of a character by its class - as the app shows a password (Color.kt: PasswordDigit, PasswordSymbol). */
export function charColor(char: string): string {
  if (/\d/.test(char)) return 'text-password-digit';
  if (/[a-z]/i.test(char)) return 'text-on-surface';
  return 'text-password-symbol';
}
