import { describe, it, expect } from 'vitest';
import {
  parseChord,
  analyzeRomanNumeral,
  formatRomanFigure,
  expectedQualityAtDegree,
  createKey,
} from '@grilled-cheese/lib';
import type { Key, ChordQuality } from '@grilled-cheese/lib';

describe('analyzeRomanNumeral - diatonic chords in C major', () => {
  const cMajor = createKey('C', 'major');

  it('Cmaj7 → Imaj7', () => {
    const chord = parseChord('Cmaj7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('Imaj7');
    expect(analysis.scaleDegree).toBe(1);
    expect(analysis.harmonicFunction).toBe('tonic');
    expect(analysis.type).toBe('diatonic');
  });

  it('Dm7 → ii7', () => {
    const chord = parseChord('Dm7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('ii7');
    expect(analysis.scaleDegree).toBe(2);
    expect(analysis.harmonicFunction).toBe('subdominant');
    expect(analysis.type).toBe('diatonic');
  });

  it('Em7 → iii7', () => {
    const chord = parseChord('Em7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('iii7');
    expect(analysis.scaleDegree).toBe(3);
    expect(analysis.harmonicFunction).toBe('tonic');
    expect(analysis.type).toBe('diatonic');
  });

  it('Fmaj7 → IVmaj7', () => {
    const chord = parseChord('Fmaj7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('IVmaj7');
    expect(analysis.scaleDegree).toBe(4);
    expect(analysis.harmonicFunction).toBe('subdominant');
    expect(analysis.type).toBe('diatonic');
  });

  it('G7 → V7', () => {
    const chord = parseChord('G7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('V7');
    expect(analysis.scaleDegree).toBe(5);
    expect(analysis.harmonicFunction).toBe('dominant');
    expect(analysis.type).toBe('diatonic');
  });

  it('Am7 → vi7', () => {
    const chord = parseChord('Am7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('vi7');
    expect(analysis.scaleDegree).toBe(6);
    expect(analysis.harmonicFunction).toBe('tonic');
    expect(analysis.type).toBe('diatonic');
  });

  it('Bm7b5 → viiø7', () => {
    const chord = parseChord('Bm7b5');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('viiø7');
    expect(analysis.scaleDegree).toBe(7);
    expect(analysis.harmonicFunction).toBe('dominant');
    expect(analysis.type).toBe('diatonic');
  });
});

describe('analyzeRomanNumeral - secondary dominants in C major', () => {
  const cMajor = createKey('C', 'major');

  it('D7 → V7/V', () => {
    const chord = parseChord('D7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('V7/v');
    expect(analysis.type).toBe('secondary');
    expect(analysis.secondaryTarget).toBe('v');
  });

  it('E7 → V7/vi', () => {
    const chord = parseChord('E7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('V7/vi');
    expect(analysis.type).toBe('secondary');
    expect(analysis.secondaryTarget).toBe('vi');
  });

  it('A7 → V7/ii', () => {
    const chord = parseChord('A7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('V7/ii');
    expect(analysis.type).toBe('secondary');
    expect(analysis.secondaryTarget).toBe('ii');
  });

  it('B7 → V7/iii', () => {
    const chord = parseChord('B7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.figure).toBe('V7/iii');
    expect(analysis.type).toBe('secondary');
    expect(analysis.secondaryTarget).toBe('iii');
  });

  it('G7 is NOT secondary (diatonic V)', () => {
    const chord = parseChord('G7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.type).toBe('diatonic');
    expect(analysis.figure).toBe('V7');
  });

  it('F7 in C major is not secondary', () => {
    const chord = parseChord('F7');
    const analysis = analyzeRomanNumeral(chord, cMajor);
    expect(analysis.type).toBe('borrowed');
  });
});

describe('analyzeRomanNumeral - diatonic chords in F major', () => {
  const fMajor = createKey('F', 'major');

  it('Fmaj7 → Imaj7', () => {
    const chord = parseChord('Fmaj7');
    const analysis = analyzeRomanNumeral(chord, fMajor);
    expect(analysis.figure).toBe('Imaj7');
    expect(analysis.scaleDegree).toBe(1);
    expect(analysis.type).toBe('diatonic');
  });

  it('Gm7 → ii7', () => {
    const chord = parseChord('Gm7');
    const analysis = analyzeRomanNumeral(chord, fMajor);
    expect(analysis.figure).toBe('ii7');
    expect(analysis.scaleDegree).toBe(2);
  });

  it('Am7 → iii7', () => {
    const chord = parseChord('Am7');
    const analysis = analyzeRomanNumeral(chord, fMajor);
    expect(analysis.figure).toBe('iii7');
    expect(analysis.scaleDegree).toBe(3);
  });

  it('Bbmaj7 → IVmaj7', () => {
    const chord = parseChord('Bbmaj7');
    const analysis = analyzeRomanNumeral(chord, fMajor);
    expect(analysis.figure).toBe('IVmaj7');
    expect(analysis.scaleDegree).toBe(4);
  });

  it('C7 → V7', () => {
    const chord = parseChord('C7');
    const analysis = analyzeRomanNumeral(chord, fMajor);
    expect(analysis.figure).toBe('V7');
    expect(analysis.scaleDegree).toBe(5);
  });

  it('Dm7 → vi7', () => {
    const chord = parseChord('Dm7');
    const analysis = analyzeRomanNumeral(chord, fMajor);
    expect(analysis.figure).toBe('vi7');
    expect(analysis.scaleDegree).toBe(6);
  });

  it('Em7b5 → viiø7', () => {
    const chord = parseChord('Em7b5');
    const analysis = analyzeRomanNumeral(chord, fMajor);
    expect(analysis.figure).toBe('viiø7');
    expect(analysis.scaleDegree).toBe(7);
  });
});

describe('formatRomanFigure', () => {
  it('degree 1, major7 → Imaj7', () => {
    expect(formatRomanFigure(1, 'major7', [], [], 'diatonic')).toBe('Imaj7');
  });

  it('degree 2, minor7 → ii7', () => {
    expect(formatRomanFigure(2, 'minor7', [], [], 'diatonic')).toBe('ii7');
  });

  it('degree 7, halfDiminished → viiø7', () => {
    expect(formatRomanFigure(7, 'halfDiminished', [], [], 'diatonic')).toBe('viiø7');
  });
});

describe('expectedQualityAtDegree', () => {
  const cMajor = createKey('C', 'major');

  it('returns correct qualities for C major', () => {
    expect(expectedQualityAtDegree(1, cMajor)).toBe('major7');
    expect(expectedQualityAtDegree(2, cMajor)).toBe('minor7');
    expect(expectedQualityAtDegree(5, cMajor)).toBe('dominant7');
    expect(expectedQualityAtDegree(7, cMajor)).toBe('halfDiminished');
  });
});
