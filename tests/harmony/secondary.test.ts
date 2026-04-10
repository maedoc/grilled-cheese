import { describe, it, expect } from 'vitest';
import {
  parseChord,
  detectSecondaryDominant,
  getSecondaryDominants,
  isPerfectFifthAbove,
  createKey,
} from '@grilled-cheese/lib';

describe('detectSecondaryDominant', () => {
  const cMajor = createKey('C', 'major');

  it('E7 in C → V/vi', () => {
    const chord = parseChord('E7');
    const info = detectSecondaryDominant(chord, cMajor);
    expect(info.isSecondary).toBe(true);
    expect(info.targetDegree).toBe(6);
    expect(info.numeral).toBe('V7/vi');
  });

  it('D7 in C → V/V', () => {
    const chord = parseChord('D7');
    const info = detectSecondaryDominant(chord, cMajor);
    expect(info.isSecondary).toBe(true);
    expect(info.targetDegree).toBe(5);
    expect(info.numeral).toBe('V7/v');
  });

  it('A7 in C → V/ii', () => {
    const chord = parseChord('A7');
    const info = detectSecondaryDominant(chord, cMajor);
    expect(info.isSecondary).toBe(true);
    expect(info.targetDegree).toBe(2);
    expect(info.numeral).toBe('V7/ii');
  });

  it('B7 in C → V/iii', () => {
    const chord = parseChord('B7');
    const info = detectSecondaryDominant(chord, cMajor);
    expect(info.isSecondary).toBe(true);
    expect(info.targetDegree).toBe(3);
    expect(info.numeral).toBe('V7/iii');
  });

  it('G7 in C is NOT secondary (diatonic V)', () => {
    const chord = parseChord('G7');
    const info = detectSecondaryDominant(chord, cMajor);
    expect(info.isSecondary).toBe(false);
  });

  it('F7 in C is NOT secondary', () => {
    const chord = parseChord('F7');
    const info = detectSecondaryDominant(chord, cMajor);
    expect(info.isSecondary).toBe(false);
  });

  it('non-dominant chord is not secondary', () => {
    const chord = parseChord('Cmaj7');
    const info = detectSecondaryDominant(chord, cMajor);
    expect(info.isSecondary).toBe(false);
  });
});

describe('getSecondaryDominants', () => {
  it('returns 6 secondary dominants for C major', () => {
    const cMajor = createKey('C', 'major');
    const secDom = getSecondaryDominants(cMajor);
    expect(secDom).toHaveLength(6);

    const numerals = secDom.map(sd => sd.numeral).sort();
    expect(numerals).toContain('V7/ii');
    expect(numerals).toContain('V7/iii');
    expect(numerals).toContain('V7/iv');
    expect(numerals).toContain('V7/v');
    expect(numerals).toContain('V7/vi');
    expect(numerals).toContain('V7/vii');
  });

  it('does not include V/I (which is just the diatonic V)', () => {
    const cMajor = createKey('C', 'major');
    const secDom = getSecondaryDominants(cMajor);
    const numerals = secDom.map(sd => sd.numeral);
    expect(numerals).not.toContain('V7/i');
  });
});

describe('isPerfectFifthAbove', () => {
  const cMajor = createKey('C', 'major');

  it('D is a P5 above G (degree 5)', () => {
    const result = isPerfectFifthAbove(2, cMajor);
    expect(result).not.toBeNull();
    expect(result!.degree).toBe(5);
    expect(result!.target).toBe(7);
  });

  it('E is a P5 above A (degree 6)', () => {
    const result = isPerfectFifthAbove(4, cMajor);
    expect(result).not.toBeNull();
    expect(result!.degree).toBe(6);
    expect(result!.target).toBe(9);
  });

  it('A is a P5 above D (degree 2)', () => {
    const result = isPerfectFifthAbove(9, cMajor);
    expect(result).not.toBeNull();
    expect(result!.degree).toBe(2);
    expect(result!.target).toBe(2);
  });

  it('C# is NOT a P5 above any diatonic degree in C major', () => {
    expect(isPerfectFifthAbove(1, cMajor)).toBeNull();
  });

  it('Bb is NOT a P5 above any diatonic degree in C major', () => {
    expect(isPerfectFifthAbove(10, cMajor)).toBeNull();
  });
});
