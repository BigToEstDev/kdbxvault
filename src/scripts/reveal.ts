/**
 * Reveal on scroll: marks `[data-reveal]` with `.is-revealed` once it enters the window (CSS - global.css).
 * Once shown, it stays shown. Without IntersectionObserver - everything is shown at once.
 */
const REVEALED = 'is-revealed';

export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add(REVEALED);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(REVEALED);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  for (const el of targets) observer.observe(el);
}
