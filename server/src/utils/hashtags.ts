const HASHTAG_RE = /#([\p{L}0-9_]+)/gu;

export function extractHashtags(text?: string | null): string[] {
  if (!text) return [];
  const found = new Set<string>();
  for (const match of text.matchAll(HASHTAG_RE)) {
    found.add(match[1].toLowerCase());
  }
  return [...found];
}
