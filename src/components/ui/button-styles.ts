/**
 * The looks of the buttons - one place for Button and IconButton (and for links that look like buttons).
 * Pill shapes and state layers in the manner of Material 3; colors - only the tokens of the theme.
 */
/** `accent` - the gold of the brand (tertiary): for what stands apart from the main action (donations). */
export type ButtonVariant = 'filled' | 'accent' | 'tonal' | 'outlined' | 'text';
export type ButtonSize = 'sm' | 'md';

const BASE =
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium ' +
  'transition-colors duration-150 cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
  'disabled:pointer-events-none disabled:opacity-40';

const VARIANTS: Record<ButtonVariant, string> = {
  filled: 'bg-primary text-on-primary shadow-sm hover:bg-primary/90 hover:shadow-md',
  accent: 'bg-tertiary text-on-tertiary shadow-sm hover:bg-tertiary/90 hover:shadow-md',
  tonal: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80',
  outlined: 'border border-outline/40 text-primary hover:bg-primary/8',
  text: 'text-primary hover:bg-primary/8',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-5 text-sm',
};

const ICON_SIZES: Record<ButtonSize, string> = {
  sm: 'size-8',
  md: 'size-10',
};

/** An icon button with no fill of its own - for bars: the color of the content, a state layer on hover. */
const ICON_STANDARD = 'text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface';

export function buttonClasses(variant: ButtonVariant, size: ButtonSize): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`;
}

export type IconButtonVariant = 'standard' | Exclude<ButtonVariant, 'text'>;

export function iconButtonClasses(variant: IconButtonVariant, size: ButtonSize): string {
  const look = variant === 'standard' ? ICON_STANDARD : VARIANTS[variant];
  return `${BASE} ${look} ${ICON_SIZES[size]}`;
}
