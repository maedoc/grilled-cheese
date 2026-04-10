import type { ChordQuality, Alteration } from '../core/types.js';
import { CHORD_QUALITY_INTERVALS } from '../core/constants.js';

export function detectQuality(intervals: number[]): ChordQuality {
  const normalized = [...new Set(intervals.map(i => ((i % 12) + 12) % 12))].sort((a, b) => a - b);

  for (const [quality, pattern] of Object.entries(CHORD_QUALITY_INTERVALS)) {
    if (normalized.length === pattern.length && normalized.every((v, i) => v === pattern[i])) {
      return quality as ChordQuality;
    }
  }

  let bestMatch: ChordQuality = 'major';
  let bestLen = 0;
  for (const [quality, pattern] of Object.entries(CHORD_QUALITY_INTERVALS)) {
    if (pattern.every(p => normalized.includes(p)) && pattern.length > bestLen) {
      bestMatch = quality as ChordQuality;
      bestLen = pattern.length;
    }
  }
  return bestMatch;
}

export function matchesQuality(intervals: number[], quality: ChordQuality): boolean {
  const normalized = [...new Set(intervals.map(i => ((i % 12) + 12) % 12))].sort((a, b) => a - b);
  const canonical = [...CHORD_QUALITY_INTERVALS[quality]].sort((a, b) => a - b);
  return normalized.length === canonical.length && normalized.every((v, i) => v === canonical[i]);
}

export function getCanonicalIntervals(quality: ChordQuality, alterations: Alteration[] = []): number[] {
  const base = [...CHORD_QUALITY_INTERVALS[quality]];

  for (const alt of alterations) {
    switch (alt) {
      case 'b5': {
        const idx = base.indexOf(7);
        if (idx !== -1) base[idx] = 6;
        else base.push(6);
        break;
      }
      case '#5': {
        const idx = base.indexOf(7);
        if (idx !== -1) base[idx] = 8;
        else base.push(8);
        break;
      }
      case 'b9': {
        base.push(13);
        break;
      }
      case '#9': {
        base.push(15);
        break;
      }
      case '#11': {
        base.push(18);
        break;
      }
      case 'b13': {
        base.push(20);
        break;
      }
    }
  }

  return base.sort((a, b) => a - b);
}
