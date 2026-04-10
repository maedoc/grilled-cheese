import { describe, it, expect } from 'vitest';
import {
  parseChord,
  getHarmonicFunction,
  resolvesToMajor,
  getFunctionalContext,
  createKey,
} from '@grilled-cheese/lib';

describe('getHarmonicFunction', () => {
  const cMajor = createKey('C', 'major');

  it('Cmaj7 → tonic', () => {
    const chord = parseChord('Cmaj7');
    expect(getHarmonicFunction(chord, cMajor)).toBe('tonic');
  });

  it('Dm7 → subdominant', () => {
    const chord = parseChord('Dm7');
    expect(getHarmonicFunction(chord, cMajor)).toBe('subdominant');
  });

  it('Em7 → tonic', () => {
    const chord = parseChord('Em7');
    expect(getHarmonicFunction(chord, cMajor)).toBe('tonic');
  });

  it('Fmaj7 → subdominant', () => {
    const chord = parseChord('Fmaj7');
    expect(getHarmonicFunction(chord, cMajor)).toBe('subdominant');
  });

  it('G7 → dominant', () => {
    const chord = parseChord('G7');
    expect(getHarmonicFunction(chord, cMajor)).toBe('dominant');
  });

  it('Am7 → tonic', () => {
    const chord = parseChord('Am7');
    expect(getHarmonicFunction(chord, cMajor)).toBe('tonic');
  });

  it('Bm7b5 → dominant', () => {
    const chord = parseChord('Bm7b5');
    expect(getHarmonicFunction(chord, cMajor)).toBe('dominant');
  });

  it('E7 (secondary dominant) → dominant', () => {
    const chord = parseChord('E7');
    expect(getHarmonicFunction(chord, cMajor)).toBe('dominant');
  });
});

describe('resolvesToMajor', () => {
  const cMajor = createKey('C', 'major');

  it('V7 → Imaj7 resolves to major', () => {
    const g7 = parseChord('G7');
    const cmaj7 = parseChord('Cmaj7');
    expect(resolvesToMajor(g7, cmaj7, cMajor)).toBe(true);
  });

  it('V7 → im7 resolves to minor', () => {
    const g7 = parseChord('G7');
    const cm7 = parseChord('Cm7');
    expect(resolvesToMajor(g7, cm7, cMajor)).toBe(false);
  });

  it('V7 → VImaj7 resolves to major', () => {
    const g7 = parseChord('G7');
    const aMaj7 = parseChord('Amaj7');
    expect(resolvesToMajor(g7, aMaj7, cMajor)).toBe(true);
  });

  it('V7 with no next chord defaults to true', () => {
    const g7 = parseChord('G7');
    expect(resolvesToMajor(g7, null, cMajor)).toBe(true);
  });
});

describe('getFunctionalContext', () => {
  const cMajor = createKey('C', 'major');

  it('returns correct context for diatonic V7 resolving to I', () => {
    const g7 = parseChord('G7');
    const cmaj7 = parseChord('Cmaj7');
    const ctx = getFunctionalContext(g7, cmaj7, cMajor);
    expect(ctx.harmonicFunction).toBe('dominant');
    expect(ctx.isSecondaryDominant).toBe(false);
    expect(ctx.resolvesToMajor).toBe(true);
  });

  it('returns correct context for secondary dominant', () => {
    const e7 = parseChord('E7');
    const am7 = parseChord('Am7');
    const ctx = getFunctionalContext(e7, am7, cMajor);
    expect(ctx.harmonicFunction).toBe('dominant');
    expect(ctx.isSecondaryDominant).toBe(true);
    expect(ctx.secondaryTarget).toBe('vi');
    expect(ctx.resolvesToMajor).toBe(false);
  });

  it('returns correct context for diatonic tonic chord', () => {
    const cmaj7 = parseChord('Cmaj7');
    const dm7 = parseChord('Dm7');
    const ctx = getFunctionalContext(cmaj7, dm7, cMajor);
    expect(ctx.harmonicFunction).toBe('tonic');
    expect(ctx.isSecondaryDominant).toBe(false);
    expect(ctx.resolvesToMajor).toBeUndefined();
  });
});
