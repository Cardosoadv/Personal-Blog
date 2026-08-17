const HASHTAG_RE = /#([\p{L}0-9_]+)/gu;

function extractHashtags(text) {
  if (!text) return [];
  const found = new Set();
  for (const match of text.matchAll(HASHTAG_RE)) {
    found.add(match[1].toLowerCase());
  }
  return [...found];
}

module.exports = { extractHashtags };
