/**
 * A link out of the site: a new tab, and the page opened gets no access to this one (`noopener`) nor its address
 * (`noreferrer`). One place for every component that renders a link.
 */
export function linkAttrs(external: boolean): Record<string, string> {
  return external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}
