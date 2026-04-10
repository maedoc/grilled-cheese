import type { ParsedChord, Key, ChordVariant, PitchClass, SubstitutionCategory, GuideToneMatch } from '../core/types.js';
import type { FunctionalContext } from '../harmony/function.js';
import { assignChordScale } from '../chord-scale/mapper.js';
import { getRootPitchClass, getThird, getSeventh, getFifth } from '../chord/builder.js';
import { transposePitchClass } from '../core/constants.js';
import { generateSubstitutionVariants } from './substitutions.js';

const TENSION_OFFSET: Record<string, number> = {
  '9': 2,
  '11': 5,
  '13': 9,
  'b9': 1,
  '#9': 3,
  '#11': 6,
  'b13': 8,
};

function sortUnique(pcs: PitchClass[]): PitchClass[] {
  return [...new Set(pcs)].sort((a, b) => a - b) as PitchClass[];
}

function buildVariant(
  root: PitchClass,
  third: PitchClass,
  fifth: PitchClass,
  seventh: PitchClass,
  guideTones: [PitchClass, PitchClass],
  symbol: string,
  extensions: string[],
  use6th: boolean,
  category: SubstitutionCategory = 'same-root',
  originalRoot?: PitchClass,
  guideToneMatch: GuideToneMatch = 'exact',
): ChordVariant {
  const pcs: PitchClass[] = [root, third, fifth];

  if (use6th) {
    pcs.push(transposePitchClass(root, 9));
  } else {
    pcs.push(seventh);
  }

  for (const ext of extensions) {
    pcs.push(transposePitchClass(root, TENSION_OFFSET[ext]!));
  }

  return {
    symbol,
    pitchClasses: sortUnique(pcs),
    guideTones,
    extensions,
    category,
    originalRoot: originalRoot ?? root,
    guideToneMatch,
  };
}

function isMajorish(q: string): boolean {
  return q === 'major7' || q === 'major6' || q === 'major';
}

function isMinorish(q: string): boolean {
  return q === 'minor7' || q === 'minor6' || q === 'minor' || q === 'minorMajor7';
}

function majorVariants(
  rn: string,
  root: PitchClass,
  third: PitchClass,
  fifth: PitchClass,
  seventh: PitchClass,
  gt: [PitchClass, PitchClass],
): ChordVariant[] {
  return [
    buildVariant(root, third, fifth, seventh, gt, `${rn}maj7`, [], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}6`, [], true),
    buildVariant(root, third, fifth, seventh, gt, `${rn}maj9`, ['9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}maj7#11`, ['#11'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}69`, ['9'], true),
    buildVariant(root, third, fifth, seventh, gt, `${rn}maj13`, ['9', '13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}maj13#11`, ['9', '#11', '13'], false),
  ];
}

function minorVariants(
  rn: string,
  root: PitchClass,
  third: PitchClass,
  fifth: PitchClass,
  seventh: PitchClass,
  gt: [PitchClass, PitchClass],
): ChordVariant[] {
  return [
    buildVariant(root, third, fifth, seventh, gt, `${rn}m7`, [], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m9`, ['9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m11`, ['9', '11'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m13`, ['9', '13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m6`, [], true),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m69`, ['9'], true),
  ];
}

function dominantMajorVariants(
  rn: string,
  root: PitchClass,
  third: PitchClass,
  fifth: PitchClass,
  seventh: PitchClass,
  gt: [PitchClass, PitchClass],
): ChordVariant[] {
  return [
    buildVariant(root, third, fifth, seventh, gt, `${rn}7`, [], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}9`, ['9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}13`, ['9', '13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7#11`, ['#11'], false),
    buildVariant(root, third, transposePitchClass(root, 8), seventh, gt, `${rn}7#5`, [], false),
  ];
}

function dominantMinorVariants(
  rn: string,
  root: PitchClass,
  third: PitchClass,
  fifth: PitchClass,
  seventh: PitchClass,
  gt: [PitchClass, PitchClass],
): ChordVariant[] {
  return [
    buildVariant(root, third, fifth, seventh, gt, `${rn}7`, [], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b9`, ['b9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7#9`, ['#9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b13`, ['b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b9b13`, ['b9', 'b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7#9b13`, ['#9', 'b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b9#9`, ['b9', '#9'], false),
    buildVariant(root, third, transposePitchClass(root, 8), seventh, gt, `${rn}7#5`, [], false),
  ];
}

function alteredVariants(
  rn: string,
  root: PitchClass,
  third: PitchClass,
  fifth: PitchClass,
  seventh: PitchClass,
  gt: [PitchClass, PitchClass],
): ChordVariant[] {
  return [
    buildVariant(root, third, fifth, seventh, gt, `${rn}7alt`, ['b9', '#9', 'b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b9`, ['b9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7#9`, ['#9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b13`, ['b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b9b13`, ['b9', 'b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7#9b13`, ['#9', 'b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b9#9`, ['b9', '#9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}7b9#9b13`, ['b9', '#9', 'b13'], false),
    buildVariant(root, third, transposePitchClass(root, 8), seventh, gt, `${rn}7#5`, [], false),
  ];
}

function halfDimVariants(
  rn: string,
  root: PitchClass,
  third: PitchClass,
  fifth: PitchClass,
  seventh: PitchClass,
  gt: [PitchClass, PitchClass],
): ChordVariant[] {
  return [
    buildVariant(root, third, fifth, seventh, gt, `${rn}m7b5`, [], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m7b5b9`, ['b9'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m7b5b13`, ['b13'], false),
    buildVariant(root, third, fifth, seventh, gt, `${rn}m7b5b9b13`, ['b9', 'b13'], false),
  ];
}

export function generateVariants(chord: ParsedChord, key: Key, context: FunctionalContext): ChordVariant[] {
  const assignment = assignChordScale(chord, key, context);
  const root = getRootPitchClass(chord);
  const rn = chord.root;
  const third = getThird(root, chord.quality);
  const seventh = getSeventh(root, chord.quality);
  const fifth = getFifth(root, chord.quality);
  const gt: [PitchClass, PitchClass] = [third, seventh];

  const q = chord.quality;
  const sn = assignment.scaleName;

  if (isMajorish(q)) {
    const same = majorVariants(rn, root, third, fifth, seventh, gt);
    const subs = generateSubstitutionVariants(chord, key, context);
    return [...same, ...subs];
  }

  if (isMinorish(q)) {
    const same = minorVariants(rn, root, third, fifth, seventh, gt);
    const subs = generateSubstitutionVariants(chord, key, context);
    return [...same, ...subs];
  }

  if (q === 'dominant7') {
    if (sn === 'altered') {
      const same = alteredVariants(rn, root, third, fifth, seventh, gt);
      const subs = generateSubstitutionVariants(chord, key, context);
      return [...same, ...subs];
    }
    if (sn === 'phrygianDominant') {
      const same = dominantMinorVariants(rn, root, third, fifth, seventh, gt);
      const subs = generateSubstitutionVariants(chord, key, context);
      return [...same, ...subs];
    }
    const same = dominantMajorVariants(rn, root, third, fifth, seventh, gt);
    const subs = generateSubstitutionVariants(chord, key, context);
    return [...same, ...subs];
  }

  if (q === 'halfDiminished') {
    const same = halfDimVariants(rn, root, third, fifth, seventh, gt);
    const subs = generateSubstitutionVariants(chord, key, context);
    return [...same, ...subs];
  }

  if (q === 'diminished7') {
    return [
      buildVariant(root, third, fifth, seventh, gt, `${rn}dim7`, [], false),
    ];
  }

  return [
    buildVariant(root, third, fifth, seventh, gt, `${rn}`, [], false),
  ];
}
