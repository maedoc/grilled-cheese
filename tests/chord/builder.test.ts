import { describe, it, expect } from 'vitest';
import type { PitchClass } from '@grilled-cheese/lib';
import {
  buildPitchClasses,
  buildGuideTones,
  getThird,
  getSeventh,
  getFifth,
  getRootPitchClass,
} from '@grilled-cheese/lib';
import type { ParsedChord } from '../../src/lib/core/types.js';

function makeChord(overrides: Partial<ParsedChord> & Pick<ParsedChord, 'root' | 'quality'>): ParsedChord {
  return {
    symbol: overrides.root + overrides.quality,
    bass: null,
    extensions: [],
    alterations: [],
    addedTones: [],
    suspensions: [],
    omits: [],
    pitchClasses: [],
    ...overrides,
  };
}

describe('getRootPitchClass', () => {
  it('returns 0 for C', () => {
    expect(getRootPitchClass(makeChord({ root: 'C', quality: 'major' }))).toBe(0);
  });

  it('returns 10 for Bb', () => {
    expect(getRootPitchClass(makeChord({ root: 'Bb', quality: 'dominant7' }))).toBe(10);
  });

  it('returns 6 for F#', () => {
    expect(getRootPitchClass(makeChord({ root: 'F#', quality: 'minor7' }))).toBe(6);
  });
});

describe('getThird', () => {
  it('returns major third for major quality', () => {
    expect(getThird(0, 'major')).toBe(4);
  });

  it('returns minor third for minor quality', () => {
    expect(getThird(0, 'minor')).toBe(3);
  });

  it('returns major third for dominant7', () => {
    expect(getThird(0, 'dominant7')).toBe(4);
  });

  it('returns minor third for minor7', () => {
    expect(getThird(0, 'minor7')).toBe(3);
  });

  it('returns minor third for halfDiminished', () => {
    expect(getThird(0, 'halfDiminished')).toBe(3);
  });

  it('returns major third for major7', () => {
    expect(getThird(0, 'major7')).toBe(4);
  });

  it('returns minor third for minorMajor7', () => {
    expect(getThird(0, 'minorMajor7')).toBe(3);
  });

  it('returns 4th for suspended4', () => {
    expect(getThird(0, 'suspended4')).toBe(5);
  });

  it('returns 2nd for suspended2', () => {
    expect(getThird(0, 'suspended2')).toBe(2);
  });

  it('transposes from non-C root', () => {
    expect(getThird(7, 'major')).toBe(11);
    expect(getThird(7, 'minor')).toBe(10);
  });
});

describe('getSeventh', () => {
  it('returns major 7th for major7', () => {
    expect(getSeventh(0, 'major7')).toBe(11);
  });

  it('returns minor 7th for dominant7', () => {
    expect(getSeventh(0, 'dominant7')).toBe(10);
  });

  it('returns minor 7th for minor7', () => {
    expect(getSeventh(0, 'minor7')).toBe(10);
  });

  it('returns major 7th for minorMajor7', () => {
    expect(getSeventh(0, 'minorMajor7')).toBe(11);
  });

  it('returns minor 7th for halfDiminished', () => {
    expect(getSeventh(0, 'halfDiminished')).toBe(10);
  });

  it('returns diminished 7th for diminished7', () => {
    expect(getSeventh(0, 'diminished7')).toBe(9);
  });

  it('returns minor 7th for augmented7', () => {
    expect(getSeventh(0, 'augmented7')).toBe(10);
  });

  it('returns major 7th for augmentedMajor7', () => {
    expect(getSeventh(0, 'augmentedMajor7')).toBe(11);
  });

  it('transposes from non-C root', () => {
    expect(getSeventh(7, 'dominant7')).toBe(5);
    expect(getSeventh(7, 'major7')).toBe(6);
  });
});

describe('getFifth', () => {
  it('returns perfect 5th for major', () => {
    expect(getFifth(0, 'major')).toBe(7);
  });

  it('returns perfect 5th for minor', () => {
    expect(getFifth(0, 'minor')).toBe(7);
  });

  it('returns diminished 5th for halfDiminished', () => {
    expect(getFifth(0, 'halfDiminished')).toBe(6);
  });

  it('returns augmented 5th for augmented', () => {
    expect(getFifth(0, 'augmented')).toBe(8);
  });

  it('returns diminished 5th for diminished', () => {
    expect(getFifth(0, 'diminished')).toBe(6);
  });
});

describe('buildGuideTones', () => {
  it('returns [3rd, 7th] for major7', () => {
    const chord = makeChord({ root: 'C', quality: 'major7' });
    expect(buildGuideTones(chord)).toEqual([4, 11]);
  });

  it('returns [3rd, 7th] for dominant7', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7' });
    expect(buildGuideTones(chord)).toEqual([4, 10]);
  });

  it('returns [3rd, 7th] for minor7', () => {
    const chord = makeChord({ root: 'C', quality: 'minor7' });
    expect(buildGuideTones(chord)).toEqual([3, 10]);
  });

  it('returns [3rd, 7th] for halfDiminished', () => {
    const chord = makeChord({ root: 'C', quality: 'halfDiminished' });
    expect(buildGuideTones(chord)).toEqual([3, 10]);
  });

  it('returns [3rd, 7th] for minorMajor7', () => {
    const chord = makeChord({ root: 'C', quality: 'minorMajor7' });
    expect(buildGuideTones(chord)).toEqual([3, 11]);
  });

  it('returns correct guide tones from non-C root', () => {
    const chord = makeChord({ root: 'G', quality: 'dominant7' });
    expect(buildGuideTones(chord)).toEqual([11, 5]);
  });
});

describe('buildPitchClasses', () => {
  it('builds major triad', () => {
    const chord = makeChord({ root: 'C', quality: 'major' });
    expect(buildPitchClasses(chord)).toEqual([0, 4, 7]);
  });

  it('builds minor triad', () => {
    const chord = makeChord({ root: 'C', quality: 'minor' });
    expect(buildPitchClasses(chord)).toEqual([0, 3, 7]);
  });

  it('builds dominant7', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7' });
    expect(buildPitchClasses(chord)).toEqual([0, 4, 7, 10]);
  });

  it('builds major7', () => {
    const chord = makeChord({ root: 'C', quality: 'major7' });
    expect(buildPitchClasses(chord)).toEqual([0, 4, 7, 11]);
  });

  it('builds halfDiminished', () => {
    const chord = makeChord({ root: 'C', quality: 'halfDiminished' });
    expect(buildPitchClasses(chord)).toEqual([0, 3, 6, 10]);
  });

  it('builds diminished7', () => {
    const chord = makeChord({ root: 'C', quality: 'diminished7' });
    expect(buildPitchClasses(chord)).toEqual([0, 3, 6, 9]);
  });

  it('builds augmented', () => {
    const chord = makeChord({ root: 'C', quality: 'augmented' });
    expect(buildPitchClasses(chord)).toEqual([0, 4, 8]);
  });

  it('applies b5 alteration', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7', alterations: ['b5'] });
    expect(buildPitchClasses(chord)).toEqual([0, 4, 6, 10]);
  });

  it('applies #5 alteration', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7', alterations: ['#5'] });
    expect(buildPitchClasses(chord)).toEqual([0, 4, 8, 10]);
  });

  it('applies sus4', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7', suspensions: ['sus4'] });
    expect(buildPitchClasses(chord)).toEqual([0, 5, 7, 10]);
  });

  it('applies sus2', () => {
    const chord = makeChord({ root: 'C', quality: 'major', suspensions: ['sus2'] });
    expect(buildPitchClasses(chord)).toEqual([0, 2, 7]);
  });

  it('adds 9th extension', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7', extensions: ['9'] });
    const pcs = buildPitchClasses(chord);
    expect(pcs).toContain(2);
    expect(pcs).toEqual([0, 2, 4, 7, 10]);
  });

  it('adds 13th extension', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7', extensions: ['13'] });
    const pcs = buildPitchClasses(chord);
    expect(pcs).toContain(9);
  });

  it('handles non-C root', () => {
    const chord = makeChord({ root: 'G', quality: 'major' });
    expect(buildPitchClasses(chord)).toEqual([2, 7, 11]);
  });

  it('handles Bb dominant7', () => {
    const chord = makeChord({ root: 'Bb', quality: 'dominant7' });
    expect(buildPitchClasses(chord)).toEqual([2, 5, 8, 10]);
  });

  it('deduplicates pitch classes', () => {
    const chord = makeChord({ root: 'C', quality: 'dominant7', alterations: ['b5'] });
    const pcs = buildPitchClasses(chord);
    expect(new Set(pcs).size).toBe(pcs.length);
  });
});
