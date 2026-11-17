/**
 * Inline markdown of the changelog - code spans and links - into HTML. Only what `CHANGELOG.md` uses; the rest is
 * escaped text. Links - only `https`.
 */
const TOKEN = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderToken(token: string): string {
  if (token.startsWith('`')) return `<code>${escapeHtml(token.slice(1, -1))}</code>`;
  const link = LINK.exec(token);
  if (link?.[1] && link[2]?.startsWith('https://')) {
    return `<a href="${escapeHtml(link[2])}" rel="noopener noreferrer" target="_blank">${escapeHtml(link[1])}</a>`;
  }
  return escapeHtml(token);
}

export function inlineMarkdown(text: string): string {
  return text
    .split(TOKEN)
    .map((part, index) => (index % 2 === 1 ? renderToken(part) : escapeHtml(part)))
    .join('');
}
