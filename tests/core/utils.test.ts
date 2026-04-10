import { describe, it, expect } from 'vitest';
import {
  noteToPitchClass,
  pitchClassToNote,
  intervalBetween,
  transposePitchClass,
  chordToPitchClasses,
  isSamePitchClass,
  minSemitoneDistance,
  scaleToPitchClasses,
  isPitchClassInSet,
  getScaleDegree,
  permutations,
} from '@grilled-cheese/lib';

describe('noteToPitchClass', () => {
  it('maps natural notes correctly', () => {
    expect(noteToPitchClass('C')).toBe(0);
    expect(noteToPitchClass('D')).toBe(2);
    expect(noteToPitchClass('E')).toBe(4);
    expect(noteToPitchClass('F')).toBe(5);
    expect(noteToPitchClass('G')).toBe(7);
    expect(noteToPitchClass('A')).toBe(9);
    expect(noteToPitchClass('B')).toBe(11);
  });

  it('maps sharps correctly', () => {
    expect(noteToPitchClass('C#')).toBe(1);
    expect(noteToPitchClass('D#')).toBe(3);
    expect(noteToPitchClass('F#')).toBe(6);
    expect(noteToPitchClass('G#')).toBe(8);
    expect(noteToPitchClass('A#')).toBe(10);
  });

  it('maps flats correctly', () => {
    expect(noteToPitchClass('Db')).toBe(1);
    expect(noteToPitchClass('Eb')).toBe(3);
    expect(noteToPitchClass('Gb')).toBe(6);
    expect(noteToPitchClass('Ab')).toBe(8);
    expect(noteToPitchClass('Bb')).toBe(10);
  });

  it('handles enharmonic equivalents', () => {
    expect(noteToPitchClass('B#')).toBe(0);
    expect(noteToPitchClass('Cb')).toBe(11);
    expect(noteToPitchClass('E#')).toBe(5);
    expect(noteToPitchClass('Fb')).toBe(4);
  });

  it('throws for unknown notes', () => {
    expect(() => noteToPitchClass('X')).toThrow();
    expect(() => noteToPitchClass('')).toThrow();
    expect(() => noteToPitchClass('H')).toThrow();
  });
});

describe('pitchClassToNote', () => {
  it('returns sharp names by default', () => {
    expect(pitchClassToNote(0)).toBe('C');
    expect(pitchClassToNote(1)).toBe('C#');
    expect(pitchClassToNote(3)).toBe('D#');
    expect(pitchClassToNote(6)).toBe('F#');
    expect(pitchClassToNote(10)).toBe('A#');
  });

  it('returns flat names when useFlats=true', () => {
    expect(pitchClassToNote(1, true)).toBe('Db');
    expect(pitchClassToNote(3, true)).toBe('Eb');
    expect(pitchClassToNote(6, true)).toBe('Gb');
    expect(pitchClassToNote(8, true)).toBe('Ab');
    expect(pitchClassToNote(10, true)).toBe('Bb');
  });

  it('is the inverse of noteToPitchClass for sharps', () => {
    for (let i = 0; i < 12; i++) {
      const name = pitchClassToNote(i as any);
      expect(noteToPitchClass(name)).toBe(i);
    }
  });
});

describe('intervalBetween', () => {
  it('computes ascending intervals', () => {
    expect(intervalBetween(0, 4)).toBe(4);
    expect(intervalBetween(0, 7)).toBe(7);
    expect(intervalBetween(5, 11)).toBe(6);
  });

  it('handles wrap-around (descending becomes ascending)', () => {
    expect(intervalBetween(4, 0)).toBe(8);
    expect(intervalBetween(11, 0)).toBe(1);
    expect(intervalBetween(7, 2)).toBe(7);
  });

  it('returns 0 for same pitch class', () => {
    expect(intervalBetween(0, 0)).toBe(0);
    expect(intervalBetween(6, 6)).toBe(0);
  });
});

describe('transposePitchClass', () => {
  it('transposes within octave', () => {
    expect(transposePitchClass(0, 4)).toBe(4);
    expect(transposePitchClass(0, 7)).toBe(7);
    expect(transposePitchClass(5, 2)).toBe(7);
  });

  it('wraps above 11', () => {
    expect(transposePitchClass(10, 4)).toBe(2);
    expect(transposePitchClass(11, 1)).toBe(0);
    expect(transposePitchClass(9, 12)).toBe(9);
  });

  it('handles negative transposition', () => {
    expect(transposePitchClass(0, -1)).toBe(11);
    expect(transposePitchClass(2, -4)).toBe(10);
    expect(transposePitchClass(5, -12)).toBe(5);
  });
});

describe('chordToPitchClasses', () => {
  it('builds a major chord', () => {
    expect(chordToPitchClasses(0, [0, 4, 7])).toEqual([0, 4, 7]);
  });

  it('builds a dominant 7th chord', () => {
    expect(chordToPitchClasses(0, [0, 4, 7, 10])).toEqual([0, 4, 7, 10]);
  });

  it('builds a minor chord from D', () => {
    expect(chordToPitchClasses(2, [0, 3, 7])).toEqual([2, 5, 9]);
  });

  it('builds a diminished chord from B', () => {
    expect(chordToPitchClasses(11, [0, 3, 6])).toEqual([11, 2, 5]);
  });

  it('builds a minor 7th from G', () => {
    expect(chordToPitchClasses(7, [0, 3, 7, 10])).toEqual([7, 10, 2, 5]);
  });
});

describe('isSamePitchClass', () => {
  it('returns true for same values', () => {
    expect(isSamePitchClass(0, 0)).toBe(true);
    expect(isSamePitchClass(6, 6)).toBe(true);
  });

  it('returns false for different values', () => {
    expect(isSamePitchClass(0, 1)).toBe(false);
    expect(isSamePitchClass(3, 4)).toBe(false);
  });
});

describe('minSemitoneDistance', () => {
  it('computes adjacent distances', () => {
    expect(minSemitoneDistance(0, 1)).toBe(1);
    expect(minSemitoneDistance(1, 0)).toBe(1);
    expect(minSemitoneDistance(5, 6)).toBe(1);
  });

  it('computes tritone distance', () => {
    expect(minSemitoneDistance(0, 6)).toBe(6);
    expect(minSemitoneDistance(6, 0)).toBe(6);
  });

  it('wraps around octave', () => {
    expect(minSemitoneDistance(0, 11)).toBe(1);
    expect(minSemitoneDistance(11, 0)).toBe(1);
    expect(minSemitoneDistance(1, 10)).toBe(3);
  });

  it('returns 0 for same pitch class', () => {
    expect(minSemitoneDistance(4, 4)).toBe(0);
  });
});

describe('scaleToPitchClasses', () => {
  it('builds C major', () => {
    expect(scaleToPitchClasses(0, [0, 2, 4, 5, 7, 9, 11])).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('builds D major', () => {
    expect(scaleToPitchClasses(2, [0, 2, 4, 5, 7, 9, 11])).toEqual([2, 4, 6, 7, 9, 11, 1]);
  });

  it('builds F minor (natural)', () => {
    expect(scaleToPitchClasses(5, [0, 2, 3, 5, 7, 8, 10])).toEqual([5, 7, 8, 10, 0, 1, 3]);
  });
});

describe('isPitchClassInSet', () => {
  it('returns true when present', () => {
    expect(isPitchClassInSet(0, [0, 4, 7])).toBe(true);
    expect(isPitchClassInSet(4, [0, 4, 7])).toBe(true);
  });

  it('returns false when absent', () => {
    expect(isPitchClassInSet(1, [0, 4, 7])).toBe(false);
    expect(isPitchClassInSet(3, [0, 2, 5])).toBe(false);
  });
});

describe('getScaleDegree', () => {
  const cMajor = [0, 2, 4, 5, 7, 9, 11] as const;

  it('returns correct 1-indexed degree for diatonic notes', () => {
    expect(getScaleDegree(0, cMajor)).toBe(1);
    expect(getScaleDegree(2, cMajor)).toBe(2);
    expect(getScaleDegree(4, cMajor)).toBe(3);
    expect(getScaleDegree(5, cMajor)).toBe(4);
    expect(getScaleDegree(7, cMajor)).toBe(5);
    expect(getScaleDegree(9, cMajor)).toBe(6);
    expect(getScaleDegree(11, cMajor)).toBe(7);
  });

  it('returns null for chromatic notes', () => {
    expect(getScaleDegree(1, cMajor)).toBeNull();
    expect(getScaleDegree(3, cMajor)).toBeNull();
    expect(getScaleDegree(6, cMajor)).toBeNull();
  });
});

describe('permutations', () => {
  it('returns single empty permutation for empty array', () => {
    expect(permutations([])).toEqual([[]]);
  });

  it('returns single permutation for single element', () => {
    expect(permutations([42])).toEqual([[42]]);
  });

  it('returns 6 permutations for [1,2,3]', () => {
    const result = permutations([1, 2, 3]);
    expect(result).toHaveLength(6);
    expect(result).toEqual(
      expect.arrayContaining([
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ])
    );
  });

  it('returns 24 permutations for [1,2,3,4]', () => {
    expect(permutations([1, 2, 3, 4])).toHaveLength(24);
  });

  it('does not mutate the input', () => {
    const input = [1, 2, 3];
    permutations(input);
    expect(input).toEqual([1, 2, 3]);
  });
});
