import { describe, it, expect } from 'vitest';
import type { VoiceLeadingDistance } from '@grilled-cheese/lib';
import { findOptimalPath, findGreedyPath, findOptimalPaths, findOptimalPathFrom, findOptimalPathsFrom } from '../../src/lib/voicing/path.js';

function makeDist(from: number, to: number, total: number, movements?: number[]): VoiceLeadingDistance {
  return {
    fromVariant: from,
    toVariant: to,
    totalDistance: total,
    voiceMovements: movements ?? [0, 0, 0, 0],
  };
}

function buildDistances(
  data: number[][][],
): VoiceLeadingDistance[][][] {
  return data.map((col) =>
    col.map((row) =>
      row.map((d, j) => makeDist(row.indexOf(d) === -1 ? 0 : col.indexOf(row), j, d)),
    ),
  );
}

describe('findOptimalPath', () => {
  it('handles single column (trivial path)', () => {
    const result = findOptimalPath([], [3]);
    expect(result.variantIndices).toEqual([0]);
    expect(result.totalDistance).toBe(0);
  });

  it('handles two columns', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 2), makeDist(0, 1, 5)],
        [makeDist(1, 0, 1), makeDist(1, 1, 8)],
      ],
    ];
    const result = findOptimalPath(distances, [2, 2]);
    expect(result.variantIndices).toHaveLength(2);
    expect(result.totalDistance).toBe(1);
    expect(result.variantIndices).toEqual([1, 0]);
  });

  it('finds globally optimal path in 3-column matrix', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 10)],
        [makeDist(1, 0, 10), makeDist(1, 1, 1)],
      ],
      [
        [makeDist(0, 0, 10), makeDist(0, 1, 1)],
        [makeDist(1, 0, 1), makeDist(1, 1, 10)],
      ],
    ];
    const result = findOptimalPath(distances, [2, 2, 2]);
    expect(result.totalDistance).toBe(2);
  });

  it('finds globally optimal path avoiding greedy trap', () => {
    const greedyTrap: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const optimal = findOptimalPath(greedyTrap, [2, 2, 2]);
    const greedy = findGreedyPath(greedyTrap, [2, 2, 2], 0);
    expect(optimal.totalDistance).toBeLessThan(greedy.totalDistance);
    expect(optimal.totalDistance).toBe(3);
  });

  it('handles unequal variant counts per column', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 5), makeDist(0, 1, 1), makeDist(0, 2, 8)],
      ],
    ];
    const result = findOptimalPath(distances, [1, 3]);
    expect(result.totalDistance).toBe(1);
    expect(result.variantIndices).toEqual([0, 1]);
  });
});

describe('findGreedyPath', () => {
  it('handles single column', () => {
    const result = findGreedyPath([], [3]);
    expect(result.variantIndices).toEqual([0]);
    expect(result.totalDistance).toBe(0);
  });

  it('follows local minimum at each step', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 5), makeDist(0, 1, 2)],
        [makeDist(1, 0, 1), makeDist(1, 1, 8)],
      ],
    ];
    const result = findGreedyPath(distances, [2, 2], 0);
    expect(result.variantIndices[0]).toBe(0);
    expect(result.variantIndices[1]).toBe(1);
    expect(result.totalDistance).toBe(2);
  });

  it('starts at specified startRow', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 5), makeDist(0, 1, 2)],
        [makeDist(1, 0, 1), makeDist(1, 1, 8)],
      ],
    ];
    const result = findGreedyPath(distances, [2, 2], 1);
    expect(result.variantIndices[0]).toBe(1);
    expect(result.variantIndices[1]).toBe(0);
    expect(result.totalDistance).toBe(1);
  });

  it('defaults to row 0 when startRow is not specified', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 3), makeDist(0, 1, 1)],
      ],
    ];
    const result = findGreedyPath(distances, [1, 2]);
    expect(result.variantIndices[0]).toBe(0);
  });

  it('accumulates totalDistance across columns', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 2), makeDist(0, 1, 5)],
      ],
      [
        [makeDist(0, 0, 3), makeDist(0, 1, 1)],
      ],
    ];
    const result = findGreedyPath(distances, [1, 2, 2]);
    expect(result.totalDistance).toBe(3);
    expect(result.voiceMovementsPerColumn).toHaveLength(2);
  });
});

describe('findOptimalPaths', () => {
  it('returns multiple distinct paths', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const paths = findOptimalPaths(distances, [2, 2, 2], 3);
    expect(paths).toHaveLength(3);
    for (const p of paths) {
      expect(p.variantIndices).toHaveLength(3);
      expect(p.totalDistance).toBeGreaterThan(-1);
    }
  });

  it('paths have different variant indices', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const paths = findOptimalPaths(distances, [2, 2, 2], 2);
    const idx0 = paths[0]!.variantIndices.join(',');
    const idx1 = paths[1]!.variantIndices.join(',');
    expect(idx0).not.toBe(idx1);
  });

  it('with n=1 returns same as findOptimalPath', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const single = findOptimalPaths(distances, [2, 2, 2], 1);
    const optimal = findOptimalPath(distances, [2, 2, 2]);
    expect(single).toHaveLength(1);
    expect(single[0]!.variantIndices).toEqual(optimal.variantIndices);
    expect(single[0]!.totalDistance).toBe(optimal.totalDistance);
  });
});

describe('findOptimalPathFrom', () => {
  it('constrains the anchor column correctly', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const path = findOptimalPathFrom(distances, [2, 2, 2], 1, 0);
    expect(path.variantIndices).toHaveLength(3);
    expect(path.variantIndices[1]).toBe(0);
  });

  it('the anchor row is in the returned path', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 5), makeDist(0, 1, 1)],
        [makeDist(1, 0, 1), makeDist(1, 1, 8)],
      ],
    ];
    const path = findOptimalPathFrom(distances, [2, 2], 0, 1);
    expect(path.variantIndices[0]).toBe(1);
  });
});

describe('findOptimalPathsFrom', () => {
  it('returns paths that all pass through the anchor cell', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const paths = findOptimalPathsFrom(distances, [2, 2, 2], 1, 0, 3);
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      expect(p.variantIndices).toHaveLength(3);
      expect(p.variantIndices[1]).toBe(0);
    }
  });

  it('returns multiple diverse paths', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const paths = findOptimalPathsFrom(distances, [2, 2, 2], 1, 0, 2);
    expect(paths).toHaveLength(2);
    const idx0 = paths[0]!.variantIndices.join(',');
    const idx1 = paths[1]!.variantIndices.join(',');
    expect(idx0).not.toBe(idx1);
  });

  it('with anchor at col 0 works correctly', () => {
    const distances: VoiceLeadingDistance[][][] = [
      [
        [makeDist(0, 0, 1), makeDist(0, 1, 3)],
        [makeDist(1, 0, 100), makeDist(1, 1, 2)],
      ],
      [
        [makeDist(0, 0, 100), makeDist(0, 1, 100)],
        [makeDist(1, 0, 1), makeDist(1, 1, 1)],
      ],
    ];
    const paths = findOptimalPathsFrom(distances, [2, 2, 2], 0, 1, 2);
    for (const p of paths) {
      expect(p.variantIndices[0]).toBe(1);
    }
  });
});
