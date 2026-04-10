import type {
  ParsedChord,
  Key,
  RomanNumeralAnalysis,
  ChordQuality,
} from '../core/types.js';
import {
  ROMAN_NUMERALS,
  MAJOR_KEY_SEVENTH_QUALITIES,
  MINOR_KEY_SEVENTH_QUALITIES,
  MAJOR_KEY_FUNCTIONS,
  MINOR_KEY_FUNCTIONS,
} from '../core/constants.js';
import { getRootPitchClass } from '../chord/builder.js';
import { getDegreeInKey, getKeyScalePitches, isDiatonic } from './key.js';
import { detectSecondaryDominant } from './secondary.js';

function isMinorishQuality(quality: ChordQuality): boolean {
  return quality === 'minor' || quality === 'minor7' || quality === 'minor6'
    || quality === 'minorMajor7' || quality === 'halfDiminished' || quality === 'diminished'
    || quality === 'diminished7';
}

function qualitySuffix(quality: ChordQuality): string {
  switch (quality) {
    case 'major7': return 'maj7';
    case 'major6': return '6';
    case 'major': return '';
    case 'minor7': return '7';
    case 'minor6': return '6';
    case 'minor': return '';
    case 'minorMajor7': return 'maj7';
    case 'dominant7': return '7';
    case 'diminished7': return '°7';
    case 'diminished': return '°';
    case 'halfDiminished': return 'ø7';
    case 'augmented': return '+';
    case 'augmented7': return '7+';
    case 'augmentedMajor7': return 'maj7+';
    case 'suspended4': return 'sus4';
    case 'suspended2': return 'sus2';
    case 'power': return '5';
  }
}

function formatAlterations(quality: ChordQuality, alterations: string[]): string {
  if (quality === 'halfDiminished' || quality === 'diminished' || quality === 'diminished7') {
    const filtered = alterations.filter(a => a !== 'b5' && a !== '#5');
    return filtered.sort().join('');
  }
  return alterations.slice().sort().join('');
}

export function formatRomanFigure(
  degree: number,
  quality: ChordQuality,
  _extensions: string[],
  alterations: string[],
  type: 'diatonic' | 'secondary' | 'borrowed',
  secondaryTarget?: string,
): string {
  const roman = ROMAN_NUMERALS[degree - 1]!;

  let figure: string;
  if (isMinorishQuality(quality)) {
    figure = roman.toLowerCase();
  } else {
    figure = roman;
  }

  figure += qualitySuffix(quality);
  figure += formatAlterations(quality, alterations);

  if (type === 'secondary' && secondaryTarget) {
    figure += `/${secondaryTarget}`;
  }

  return figure;
}

export function expectedQualityAtDegree(degree: number, key: Key): ChordQuality {
  const qualities = key.mode === 'major'
    ? MAJOR_KEY_SEVENTH_QUALITIES
    : MINOR_KEY_SEVENTH_QUALITIES;
  return qualities[degree]!;
}

function getHarmonicFunctionForDegree(degree: number, key: Key) {
  const functions = key.mode === 'major'
    ? MAJOR_KEY_FUNCTIONS
    : MINOR_KEY_FUNCTIONS;
  return functions[degree]!;
}

function isSecondaryIi(chord: ParsedChord, key: Key): { targetDegree: number; targetRoman: string } | null {
  const root = getRootPitchClass(chord);
  const quality = chord.quality;

  if (quality !== 'minor7' && quality !== 'halfDiminished') return null;
  if (isDiatonic(root, key)) return null;

  const scale = getKeyScalePitches(key);
  for (let i = 0; i < scale.length; i++) {
    const degreePitch = scale[i]!;
    const fourthAbove = (degreePitch + 5) % 12;

    if (root === fourthAbove) {
      const targetRoman = ROMAN_NUMERALS[i]!.toLowerCase();
      return { targetDegree: i + 1, targetRoman };
    }
  }

  return null;
}

export function analyzeRomanNumeral(chord: ParsedChord, key: Key): RomanNumeralAnalysis {
  const root = getRootPitchClass(chord);
  const degree = getDegreeInKey(root, key);

  if (degree !== null) {
    const secInfo = detectSecondaryDominant(chord, key);
    if (secInfo.isSecondary) {
      return {
        figure: secInfo.numeral!,
        scaleDegree: degree,
        quality: chord.quality,
        harmonicFunction: 'dominant',
        type: 'secondary',
        ...(secInfo.targetRoman ? { secondaryTarget: secInfo.targetRoman } : {}),
      };
    }

    const expected = expectedQualityAtDegree(degree, key);
    const figure = formatRomanFigure(
      degree,
      chord.quality,
      chord.extensions.map(e => e as string),
      chord.alterations.map(a => a as string),
      'diatonic',
    );

    if (chord.quality === expected || qualityFamilyMatch(chord.quality, expected)) {
      return {
        figure,
        scaleDegree: degree,
        quality: chord.quality,
        harmonicFunction: getHarmonicFunctionForDegree(degree, key),
        type: 'diatonic',
      };
    }

    return {
      figure,
      scaleDegree: degree,
      quality: chord.quality,
      harmonicFunction: getHarmonicFunctionForDegree(degree, key),
      type: 'borrowed',
    };
  }

  const secondaryInfo = detectSecondaryDominant(chord, key);
  if (secondaryInfo.isSecondary && secondaryInfo.targetDegree) {
    return {
      figure: secondaryInfo.numeral!,
      scaleDegree: -1,
      quality: chord.quality,
      harmonicFunction: 'dominant',
      type: 'secondary',
      ...(secondaryInfo.targetRoman ? { secondaryTarget: secondaryInfo.targetRoman } : {}),
    };
  }

  const secIi = isSecondaryIi(chord, key);
  if (secIi) {
    const targetRoman = secIi.targetRoman;
    const roman = ROMAN_NUMERALS[1]!.toLowerCase();
    return {
      figure: `${roman}7/${targetRoman}`,
      scaleDegree: -1,
      quality: chord.quality,
      harmonicFunction: 'predominant',
      type: 'secondary',
      secondaryTarget: targetRoman,
    };
  }

  return {
    figure: formatRomanFigure(
      1,
      chord.quality,
      chord.extensions.map(e => e as string),
      chord.alterations.map(a => a as string),
      'borrowed',
    ),
    scaleDegree: -1,
    quality: chord.quality,
    harmonicFunction: 'dominant',
    type: 'borrowed',
  };
}

function qualityFamilyMatch(actual: ChordQuality, expected: ChordQuality): boolean {
  if (actual === expected) return true;
  const majorQualities: ChordQuality[] = ['major', 'major6', 'major7', 'augmented', 'augmented7', 'augmentedMajor7'];
  const minorQualities: ChordQuality[] = ['minor', 'minor6', 'minor7', 'minorMajor7'];
  const dimQualities: ChordQuality[] = ['diminished', 'diminished7', 'halfDiminished'];
  const families = [majorQualities, minorQualities, dimQualities];
  return families.some(f => f.includes(actual) && f.includes(expected));
}
