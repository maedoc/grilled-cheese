import type { ParsedChord, Key, PitchClass } from '../core/types.js';
import {
  intervalBetween,
  ROMAN_NUMERALS,
} from '../core/constants.js';
import { getRootPitchClass } from '../chord/builder.js';
import { getKeyScalePitches, getDegreeInKey } from './key.js';

export interface SecondaryDominantInfo {
  isSecondary: boolean;
  targetDegree: number | null;
  targetRoman: string | null;
  numeral: string | null;
}

function isDominantQuality(quality: string): boolean {
  return quality === 'dominant7';
}

export function isPerfectFifthAbove(
  root: PitchClass,
  key: Key,
): { degree: number; target: PitchClass } | null {
  const scale = getKeyScalePitches(key);
  for (let i = 0; i < scale.length; i++) {
    const degreePitch = scale[i]!;
    if (intervalBetween(degreePitch, root) === 7) {
      return { degree: i + 1, target: degreePitch };
    }
  }
  return null;
}

export function detectSecondaryDominant(
  chord: ParsedChord,
  key: Key,
): SecondaryDominantInfo {
  const root = getRootPitchClass(chord);

  if (!isDominantQuality(chord.quality)) {
    return { isSecondary: false, targetDegree: null, targetRoman: null, numeral: null };
  }

  const degree = getDegreeInKey(root, key);
  if (degree === 5) {
    return { isSecondary: false, targetDegree: null, targetRoman: null, numeral: null };
  }

  const result = isPerfectFifthAbove(root, key);
  if (result) {
    const targetRoman = ROMAN_NUMERALS[result.degree - 1]!.toLowerCase();
    return {
      isSecondary: true,
      targetDegree: result.degree,
      targetRoman,
      numeral: `V7/${targetRoman}`,
    };
  }

  return { isSecondary: false, targetDegree: null, targetRoman: null, numeral: null };
}

export function getSecondaryDominants(
  key: Key,
): Array<{ numeral: string; root: PitchClass; targetDegree: number }> {
  const results: Array<{ numeral: string; root: PitchClass; targetDegree: number }> = [];
  const scale = getKeyScalePitches(key);

  for (let i = 0; i < scale.length; i++) {
    const degree = i + 1;
    const degreePitch = scale[i]!;
    const dominantRoot = (degreePitch + 7) % 12 as PitchClass;

    const dominantDegree = getDegreeInKey(dominantRoot, key);
    if (dominantDegree === 5) continue;

    const targetRoman = ROMAN_NUMERALS[i]!.toLowerCase();
    results.push({
      numeral: `V7/${targetRoman}`,
      root: dominantRoot,
      targetDegree: degree,
    });
  }

  return results;
}
