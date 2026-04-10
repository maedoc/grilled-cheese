import { describe, it, expect } from 'vitest';
import {
  parseChord,
  createKey,
  getFunctionalContext,
  assignChordScale,
} from '@grilled-cheese/lib';

describe('assignChordScale', () => {
  const cMajor = createKey('C', 'major');

  it('Cmaj7 in C major (Imaj7, tonic) → Ionian', () => {
    const chord = parseChord('Cmaj7');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('ionian');
    expect(result.avoidNotes).toContain(5);
    expect(result.scalePitches).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('Fmaj7 in C major (IVmaj7, subdominant) → Lydian', () => {
    const chord = parseChord('Fmaj7');
    const next = parseChord('G7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('lydian');
    expect(result.avoidNotes).toEqual([]);
    expect(result.scalePitches).toEqual([5, 7, 9, 11, 0, 2, 4]);
  });

  it('Dm7 in C major (ii7) → Dorian', () => {
    const chord = parseChord('Dm7');
    const next = parseChord('G7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('dorian');
    expect(result.avoidNotes).toEqual([]);
    expect(result.scalePitches).toEqual([2, 4, 5, 7, 9, 11, 0]);
  });

  it('Am7 in C major (vi7, tonic substitute) → Aeolian', () => {
    const chord = parseChord('Am7');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('aeolian');
    expect(result.scalePitches).toEqual([9, 11, 0, 2, 4, 5, 7]);
  });

  it('G7 resolving to Cmaj7 (V7→I) → Mixolydian', () => {
    const chord = parseChord('G7');
    const next = parseChord('Cmaj7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('mixolydian');
    expect(result.avoidNotes).toContain(0);
  });

  it('E7 resolving to Am7 (V7→vi, secondary dominant resolving to minor) → Phrygian Dominant', () => {
    const chord = parseChord('E7');
    const next = parseChord('Am7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('phrygianDominant');
    expect(result.availableTensions).toContain('b9');
    expect(result.availableTensions).toContain('b13');
  });

  it('D7 resolving to G7 (V7/V, secondary dominant resolving to major) → Mixolydian', () => {
    const chord = parseChord('D7');
    const next = parseChord('G7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('mixolydian');
  });

  it('Bm7b5 in C major (viiø7) → Locrian', () => {
    const chord = parseChord('Bm7b5');
    const next = parseChord('Cmaj7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('locrian');
  });

  it('Bdim7 → Whole-Half Diminished', () => {
    const chord = parseChord('Bdim7');
    const next = parseChord('Cmaj7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('wholeHalfDim');
  });

  it('Cmaj7#11 → Lydian (forced by #11)', () => {
    const chord = parseChord('Cmaj7#11');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('lydian');
  });

  it('Em7 in C major (iii7) → Phrygian', () => {
    const chord = parseChord('Em7');
    const next = parseChord('Fmaj7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const result = assignChordScale(chord, cMajor, ctx);
    expect(result.scaleName).toBe('phrygian');
  });
});
