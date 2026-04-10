import { describe, it, expect } from 'vitest';
import type { ChordQuality } from '@grilled-cheese/lib';
import {
  PITCH_CLASS_SHARPS,
  PITCH_CLASS_FLATS,
  MAJOR_SCALE_SEMITONES,
  MINOR_SCALE_SEMITONES,
  HARMONIC_MINOR_SEMITONES,
  MELODIC_MINOR_SEMITONES,
  MAJOR_KEY_SEVENTH_QUALITIES,
  MINOR_KEY_SEVENTH_QUALITIES,
  MAJOR_KEY_FUNCTIONS,
  MINOR_KEY_FUNCTIONS,
  CHORD_QUALITY_INTERVALS,
  ROMAN_NUMERALS,
  CHORD_SCALES,
} from '@grilled-cheese/lib';

describe('pitch class name arrays', () => {
  it('has 12 entries in PITCH_CLASS_SHARPS', () => {
    expect(PITCH_CLASS_SHARPS).toHaveLength(12);
  });

  it('has 12 entries in PITCH_CLASS_FLATS', () => {
    expect(PITCH_CLASS_FLATS).toHaveLength(12);
  });

  it('starts with C in both', () => {
    expect(PITCH_CLASS_SHARPS[0]).toBe('C');
    expect(PITCH_CLASS_FLATS[0]).toBe('C');
  });
});

describe('scale semitone arrays', () => {
  it('MAJOR_SCALE_SEMITONES has correct pattern', () => {
    expect(MAJOR_SCALE_SEMITONES).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('MINOR_SCALE_SEMITONES has correct pattern', () => {
    expect(MINOR_SCALE_SEMITONES).toEqual([0, 2, 3, 5, 7, 8, 10]);
  });

  it('HARMONIC_MINOR_SEMITONES has correct pattern', () => {
    expect(HARMONIC_MINOR_SEMITONES).toEqual([0, 2, 3, 5, 7, 8, 11]);
  });

  it('MELODIC_MINOR_SEMITONES has correct pattern', () => {
    expect(MELODIC_MINOR_SEMITONES).toEqual([0, 2, 3, 5, 7, 9, 11]);
  });

  it('all 7-note scales span a full octave', () => {
    const scales = [MAJOR_SCALE_SEMITONES, MINOR_SCALE_SEMITONES, HARMONIC_MINOR_SEMITONES, MELODIC_MINOR_SEMITONES];
    for (const scale of scales) {
      expect(scale).toHaveLength(7);
      expect(scale[0]).toBe(0);
    }
  });
});

describe('MAJOR_KEY_SEVENTH_QUALITIES', () => {
  it('has entries for all 7 scale degrees', () => {
    for (let i = 1; i <= 7; i++) {
      expect(MAJOR_KEY_SEVENTH_QUALITIES[i]).toBeDefined();
    }
  });

  it('maps degree 1 to major7', () => {
    expect(MAJOR_KEY_SEVENTH_QUALITIES[1]).toBe('major7');
  });

  it('maps degree 5 to dominant7', () => {
    expect(MAJOR_KEY_SEVENTH_QUALITIES[5]).toBe('dominant7');
  });

  it('maps degree 7 to halfDiminished', () => {
    expect(MAJOR_KEY_SEVENTH_QUALITIES[7]).toBe('halfDiminished');
  });
});

describe('MINOR_KEY_SEVENTH_QUALITIES', () => {
  it('has entries for all 7 scale degrees', () => {
    for (let i = 1; i <= 7; i++) {
      expect(MINOR_KEY_SEVENTH_QUALITIES[i]).toBeDefined();
    }
  });

  it('maps degree 1 to minor7', () => {
    expect(MINOR_KEY_SEVENTH_QUALITIES[1]).toBe('minor7');
  });
});

describe('harmonic function mappings', () => {
  it('MAJOR_KEY_FUNCTIONS has all 7 degrees', () => {
    for (let i = 1; i <= 7; i++) {
      expect(MAJOR_KEY_FUNCTIONS[i]).toBeDefined();
    }
  });

  it('MINOR_KEY_FUNCTIONS has all 7 degrees', () => {
    for (let i = 1; i <= 7; i++) {
      expect(MINOR_KEY_FUNCTIONS[i]).toBeDefined();
    }
  });

  it('degree 1 is tonic in both modes', () => {
    expect(MAJOR_KEY_FUNCTIONS[1]).toBe('tonic');
    expect(MINOR_KEY_FUNCTIONS[1]).toBe('tonic');
  });

  it('degree 5 is dominant in both modes', () => {
    expect(MAJOR_KEY_FUNCTIONS[5]).toBe('dominant');
    expect(MINOR_KEY_FUNCTIONS[5]).toBe('dominant');
  });
});

describe('CHORD_QUALITY_INTERVALS', () => {
  const allQualities: ChordQuality[] = [
    'major', 'major6', 'major7', 'minor', 'minor6', 'minor7',
    'minorMajor7', 'dominant7', 'diminished', 'diminished7',
    'augmented', 'augmented7', 'augmentedMajor7', 'halfDiminished',
    'suspended4', 'suspended2', 'power',
  ];

  it('has an entry for every ChordQuality', () => {
    for (const q of allQualities) {
      expect(CHORD_QUALITY_INTERVALS[q]).toBeDefined();
    }
  });

  it('every interval array starts with 0 (root)', () => {
    for (const q of allQualities) {
      expect(CHORD_QUALITY_INTERVALS[q]![0]).toBe(0);
    }
  });

  it('every interval value is between 0 and 11', () => {
    for (const q of allQualities) {
      for (const interval of CHORD_QUALITY_INTERVALS[q]!) {
        expect(interval).toBeGreaterThanOrEqual(0);
        expect(interval).toBeLessThanOrEqual(11);
      }
    }
  });

  it('intervals are in ascending order within each chord', () => {
    for (const q of allQualities) {
      const intervals = CHORD_QUALITY_INTERVALS[q]!;
      for (let i = 1; i < intervals.length; i++) {
        expect(intervals[i]).toBeGreaterThan(intervals[i - 1]!);
      }
    }
  });
});

describe('ROMAN_NUMERALS', () => {
  it('has 7 entries', () => {
    expect(ROMAN_NUMERALS).toHaveLength(7);
  });

  it('matches expected values', () => {
    expect(ROMAN_NUMERALS).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
  });
});

describe('CHORD_SCALES', () => {
  it('has entries for all expected scale names', () => {
    const expected = [
      'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian',
      'locrian', 'melodicMinor', 'harmonicMinor', 'altered', 'lydianDominant',
      'phrygianDominant', 'locrianSharp2', 'wholeTone', 'halfWholeDim', 'wholeHalfDim',
    ];
    for (const name of expected) {
      expect(CHORD_SCALES[name]).toBeDefined();
    }
  });

  it('every scale starts with 0', () => {
    for (const [, pitches] of Object.entries(CHORD_SCALES)) {
      expect(pitches[0]).toBe(0);
    }
  });

  it('every pitch in every scale is between 0 and 11', () => {
    for (const [, pitches] of Object.entries(CHORD_SCALES)) {
      for (const p of pitches) {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(11);
      }
    }
  });

  it('every scale is in ascending order', () => {
    for (const [, pitches] of Object.entries(CHORD_SCALES)) {
      for (let i = 1; i < pitches.length; i++) {
        expect(pitches[i]).toBeGreaterThan(pitches[i - 1]!);
      }
    }
  });

  it('7-note diatonic scales have correct interval patterns', () => {
    expect(CHORD_SCALES.ionian).toEqual([0, 2, 4, 5, 7, 9, 11]);
    expect(CHORD_SCALES.dorian).toEqual([0, 2, 3, 5, 7, 9, 10]);
    expect(CHORD_SCALES.phrygian).toEqual([0, 1, 3, 5, 7, 8, 10]);
    expect(CHORD_SCALES.lydian).toEqual([0, 2, 4, 6, 7, 9, 11]);
    expect(CHORD_SCALES.mixolydian).toEqual([0, 2, 4, 5, 7, 9, 10]);
    expect(CHORD_SCALES.aeolian).toEqual([0, 2, 3, 5, 7, 8, 10]);
    expect(CHORD_SCALES.locrian).toEqual([0, 1, 3, 5, 6, 8, 10]);
  });

  it('wholeTone has 6 notes all a whole step apart', () => {
    expect(CHORD_SCALES.wholeTone).toEqual([0, 2, 4, 6, 8, 10]);
  });

  it('octatonic scales have 8 notes', () => {
    expect(CHORD_SCALES.halfWholeDim).toHaveLength(8);
    expect(CHORD_SCALES.wholeHalfDim).toHaveLength(8);
  });
});
