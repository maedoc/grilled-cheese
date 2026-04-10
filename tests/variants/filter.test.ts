import { describe, it, expect } from 'vitest';
import {
  parseChord,
  createKey,
  getFunctionalContext,
  generateVariants,
  rankVariants,
  filterCommonVariants,
} from '@grilled-cheese/lib';

describe('rankVariants', () => {
  const cMajor = createKey('C', 'major');

  it('ranks major7 variants by commonness', () => {
    const chord = parseChord('Cmaj7');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const ranked = rankVariants(variants, chord.quality);
    const symbols = ranked.map(v => v.symbol);
    expect(symbols.indexOf('Cmaj7')).toBeLessThan(symbols.indexOf('Cmaj9'));
    expect(symbols.indexOf('Cmaj9')).toBeLessThan(symbols.indexOf('C6'));
    expect(symbols.indexOf('C6')).toBeLessThan(symbols.indexOf('C69'));
    expect(symbols.indexOf('C69')).toBeLessThan(symbols.indexOf('Cmaj7#11'));
    expect(symbols.indexOf('Cmaj7#11')).toBeLessThan(symbols.indexOf('Cmaj13'));
  });

  it('ranks minor7 variants by commonness', () => {
    const chord = parseChord('Dm7');
    const next = parseChord('G7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const ranked = rankVariants(variants, chord.quality);
    const symbols = ranked.map(v => v.symbol);
    expect(symbols.indexOf('Dm7')).toBeLessThan(symbols.indexOf('Dm9'));
    expect(symbols.indexOf('Dm9')).toBeLessThan(symbols.indexOf('Dm11'));
    expect(symbols.indexOf('Dm11')).toBeLessThan(symbols.indexOf('Dm13'));
    expect(symbols.indexOf('Dm13')).toBeLessThan(symbols.indexOf('Dm6'));
    expect(symbols.indexOf('Dm6')).toBeLessThan(symbols.indexOf('Dm69'));
  });

  it('ranks dominant-to-major variants by commonness', () => {
    const chord = parseChord('G7');
    const next = parseChord('Cmaj7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const ranked = rankVariants(variants, chord.quality);
    const symbols = ranked.map(v => v.symbol);
    expect(symbols[0]).toBe('G7');
    expect(symbols.indexOf('G7')).toBeLessThan(symbols.indexOf('G13'));
    expect(symbols.indexOf('G13')).toBeLessThan(symbols.indexOf('G9'));
    expect(symbols.indexOf('G9')).toBeLessThan(symbols.indexOf('G7#11'));
  });

  it('ranks dominant-to-minor variants by commonness', () => {
    const chord = parseChord('E7');
    const next = parseChord('Am7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const ranked = rankVariants(variants, chord.quality);
    const symbols = ranked.map(v => v.symbol);
    expect(symbols[0]).toBe('E7');
    expect(symbols.indexOf('E7')).toBeLessThan(symbols.indexOf('E7b9'));
    expect(symbols.indexOf('E7b9')).toBeLessThan(symbols.indexOf('E7b9b13'));
    expect(symbols.indexOf('E7b9b13')).toBeLessThan(symbols.indexOf('E7#9'));
    expect(symbols.indexOf('E7#9')).toBeLessThan(symbols.indexOf('E7b13'));
    expect(symbols.indexOf('E7b13')).toBeLessThan(symbols.indexOf('E7#9b13'));
  });

  it('returns all variants even when ranking', () => {
    const chord = parseChord('Cmaj7');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const ranked = rankVariants(variants, chord.quality);
    expect(ranked).toHaveLength(variants.length);
  });

  it('does not mutate the input array', () => {
    const chord = parseChord('Cmaj7');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const originalSymbols = variants.map(v => v.symbol);
    rankVariants(variants, chord.quality);
    expect(variants.map(v => v.symbol)).toEqual(originalSymbols);
  });
});

describe('filterCommonVariants', () => {
  const cMajor = createKey('C', 'major');

  it('removes E7b9#9 (extremely rare)', () => {
    const chord = parseChord('E7');
    const next = parseChord('Am7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const filtered = filterCommonVariants(variants);
    const symbols = filtered.map(v => v.symbol);
    expect(symbols).not.toContain('E7b9#9');
  });

  it('keeps common dominant-to-minor variants', () => {
    const chord = parseChord('E7');
    const next = parseChord('Am7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const filtered = filterCommonVariants(variants);
    const symbols = filtered.map(v => v.symbol);
    expect(symbols).toContain('E7');
    expect(symbols).toContain('E7b9');
    expect(symbols).toContain('E7#9');
    expect(symbols).toContain('E7b13');
    expect(symbols).toContain('E7b9b13');
  });

  it('removes 7b9#9b13 from altered variants', () => {
    const chord = parseChord('G7b9');
    const next = parseChord('Cmaj7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const filtered = filterCommonVariants(variants);
    const symbols = filtered.map(v => v.symbol);
    expect(symbols).not.toContain('G7b9#9');
    expect(symbols).not.toContain('G7b9#9b13');
  });

  it('keeps all major7 variants (none are rare)', () => {
    const chord = parseChord('Cmaj7');
    const next = parseChord('Dm7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const filtered = filterCommonVariants(variants);
    const sameRootVariants = variants.filter(v => v.category === 'same-root');
    for (const sv of sameRootVariants) {
      expect(filtered.some(f => f.symbol === sv.symbol)).toBe(true);
    }
  });

  it('keeps all minor7 variants (none are rare)', () => {
    const chord = parseChord('Dm7');
    const next = parseChord('G7');
    const ctx = getFunctionalContext(chord, next, cMajor);
    const variants = generateVariants(chord, cMajor, ctx);
    const filtered = filterCommonVariants(variants);
    const sameRootVariants = variants.filter(v => v.category === 'same-root');
    for (const sv of sameRootVariants) {
      expect(filtered.some(f => f.symbol === sv.symbol)).toBe(true);
    }
  });
});
