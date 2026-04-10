import { describe, it, expect } from 'vitest';
import type { PitchClass } from '@grilled-cheese/lib';
import { detectQuality, matchesQuality, getCanonicalIntervals } from '@grilled-cheese/lib';
import { CHORD_QUALITY_INTERVALS } from '@grilled-cheese/lib';

describe('detectQuality', () => {
  it('detects major triad', () => {
    expect(detectQuality([0, 4, 7])).toBe('major');
  });

  it('detects minor triad', () => {
    expect(detectQuality([0, 3, 7])).toBe('minor');
  });

  it('detects major7', () => {
    expect(detectQuality([0, 4, 7, 11])).toBe('major7');
  });

  it('detects dominant7', () => {
    expect(detectQuality([0, 4, 7, 10])).toBe('dominant7');
  });

  it('detects minor7', () => {
    expect(detectQuality([0, 3, 7, 10])).toBe('minor7');
  });

  it('detects minorMajor7', () => {
    expect(detectQuality([0, 3, 7, 11])).toBe('minorMajor7');
  });

  it('detects halfDiminished', () => {
    expect(detectQuality([0, 3, 6, 10])).toBe('halfDiminished');
  });

  it('detects diminished7', () => {
    expect(detectQuality([0, 3, 6, 9])).toBe('diminished7');
  });

  it('detects diminished triad', () => {
    expect(detectQuality([0, 3, 6])).toBe('diminished');
  });

  it('detects augmented', () => {
    expect(detectQuality([0, 4, 8])).toBe('augmented');
  });

  it('detects augmented7', () => {
    expect(detectQuality([0, 4, 8, 10])).toBe('augmented7');
  });

  it('detects augmentedMajor7', () => {
    expect(detectQuality([0, 4, 8, 11])).toBe('augmentedMajor7');
  });

  it('detects major6', () => {
    expect(detectQuality([0, 4, 7, 9])).toBe('major6');
  });

  it('detects minor6', () => {
    expect(detectQuality([0, 3, 7, 9])).toBe('minor6');
  });

  it('detects suspended4', () => {
    expect(detectQuality([0, 5, 7])).toBe('suspended4');
  });

  it('detects suspended2', () => {
    expect(detectQuality([0, 2, 7])).toBe('suspended2');
  });

  it('detects power chord', () => {
    expect(detectQuality([0, 7])).toBe('power');
  });

  it('handles intervals > 12 by normalizing', () => {
    expect(detectQuality([0, 4, 7, 11, 14])).toBe('major7');
  });

  it('handles duplicates', () => {
    expect(detectQuality([0, 4, 7, 7])).toBe('major');
  });
});

describe('matchesQuality', () => {
  it('returns true for matching major', () => {
    expect(matchesQuality([0, 4, 7], 'major')).toBe(true);
  });

  it('returns false for non-matching', () => {
    expect(matchesQuality([0, 4, 7], 'minor')).toBe(false);
  });

  it('returns true for matching dominant7', () => {
    expect(matchesQuality([0, 4, 7, 10], 'dominant7')).toBe(true);
  });

  it('returns true for matching halfDiminished', () => {
    expect(matchesQuality([0, 3, 6, 10], 'halfDiminished')).toBe(true);
  });

  it('returns false when lengths differ', () => {
    expect(matchesQuality([0, 4, 7], 'major7')).toBe(false);
  });

  it('returns true for all known qualities', () => {
    const qualities = Object.keys(CHORD_QUALITY_INTERVALS);
    for (const q of qualities) {
      const intervals = [...CHORD_QUALITY_INTERVALS[q as keyof typeof CHORD_QUALITY_INTERVALS]!] as number[];
      expect(matchesQuality(intervals, q as any)).toBe(true);
    }
  });
});

describe('getCanonicalIntervals', () => {
  it('returns base intervals without alterations', () => {
    expect(getCanonicalIntervals('major')).toEqual([0, 4, 7]);
  });

  it('returns base intervals for dominant7', () => {
    expect(getCanonicalIntervals('dominant7')).toEqual([0, 4, 7, 10]);
  });

  it('applies b5 alteration', () => {
    const result = getCanonicalIntervals('dominant7', ['b5']);
    expect(result).toEqual([0, 4, 6, 10]);
  });

  it('applies #5 alteration', () => {
    const result = getCanonicalIntervals('dominant7', ['#5']);
    expect(result).toEqual([0, 4, 8, 10]);
  });

  it('applies b5 and #5 alterations together', () => {
    const result = getCanonicalIntervals('dominant7', ['b5', '#5']);
    expect(result).toContain(6);
    expect(result).toContain(8);
  });

  it('applies b9 alteration as additional interval', () => {
    const result = getCanonicalIntervals('dominant7', ['b9']);
    expect(result).toContain(13);
  });

  it('applies #9 alteration as additional interval', () => {
    const result = getCanonicalIntervals('dominant7', ['#9']);
    expect(result).toContain(15);
  });

  it('applies #11 alteration as additional interval', () => {
    const result = getCanonicalIntervals('dominant7', ['#11']);
    expect(result).toContain(18);
  });

  it('applies b13 alteration as additional interval', () => {
    const result = getCanonicalIntervals('dominant7', ['b13']);
    expect(result).toContain(20);
  });

  it('returns sorted intervals', () => {
    const result = getCanonicalIntervals('dominant7', ['b9', '#5']);
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThan(result[i - 1]!);
    }
  });
});
