import { describe, it, expect } from 'vitest';
import {
  parseChord,
  createKey,
  getFunctionalContext,
  assignChordScale,
  getAvailableTensionPcs,
} from '@grilled-cheese/lib';

describe('getAvailableTensionPcs', () => {
  const cMajor = createKey('C', 'major');

  it('Cmaj7 Ionian: D (9th), A (13th)', () => {
    const chord = parseChord('Cmaj7');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const assignment = assignChordScale(chord, cMajor, ctx);
    const tensions = getAvailableTensionPcs(chord, assignment);
    expect(tensions).toEqual([2, 9]);
  });

  it('Cmaj7 Lydian: D (9th), F# (#11), A (13th)', () => {
    const chord = parseChord('Fmaj7');
    const next = parseChord('G7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const assignment = assignChordScale(chord, cMajor, ctx);
    const tensions = getAvailableTensionPcs(chord, assignment);
    expect(tensions).toEqual([2, 7, 11]);
  });

  it('Dm7 Dorian: E (9th), G (11th), B (13th)', () => {
    const chord = parseChord('Dm7');
    const next = parseChord('G7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const assignment = assignChordScale(chord, cMajor, ctx);
    const tensions = getAvailableTensionPcs(chord, assignment);
    expect(tensions).toEqual([4, 7, 11]);
  });

  it('G7 Mixolydian: A (9th), E (13th) — C is avoid note', () => {
    const chord = parseChord('G7');
    const next = parseChord('Cmaj7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const assignment = assignChordScale(chord, cMajor, ctx);
    const tensions = getAvailableTensionPcs(chord, assignment);
    expect(tensions).toEqual([4, 9]);
  });

  it('E7 Phrygian Dominant: all non-chord tones are avoid notes, tensions empty', () => {
    const chord = parseChord('E7');
    const next = parseChord('Am7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const assignment = assignChordScale(chord, cMajor, ctx);
    const tensions = getAvailableTensionPcs(chord, assignment);
    expect(assignment.scaleName).toBe('phrygianDominant');
    expect(assignment.availableTensions).toEqual(['b9', '#9', 'b13']);
    expect(tensions).toEqual([]);
  });
});
