import type { ChordQuality, PitchClass, ParsedChord } from '../core/types.js';
import { CHORD_QUALITY_INTERVALS, noteToPitchClass, transposePitchClass } from '../core/constants.js';

export const EXTENSION_SEMITONES: Record<string, number> = {
  '9': 14,
  '11': 17,
  '13': 21,
};

export const ALTERATION_SEMITONES: Record<string, number> = {
  'b5': -1,
  '#5': +1,
  'b9': -1,
  '#9': +1,
  '#11': +1,
  'b13': -1,
};

export function getRootPitchClass(chord: ParsedChord): PitchClass {
  return noteToPitchClass(chord.root);
}

export function getThird(root: PitchClass, quality: ChordQuality): PitchClass {
  const intervals = CHORD_QUALITY_INTERVALS[quality];
  for (const i of intervals) {
    if (i === 3 || i === 4) return transposePitchClass(root, i);
  }
  for (const i of intervals) {
    if (i === 5 || i === 2) return transposePitchClass(root, i);
  }
  return transposePitchClass(root, 4);
}

export function getSeventh(root: PitchClass, quality: ChordQuality): PitchClass {
  const intervals = CHORD_QUALITY_INTERVALS[quality];
  for (const i of intervals) {
    if (i === 9 || i === 10 || i === 11) return transposePitchClass(root, i);
  }
  return transposePitchClass(root, 10);
}

export function getFifth(root: PitchClass, quality: ChordQuality): PitchClass {
  const intervals = CHORD_QUALITY_INTERVALS[quality];
  for (const i of intervals) {
    if (i >= 6 && i <= 8) return transposePitchClass(root, i);
  }
  return transposePitchClass(root, 7);
}

export function buildGuideTones(chord: ParsedChord): [PitchClass, PitchClass] {
  const root = getRootPitchClass(chord);
  return [getThird(root, chord.quality), getSeventh(root, chord.quality)];
}

export function buildPitchClasses(chord: ParsedChord): PitchClass[] {
  const root = getRootPitchClass(chord);
  const baseIntervals = [...CHORD_QUALITY_INTERVALS[chord.quality]];

  if (chord.suspensions.includes('sus4')) {
    const idx3 = baseIntervals.indexOf(4);
    if (idx3 !== -1) baseIntervals[idx3] = 5;
    else if (idx3 === -1) {
      const idx3b = baseIntervals.indexOf(3);
      if (idx3b !== -1) baseIntervals[idx3b] = 5;
    }
  }
  if (chord.suspensions.includes('sus2')) {
    const idx3 = baseIntervals.indexOf(4);
    if (idx3 !== -1) baseIntervals[idx3] = 2;
    else {
      const idx3b = baseIntervals.indexOf(3);
      if (idx3b !== -1) baseIntervals[idx3b] = 2;
    }
  }

  for (const alt of chord.alterations) {
    switch (alt) {
      case 'b5': {
        const idx = baseIntervals.indexOf(7);
        if (idx !== -1) baseIntervals[idx] = 6;
        else baseIntervals.push(6);
        break;
      }
      case '#5': {
        const idx = baseIntervals.indexOf(7);
        if (idx !== -1) baseIntervals[idx] = 8;
        else baseIntervals.push(8);
        break;
      }
    }
  }

  for (const ext of chord.extensions) {
    const semi = EXTENSION_SEMITONES[ext];
    if (semi !== undefined) baseIntervals.push(semi);
  }

  for (const add of chord.addedTones) {
    switch (add) {
      case 'add9': baseIntervals.push(14); break;
      case 'add11': baseIntervals.push(17); break;
      case '6': baseIntervals.push(9); break;
      case '69': baseIntervals.push(9, 14); break;
    }
  }

  for (const alt of chord.alterations) {
    switch (alt) {
      case 'b9': baseIntervals.push(13); break;
      case '#9': baseIntervals.push(15); break;
      case '#11': baseIntervals.push(18); break;
      case 'b13': baseIntervals.push(20); break;
    }
  }

  const pcs = baseIntervals.map(i => {
    const mod = ((i % 12) + 12) % 12;
    return transposePitchClass(root, mod) as PitchClass;
  });

  return [...new Set(pcs)].sort((a, b) => a - b);
}
