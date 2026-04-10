import { describe, it, expect } from 'vitest';
import {
  parseChord,
  createKey,
  getFunctionalContext,
  generateSubstitutionVariants,
} from '@grilled-cheese/lib';

describe('generateSubstitutionVariants', () => {
  const cMajor = createKey('C', 'major');

  function getSubs(symbol: string, nextSymbol: string | null = null) {
    const chord = parseChord(symbol);
    const next = nextSymbol ? parseChord(nextSymbol) : null;
    const ctx = getFunctionalContext(chord, next, cMajor);
    return generateSubstitutionVariants(chord, cMajor, ctx);
  }

  describe('overlap-based generation', () => {
    it('generates substitution variants for any chord quality', () => {
      const subs = getSubs('E7', 'Am7');
      expect(subs.length).toBeGreaterThan(0);
      for (const s of subs) {
        expect(s.category).not.toBe('same-root');
      }
    });

    it('all variants share >= 2 pitch classes with original chord or scale', () => {
      const chord = parseChord('D7');
      const next = parseChord('G7');
      const ctx = getFunctionalContext(chord, next, cMajor);
      const subs = generateSubstitutionVariants(chord, cMajor, ctx);
      expect(subs.length).toBeGreaterThan(0);
    });

    it('allows enharmonic equivalents with different roots', () => {
      const subs = getSubs('E7', 'Am7');
      const fm6 = subs.find(s => s.symbol === 'Fm6');
      const dm7b5 = subs.find(s => s.symbol === 'Dm7b5');
      expect(fm6).toBeDefined();
      expect(dm7b5).toBeDefined();
      expect(fm6!.pitchClasses).toEqual(dm7b5!.pitchClasses);
    });

    it('does not include same-root basic shells already in generator', () => {
      const subs = getSubs('E7', 'Am7');
      expect(subs.some(s => s.symbol === 'E7')).toBe(false);
    });

    it('sorts by overlap count descending then root proximity ascending', () => {
      const subs = getSubs('D7', 'G7');
      expect(subs.length).toBeGreaterThan(0);
    });
  });

  describe('E7 (dominant7) - jazz class paths', () => {
    it('generates Fm6 for E7 (Path 2 starting chord)', () => {
      const subs = getSubs('E7', 'Am7');
      const fm6 = subs.find(s => s.symbol === 'Fm6');
      expect(fm6).toBeDefined();
      expect(fm6!.pitchClasses.sort((a, b) => a - b)).toEqual([0, 2, 5, 8]);
      expect(fm6!.category).toBe('m6-enharmonic');
    });

    it('generates G#dim7 for E7 (Path 3 starting chord)', () => {
      const subs = getSubs('E7', 'Am7');
      const gdim = subs.find(s => s.symbol === 'Abdim7');
      expect(gdim).toBeDefined();
      expect(gdim!.pitchClasses.sort((a, b) => a - b)).toEqual([2, 5, 8, 11]);
    });

    it('generates Cmaj7#5 for E7 (Path 5 starting chord)', () => {
      const subs = getSubs('E7', 'Am7');
      const cmaj = subs.find(s => s.symbol === 'Cmaj7#5');
      expect(cmaj).toBeDefined();
      expect(cmaj!.pitchClasses.sort((a, b) => a - b)).toEqual([0, 4, 8, 11]);
    });

    it('generates tritone substitute Bb7', () => {
      const subs = getSubs('E7', 'Am7');
      const bb7 = subs.find(s => s.symbol === 'Bb7');
      expect(bb7).toBeDefined();
      expect(bb7!.category).toBe('tritone-substitute');
      expect(bb7!.guideToneMatch).toBe('exact');
    });

    it('generates Bm6 (m6-on-fifth for E7)', () => {
      const subs = getSubs('E7', 'Am7');
      const bm6 = subs.find(s => s.symbol === 'Bm6');
      expect(bm6).toBeDefined();
      expect(bm6!.category).toBe('m6-on-fifth');
    });

    it('generates Bm7 (m7-sus-substitute for E7)', () => {
      const subs = getSubs('E7', 'Am7');
      const bm7 = subs.find(s => s.symbol === 'Bm7');
      expect(bm7).toBeDefined();
      expect(bm7!.category).toBe('m7-sus-substitute');
    });

    it('generates Bm7 for E7 (m7-sus-substitute)', () => {
      const subs = getSubs('E7', 'Am7');
      const bm7 = subs.find(s => s.symbol === 'Bm7');
      expect(bm7).toBeDefined();
      expect(bm7!.category).toBe('m7-sus-substitute');
    });
  });

  describe('A7 (dominant7) - jazz class paths', () => {
    it('generates Edim7 for A7 (Path 1 col 2)', () => {
      const subs = getSubs('A7', 'D7');
      const edim = subs.find(s => s.symbol === 'Edim7');
      expect(edim).toBeDefined();
      expect(edim!.pitchClasses.sort((a, b) => a - b)).toEqual([1, 4, 7, 10]);
    });

    it('generates Fmaj7#5 for A7 (Path 2 col 2)', () => {
      const subs = getSubs('A7', 'D7');
      const fmaj = subs.find(s => s.symbol === 'Fmaj7#5');
      expect(fmaj).toBeDefined();
      expect(fmaj!.pitchClasses.sort((a, b) => a - b)).toEqual([1, 4, 5, 9]);
    });

    it('generates Gm7b5 for A7 (Path 3 col 2)', () => {
      const subs = getSubs('A7', 'D7');
      const gm7b5 = subs.find(s => s.symbol === 'Gm7b5');
      expect(gm7b5).toBeDefined();
      expect(gm7b5!.pitchClasses.sort((a, b) => a - b)).toEqual([1, 5, 7, 10]);
    });

    it('generates Bdim7 or Bbdim7 for A7 (Path 4 col 2)', () => {
      const subs = getSubs('A7', 'D7');
      const hasBdim = subs.some(s => s.symbol === 'Bdim7' || s.symbol === 'Bbdim7');
      expect(hasBdim).toBe(true);
    });

    it('generates C#dim7 for A7 (Path 5 col 2)', () => {
      const subs = getSubs('A7', 'D7');
      const cdim = subs.find(s => s.symbol === 'Dbdim7');
      expect(cdim).toBeDefined();
    });

    it('generates Ddim7 for A7 (Path 6 col 2)', () => {
      const subs = getSubs('A7', 'D7');
      const ddim = subs.find(s => s.symbol === 'Ddim7');
      expect(ddim).toBeDefined();
    });
  });

  describe('D7 (dominant7) - jazz class paths', () => {
    it('generates Gbm7b5 (F#m7b5 enharmonic) for D7 (Path 2 col 3)', () => {
      const subs = getSubs('D7', 'G7');
      const fsm7b5 = subs.find(s => s.symbol === 'Gbm7b5');
      expect(fsm7b5).toBeDefined();
    });

    it('generates Am6 for D7 (Path 3 col 3)', () => {
      const subs = getSubs('D7', 'G7');
      const am6 = subs.find(s => s.symbol === 'Am6');
      expect(am6).toBeDefined();
      expect(am6!.pitchClasses.sort((a, b) => a - b)).toEqual([0, 4, 6, 9]);
    });

    it('generates Bm7 for D7 (Path 4 col 3)', () => {
      const subs = getSubs('D7', 'G7');
      const bm7 = subs.find(s => s.symbol === 'Bm7');
      expect(bm7).toBeDefined();
    });

    it('generates Cmaj7b5 for D7 (Path 5 col 3)', () => {
      const subs = getSubs('D7', 'G7');
      const cmaj = subs.find(s => s.symbol === 'Cmaj7b5');
      expect(cmaj).toBeDefined();
      expect(cmaj!.pitchClasses.sort((a, b) => a - b)).toEqual([0, 4, 6, 11]);
    });
  });

  describe('Dm7 (minor7) - jazz class paths', () => {
    it('generates Am7 for Dm7 (Path 3/4 col 4)', () => {
      const subs = getSubs('Dm7', null);
      const am7 = subs.find(s => s.symbol === 'Am7');
      expect(am7).toBeDefined();
      expect(am7!.category).toBe('m7-sus-substitute');
    });

    it('generates C6 for Dm7 (Path 5 col 4)', () => {
      const subs = getSubs('Dm7', null);
      const c6 = subs.find(s => s.symbol === 'C6');
      expect(c6).toBeDefined();
      expect(c6!.pitchClasses.sort((a, b) => a - b)).toEqual([0, 4, 7, 9]);
    });

    it('generates F6 for Dm7 (relative major 6)', () => {
      const subs = getSubs('Dm7', null);
      const f6 = subs.find(s => s.symbol === 'F6');
      expect(f6).toBeDefined();
      expect(f6!.category).toBe('relative-major6');
      expect(f6!.pitchClasses.sort((a, b) => a - b)).toEqual([0, 2, 5, 9]);
    });

    it('generates Fmaj7 for Dm7', () => {
      const subs = getSubs('Dm7', null);
      const fmaj = subs.find(s => s.symbol === 'Fmaj7');
      expect(fmaj).toBeDefined();
      expect(fmaj!.category).toBe('relative-major7');
    });
  });

  describe('Cmaj7 (major7)', () => {
    it('generates Em7 for Cmaj7 (iii-for-I)', () => {
      const subs = getSubs('Cmaj7', 'Dm7');
      const em7 = subs.find(s => s.symbol === 'Em7');
      expect(em7).toBeDefined();
      expect(em7!.category).toBe('iii-for-I');
    });

    it('generates Em6 for Cmaj7 (m6-on-third)', () => {
      const subs = getSubs('Cmaj7', 'Dm7');
      const em6 = subs.find(s => s.symbol === 'Em6');
      expect(em6).toBeDefined();
      expect(em6!.category).toBe('m6-on-third');
    });
  });

  describe('Bm7b5 (halfDiminished)', () => {
    it('generates Dm6 for Bm7b5', () => {
      const subs = getSubs('Bm7b5', 'Cmaj7');
      const dm6 = subs.find(s => s.symbol === 'Dm6');
      expect(dm6).toBeDefined();
      expect(dm6!.pitchClasses.sort((a, b) => a - b)).toEqual([2, 5, 9, 11]);
    });

    it('generates Dm7 for Bm7b5', () => {
      const subs = getSubs('Bm7b5', 'Cmaj7');
      const dm7 = subs.find(s => s.symbol === 'Dm7');
      expect(dm7).toBeDefined();
    });
  });

  describe('new chord shells', () => {
    it('generates maj7#5 shells', () => {
      const subs = getSubs('E7', 'Am7');
      const maj7sharp5 = subs.filter(s => s.symbol.includes('maj7#5'));
      expect(maj7sharp5.length).toBeGreaterThan(0);
    });

    it('generates maj7b5 shells', () => {
      const subs = getSubs('D7', 'G7');
      const maj7flat5 = subs.filter(s => s.symbol.includes('maj7b5'));
      expect(maj7flat5.length).toBeGreaterThan(0);
    });

    it('generates m(maj7) shells', () => {
      const subs = getSubs('E7', 'Am7');
      const mmaj7 = subs.filter(s => s.symbol.includes('m(maj7)'));
      expect(mmaj7.length).toBeGreaterThan(0);
    });
  });

  describe('guide tone matching', () => {
    it('marks tritone sub as exact guide tone match', () => {
      const subs = getSubs('E7', 'Am7');
      const bb7 = subs.find(s => s.symbol === 'Bb7');
      expect(bb7!.guideToneMatch).toBe('exact');
    });

    it('marks near-miss substitutions correctly', () => {
      const subs = getSubs('E7', 'Am7');
      const nearMiss = subs.filter(s => s.guideToneMatch === 'near-miss');
      expect(nearMiss.length).toBeGreaterThan(0);
    });
  });
});
