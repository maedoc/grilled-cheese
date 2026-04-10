import { describe, it, expect } from 'vitest';
import type { PitchClass, ChordVariant } from '@grilled-cheese/lib';
import { computeDistance, computeDistanceMatrix } from '../../src/lib/voicing/distance.js';
import { computeDistance as computePureDistance } from '../../src/lib/voicing/distance.js';

function makeVariant(
  symbol: string,
  pitchClasses: PitchClass[],
  guideTones: [PitchClass, PitchClass],
  extensions: string[] = [],
): ChordVariant {
  const rootStr = symbol.length > 1 && (symbol[1] === '#' || symbol[1] === 'b')
    ? symbol.slice(0, 2) : symbol.slice(0, 1);
  const NOTE_TO_PC: Record<string, PitchClass> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
  };
  return {
    symbol,
    pitchClasses,
    guideTones,
    extensions,
    category: 'same-root',
    originalRoot: NOTE_TO_PC[rootStr] ?? 0,
    guideToneMatch: 'exact',
  };
}

describe('computeDistance', () => {
  it('returns 0 for identical voicings', () => {
    const voicing: PitchClass[] = [0, 4, 7, 11];
    const result = computeDistance(voicing, voicing, 0, 0);
    expect(result.totalDistance).toBe(0);
    expect(result.voiceMovements).toEqual([0, 0, 0, 0]);
  });

  it('computes small distance for Dm7 → G7 (ii-V)', () => {
    const dm7: PitchClass[] = [0, 2, 5, 9];
    const g7: PitchClass[] = [2, 5, 7, 11];
    const result = computeDistance(dm7, g7, 0, 0);
    expect(result.totalDistance).toBeLessThanOrEqual(9);
    expect(result.fromVariant).toBe(0);
    expect(result.toVariant).toBe(0);
  });

  it('computes small distance for G7 → Cmaj7 (V-I)', () => {
    const g7: PitchClass[] = [2, 5, 7, 11];
    const cmaj7: PitchClass[] = [0, 4, 7, 11];
    const result = computeDistance(g7, cmaj7, 0, 0);
    expect(result.totalDistance).toBeLessThanOrEqual(4);
  });

  it('computes very small distance for tritone-related dominants (C7 vs Gb7)', () => {
    const c7: PitchClass[] = [0, 4, 7, 10];
    const gb7: PitchClass[] = [1, 4, 6, 10];
    const result = computeDistance(c7, gb7, 0, 0);
    expect(result.totalDistance).toBeLessThanOrEqual(3);
  });

  it('stores correct fromVariant and toVariant indices', () => {
    const a: PitchClass[] = [0, 4, 7, 11];
    const b: PitchClass[] = [2, 5, 7, 10];
    const result = computeDistance(a, b, 3, 7);
    expect(result.fromVariant).toBe(3);
    expect(result.toVariant).toBe(7);
  });

  it('voiceMovements has 4 entries summing to totalDistance', () => {
    const a: PitchClass[] = [0, 2, 5, 9];
    const b: PitchClass[] = [2, 5, 7, 11];
    const result = computeDistance(a, b, 0, 0);
    expect(result.voiceMovements).toHaveLength(4);
    const sum = result.voiceMovements.reduce((s, v) => s + v, 0);
    expect(sum).toBe(result.totalDistance);
  });
});

describe('computeDistanceMatrix', () => {
  it('computes a 2x2 distance matrix', () => {
    const from: ChordVariant[] = [
      makeVariant('Dm7', [0, 2, 5, 9] as PitchClass[], [2, 5] as [PitchClass, PitchClass]),
      makeVariant('Dm9', [0, 2, 5, 9] as PitchClass[], [2, 5] as [PitchClass, PitchClass]),
    ];
    const to: ChordVariant[] = [
      makeVariant('G7', [2, 5, 7, 11] as PitchClass[], [4, 10] as [PitchClass, PitchClass]),
      makeVariant('G9', [2, 5, 7, 11] as PitchClass[], [4, 10] as [PitchClass, PitchClass], ['9']),
    ];
    const matrix = computeDistanceMatrix(from, to);
    expect(matrix).toHaveLength(2);
    expect(matrix[0]).toHaveLength(2);
    expect(matrix[1]).toHaveLength(2);
    expect(matrix[0]![0]!.totalDistance).toBeGreaterThanOrEqual(0);
    expect(matrix[0]![1]!.totalDistance).toBeGreaterThanOrEqual(0);
    expect(matrix[1]![0]!.totalDistance).toBeGreaterThanOrEqual(0);
    expect(matrix[1]![1]!.totalDistance).toBeGreaterThanOrEqual(0);
  });

  it('adds repetition penalty for identical voicings', () => {
    const variants: ChordVariant[] = [
      makeVariant('Cmaj7', [0, 4, 7, 11] as PitchClass[], [4, 11] as [PitchClass, PitchClass]),
      makeVariant('G7', [2, 5, 7, 10] as PitchClass[], [11, 5] as [PitchClass, PitchClass]),
    ];
    const matrix = computeDistanceMatrix(variants, variants);
    expect(matrix[0]![0]!.totalDistance).toBe(20);
    expect(matrix[1]![1]!.totalDistance).toBe(20);
    expect(matrix[0]![1]!.totalDistance).toBeLessThan(20);
    expect(matrix[1]![0]!.totalDistance).toBeLessThan(20);
  });

  it('no repetition penalty for different voicings', () => {
    const from = [makeVariant('Dm7', [0, 2, 5, 9] as PitchClass[], [5, 0] as [PitchClass, PitchClass])];
    const to = [makeVariant('G7', [2, 5, 7, 10] as PitchClass[], [11, 5] as [PitchClass, PitchClass])];
    const matrix = computeDistanceMatrix(from, to);
    expect(matrix[0]![0]!.totalDistance).toBeLessThan(20);
  });

  it('adds extension penalty for variants with extensions', () => {
    const from = [makeVariant('Dm7', [0, 2, 5, 9] as PitchClass[], [5, 0] as [PitchClass, PitchClass])];
    const toNoExt = [makeVariant('G7', [2, 5, 7, 10] as PitchClass[], [11, 5] as [PitchClass, PitchClass])];
    const toWithExt = [makeVariant('G13', [2, 4, 5, 7, 9, 11] as PitchClass[], [11, 5] as [PitchClass, PitchClass], ['9', '13'])];
    const matrixNoExt = computeDistanceMatrix(from, toNoExt);
    const matrixWithExt = computeDistanceMatrix(from, toWithExt);
    expect(matrixWithExt[0]![0]!.totalDistance).toBeGreaterThan(matrixNoExt[0]![0]!.totalDistance);
  });
});
