import { describe, it, expect } from 'vitest';
import { generateMatrix } from '../../src/lib/matrix/matrix.js';

describe('generateMatrix', () => {
  describe('ii-V-I in C major', () => {
    const matrix = generateMatrix(['Dm7', 'G7', 'Cmaj7'], 'C', 'major');

    it('has 3 columns', () => {
      expect(matrix.columns).toHaveLength(3);
    });

    it('column 0 has Dm7 variants', () => {
      const symbols = matrix.columns[0]!.variants.map(v => v.symbol);
      expect(symbols).toContain('Dm7');
      expect(symbols).toContain('Dm9');
      expect(symbols).toContain('Dm11');
      expect(symbols).toContain('Dm13');
      expect(symbols).toContain('Dm6');
      expect(symbols).toContain('Dm69');
    });

    it('column 1 has G7 variants (Mixolydian, resolving to major)', () => {
      const symbols = matrix.columns[1]!.variants.map(v => v.symbol);
      expect(symbols).toContain('G7');
      expect(symbols).toContain('G13');
      expect(symbols).toContain('G9');
      expect(symbols).toContain('G7#11');
      expect(matrix.columns[1]!.chordScale.scaleName).toBe('mixolydian');
    });

    it('column 2 has Cmaj7 variants', () => {
      const symbols = matrix.columns[2]!.variants.map(v => v.symbol);
      expect(symbols).toContain('Cmaj7');
      expect(symbols).toContain('Cmaj9');
      expect(symbols).toContain('C6');
      expect(symbols).toContain('C69');
      expect(symbols).toContain('Cmaj7#11');
      expect(symbols).toContain('Cmaj13');
      expect(symbols).toContain('Cmaj13#11');
    });

    it('has correct roman analysis for each column', () => {
      expect(matrix.columns[0]!.romanAnalysis.figure).toBe('ii7');
      expect(matrix.columns[0]!.romanAnalysis.harmonicFunction).toBe('subdominant');
      expect(matrix.columns[1]!.romanAnalysis.figure).toBe('V7');
      expect(matrix.columns[1]!.romanAnalysis.harmonicFunction).toBe('dominant');
      expect(matrix.columns[2]!.romanAnalysis.figure).toBe('Imaj7');
      expect(matrix.columns[2]!.romanAnalysis.harmonicFunction).toBe('tonic');
    });

    it('has correct chord scales', () => {
      expect(matrix.columns[0]!.chordScale.scaleName).toBe('dorian');
      expect(matrix.columns[1]!.chordScale.scaleName).toBe('mixolydian');
    });

    it('has 2 distance matrices (between adjacent columns)', () => {
      expect(matrix.distances).toHaveLength(2);
    });

    it('optimal path has small total distance', () => {
      const path = matrix.findOptimalPath();
      expect(path.variantIndices).toHaveLength(3);
      expect(path.totalDistance).toBeLessThan(20);
    });

    it('optimal path variant indices are valid', () => {
      const path = matrix.findOptimalPath();
      for (let i = 0; i < path.variantIndices.length; i++) {
        expect(path.variantIndices[i]!).toBeLessThan(matrix.columns[i]!.variants.length);
        expect(path.variantIndices[i]!).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('secondary dominant resolving to minor', () => {
    const matrix = generateMatrix(['Cmaj7', 'E7', 'Am7'], 'C', 'major');

    it('E7 uses Phrygian Dominant scale', () => {
      expect(matrix.columns[1]!.chordScale.scaleName).toBe('phrygianDominant');
    });

    it('E7 variants include b9 and b13 alterations', () => {
      const symbols = matrix.columns[1]!.variants.map(v => v.symbol);
      expect(symbols).toContain('E7b9');
      expect(symbols).toContain('E7b13');
    });

    it('E7 roman analysis shows V/vi', () => {
      const ra = matrix.columns[1]!.romanAnalysis;
      expect(ra.type).toBe('secondary');
      expect(ra.harmonicFunction).toBe('dominant');
    });
  });

  describe('minor ii-V-i', () => {
    const matrix = generateMatrix(['Dm7b5', 'G7b9', 'Cm7'], 'C', 'minor');

    it('Dm7b5 uses Locrian scale', () => {
      expect(matrix.columns[0]!.chordScale.scaleName).toBe('locrian');
    });

    it('G7b9 uses altered or Phrygian Dominant', () => {
      const sn = matrix.columns[1]!.chordScale.scaleName;
      expect(sn === 'altered' || sn === 'phrygianDominant').toBe(true);
    });

    it('Cm7 uses Dorian', () => {
      expect(matrix.columns[2]!.chordScale.scaleName).toBe('dorian');
    });

    it('has 3 columns', () => {
      expect(matrix.columns).toHaveLength(3);
    });
  });

  describe('single chord', () => {
    const matrix = generateMatrix(['Cmaj7'], 'C', 'major');

    it('has 1 column', () => {
      expect(matrix.columns).toHaveLength(1);
    });

    it('has 0 distance matrices', () => {
      expect(matrix.distances).toHaveLength(0);
    });

    it('findOptimalPath returns [0]', () => {
      const path = matrix.findOptimalPath();
      expect(path.variantIndices).toEqual([0]);
      expect(path.totalDistance).toBe(0);
    });

    it('findGreedyPath returns [0]', () => {
      const path = matrix.findGreedyPath();
      expect(path.variantIndices).toEqual([0]);
      expect(path.totalDistance).toBe(0);
    });
  });

  describe('empty progression', () => {
    const matrix = generateMatrix([], 'C', 'major');

    it('has 0 columns', () => {
      expect(matrix.columns).toHaveLength(0);
    });

    it('returns empty path', () => {
      const path = matrix.findOptimalPath();
      expect(path.variantIndices).toEqual([]);
      expect(path.totalDistance).toBe(0);
    });

    it('greedy path returns empty', () => {
      const path = matrix.findGreedyPath();
      expect(path.variantIndices).toEqual([]);
    });
  });

  describe('Rhythm changes A section', () => {
    const matrix = generateMatrix(
      ['Cmaj7', 'Am7', 'Dm7', 'G7', 'Cmaj7', 'Am7', 'Dm7', 'G7'],
      'C',
      'major',
    );

    it('has 8 columns', () => {
      expect(matrix.columns).toHaveLength(8);
    });

    it('does not crash and has 7 distance matrices', () => {
      expect(matrix.distances).toHaveLength(7);
    });

    it('optimal path has reasonable total distance', () => {
      const path = matrix.findOptimalPath();
      expect(path.variantIndices).toHaveLength(8);
      expect(path.totalDistance).toBeLessThan(100);
    });
  });

  describe('variant ordering', () => {
    const matrix = generateMatrix(['Dm7', 'G7', 'Cmaj7'], 'C', 'major');

    it('column 1 row 0 is the same-root variant (original chord)', () => {
      const col1First = matrix.columns[1]!.variants[0]!;
      expect(col1First.category).toBe('same-root');
      expect(col1First.symbol).toBe('G7');
    });

    it('optimal path total distance includes voice movements plus penalties', () => {
      const path = matrix.findOptimalPath();
      expect(path.totalDistance).toBeGreaterThanOrEqual(0);
      expect(path.voiceMovementsPerColumn).toHaveLength(2);
      const voiceTotal = path.voiceMovementsPerColumn.reduce(
        (sum, col) => sum + col.reduce((s, m) => s + m, 0),
        0,
      );
      expect(path.totalDistance).toBeGreaterThanOrEqual(voiceTotal);
    });

    it('has paths property with multiple paths', () => {
      expect(matrix.paths).toBeDefined();
      expect(matrix.paths.length).toBeGreaterThan(0);
    });

    it('findOptimalPaths(3) returns 3 paths', () => {
      const paths = matrix.findOptimalPaths(3);
      expect(paths).toHaveLength(3);
      for (const p of paths) {
        expect(p.variantIndices).toHaveLength(3);
      }
    });

    it('findOptimalPathFrom(1, 0) returns a path where column 1 uses variant 0', () => {
      const path = matrix.findOptimalPathFrom(1, 0);
      expect(path.variantIndices).toHaveLength(3);
      expect(path.variantIndices[1]).toBe(0);
    });

    it('reanchorFrom(1, 0, 3) returns 3 paths all having variantIndices[1] === 0', () => {
      const paths = matrix.reanchorFrom(1, 0, 3);
      expect(paths).toHaveLength(3);
      for (const p of paths) {
        expect(p.variantIndices).toHaveLength(3);
        expect(p.variantIndices[1]).toBe(0);
      }
    });
  });
});
