import { describe, it, expect } from 'vitest';
import { parseChord } from '@grilled-cheese/lib';

describe('parseChord', () => {
  it('parses C major triad', () => {
    const c = parseChord('C');
    expect(c.root).toBe('C');
    expect(c.bass).toBeNull();
    expect(c.quality).toBe('major');
    expect(c.pitchClasses).toEqual([0, 4, 7]);
    expect(c.extensions).toEqual([]);
    expect(c.alterations).toEqual([]);
  });

  it('parses Cm minor triad', () => {
    const c = parseChord('Cm');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('minor');
    expect(c.pitchClasses).toEqual([0, 3, 7]);
  });

  it('parses Cmaj7', () => {
    const c = parseChord('Cmaj7');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('major7');
    expect(c.pitchClasses).toEqual([0, 4, 7, 11]);
  });

  it('parses Cm7', () => {
    const c = parseChord('Cm7');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('minor7');
    expect(c.pitchClasses).toEqual([0, 3, 7, 10]);
  });

  it('parses C7', () => {
    const c = parseChord('C7');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('dominant7');
    expect(c.pitchClasses).toEqual([0, 4, 7, 10]);
  });

  it('parses Cdim7', () => {
    const c = parseChord('Cdim7');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('diminished7');
    expect(c.pitchClasses).toEqual([0, 3, 6, 9]);
  });

  it('parses Cm7b5 as halfDiminished', () => {
    const c = parseChord('Cm7b5');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('halfDiminished');
    expect(c.pitchClasses).toEqual([0, 3, 6, 10]);
  });

  it('parses Caug', () => {
    const c = parseChord('Caug');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('augmented');
    expect(c.pitchClasses).toEqual([0, 4, 8]);
  });

  it('parses C7#5b9 with alterations', () => {
    const c = parseChord('C7#5b9');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('dominant7');
    expect(c.alterations).toContain('#5');
    expect(c.alterations).toContain('b9');
    expect(c.pitchClasses).toContain(8);
  });

  it('parses Bb7 with correct root', () => {
    const c = parseChord('Bb7');
    expect(c.root).toBe('Bb');
    expect(c.quality).toBe('dominant7');
    expect(c.pitchClasses).toEqual([2, 5, 8, 10]);
  });

  it('parses F#m7 with correct root', () => {
    const c = parseChord('F#m7');
    expect(c.root).toBe('F#');
    expect(c.quality).toBe('minor7');
    expect(c.pitchClasses).toEqual([1, 4, 6, 9]);
  });

  it('parses C6 as major6', () => {
    const c = parseChord('C6');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('major6');
    expect(c.pitchClasses).toEqual([0, 4, 7, 9]);
  });

  it('parses Cm6 as minor6', () => {
    const c = parseChord('Cm6');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('minor6');
    expect(c.pitchClasses).toEqual([0, 3, 7, 9]);
  });

  it('parses C69 with added tones', () => {
    const c = parseChord('C69');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('major6');
    expect(c.addedTones).toContain('69');
    expect(c.pitchClasses).toEqual([0, 2, 4, 7, 9]);
  });

  it('parses C7sus4', () => {
    const c = parseChord('C7sus4');
    expect(c.root).toBe('C');
    expect(c.suspensions).toContain('sus4');
    expect(c.pitchClasses).toEqual([0, 5, 7, 10]);
  });

  it('parses Csus4', () => {
    const c = parseChord('Csus4');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('suspended4');
    expect(c.pitchClasses).toEqual([0, 5, 7]);
  });

  it('parses G7alt as dominant7 with alterations', () => {
    const c = parseChord('G7alt');
    expect(c.root).toBe('G');
    expect(c.quality).toBe('dominant7');
    expect(c.alterations.length).toBeGreaterThan(0);
  });

  it('parses Cdim as diminished triad', () => {
    const c = parseChord('Cdim');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('diminished');
    expect(c.pitchClasses).toEqual([0, 3, 6]);
  });

  it('parses CmMaj7 as minorMajor7', () => {
    const c = parseChord('CmMaj7');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('minorMajor7');
    expect(c.pitchClasses).toEqual([0, 3, 7, 11]);
  });

  it('parses C5 as power', () => {
    const c = parseChord('C5');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('power');
    expect(c.pitchClasses).toEqual([0, 7]);
  });

  it('parses C9 with extension', () => {
    const c = parseChord('C9');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('dominant7');
    expect(c.extensions).toContain('9');
    expect(c.pitchClasses).toContain(2);
  });

  it('parses C13 with extensions', () => {
    const c = parseChord('C13');
    expect(c.root).toBe('C');
    expect(c.extensions).toContain('9');
    expect(c.extensions).toContain('13');
  });

  it('parses Cadd9', () => {
    const c = parseChord('Cadd9');
    expect(c.root).toBe('C');
    expect(c.quality).toBe('major');
    expect(c.addedTones).toContain('add9');
    expect(c.pitchClasses).toContain(2);
  });

  it('parses slash chords with bass note', () => {
    const c = parseChord('C/G');
    expect(c.root).toBe('C');
    expect(c.bass).toBe('G');
  });

  it('preserves the original symbol', () => {
    expect(parseChord('Cmaj7').symbol).toBe('Cmaj7');
    expect(parseChord('F#m7').symbol).toBe('F#m7');
  });

  it('throws on invalid chord symbol', () => {
    expect(() => parseChord('')).toThrow();
  });
});
