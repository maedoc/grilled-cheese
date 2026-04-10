// @ts-expect-error chord-symbol lacks ESM type declarations
import { chordParserFactory } from 'chord-symbol/lib/chord-symbol-esm.js';
import type { ChordQuality, Alteration, Extension, AddedTone, Suspension, PitchClass, ParsedChord } from '../core/types.js';
import { noteToPitchClass, CHORD_QUALITY_INTERVALS, transposePitchClass } from '../core/constants.js';
import { detectQuality } from './quality.js';

const parse = chordParserFactory();

const QUALITY_MAP: Record<string, ChordQuality> = {
  major: 'major',
  minor: 'minor',
  major7: 'major7',
  minor7: 'minor7',
  dominant7: 'dominant7',
  diminished7: 'diminished7',
  diminished: 'diminished',
  augmented: 'augmented',
  major6: 'major6',
  minor6: 'minor6',
  minorMajor7: 'minorMajor7',
  power: 'power',
};

function mapExtensions(exts: string[]): Extension[] {
  const result: Extension[] = [];
  for (const e of exts) {
    if (e === '9' || e === '11' || e === '13') result.push(e);
  }
  return result;
}

function mapAlterations(alts: string[]): Alteration[] {
  const valid: Alteration[] = ['b5', '#5', 'b9', '#9', '#11', 'b13'];
  return alts.filter((a): a is Alteration => valid.includes(a as Alteration));
}

function mapAddedTones(_adds: string[], symbol: string): AddedTone[] {
  const result: AddedTone[] = [];
  const lower = symbol.toLowerCase();

  if (lower.includes('69') && !lower.includes('add9')) {
    result.push('69');
    return result;
  }

  if (/add11/i.test(symbol)) {
    result.push('add11');
  } else if (/add9/i.test(symbol)) {
    result.push('add9');
  }

  return result;
}

function mapSuspensions(
  isSuspended: boolean,
  semitones: number[],
  omits: string[],
  adds: string[],
): Suspension[] {
  const result: Suspension[] = [];
  const normalized = semitones.map(s => ((s % 12) + 12) % 12);

  if (isSuspended) {
    if (normalized.includes(5)) result.push('sus4');
    else if (normalized.includes(2)) result.push('sus2');
  } else if (omits.includes('3') && (adds.includes('9') || normalized.includes(2))) {
    result.push('sus2');
  }

  return result;
}

function resolveQuality(
  csQuality: string,
  semitones: number[],
  isSuspended: boolean,
  alterations: string[],
  omits: string[],
  adds: string[],
): ChordQuality {
  if (csQuality === 'minor7' && alterations.includes('b5')) {
    return 'halfDiminished';
  }

  if (isSuspended) {
    const normalized = semitones.map(s => ((s % 12) + 12) % 12);
    const has7th = normalized.includes(9) || normalized.includes(10) || normalized.includes(11);

    if (normalized.includes(5)) {
      if (has7th) return 'dominant7';
      return 'suspended4';
    }
    if (normalized.includes(2)) {
      return 'suspended2';
    }
    if (!has7th) return 'suspended4';
    return 'dominant7';
  }

  if (omits.includes('3') && adds.includes('9')) {
    return 'suspended2';
  }

  const mapped = QUALITY_MAP[csQuality];
  if (mapped) return mapped;

  const normalized = semitones.map(s => ((s % 12) + 12) % 12);
  return detectQuality(normalized);
}

function computePitchClasses(
  root: PitchClass,
  quality: ChordQuality,
  extensions: Extension[],
  alterations: Alteration[],
  addedTones: AddedTone[],
  suspensions: Suspension[],
): PitchClass[] {
  const intervals = [...CHORD_QUALITY_INTERVALS[quality]];

  if (suspensions.includes('sus4')) {
    const idx3 = intervals.indexOf(4);
    if (idx3 !== -1) intervals[idx3] = 5;
    else {
      const idx3b = intervals.indexOf(3);
      if (idx3b !== -1) intervals[idx3b] = 5;
    }
  }
  if (suspensions.includes('sus2')) {
    const idx3 = intervals.indexOf(4);
    if (idx3 !== -1) intervals[idx3] = 2;
    else {
      const idx3b = intervals.indexOf(3);
      if (idx3b !== -1) intervals[idx3b] = 2;
    }
  }

  for (const alt of alterations) {
    switch (alt) {
      case 'b5': {
        const idx = intervals.indexOf(7);
        if (idx !== -1) intervals[idx] = 6;
        else intervals.push(6);
        break;
      }
      case '#5': {
        const idx = intervals.indexOf(7);
        if (idx !== -1) intervals[idx] = 8;
        else intervals.push(8);
        break;
      }
    }
  }

  for (const ext of extensions) {
    const semi = ext === '9' ? 14 : ext === '11' ? 17 : 21;
    intervals.push(semi);
  }

  for (const add of addedTones) {
    switch (add) {
      case 'add9': intervals.push(14); break;
      case 'add11': intervals.push(17); break;
      case '6': intervals.push(9); break;
      case '69': intervals.push(9, 14); break;
    }
  }

  for (const alt of alterations) {
    switch (alt) {
      case 'b9': intervals.push(13); break;
      case '#9': intervals.push(15); break;
      case '#11': intervals.push(18); break;
      case 'b13': intervals.push(20); break;
    }
  }

  const pcs = intervals.map(i => {
    const mod = ((i % 12) + 12) % 12;
    return transposePitchClass(root, mod) as PitchClass;
  });

  return [...new Set(pcs)].sort((a, b) => a - b);
}

export function parseChord(symbol: string): ParsedChord {
  const result = parse(symbol);

  if ('error' in result) {
    throw new Error(`Failed to parse chord: "${symbol}" - ${result.error.map((e: { message: string }) => e.message).join(', ')}`);
  }

  const { input, normalized } = result;
  const root = input.rootNote;
  const bass = input.bassNote || null;

  const extensions = mapExtensions(normalized.extensions);
  const alterations = mapAlterations(normalized.alterations);
  const addedTones = mapAddedTones(normalized.adds, symbol);
  const suspensions = mapSuspensions(normalized.isSuspended, normalized.semitones, normalized.omits, normalized.adds);
  const quality = resolveQuality(normalized.quality, normalized.semitones, normalized.isSuspended, normalized.alterations, normalized.omits, normalized.adds);

  const rootPc = noteToPitchClass(root);
  const pitchClasses = computePitchClasses(rootPc, quality, extensions, alterations, addedTones, suspensions);

  return {
    symbol,
    root,
    bass,
    quality,
    extensions,
    alterations,
    addedTones,
    suspensions,
    omits: normalized.omits,
    pitchClasses,
  };
}
