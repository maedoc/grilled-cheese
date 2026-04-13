export {
  PITCH_CLASS_SHARPS,
  PITCH_CLASS_FLATS,
  MAJOR_SCALE_SEMITONES,
  MINOR_SCALE_SEMITONES,
  HARMONIC_MINOR_SEMITONES,
  MELODIC_MINOR_SEMITONES,
  MAJOR_KEY_SEVENTH_QUALITIES,
  MINOR_KEY_SEVENTH_QUALITIES,
  MAJOR_KEY_FUNCTIONS,
  MINOR_KEY_FUNCTIONS,
  CHORD_QUALITY_INTERVALS,
  ROMAN_NUMERALS,
  CHORD_SCALES,
  noteToPitchClass,
  pitchClassToNote,
  pitchClassToChordRoot,
  intervalBetween,
  transposePitchClass,
  chordToPitchClasses,
  isSamePitchClass,
  minSemitoneDistance,
  scaleToPitchClasses,
  isPitchClassInSet,
  getScaleDegree,
  permutations,
} from './core/constants.js';

export type {
  PitchClass,
  Note,
  ChordQuality,
  Mode,
  Key,
  Extension,
  Alteration,
  AddedTone,
  Suspension,
  ParsedChord,
  HarmonicFunction,
  RomanNumeralAnalysis,
  ChordScaleAssignment,
  ChordVariant,
  SubstitutionCategory,
  GuideToneMatch,
  MatrixColumn,
  VoiceLeadingDistance,
  VoiceLeadingPath,
  VoiceLeadingMatrix,
} from './core/types.js';

export { parseChord } from './chord/parser.js';
export {
  buildPitchClasses,
  buildGuideTones,
  getThird,
  getSeventh,
  getFifth,
  getRootPitchClass,
  EXTENSION_SEMITONES,
  ALTERATION_SEMITONES,
} from './chord/builder.js';
export {
  detectQuality,
  matchesQuality,
  getCanonicalIntervals,
} from './chord/quality.js';

export {
  createKey,
  getKeyScalePitches,
  getScalePitch,
  getDiatonicSeventhChord,
  getDiatonicQuality,
  isDiatonic,
  getDegreeInKey,
} from './harmony/key.js';

export {
  analyzeRomanNumeral,
  formatRomanFigure,
  expectedQualityAtDegree,
} from './harmony/roman.js';

export {
  getHarmonicFunction,
  resolvesToMajor,
  getFunctionalContext,
} from './harmony/function.js';
export type { FunctionalContext } from './harmony/function.js';

export {
  detectSecondaryDominant,
  getSecondaryDominants,
  isPerfectFifthAbove,
} from './harmony/secondary.js';
export type { SecondaryDominantInfo } from './harmony/secondary.js';

export { assignChordScale } from './chord-scale/mapper.js';
export { getAvailableTensionPcs } from './chord-scale/tensions.js';
export { detectAvoidNotes } from './chord-scale/avoid-notes.js';

export { generateVariants } from './variants/generator.js';
export { generateSubstitutionVariants } from './variants/substitutions.js';
export { rankVariants, filterCommonVariants } from './variants/filter.js';

export { extractVoicing } from './voicing/voicing.js';
export { computeDistance, computeDistanceMatrix } from './voicing/distance.js';
export { findOptimalPath, findGreedyPath, findOptimalPaths, findOptimalPathFrom, findOptimalPathsFrom } from './voicing/path.js';

export { generateMatrix } from './matrix/matrix.js';
export type { GenerateMatrixOptions } from './matrix/matrix.js';
