import type { VoiceLeadingMatrix, MatrixColumn, VoiceLeadingDistance, VoiceLeadingPath, PitchClass } from '../core/types.js';
import { createKey } from '../harmony/key.js';
import { parseChord } from '../chord/parser.js';
import { analyzeRomanNumeral } from '../harmony/roman.js';
import { getFunctionalContext } from '../harmony/function.js';
import { assignChordScale } from '../chord-scale/mapper.js';
import { generateVariants } from '../variants/generator.js';
import { rankVariants, filterCommonVariants } from '../variants/filter.js';
import { extractVoicing } from '../voicing/voicing.js';
import { computeDistanceMatrix } from '../voicing/distance.js';
import { findOptimalPath as findOptimalPathImpl, findGreedyPath as findGreedyPathImpl, findOptimalPaths as findOptimalPathsImpl, findOptimalPathFrom as findOptimalPathFromImpl, findOptimalPathsFrom as findOptimalPathsFromImpl } from '../voicing/path.js';
import { minSemitoneDistance } from '../core/constants.js';

function sortVariantsByProximity(
  variants: MatrixColumn['variants'],
  refVoicing: PitchClass[],
): MatrixColumn['variants'] {
  const scored = variants.map((v, i) => {
    const voicing = extractVoicing(v);
    let total = 0;
    for (let k = 0; k < 4; k++) {
      total += minSemitoneDistance(refVoicing[k]!, voicing[k]!);
    }
    return { index: i, distance: total };
  });
  scored.sort((a, b) => a.distance - b.distance);
  return scored.map(s => variants[s.index]!);
}

export function generateMatrix(
  chordSymbols: string[],
  tonic: string,
  mode: 'major' | 'minor',
): VoiceLeadingMatrix {
  const key = createKey(tonic, mode);
  const parsedChords = chordSymbols.map(s => parseChord(s));

  const columns: MatrixColumn[] = [];

  for (let i = 0; i < parsedChords.length; i++) {
    const chord = parsedChords[i]!;
    const nextChord = i < parsedChords.length - 1 ? parsedChords[i + 1]! : null;

    const context = getFunctionalContext(chord, nextChord, key);
    const chordScale = assignChordScale(chord, key, context);
    const romanAnalysis = analyzeRomanNumeral(chord, key);
    const rawVariants = generateVariants(chord, key, context);
    const ranked = filterCommonVariants(rankVariants(rawVariants, chord.quality));

    let variants = ranked;

    if (i > 0) {
      const prevFirstVoicing = extractVoicing(columns[i - 1]!.variants[0]!);
      const original = ranked[0]!;
      const rest = ranked.slice(1);
      const sortedRest = sortVariantsByProximity(rest, prevFirstVoicing);
      variants = [original, ...sortedRest];
    }

    columns.push({
      originalSymbol: chordSymbols[i]!,
      parsedChord: chord,
      romanAnalysis,
      chordScale,
      variants,
    });
  }

  const distances: VoiceLeadingDistance[][][] = [];
  for (let i = 0; i < columns.length - 1; i++) {
    distances.push(computeDistanceMatrix(columns[i]!.variants, columns[i + 1]!.variants));
  }

  const numVariantsPerColumn = columns.map(c => c.variants.length);
  const initialPaths = numVariantsPerColumn.length === 0
    ? []
    : numVariantsPerColumn.length === 1
      ? [{ variantIndices: [0], totalDistance: 0, voiceMovementsPerColumn: [] }]
      : findOptimalPathsFromImpl(distances, numVariantsPerColumn, 0, 0, 6);

  return {
    columns,
    distances,
    paths: initialPaths,
    findOptimalPath(): VoiceLeadingPath {
      return findOptimalPathImpl(distances, numVariantsPerColumn);
    },
    findGreedyPath(startRow?: number): VoiceLeadingPath {
      return findGreedyPathImpl(distances, numVariantsPerColumn, startRow);
    },
    findOptimalPaths(n: number): VoiceLeadingPath[] {
      return findOptimalPathsImpl(distances, numVariantsPerColumn, n);
    },
    findOptimalPathFrom(col: number, row: number): VoiceLeadingPath {
      return findOptimalPathFromImpl(distances, numVariantsPerColumn, col, row);
    },
    reanchorFrom(col: number, row: number, n: number): VoiceLeadingPath[] {
      return findOptimalPathsFromImpl(distances, numVariantsPerColumn, col, row, n);
    },
  };
}
