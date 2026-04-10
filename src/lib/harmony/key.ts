import type { Key, PitchClass, Mode, ChordQuality } from '../core/types.js';
import {
  noteToPitchClass,
  scaleToPitchClasses,
  getScaleDegree,
  MAJOR_SCALE_SEMITONES,
  MINOR_SCALE_SEMITONES,
  MAJOR_KEY_SEVENTH_QUALITIES,
  MINOR_KEY_SEVENTH_QUALITIES,
} from '../core/constants.js';

function getScaleSemitones(mode: Mode): readonly number[] {
  return mode === 'major' ? MAJOR_SCALE_SEMITONES : MINOR_SCALE_SEMITONES;
}

export function createKey(tonic: string, mode: Mode): Key {
  return {
    tonic,
    mode,
    pitchClass: noteToPitchClass(tonic),
  };
}

export function getKeyScalePitches(key: Key): PitchClass[] {
  const semitones = getScaleSemitones(key.mode);
  return scaleToPitchClasses(key.pitchClass, semitones);
}

export function getScalePitch(degree: number, key: Key): PitchClass {
  const scale = getKeyScalePitches(key);
  const idx = ((degree - 1) % 7 + 7) % 7;
  return scale[idx]!;
}

export function getDiatonicSeventhChord(degree: number, key: Key): PitchClass[] {
  const scale = getKeyScalePitches(key);
  const idx = ((degree - 1) % 7 + 7) % 7;
  const root = scale[idx]!;
  const third = scale[(idx + 2) % 7]!;
  const fifth = scale[(idx + 4) % 7]!;
  const seventh = scale[(idx + 6) % 7]!;
  return [root, third, fifth, seventh];
}

export function getDiatonicQuality(degree: number, key: Key): ChordQuality {
  const qualities = key.mode === 'major'
    ? MAJOR_KEY_SEVENTH_QUALITIES
    : MINOR_KEY_SEVENTH_QUALITIES;
  return qualities[degree]!;
}

export function isDiatonic(chordRoot: PitchClass, key: Key): boolean {
  const scale = getKeyScalePitches(key);
  return scale.includes(chordRoot);
}

export function getDegreeInKey(pc: PitchClass, key: Key): number | null {
  const scale = getKeyScalePitches(key);
  return getScaleDegree(pc, scale);
}
