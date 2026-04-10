import type { ParsedChord, Key, HarmonicFunction } from '../core/types.js';
import {
  MAJOR_KEY_FUNCTIONS,
  MINOR_KEY_FUNCTIONS,
} from '../core/constants.js';
import { getRootPitchClass } from '../chord/builder.js';
import { getDegreeInKey } from './key.js';
import { detectSecondaryDominant } from './secondary.js';

function isMinorishQuality(quality: string): boolean {
  return quality === 'minor' || quality === 'minor7' || quality === 'minor6'
    || quality === 'minorMajor7' || quality === 'halfDiminished' || quality === 'diminished'
    || quality === 'diminished7';
}

export interface FunctionalContext {
  harmonicFunction: HarmonicFunction;
  isSecondaryDominant: boolean;
  secondaryTarget?: string;
  resolvesToMajor?: boolean;
}

export function getHarmonicFunction(
  chord: ParsedChord,
  key: Key,
): HarmonicFunction {
  const secInfo = detectSecondaryDominant(chord, key);
  if (secInfo.isSecondary) {
    return 'dominant';
  }

  const root = getRootPitchClass(chord);
  const degree = getDegreeInKey(root, key);

  if (degree !== null) {
    const functions = key.mode === 'major'
      ? MAJOR_KEY_FUNCTIONS
      : MINOR_KEY_FUNCTIONS;
    return functions[degree]!;
  }

  return 'dominant';
}

export function resolvesToMajor(
  _chord: ParsedChord,
  nextChord: ParsedChord | null,
  _key: Key,
): boolean {
  if (!nextChord) return true;
  return !isMinorishQuality(nextChord.quality);
}

export function getFunctionalContext(
  chord: ParsedChord,
  nextChord: ParsedChord | null,
  key: Key,
): FunctionalContext {
  const harmonicFunction = getHarmonicFunction(chord, key);
  const secInfo = detectSecondaryDominant(chord, key);

  const result: FunctionalContext = {
    harmonicFunction,
    isSecondaryDominant: secInfo.isSecondary,
  };

  if (secInfo.targetRoman) {
    result.secondaryTarget = secInfo.targetRoman;
  }

  if (harmonicFunction === 'dominant') {
    result.resolvesToMajor = resolvesToMajor(chord, nextChord, key);
  }

  return result;
}
