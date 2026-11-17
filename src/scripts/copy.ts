/**
 * The copy buttons (components/ui/CopyButton.astro): the text of `data-copy-text` to the clipboard; after a copy -
 * `data-copied` for a moment (the check icon). No clipboard (an insecure context, a refusal) - nothing to confirm.
 */
const COPIED_MS = 1500;

export function initCopyButtons(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('button[data-copy-text]')) {
    let timer: number | undefined;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copyText ?? '');
      } catch {
        return;
      }
      button.dataset.copied = '';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => delete button.dataset.copied, COPIED_MS);
    });
  }
}
