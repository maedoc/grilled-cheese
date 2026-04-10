import type { ChordQuality, HarmonicFunction, PitchClass } from './types.js';

export const PITCH_CLASS_SHARPS: readonly string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

export const PITCH_CLASS_FLATS: readonly string[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
];

export const MAJOR_SCALE_SEMITONES: readonly number[] = [0, 2, 4, 5, 7, 9, 11];

export const MINOR_SCALE_SEMITONES: readonly number[] = [0, 2, 3, 5, 7, 8, 10];

export const HARMONIC_MINOR_SEMITONES: readonly number[] = [0, 2, 3, 5, 7, 8, 11];

export const MELODIC_MINOR_SEMITONES: readonly number[] = [0, 2, 3, 5, 7, 9, 11];

export const MAJOR_KEY_SEVENTH_QUALITIES: Readonly<Record<number, ChordQuality>> = {
  1: 'major7',
  2: 'minor7',
  3: 'minor7',
  4: 'major7',
  5: 'dominant7',
  6: 'minor7',
  7: 'halfDiminished',
};

export const MINOR_KEY_SEVENTH_QUALITIES: Readonly<Record<number, ChordQuality>> = {
  1: 'minor7',
  2: 'halfDiminished',
  3: 'major7',
  4: 'minor7',
  5: 'minor7',
  6: 'major7',
  7: 'major7',
};

export const MAJOR_KEY_FUNCTIONS: Readonly<Record<number, HarmonicFunction>> = {
  1: 'tonic',
  2: 'subdominant',
  3: 'tonic',
  4: 'subdominant',
  5: 'dominant',
  6: 'tonic',
  7: 'dominant',
};

export const MINOR_KEY_FUNCTIONS: Readonly<Record<number, HarmonicFunction>> = {
  1: 'tonic',
  2: 'subdominant',
  3: 'tonic',
  4: 'subdominant',
  5: 'dominant',
  6: 'subdominant',
  7: 'dominant',
};

export const CHORD_QUALITY_INTERVALS: Readonly<Record<ChordQuality, readonly number[]>> = {
  major: [0, 4, 7],
  major6: [0, 4, 7, 9],
  major7: [0, 4, 7, 11],
  minor: [0, 3, 7],
  minor6: [0, 3, 7, 9],
  minor7: [0, 3, 7, 10],
  minorMajor7: [0, 3, 7, 11],
  dominant7: [0, 4, 7, 10],
  diminished: [0, 3, 6],
  diminished7: [0, 3, 6, 9],
  augmented: [0, 4, 8],
  augmented7: [0, 4, 8, 10],
  augmentedMajor7: [0, 4, 8, 11],
  halfDiminished: [0, 3, 6, 10],
  suspended4: [0, 5, 7],
  suspended2: [0, 2, 7],
  power: [0, 7],
};

export const ROMAN_NUMERALS: readonly string[] = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII',
];

export const CHORD_SCALES: Readonly<Record<string, readonly number[]>> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  altered: [0, 1, 3, 4, 6, 8, 10],
  lydianDominant: [0, 2, 4, 6, 7, 9, 10],
  phrygianDominant: [0, 1, 4, 5, 7, 8, 10],
  locrianSharp2: [0, 2, 3, 5, 6, 8, 10],
  wholeTone: [0, 2, 4, 6, 8, 10],
  halfWholeDim: [0, 1, 3, 4, 6, 7, 9, 10],
  wholeHalfDim: [0, 2, 3, 5, 6, 8, 9, 11],
};

const NOTE_TO_PC: Readonly<Record<string, PitchClass>> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4, 'F': 5, 'E#': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11, 'B#': 0,
};

export function noteToPitchClass(note: string): PitchClass {
  const pc = NOTE_TO_PC[note];
  if (pc === undefined) {
    throw new Error(`Unknown note name: "${note}"`);
  }
  return pc;
}

export function pitchClassToNote(pc: PitchClass, useFlats?: boolean): string {
  const table = useFlats ? PITCH_CLASS_FLATS : PITCH_CLASS_SHARPS;
  return table[pc]!;
}

export function pitchClassToChordRoot(pc: PitchClass): string {
  const NAMES: Record<number, string> = {
    0: 'C', 1: 'Db', 2: 'D', 3: 'Eb', 4: 'E', 5: 'F',
    6: 'Gb', 7: 'G', 8: 'Ab', 9: 'A', 10: 'Bb', 11: 'B',
  };
  return NAMES[pc]!;
}

export function intervalBetween(a: PitchClass, b: PitchClass): number {
  return ((b - a) % 12 + 12) % 12;
}

export function transposePitchClass(pc: PitchClass, semitones: number): PitchClass {
  return (((pc + semitones) % 12) + 12) % 12 as PitchClass;
}

export function chordToPitchClasses(root: PitchClass, intervals: readonly number[]): PitchClass[] {
  return intervals.map((i) => transposePitchClass(root, i));
}

export function isSamePitchClass(a: PitchClass, b: PitchClass): boolean {
  return a === b;
}

export function minSemitoneDistance(a: PitchClass, b: PitchClass): number {
  const d = ((b - a) % 12 + 12) % 12;
  return d <= 6 ? d : 12 - d;
}

export function scaleToPitchClasses(tonic: PitchClass, intervals: readonly number[]): PitchClass[] {
  return intervals.map((i) => transposePitchClass(tonic, i));
}

export function isPitchClassInSet(pc: PitchClass, set: readonly PitchClass[]): boolean {
  return set.includes(pc);
}

export function getScaleDegree(pc: PitchClass, scalePitches: readonly PitchClass[]): number | null {
  const idx = scalePitches.indexOf(pc);
  return idx === -1 ? null : idx + 1;
}

export function permutations<T>(arr: readonly T[]): T[][] {
  if (arr.length <= 1) return [arr.slice() as T[]];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i]!, ...perm]);
    }
  }
  return result;
}
