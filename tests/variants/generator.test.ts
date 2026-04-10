import { describe, it, expect } from 'vitest';
import {
  parseChord,
  createKey,
  getFunctionalContext,
  generateVariants,
} from '@grilled-cheese/lib';

describe('generateVariants', () => {
  const cMajor = createKey('C', 'major');

  describe('Cmaj7 in C major (tonic, Ionian)', () => {
    it('generates all major 7 variants', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);

      const symbols = variants.map(v => v.symbol);
      expect(symbols).toContain('Cmaj7');
      expect(symbols).toContain('C6');
      expect(symbols).toContain('Cmaj9');
      expect(symbols).toContain('C69');
      expect(symbols).toContain('Cmaj7#11');
      expect(symbols).toContain('Cmaj13');
      expect(symbols).toContain('Cmaj13#11');
      expect(symbols).toContain('Em7');
      expect(symbols).toContain('Em6');
    });

    it('has correct pitchClasses for Cmaj7', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const maj7 = variants.find(v => v.symbol === 'Cmaj7')!;
      expect(maj7.pitchClasses).toEqual([0, 4, 7, 11]);
      expect(maj7.guideTones).toEqual([4, 11]);
      expect(maj7.extensions).toEqual([]);
    });

    it('has correct pitchClasses for C6', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const c6 = variants.find(v => v.symbol === 'C6')!;
      expect(c6.pitchClasses).toEqual([0, 4, 7, 9]);
      expect(c6.guideTones).toEqual([4, 11]);
      expect(c6.extensions).toEqual([]);
    });

    it('has correct pitchClasses for Cmaj9', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const maj9 = variants.find(v => v.symbol === 'Cmaj9')!;
      expect(maj9.pitchClasses).toEqual([0, 2, 4, 7, 11]);
      expect(maj9.extensions).toEqual(['9']);
    });

    it('has correct pitchClasses for Cmaj7#11', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Cmaj7#11')!;
      expect(v.pitchClasses).toEqual([0, 4, 6, 7, 11]);
      expect(v.extensions).toEqual(['#11']);
    });

    it('has correct pitchClasses for C69', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const c69 = variants.find(v => v.symbol === 'C69')!;
      expect(c69.pitchClasses).toEqual([0, 2, 4, 7, 9]);
      expect(c69.extensions).toEqual(['9']);
    });

    it('has correct pitchClasses for Cmaj13', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Cmaj13')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 7, 9, 11]);
      expect(v.extensions).toEqual(['9', '13']);
    });

    it('has correct pitchClasses for Cmaj13#11', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Cmaj13#11')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 6, 7, 9, 11]);
      expect(v.extensions).toEqual(['9', '#11', '13']);
    });

    it('same-root variants have guideTones [4, 11]', () => {
      const chord = parseChord('Cmaj7');
      const next = parseChord('Dm7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const sameRoot = variants.filter(v => v.category === 'same-root');
      for (const v of sameRoot) {
        expect(v.guideTones).toEqual([4, 11]);
      }
    });
  });

  describe('Dm7 in C major (ii7, Dorian)', () => {
    it('generates all minor 7 variants', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);

      const symbols = variants.map(v => v.symbol);
      expect(symbols).toContain('Dm7');
      expect(symbols).toContain('Dm9');
      expect(symbols).toContain('Dm11');
      expect(symbols).toContain('Dm13');
      expect(symbols).toContain('Dm6');
      expect(symbols).toContain('Dm69');
      expect(symbols).toContain('F6');
      expect(symbols).toContain('Fmaj7');
      expect(symbols).toContain('Fm6');
      expect(symbols).toContain('Am7');
    });

    it('has correct pitchClasses for Dm7', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const dm7 = variants.find(v => v.symbol === 'Dm7')!;
      expect(dm7.pitchClasses).toEqual([0, 2, 5, 9]);
      expect(dm7.guideTones).toEqual([5, 0]);
      expect(dm7.extensions).toEqual([]);
    });

    it('has correct pitchClasses for Dm9', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Dm9')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 5, 9]);
      expect(v.extensions).toEqual(['9']);
    });

    it('has correct pitchClasses for Dm11', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Dm11')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 5, 7, 9]);
      expect(v.extensions).toEqual(['9', '11']);
    });

    it('has correct pitchClasses for Dm13', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Dm13')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 5, 9, 11]);
      expect(v.extensions).toEqual(['9', '13']);
    });

    it('has correct pitchClasses for Dm6', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Dm6')!;
      expect(v.pitchClasses).toEqual([2, 5, 9, 11]);
      expect(v.extensions).toEqual([]);
    });

    it('has correct pitchClasses for Dm69', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Dm69')!;
      expect(v.pitchClasses).toEqual([2, 4, 5, 9, 11]);
      expect(v.extensions).toEqual(['9']);
    });

    it('same-root variants have guideTones [5, 0]', () => {
      const chord = parseChord('Dm7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const sameRoot = variants.filter(v => v.category === 'same-root');
      for (const v of sameRoot) {
        expect(v.guideTones).toEqual([5, 0]);
      }
    });
  });

  describe('G7 in C major resolving to Cmaj7 (V→I, Mixolydian)', () => {
    it('generates dominant-to-major variants', () => {
      const chord = parseChord('G7');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);

      const symbols = variants.map(v => v.symbol);
      expect(symbols).toContain('G7');
      expect(symbols).toContain('G9');
      expect(symbols).toContain('G13');
      expect(symbols).toContain('G7#11');
      expect(symbols).toContain('Db7');
      expect(symbols).toContain('Bdim7');
      expect(symbols).toContain('Dm6');
      expect(symbols).toContain('Abm6');
      expect(symbols).toContain('Dm7');
      expect(symbols).toContain('G7#5');
    });

    it('has correct pitchClasses for G7', () => {
      const chord = parseChord('G7');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const g7 = variants.find(v => v.symbol === 'G7')!;
      expect(g7.pitchClasses).toEqual([2, 5, 7, 11]);
      expect(g7.guideTones).toEqual([11, 5]);
      expect(g7.extensions).toEqual([]);
    });

    it('has correct pitchClasses for G9', () => {
      const chord = parseChord('G7');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'G9')!;
      expect(v.pitchClasses).toEqual([2, 5, 7, 9, 11]);
      expect(v.extensions).toEqual(['9']);
    });

    it('has correct pitchClasses for G13', () => {
      const chord = parseChord('G7');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'G13')!;
      expect(v.pitchClasses).toEqual([2, 4, 5, 7, 9, 11]);
      expect(v.extensions).toEqual(['9', '13']);
    });

    it('has correct pitchClasses for G7#11', () => {
      const chord = parseChord('G7');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'G7#11')!;
      expect(v.pitchClasses).toEqual([1, 2, 5, 7, 11]);
      expect(v.extensions).toEqual(['#11']);
    });

    it('same-root variants have guideTones [11, 5]', () => {
      const chord = parseChord('G7');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const sameRoot = variants.filter(v => v.category === 'same-root');
      for (const v of sameRoot) {
        expect(v.guideTones).toEqual([11, 5]);
      }
    });
  });

  describe('E7 in C major resolving to Am7 (V/vi→vi, Phrygian Dominant)', () => {
    it('generates dominant-to-minor variants', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);

      const symbols = variants.map(v => v.symbol);
      expect(symbols).toContain('E7');
      expect(symbols).toContain('E7b9');
      expect(symbols).toContain('E7#9');
      expect(symbols).toContain('E7b13');
      expect(symbols).toContain('E7b9b13');
      expect(symbols).toContain('E7#9b13');
      expect(symbols).toContain('E7b9#9');
      expect(symbols).toContain('E7#5');
    });

    it('has correct pitchClasses for E7', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const e7 = variants.find(v => v.symbol === 'E7')!;
      expect(e7.pitchClasses).toEqual([2, 4, 8, 11]);
      expect(e7.guideTones).toEqual([8, 2]);
      expect(e7.extensions).toEqual([]);
    });

    it('has correct pitchClasses for E7b9', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'E7b9')!;
      expect(v.pitchClasses).toEqual([2, 4, 5, 8, 11]);
      expect(v.extensions).toEqual(['b9']);
    });

    it('has correct pitchClasses for E7#9', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'E7#9')!;
      expect(v.pitchClasses).toEqual([2, 4, 7, 8, 11]);
      expect(v.extensions).toEqual(['#9']);
    });

    it('has correct pitchClasses for E7b13', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'E7b13')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 8, 11]);
      expect(v.extensions).toEqual(['b13']);
    });

    it('has correct pitchClasses for E7b9b13', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'E7b9b13')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 5, 8, 11]);
      expect(v.extensions).toEqual(['b9', 'b13']);
    });

    it('has correct pitchClasses for E7#9b13', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'E7#9b13')!;
      expect(v.pitchClasses).toEqual([0, 2, 4, 7, 8, 11]);
      expect(v.extensions).toEqual(['#9', 'b13']);
    });

    it('same-root variants have guideTones [8, 2]', () => {
      const chord = parseChord('E7');
      const next = parseChord('Am7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const sameRoot = variants.filter(v => v.category === 'same-root');
      for (const v of sameRoot) {
        expect(v.guideTones).toEqual([8, 2]);
      }
    });
  });

  describe('G7b9 in C major (altered)', () => {
    it('generates altered variants', () => {
      const chord = parseChord('G7b9');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);

      const symbols = variants.map(v => v.symbol);
      expect(symbols).toContain('G7alt');
      expect(symbols).toContain('G7b9');
      expect(symbols).toContain('G7#9');
      expect(symbols).toContain('G7b13');
      expect(symbols).toContain('G7b9b13');
      expect(symbols).toContain('G7#9b13');
      expect(symbols).toContain('G7b9#9');
      expect(symbols).toContain('G7b9#9b13');
      expect(symbols).toContain('G7#5');
    });

    it('has correct pitchClasses for G7alt', () => {
      const chord = parseChord('G7b9');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'G7alt')!;
      expect(v.extensions).toEqual(['b9', '#9', 'b13']);
    });

    it('same-root variants have guideTones [11, 5]', () => {
      const chord = parseChord('G7b9');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const sameRoot = variants.filter(v => v.category === 'same-root');
      for (const v of sameRoot) {
        expect(v.guideTones).toEqual([11, 5]);
      }
    });
  });

  describe('Bm7b5 in C major (viiø7, Locrian)', () => {
    it('generates half-diminished variants', () => {
      const chord = parseChord('Bm7b5');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);

      const symbols = variants.map(v => v.symbol);
      expect(symbols).toContain('Bm7b5');
      expect(symbols).toContain('Bm7b5b9');
      expect(symbols).toContain('Bm7b5b13');
      expect(symbols).toContain('Bm7b5b9b13');
      expect(symbols).toContain('Dm6');
      expect(symbols).toContain('Dm7');
    });

    it('has correct pitchClasses for Bm7b5', () => {
      const chord = parseChord('Bm7b5');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Bm7b5')!;
      expect(v.pitchClasses).toEqual([2, 5, 9, 11]);
      expect(v.guideTones).toEqual([2, 9]);
      expect(v.extensions).toEqual([]);
    });

    it('has correct pitchClasses for Bm7b5b9', () => {
      const chord = parseChord('Bm7b5');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Bm7b5b9')!;
      expect(v.pitchClasses).toEqual([0, 2, 5, 9, 11]);
      expect(v.extensions).toEqual(['b9']);
    });

    it('has correct pitchClasses for Bm7b5b13', () => {
      const chord = parseChord('Bm7b5');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Bm7b5b13')!;
      expect(v.pitchClasses).toEqual([2, 5, 7, 9, 11]);
      expect(v.extensions).toEqual(['b13']);
    });

    it('has correct pitchClasses for Bm7b5b9b13', () => {
      const chord = parseChord('Bm7b5');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const v = variants.find(v2 => v2.symbol === 'Bm7b5b9b13')!;
      expect(v.pitchClasses).toEqual([0, 2, 5, 7, 9, 11]);
      expect(v.extensions).toEqual(['b9', 'b13']);
    });

    it('same-root variants have guideTones [2, 9]', () => {
      const chord = parseChord('Bm7b5');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);
      const sameRoot = variants.filter(v => v.category === 'same-root');
      for (const v of sameRoot) {
        expect(v.guideTones).toEqual([2, 9]);
      }
    });
  });

  describe('Bdim7', () => {
    it('generates only Bdim7', () => {
      const chord = parseChord('Bdim7');
      const next = parseChord('Cmaj7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const variants = generateVariants(chord, cMajor, ctx);

      expect(variants).toHaveLength(1);
      expect(variants[0]!.symbol).toBe('Bdim7');
      expect(variants[0]!.pitchClasses).toEqual([2, 5, 8, 11]);
      expect(variants[0]!.extensions).toEqual([]);
    });
  });
});
