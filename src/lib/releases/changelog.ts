/**
 * `CHANGELOG.md` of the app (Keep a Changelog): a version → its intro and sections (Added, Changed, ...) with their
 * items. Text - already HTML (inline markdown: code, links).
 */
import { inlineMarkdown } from './inline-markdown';

/** The sections of Keep a Changelog, in its order. */
export const CHANGE_KINDS = [
  'Added',
  'Changed',
  'Deprecated',
  'Removed',
  'Fixed',
  'Security',
] as const;

export type ChangeKind = (typeof CHANGE_KINDS)[number];

export interface ChangeSection {
  kind: ChangeKind;
  /** Items - HTML. */
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  /** Paragraphs before the sections - HTML. */
  intro: string[];
  sections: ChangeSection[];
}

const VERSION_HEADING = /^## \[([^\]]+)\]/;
const SECTION_HEADING = /^### (.+)$/;
const ITEM = /^[-*] (.*)$/;
const LINK_DEFINITION = /^\[[^\]]+\]:\s/;

function isChangeKind(value: string): value is ChangeKind {
  return (CHANGE_KINDS as readonly string[]).includes(value);
}

/** The blocks of a version: paragraphs of the intro, items of the sections - lines joined, still markdown. */
interface Draft {
  version: string;
  intro: string[];
  sections: { kind: ChangeKind; items: string[] }[];
  /** The block lines go to: a paragraph of the intro or an item. */
  open: string[] | undefined;
}

function append(lines: string[], text: string): void {
  const last = lines.length - 1;
  lines[last] = `${lines[last]} ${text}`;
}

function finish(draft: Draft): ChangelogEntry {
  return {
    version: draft.version,
    intro: draft.intro.map(inlineMarkdown),
    sections: draft.sections
      .filter((section) => section.items.length > 0)
      .map((section) => ({ kind: section.kind, items: section.items.map(inlineMarkdown) })),
  };
}

/** Parses the changelog: version → entry. An unknown section - an exception (the build fails). */
export function parseChangelog(text: string): Map<string, ChangelogEntry> {
  const entries = new Map<string, ChangelogEntry>();
  let draft: Draft | undefined;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();

    const version = VERSION_HEADING.exec(line);
    if (version?.[1]) {
      if (draft) entries.set(draft.version, finish(draft));
      draft = { version: version[1], intro: [], sections: [], open: undefined };
      continue;
    }
    if (!draft || LINK_DEFINITION.test(line)) continue;

    const section = SECTION_HEADING.exec(line);
    if (section?.[1]) {
      const kind = section[1].trim();
      if (!isChangeKind(kind))
        throw new Error(`changelog: unknown section "${kind}" in ${draft.version}`);
      draft.sections.push({ kind, items: [] });
      draft.open = undefined;
      continue;
    }

    const current = draft.sections.at(-1);
    const item = ITEM.exec(line);
    if (item?.[1] !== undefined && current) {
      current.items.push(item[1]);
      draft.open = current.items;
    } else if (line.trim() === '') {
      draft.open = undefined;
    } else if (draft.open) {
      append(draft.open, line.trim());
    } else if (!current) {
      draft.intro.push(line.trim());
      draft.open = draft.intro;
    }
  }
  if (draft) entries.set(draft.version, finish(draft));
  return entries;
}
