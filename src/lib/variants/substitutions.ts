import type {
  ParsedChord,
  Key,
  ChordVariant,
  PitchClass,
  SubstitutionCategory,
  GuideToneMatch,
} from '../core/types.js';
import type { FunctionalContext } from '../harmony/function.js';
import { transposePitchClass, pitchClassToChordRoot } from '../core/constants.js';
import { getRootPitchClass, getThird, getSeventh, buildPitchClasses } from '../chord/builder.js';
import { assignChordScale } from '../chord-scale/mapper.js';

interface ChordShell {
  suffix: string;
  intervals: number[];
  gtOffsets: [number, number];
}

const CHORD_SHELLS: ChordShell[] = [
  { suffix: 'maj7', intervals: [0, 4, 7, 11], gtOffsets: [4, 11] },
  { suffix: '6', intervals: [0, 4, 7, 9], gtOffsets: [4, 9] },
  { suffix: 'm7', intervals: [0, 3, 7, 10], gtOffsets: [3, 10] },
  { suffix: 'm6', intervals: [0, 3, 7, 9], gtOffsets: [3, 9] },
  { suffix: '7', intervals: [0, 4, 7, 10], gtOffsets: [4, 10] },
  { suffix: 'dim7', intervals: [0, 3, 6, 9], gtOffsets: [3, 6] },
  { suffix: 'm7b5', intervals: [0, 3, 6, 10], gtOffsets: [3, 10] },
  { suffix: 'maj7#5', intervals: [0, 4, 8, 11], gtOffsets: [4, 11] },
  { suffix: 'maj7b5', intervals: [0, 4, 6, 11], gtOffsets: [4, 11] },
  { suffix: '7#5', intervals: [0, 4, 8, 10], gtOffsets: [4, 10] },
  { suffix: '7b5', intervals: [0, 4, 6, 10], gtOffsets: [4, 10] },
  { suffix: 'm(maj7)', intervals: [0, 3, 7, 11], gtOffsets: [3, 11] },
];

function sortUnique(pcs: PitchClass[]): PitchClass[] {
  return [...new Set(pcs)].sort((a, b) => a - b) as PitchClass[];
}

function tp(pc: PitchClass, semitones: number): PitchClass {
  return transposePitchClass(pc, semitones);
}

function computeOverlap(candidate: PitchClass[], original: PitchClass[]): number {
  let count = 0;
  for (const pc of candidate) {
    if (original.includes(pc)) count++;
  }
  return count;
}

function classifyCategory(
  rootOffset: number,
  shell: ChordShell,
): SubstitutionCategory {
  const mod = ((rootOffset % 12) + 12) % 12;

  if (mod === 0) return 'pc-overlap';

  if (mod === 6) {
    if (shell.suffix === '7') return 'tritone-substitute';
    if (shell.suffix === 'dim7') return 'dim7-equivalent';
    return 'tritone-substitute';
  }

  if (mod === 7) {
    if (shell.suffix === 'm6') return 'm6-on-fifth';
    if (shell.suffix === 'm7') return 'm7-sus-substitute';
    return 'pc-overlap';
  }

  if (mod === 1) {
    if (shell.suffix === 'm6') return 'm6-enharmonic';
    return 'pc-overlap';
  }

  if (mod === 3) {
    if (shell.suffix === '6') return 'relative-major6';
    if (shell.suffix === 'maj7') return 'relative-major7';
    if (shell.suffix === 'm6') return 'relative-minor6';
    if (shell.suffix === 'm6') return 'halfdim-to-m6';
    if (shell.suffix === 'm7') return 'halfdim-to-m7';
    return 'pc-overlap';
  }

  if (mod === 4) {
    if (shell.suffix === 'm7') return 'iii-for-I';
    if (shell.suffix === 'm6') return 'm6-on-third';
    return 'pc-overlap';
  }

  if (mod === 9) {
    if (shell.suffix === 'm9') return 'vi9-for-I';
    return 'pc-overlap';
  }

  if (mod === 5) {
    if (shell.suffix === 'dim7') return 'dim7-equivalent';
    return 'pc-overlap';
  }

  return 'pc-overlap';
}

const MIN_OVERLAP = 2;

export function generateSubstitutionVariants(
  chord: ParsedChord,
  key: Key,
  context: FunctionalContext,
): ChordVariant[] {
  const originalRoot = getRootPitchClass(chord);
  const basePcs = buildPitchClasses(chord);
  const scaleAssignment = assignChordScale(chord, key, context);
  const originalPcs = [...new Set([...basePcs, ...scaleAssignment.scalePitches])].sort((a, b) => a - b) as PitchClass[];
  const third = getThird(originalRoot, chord.quality);
  const seventh = getSeventh(originalRoot, chord.quality);
  const originalGuideTones: [PitchClass, PitchClass] = [third, seventh];

  const candidates: ChordVariant[] = [];

  for (let rootSemitone = 0; rootSemitone < 12; rootSemitone++) {
    const subRoot = rootSemitone as PitchClass;
    const rootOffset = ((subRoot - originalRoot) % 12 + 12) % 12;

    for (const shell of CHORD_SHELLS) {
      if (rootOffset === 0) continue;

      const pcs = shell.intervals.map(i => tp(subRoot, i % 12) as PitchClass);
      const sorted = sortUnique(pcs);

      const overlap = computeOverlap(sorted, originalPcs);
      if (overlap < MIN_OVERLAP) continue;

      const guideTones: [PitchClass, PitchClass] = [
        tp(subRoot, shell.gtOffsets[0]),
        tp(subRoot, shell.gtOffsets[1]),
      ];

      const match: GuideToneMatch =
        (sorted.includes(originalGuideTones[0]) && sorted.includes(originalGuideTones[1]))
          ? 'exact' : 'near-miss';

      const rootName = pitchClassToChordRoot(subRoot);
      const symbol = `${rootName}${shell.suffix}`;

      const category = classifyCategory(rootOffset, shell);

      candidates.push({
        symbol,
        pitchClasses: sorted,
        guideTones,
        extensions: [],
        category,
        originalRoot,
        guideToneMatch: match,
      });
    }
  }

  candidates.sort((a, b) => {
    const overlapA = computeOverlap(a.pitchClasses, originalPcs);
    const overlapB = computeOverlap(b.pitchClasses, originalPcs);
    if (overlapB !== overlapA) return overlapB - overlapA;
    const rootA = parseRootFromSymbol(a.symbol);
    const rootB = parseRootFromSymbol(b.symbol);
    const distA = ((rootA - originalRoot) % 12 + 12) % 12;
    const distB = ((rootB - originalRoot) % 12 + 12) % 12;
    const proxA = distA <= 6 ? distA : 12 - distA;
    const proxB = distB <= 6 ? distB : 12 - distB;
    return proxA - proxB;
  });

  return candidates;
}

function parseRootFromSymbol(symbol: string): PitchClass {
  if (symbol.length > 1 && (symbol[1] === '#' || symbol[1] === 'b')) {
    const noteToPc: Record<string, PitchClass> = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
    };
    return noteToPc[symbol.slice(0, 2)] ?? 0;
  }
  const noteToPc: Record<string, PitchClass> = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11,
  };
  return noteToPc[symbol[0]!] ?? 0;
}
