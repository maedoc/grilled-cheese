import { describe, it, expect } from 'vitest';
import {
  createKey,
  getKeyScalePitches,
  getScalePitch,
  getDiatonicSeventhChord,
  getDiatonicQuality,
  isDiatonic,
  getDegreeInKey,
} from '@grilled-cheese/lib';

describe('createKey', () => {
  it('creates C major', () => {
    const key = createKey('C', 'major');
    expect(key.tonic).toBe('C');
    expect(key.mode).toBe('major');
    expect(key.pitchClass).toBe(0);
  });

  it('creates Bb minor', () => {
    const key = createKey('Bb', 'minor');
    expect(key.tonic).toBe('Bb');
    expect(key.mode).toBe('minor');
    expect(key.pitchClass).toBe(10);
  });

  it('creates all 12 major keys', () => {
    const tonics = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const expected: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    tonics.forEach((t, i) => {
      expect(createKey(t, 'major').pitchClass).toBe(expected[i]);
    });
  });

  it('creates all 12 minor keys', () => {
    const tonics = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const expected: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    tonics.forEach((t, i) => {
      expect(createKey(t, 'minor').pitchClass).toBe(expected[i]);
    });
  });
});

describe('getKeyScalePitches', () => {
  it('returns C major scale', () => {
    const key = createKey('C', 'major');
    expect(getKeyScalePitches(key)).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('returns G major scale', () => {
    const key = createKey('G', 'major');
    expect(getKeyScalePitches(key)).toEqual([7, 9, 11, 0, 2, 4, 6]);
  });

  it('returns F minor scale', () => {
    const key = createKey('F', 'minor');
    expect(getKeyScalePitches(key)).toEqual([5, 7, 8, 10, 0, 1, 3]);
  });

  it('returns A minor scale', () => {
    const key = createKey('A', 'minor');
    expect(getKeyScalePitches(key)).toEqual([9, 11, 0, 2, 4, 5, 7]);
  });
});

describe('getScalePitch', () => {
  it('returns correct pitch for each degree in C major', () => {
    const key = createKey('C', 'major');
    expect(getScalePitch(1, key)).toBe(0);
    expect(getScalePitch(2, key)).toBe(2);
    expect(getScalePitch(3, key)).toBe(4);
    expect(getScalePitch(4, key)).toBe(5);
    expect(getScalePitch(5, key)).toBe(7);
    expect(getScalePitch(6, key)).toBe(9);
    expect(getScalePitch(7, key)).toBe(11);
  });

  it('wraps around for degree > 7', () => {
    const key = createKey('C', 'major');
    expect(getScalePitch(8, key)).toBe(0);
  });
});

describe('getDiatonicSeventhChord', () => {
  const cMajor = createKey('C', 'major');

  it('degree 1 in C major → Cmaj7', () => {
    expect(getDiatonicSeventhChord(1, cMajor)).toEqual([0, 4, 7, 11]);
  });

  it('degree 2 in C major → Dm7', () => {
    expect(getDiatonicSeventhChord(2, cMajor)).toEqual([2, 5, 9, 0]);
  });

  it('degree 3 in C major → Em7', () => {
    expect(getDiatonicSeventhChord(3, cMajor)).toEqual([4, 7, 11, 2]);
  });

  it('degree 4 in C major → Fmaj7', () => {
    expect(getDiatonicSeventhChord(4, cMajor)).toEqual([5, 9, 0, 4]);
  });

  it('degree 5 in C major → G7', () => {
    expect(getDiatonicSeventhChord(5, cMajor)).toEqual([7, 11, 2, 5]);
  });

  it('degree 6 in C major → Am7', () => {
    expect(getDiatonicSeventhChord(6, cMajor)).toEqual([9, 0, 4, 7]);
  });

  it('degree 7 in C major → Bø7', () => {
    expect(getDiatonicSeventhChord(7, cMajor)).toEqual([11, 2, 5, 9]);
  });

  const aMinor = createKey('A', 'minor');

  it('degree 1 in A minor', () => {
    expect(getDiatonicSeventhChord(1, aMinor)).toEqual([9, 0, 4, 7]);
  });

  it('degree 5 in A minor', () => {
    expect(getDiatonicSeventhChord(5, aMinor)).toEqual([4, 7, 11, 2]);
  });
});

describe('getDiatonicQuality', () => {
  it('returns correct qualities for C major', () => {
    const key = createKey('C', 'major');
    expect(getDiatonicQuality(1, key)).toBe('major7');
    expect(getDiatonicQuality(2, key)).toBe('minor7');
    expect(getDiatonicQuality(3, key)).toBe('minor7');
    expect(getDiatonicQuality(4, key)).toBe('major7');
    expect(getDiatonicQuality(5, key)).toBe('dominant7');
    expect(getDiatonicQuality(6, key)).toBe('minor7');
    expect(getDiatonicQuality(7, key)).toBe('halfDiminished');
  });
});

describe('isDiatonic', () => {
  const cMajor = createKey('C', 'major');

  it('returns true for diatonic roots', () => {
    expect(isDiatonic(0, cMajor)).toBe(true);
    expect(isDiatonic(2, cMajor)).toBe(true);
    expect(isDiatonic(4, cMajor)).toBe(true);
    expect(isDiatonic(5, cMajor)).toBe(true);
    expect(isDiatonic(7, cMajor)).toBe(true);
    expect(isDiatonic(9, cMajor)).toBe(true);
    expect(isDiatonic(11, cMajor)).toBe(true);
  });

  it('returns false for chromatic roots', () => {
    expect(isDiatonic(1, cMajor)).toBe(false);
    expect(isDiatonic(3, cMajor)).toBe(false);
    expect(isDiatonic(6, cMajor)).toBe(false);
    expect(isDiatonic(8, cMajor)).toBe(false);
    expect(isDiatonic(10, cMajor)).toBe(false);
  });
});

describe('getDegreeInKey', () => {
  const cMajor = createKey('C', 'major');

  it('returns correct degree for diatonic notes', () => {
    expect(getDegreeInKey(0, cMajor)).toBe(1);
    expect(getDegreeInKey(2, cMajor)).toBe(2);
    expect(getDegreeInKey(4, cMajor)).toBe(3);
    expect(getDegreeInKey(5, cMajor)).toBe(4);
    expect(getDegreeInKey(7, cMajor)).toBe(5);
    expect(getDegreeInKey(9, cMajor)).toBe(6);
    expect(getDegreeInKey(11, cMajor)).toBe(7);
  });

  it('returns null for chromatic notes', () => {
    expect(getDegreeInKey(1, cMajor)).toBeNull();
    expect(getDegreeInKey(3, cMajor)).toBeNull();
    expect(getDegreeInKey(6, cMajor)).toBeNull();
    expect(getDegreeInKey(8, cMajor)).toBeNull();
    expect(getDegreeInKey(10, cMajor)).toBeNull();
  });
});
