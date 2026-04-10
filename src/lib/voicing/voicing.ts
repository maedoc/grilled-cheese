import type { ChordVariant, PitchClass } from '../core/types.js';
import { noteToPitchClass } from '../core/constants.js';

export function parseRootFromSymbol(symbol: string): PitchClass {
  if (symbol.length > 1 && (symbol[1] === '#' || symbol[1] === 'b')) {
    return noteToPitchClass(symbol.slice(0, 2));
  }
  return noteToPitchClass(symbol[0]!);
}

function getFifthPc(variant: ChordVariant, root: PitchClass): PitchClass | null {
  for (const interval of [7, 6, 8] as const) {
    const pc = ((root + interval) % 12) as PitchClass;
    if (variant.pitchClasses.includes(pc)) return pc;
  }
  return null;
}

const EXTENSION_INTERVAL: Record<string, number> = {
  'b9': 1, '9': 2, '#9': 3, '11': 5, '#11': 6, 'b13': 8, '13': 9,
};

export function extractVoicing(variant: ChordVariant): PitchClass[] {
  const root = parseRootFromSymbol(variant.symbol);
  const pcs = new Set<PitchClass>();

  pcs.add(variant.guideTones[0]);
  pcs.add(variant.guideTones[1]);
  pcs.add(root);

  if (variant.extensions.length > 0) {
    const lastExt = variant.extensions[variant.extensions.length - 1]!;
    const interval = EXTENSION_INTERVAL[lastExt];
    if (interval !== undefined) {
      const extPc = ((root + interval) % 12) as PitchClass;
      pcs.add(extPc);
    }
  }

  if (pcs.size < 4) {
    const fifth = getFifthPc(variant, root);
    if (fifth !== null) pcs.add(fifth);
  }

  if (pcs.size < 4) {
    for (const pc of variant.pitchClasses) {
      if (pcs.size >= 4) break;
      pcs.add(pc);
    }
  }

  const result = [...pcs].sort((a, b) => a - b);

  while (result.length < 4) {
    result.push(root);
  }

  return result.slice(0, 4);
}
