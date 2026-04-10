import type { ChordVariant, ChordQuality } from '../core/types.js';

const RANKINGS: Record<string, Record<string, number>> = {
  major7: {
    maj7: 0,
    maj9: 1,
    '6': 2,
    '69': 3,
    'maj7#11': 4,
    maj13: 5,
    'maj13#11': 6,
  },
  minor7: {
    m7: 0,
    m9: 1,
    m11: 2,
    m13: 3,
    m6: 4,
    m69: 5,
  },
  dominantToMajor: {
    '7': 0,
    '13': 1,
    '9': 2,
    '7#11': 3,
  },
  dominantToMinor: {
    '7': 0,
    '7b9': 1,
    '7b9b13': 2,
    '7#9': 3,
    '7b13': 4,
    '7#9b13': 5,
    '7b9#9': 6,
  },
  altered: {
    '7alt': 0,
    '7b9': 1,
    '7#9': 2,
    '7b13': 3,
    '7b9b13': 4,
    '7#9b13': 5,
    '7b9#9': 6,
    '7b9#9b13': 7,
  },
  halfDiminished: {
    m7b5: 0,
    'm7b5b9': 1,
    'm7b5b13': 2,
    'm7b5b9b13': 3,
  },
  diminished7: {
    dim7: 0,
  },
};

const SUB_CATEGORY_PRIORITY: Record<string, number> = {
  'tritone-substitute': 0,
  'm6-on-fifth': 1,
  'dim7-equivalent': 2,
  'relative-major6': 3,
  'iii-for-I': 4,
  'halfdim-to-m6': 5,
  'm6-enharmonic': 6,
  'm7-sus-substitute': 7,
  'augmented-dominant': 8,
  'relative-major7': 9,
  'relative-minor6': 10,
  'vi9-for-I': 11,
  'm6-on-third': 12,
  'halfdim-to-m7': 13,
  'm7-on-fifth': 14,
  'pc-overlap': 15,
};

const MAX_VARIANTS = 30;

const RARE_SUFFIXES = new Set([
  '7b9#9',
  '7b9#9b13',
]);

function getSuffix(symbol: string): string {
  return symbol.replace(/^[A-G][#b]?/, '');
}

function getCategory(quality: ChordQuality, variants: ChordVariant[]): string {
  if (quality === 'major7' || quality === 'major6' || quality === 'major') return 'major7';
  if (quality === 'minor7' || quality === 'minor6' || quality === 'minor' || quality === 'minorMajor7') return 'minor7';
  if (quality === 'dominant7') {
    if (variants.some(v => v.symbol.includes('alt'))) return 'altered';
    if (variants.some(v => v.extensions.includes('b9') || v.extensions.includes('#9') || v.extensions.includes('b13'))) {
      return 'dominantToMinor';
    }
    return 'dominantToMajor';
  }
  if (quality === 'halfDiminished') return 'halfDiminished';
  if (quality === 'diminished7') return 'diminished7';
  return 'major7';
}

export function rankVariants(variants: ChordVariant[], quality: ChordQuality): ChordVariant[] {
  const sameRoot = variants.filter(v => v.category === 'same-root');
  const subs = variants.filter(v => v.category !== 'same-root');

  const category = getCategory(quality, sameRoot);
  const ranking = RANKINGS[category] ?? {};

  const sortedSameRoot = [...sameRoot].sort((a, b) => {
    const ra = ranking[getSuffix(a.symbol)] ?? 999;
    const rb = ranking[getSuffix(b.symbol)] ?? 999;
    return ra - rb;
  });

  const sortedSubs = [...subs].sort((a, b) => {
    const ma = a.guideToneMatch === 'exact' ? 0 : 1;
    const mb = b.guideToneMatch === 'exact' ? 0 : 1;
    if (ma !== mb) return ma - mb;
    const pa = SUB_CATEGORY_PRIORITY[a.category] ?? 999;
    const pb = SUB_CATEGORY_PRIORITY[b.category] ?? 999;
    return pa - pb;
  });

  return [...sortedSameRoot, ...sortedSubs];
}

export function filterCommonVariants(variants: ChordVariant[]): ChordVariant[] {
  return variants.filter(v => {
    const suffix = getSuffix(v.symbol);
    return !RARE_SUFFIXES.has(suffix);
  }).slice(0, MAX_VARIANTS);
}
