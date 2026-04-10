import type { VoiceLeadingDistance, VoiceLeadingPath } from '../core/types.js';

export function findOptimalPath(
  distances: VoiceLeadingDistance[][][],
  numVariantsPerColumn: number[],
): VoiceLeadingPath {
  const numCols = numVariantsPerColumn.length;

  if (numCols === 0) {
    return { variantIndices: [], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  if (numCols === 1) {
    return { variantIndices: [0], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  const INF = Infinity;
  const cost: number[][] = [];
  const parent: (number | null)[][] = [];
  const parentDist: (VoiceLeadingDistance | null)[][] = [];

  for (let i = 0; i < numVariantsPerColumn[0]!; i++) {
    if (!cost[0]) cost[0] = [];
    cost[0]![i] = 0;
  }
  parent[0] = new Array(numVariantsPerColumn[0]!).fill(null);
  parentDist[0] = new Array(numVariantsPerColumn[0]!).fill(null);

  for (let col = 1; col < numCols; col++) {
    cost[col] = [];
    parent[col] = [];
    parentDist[col] = [];
    for (let j = 0; j < numVariantsPerColumn[col]!; j++) {
      let bestCost = INF;
      let bestPrev = -1;
      let bestD: VoiceLeadingDistance | null = null;
      for (let i = 0; i < numVariantsPerColumn[col - 1]!; i++) {
        const prevCost = cost[col - 1]![i]!;
        if (prevCost === INF) continue;
        const d = distances[col - 1]![i]![j]!;
        const c = prevCost + d.totalDistance;
        if (c < bestCost) {
          bestCost = c;
          bestPrev = i;
          bestD = d;
        }
      }
      cost[col]![j] = bestCost;
      parent[col]![j] = bestPrev;
      parentDist[col]![j] = bestD;
    }
  }

  let lastIdx = 0;
  let lastCost = cost[numCols - 1]![0]!;
  for (let j = 1; j < numVariantsPerColumn[numCols - 1]!; j++) {
    if (cost[numCols - 1]![j]! < lastCost) {
      lastCost = cost[numCols - 1]![j]!;
      lastIdx = j;
    }
  }

  const variantIndices: number[] = new Array(numCols);
  variantIndices[numCols - 1] = lastIdx;

  for (let col = numCols - 1; col > 0; col--) {
    variantIndices[col - 1] = parent[col]![variantIndices[col]!]!;
  }

  const voiceMovementsPerColumn: number[][] = [];
  let totalDistance = 0;
  for (let col = 1; col < numCols; col++) {
    const d = parentDist[col]![variantIndices[col]!]!;
    voiceMovementsPerColumn.push(d!.voiceMovements);
    totalDistance += d!.totalDistance;
  }

  return { variantIndices, totalDistance, voiceMovementsPerColumn };
}

export function findGreedyPath(
  distances: VoiceLeadingDistance[][][],
  numVariantsPerColumn: number[],
  startRow?: number,
): VoiceLeadingPath {
  const numCols = numVariantsPerColumn.length;

  if (numCols === 0) {
    return { variantIndices: [], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  if (numCols === 1) {
    return { variantIndices: [startRow ?? 0], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  const variantIndices: number[] = [startRow ?? 0];
  const voiceMovementsPerColumn: number[][] = [];
  let totalDistance = 0;

  for (let col = 1; col < numCols; col++) {
    const prevRow = variantIndices[col - 1]!;
    let bestJ = 0;
    let bestDist = distances[col - 1]![prevRow]![0]!;
    for (let j = 1; j < numVariantsPerColumn[col]!; j++) {
      if (distances[col - 1]![prevRow]![j]!.totalDistance < bestDist.totalDistance) {
        bestDist = distances[col - 1]![prevRow]![j]!;
        bestJ = j;
      }
    }
    variantIndices.push(bestJ);
    voiceMovementsPerColumn.push(bestDist.voiceMovements);
    totalDistance += bestDist.totalDistance;
  }

  return { variantIndices, totalDistance, voiceMovementsPerColumn };
}

const DIVERSITY_PENALTY = 5;

function findBestPathWithPenalty(
  distances: VoiceLeadingDistance[][][],
  numVariantsPerColumn: number[],
  usedVariants: Set<string>[],
): VoiceLeadingPath {
  const numCols = numVariantsPerColumn.length;

  if (numCols === 0) {
    return { variantIndices: [], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  if (numCols === 1) {
    let best = 0;
    let bestPenalty = usedVariants[0]?.has(String(0)) ? DIVERSITY_PENALTY : 0;
    for (let i = 1; i < numVariantsPerColumn[0]!; i++) {
      const p = usedVariants[0]?.has(String(i)) ? DIVERSITY_PENALTY : 0;
      if (p < bestPenalty) {
        bestPenalty = p;
        best = i;
      }
    }
    return { variantIndices: [best], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  const INF = Infinity;
  const cost: number[][] = [];
  const parent: (number | null)[][] = [];
  const parentDist: (VoiceLeadingDistance | null)[][] = [];

  for (let i = 0; i < numVariantsPerColumn[0]!; i++) {
    if (!cost[0]) cost[0] = [];
    cost[0]![i] = usedVariants[0]?.has(String(i)) ? DIVERSITY_PENALTY : 0;
  }
  parent[0] = new Array(numVariantsPerColumn[0]!).fill(null);
  parentDist[0] = new Array(numVariantsPerColumn[0]!).fill(null);

  for (let col = 1; col < numCols; col++) {
    cost[col] = [];
    parent[col] = [];
    parentDist[col] = [];
    for (let j = 0; j < numVariantsPerColumn[col]!; j++) {
      let bestCost = INF;
      let bestPrev = -1;
      let bestD: VoiceLeadingDistance | null = null;
      const penalty = usedVariants[col]?.has(String(j)) ? DIVERSITY_PENALTY : 0;
      for (let i = 0; i < numVariantsPerColumn[col - 1]!; i++) {
        const prevCost = cost[col - 1]![i]!;
        if (prevCost === INF) continue;
        const d = distances[col - 1]![i]![j]!;
        const c = prevCost + d.totalDistance + penalty;
        if (c < bestCost) {
          bestCost = c;
          bestPrev = i;
          bestD = d;
        }
      }
      cost[col]![j] = bestCost;
      parent[col]![j] = bestPrev;
      parentDist[col]![j] = bestD;
    }
  }

  let lastIdx = 0;
  let lastCost = cost[numCols - 1]![0]!;
  for (let j = 1; j < numVariantsPerColumn[numCols - 1]!; j++) {
    if (cost[numCols - 1]![j]! < lastCost) {
      lastCost = cost[numCols - 1]![j]!;
      lastIdx = j;
    }
  }

  const variantIndices: number[] = new Array(numCols);
  variantIndices[numCols - 1] = lastIdx;

  for (let col = numCols - 1; col > 0; col--) {
    variantIndices[col - 1] = parent[col]![variantIndices[col]!]!;
  }

  const voiceMovementsPerColumn: number[][] = [];
  let totalDistance = 0;
  for (let col = 1; col < numCols; col++) {
    const d = parentDist[col]![variantIndices[col]!]!;
    voiceMovementsPerColumn.push(d!.voiceMovements);
    totalDistance += d!.totalDistance;
  }

  return { variantIndices, totalDistance, voiceMovementsPerColumn };
}

export function findOptimalPaths(
  distances: VoiceLeadingDistance[][][],
  numVariantsPerColumn: number[],
  n: number,
): VoiceLeadingPath[] {
  const results: VoiceLeadingPath[] = [];
  const usedVariants: Set<string>[] = Array.from(
    { length: numVariantsPerColumn.length },
    () => new Set<string>(),
  );

  for (let k = 0; k < n; k++) {
    const path = findBestPathWithPenalty(distances, numVariantsPerColumn, usedVariants);
    if (path.variantIndices.length === 0) break;

    for (let col = 0; col < path.variantIndices.length; col++) {
      usedVariants[col]!.add(String(path.variantIndices[col]));
    }
    results.push(path);
  }

  return results;
}

function findBestAnchoredPathWithPenalty(
  distances: VoiceLeadingDistance[][][],
  numVariantsPerColumn: number[],
  anchorCol: number,
  anchorRow: number,
  usedVariants: Set<string>[],
): VoiceLeadingPath {
  const numCols = numVariantsPerColumn.length;

  if (numCols === 0) {
    return { variantIndices: [], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  if (numCols === 1) {
    return { variantIndices: [anchorRow], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  const INF = Infinity;
  const cost: number[][] = [];
  const parent: (number | null)[][] = [];
  const parentDist: (VoiceLeadingDistance | null)[][] = [];

  if (anchorCol === 0) {
    cost[0] = new Array(numVariantsPerColumn[0]!).fill(INF);
    cost[0]![anchorRow] = 0;
    parent[0] = new Array(numVariantsPerColumn[0]!).fill(null);
    parentDist[0] = new Array(numVariantsPerColumn[0]!).fill(null);
  } else {
    cost[0] = [];
    parent[0] = new Array(numVariantsPerColumn[0]!).fill(null);
    parentDist[0] = new Array(numVariantsPerColumn[0]!).fill(null);
    for (let i = 0; i < numVariantsPerColumn[0]!; i++) {
      cost[0]![i] = usedVariants[0]?.has(String(i)) ? DIVERSITY_PENALTY : 0;
    }
  }

  for (let col = 1; col < numCols; col++) {
    cost[col] = new Array(numVariantsPerColumn[col]!).fill(INF);
    parent[col] = new Array(numVariantsPerColumn[col]!).fill(null);
    parentDist[col] = new Array(numVariantsPerColumn[col]!).fill(null);

    if (col === anchorCol) {
      const penalty = usedVariants[col]?.has(String(anchorRow)) ? DIVERSITY_PENALTY : 0;
      let bestCost = INF;
      let bestPrev = -1;
      let bestD: VoiceLeadingDistance | null = null;
      for (let i = 0; i < numVariantsPerColumn[col - 1]!; i++) {
        const prevCost = cost[col - 1]![i]!;
        if (prevCost === INF) continue;
        const d = distances[col - 1]![i]![anchorRow]!;
        const c = prevCost + d.totalDistance + penalty;
        if (c < bestCost) {
          bestCost = c;
          bestPrev = i;
          bestD = d;
        }
      }
      cost[col]![anchorRow] = bestCost;
      parent[col]![anchorRow] = bestPrev;
      parentDist[col]![anchorRow] = bestD;
    } else {
      for (let j = 0; j < numVariantsPerColumn[col]!; j++) {
        const penalty = usedVariants[col]?.has(String(j)) ? DIVERSITY_PENALTY : 0;
        for (let i = 0; i < numVariantsPerColumn[col - 1]!; i++) {
          const prevCost = cost[col - 1]![i]!;
          if (prevCost === INF) continue;
          const d = distances[col - 1]![i]![j]!;
          const c = prevCost + d.totalDistance + penalty;
          if (c < cost[col]![j]!) {
            cost[col]![j] = c;
            parent[col]![j] = i;
            parentDist[col]![j] = d;
          }
        }
      }
    }
  }

  let lastIdx = 0;
  let lastCost = cost[numCols - 1]![0]!;
  for (let j = 1; j < numVariantsPerColumn[numCols - 1]!; j++) {
    if (cost[numCols - 1]![j]! < lastCost) {
      lastCost = cost[numCols - 1]![j]!;
      lastIdx = j;
    }
  }

  const variantIndices: number[] = new Array(numCols);
  variantIndices[numCols - 1] = lastIdx;

  for (let col = numCols - 1; col > 0; col--) {
    variantIndices[col - 1] = parent[col]![variantIndices[col]!]!;
  }

  const voiceMovementsPerColumn: number[][] = [];
  let totalDistance = 0;
  for (let col = 1; col < numCols; col++) {
    const d = parentDist[col]![variantIndices[col]!]!;
    voiceMovementsPerColumn.push(d!.voiceMovements);
    totalDistance += d!.totalDistance;
  }

  return { variantIndices, totalDistance, voiceMovementsPerColumn };
}

export function findOptimalPathsFrom(
  distances: VoiceLeadingDistance[][][],
  numVariantsPerColumn: number[],
  anchorCol: number,
  anchorRow: number,
  n: number,
): VoiceLeadingPath[] {
  const results: VoiceLeadingPath[] = [];
  const usedVariants: Set<string>[] = Array.from(
    { length: numVariantsPerColumn.length },
    () => new Set<string>(),
  );
  usedVariants[anchorCol]!.add(String(anchorRow));

  for (let k = 0; k < n; k++) {
    const path = findBestAnchoredPathWithPenalty(
      distances, numVariantsPerColumn, anchorCol, anchorRow, usedVariants,
    );
    if (path.variantIndices.length === 0) break;
    for (let col = 0; col < path.variantIndices.length; col++) {
      usedVariants[col]!.add(String(path.variantIndices[col]));
    }
    results.push(path);
  }
  return results;
}

export function findOptimalPathFrom(
  distances: VoiceLeadingDistance[][][],
  numVariantsPerColumn: number[],
  anchorCol: number,
  anchorRow: number,
): VoiceLeadingPath {
  const numCols = numVariantsPerColumn.length;

  if (numCols === 0) {
    return { variantIndices: [], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  if (numCols === 1) {
    return { variantIndices: [anchorRow], totalDistance: 0, voiceMovementsPerColumn: [] };
  }

  const INF = Infinity;
  const cost: number[][] = [];
  const parent: (number | null)[][] = [];
  const parentDist: (VoiceLeadingDistance | null)[][] = [];

  if (anchorCol === 0) {
    cost[0] = new Array(numVariantsPerColumn[0]!).fill(INF);
    cost[0]![anchorRow] = 0;
    parent[0] = new Array(numVariantsPerColumn[0]!).fill(null);
    parentDist[0] = new Array(numVariantsPerColumn[0]!).fill(null);
  } else {
    for (let i = 0; i < numVariantsPerColumn[0]!; i++) {
      if (!cost[0]) cost[0] = [];
      cost[0]![i] = 0;
    }
    parent[0] = new Array(numVariantsPerColumn[0]!).fill(null);
    parentDist[0] = new Array(numVariantsPerColumn[0]!).fill(null);
  }

  for (let col = 1; col < numCols; col++) {
    if (col === anchorCol) {
      cost[col] = new Array(numVariantsPerColumn[col]!).fill(INF);
      parent[col] = new Array(numVariantsPerColumn[col]!).fill(null);
      parentDist[col] = new Array(numVariantsPerColumn[col]!).fill(null);
      let bestCost = INF;
      let bestPrev = -1;
      let bestD: VoiceLeadingDistance | null = null;
      for (let i = 0; i < numVariantsPerColumn[col - 1]!; i++) {
        const prevCost = cost[col - 1]![i]!;
        if (prevCost === INF) continue;
        const d = distances[col - 1]![i]![anchorRow]!;
        const c = prevCost + d.totalDistance;
        if (c < bestCost) {
          bestCost = c;
          bestPrev = i;
          bestD = d;
        }
      }
      cost[col]![anchorRow] = bestCost;
      parent[col]![anchorRow] = bestPrev;
      parentDist[col]![anchorRow] = bestD;
    } else {
      cost[col] = new Array(numVariantsPerColumn[col]!).fill(INF);
      parent[col] = new Array(numVariantsPerColumn[col]!).fill(null);
      parentDist[col] = new Array(numVariantsPerColumn[col]!).fill(null);
      for (let j = 0; j < numVariantsPerColumn[col]!; j++) {
        for (let i = 0; i < numVariantsPerColumn[col - 1]!; i++) {
          const prevCost = cost[col - 1]![i]!;
          if (prevCost === INF) continue;
          const d = distances[col - 1]![i]![j]!;
          const c = prevCost + d.totalDistance;
          if (c < cost[col]![j]!) {
            cost[col]![j] = c;
            parent[col]![j] = i;
            parentDist[col]![j] = d;
          }
        }
      }
    }
  }

  let lastIdx = 0;
  let lastCost = cost[numCols - 1]![0]!;
  for (let j = 1; j < numVariantsPerColumn[numCols - 1]!; j++) {
    if (cost[numCols - 1]![j]! < lastCost) {
      lastCost = cost[numCols - 1]![j]!;
      lastIdx = j;
    }
  }

  const variantIndices: number[] = new Array(numCols);
  variantIndices[numCols - 1] = lastIdx;

  for (let col = numCols - 1; col > 0; col--) {
    variantIndices[col - 1] = parent[col]![variantIndices[col]!]!;
  }

  const voiceMovementsPerColumn: number[][] = [];
  let totalDistance = 0;
  for (let col = 1; col < numCols; col++) {
    const d = parentDist[col]![variantIndices[col]!]!;
    voiceMovementsPerColumn.push(d!.voiceMovements);
    totalDistance += d!.totalDistance;
  }

  return { variantIndices, totalDistance, voiceMovementsPerColumn };
}
