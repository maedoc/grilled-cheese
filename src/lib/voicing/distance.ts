import type { ChordVariant, PitchClass, VoiceLeadingDistance } from '../core/types.js';
import { minSemitoneDistance, permutations } from '../core/constants.js';
import { extractVoicing } from './voicing.js';

const REPETITION_PENALTY = 20;
const ROOT_LEADING_WEIGHT = 5;

function getVariantRoot(variant: ChordVariant): PitchClass {
  return variant.pitchClasses[0]!;
}

function computeRootLeadingDistance(fromVariant: ChordVariant, toVariant: ChordVariant): number {
  const fromRoot = getVariantRoot(fromVariant);
  const toRoot = getVariantRoot(toVariant);
  return minSemitoneDistance(fromRoot, toRoot);
}

function computeRepetitionPenalty(fromVariant: ChordVariant, toVariant: ChordVariant): number {
  const fromVoicing = extractVoicing(fromVariant);
  const toVoicing = extractVoicing(toVariant);
  if (fromVoicing[0] === toVoicing[0] && fromVoicing[1] === toVoicing[1] &&
      fromVoicing[2] === toVoicing[2] && fromVoicing[3] === toVoicing[3]) {
    return REPETITION_PENALTY;
  }
  return 0;
}

function computeExtensionPenalty(fromVariant: ChordVariant, toVariant: ChordVariant): number {
  return fromVariant.extensions.length + toVariant.extensions.length;
}

export function computeDistance(
  fromVoicing: PitchClass[],
  toVoicing: PitchClass[],
  fromIndex: number,
  toIndex: number,
): VoiceLeadingDistance {
  const indices = [0, 1, 2, 3] as const;
  const allPerms = permutations(indices);

  let bestDist = Infinity;
  let bestMovements: number[] = [0, 0, 0, 0];

  for (const perm of allPerms) {
    const movements: number[] = [];
    let total = 0;
    for (let i = 0; i < 4; i++) {
      const d = minSemitoneDistance(
        fromVoicing[i]!,
        toVoicing[perm[i]!]!,
      );
      movements.push(d);
      total += d;
    }
    if (total < bestDist) {
      bestDist = total;
      bestMovements = movements;
    }
  }

  return {
    fromVariant: fromIndex,
    toVariant: toIndex,
    totalDistance: bestDist,
    voiceMovements: bestMovements,
  };
}

export function computeDistanceMatrix(
  fromVariants: ChordVariant[],
  toVariants: ChordVariant[],
  includeRootLeading = false,
): VoiceLeadingDistance[][] {
  const result: VoiceLeadingDistance[][] = [];
  for (let i = 0; i < fromVariants.length; i++) {
    const row: VoiceLeadingDistance[] = [];
    const fromVoicing = extractVoicing(fromVariants[i]!);
    for (let j = 0; j < toVariants.length; j++) {
      const toVoicing = extractVoicing(toVariants[j]!);
      const d = computeDistance(fromVoicing, toVoicing, i, j);
      const repPenalty = computeRepetitionPenalty(fromVariants[i]!, toVariants[j]!);
      const extPenalty = computeExtensionPenalty(fromVariants[i]!, toVariants[j]!);
      let rootLeadPenalty = 0;
      if (includeRootLeading) {
        rootLeadPenalty = computeRootLeadingDistance(fromVariants[i]!, toVariants[j]!) * ROOT_LEADING_WEIGHT;
      }
      d.totalDistance += repPenalty + extPenalty + rootLeadPenalty;
      row.push(d);
    }
    result.push(row);
  }
  return result;
}
