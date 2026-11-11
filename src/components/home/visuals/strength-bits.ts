/**
 * The figure «≈ N bits» of the generator card - for the look only (the owner's choice, Step 121): a random number in
 * the range on every roll, not a computed strength.
 */
export const BITS_MIN = 92;
export const BITS_MAX = 110;

export function randomBits(): number {
  return BITS_MIN + Math.floor(Math.random() * (BITS_MAX - BITS_MIN + 1));
}
