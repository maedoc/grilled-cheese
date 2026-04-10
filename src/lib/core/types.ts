export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface Note {
  letter: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
  accidental: '' | '#' | 'b' | '##' | 'bb';
  pitchClass: PitchClass;
}

export type ChordQuality =
  | 'major'
  | 'major6'
  | 'major7'
  | 'minor'
  | 'minor6'
  | 'minor7'
  | 'minorMajor7'
  | 'dominant7'
  | 'diminished'
  | 'diminished7'
  | 'augmented'
  | 'augmented7'
  | 'augmentedMajor7'
  | 'halfDiminished'
  | 'suspended4'
  | 'suspended2'
  | 'power';

export type Mode = 'major' | 'minor';

export interface Key {
  tonic: string;
  mode: Mode;
  pitchClass: PitchClass;
}

export type Extension = '9' | '11' | '13';
export type Alteration = 'b5' | '#5' | 'b9' | '#9' | '#11' | 'b13';
export type AddedTone = 'add9' | 'add11' | '6' | '69';
export type Suspension = 'sus2' | 'sus4';

export interface ParsedChord {
  symbol: string;
  root: string;
  bass: string | null;
  quality: ChordQuality;
  extensions: Extension[];
  alterations: Alteration[];
  addedTones: AddedTone[];
  suspensions: Suspension[];
  omits: string[];
  pitchClasses: PitchClass[];
}

export type SubstitutionCategory =
  | 'same-root'
  | 'tritone-substitute'
  | 'dim7-equivalent'
  | 'm6-on-fifth'
  | 'm6-enharmonic'
  | 'm7-sus-substitute'
  | 'augmented-dominant'
  | 'relative-major6'
  | 'relative-major7'
  | 'relative-minor6'
  | 'iii-for-I'
  | 'vi9-for-I'
  | 'm6-on-third'
  | 'halfdim-to-m6'
  | 'halfdim-to-m7'
  | 'm7-on-fifth'
  | 'pc-overlap';

export type GuideToneMatch = 'exact' | 'near-miss';

export type HarmonicFunction = 'tonic' | 'subdominant' | 'dominant' | 'predominant';

export interface RomanNumeralAnalysis {
  figure: string;
  scaleDegree: number;
  quality: ChordQuality;
  harmonicFunction: HarmonicFunction;
  type: 'diatonic' | 'secondary' | 'borrowed';
  secondaryTarget?: string;
}

export interface ChordScaleAssignment {
  scaleName: string;
  scalePitches: PitchClass[];
  availableTensions: Alteration[];
  avoidNotes: PitchClass[];
}

export interface ChordVariant {
  symbol: string;
  pitchClasses: PitchClass[];
  guideTones: [PitchClass, PitchClass];
  extensions: string[];
  category: SubstitutionCategory;
  originalRoot: PitchClass;
  guideToneMatch: GuideToneMatch;
}

export interface MatrixColumn {
  originalSymbol: string;
  parsedChord: ParsedChord;
  romanAnalysis: RomanNumeralAnalysis;
  chordScale: ChordScaleAssignment;
  variants: ChordVariant[];
}

export interface VoiceLeadingDistance {
  fromVariant: number;
  toVariant: number;
  totalDistance: number;
  voiceMovements: number[];
}

export interface VoiceLeadingPath {
  variantIndices: number[];
  totalDistance: number;
  voiceMovementsPerColumn: number[][];
}

export interface VoiceLeadingMatrix {
  columns: MatrixColumn[];
  distances: VoiceLeadingDistance[][][];
  paths: VoiceLeadingPath[];
  findOptimalPath(): VoiceLeadingPath;
  findGreedyPath(startRow?: number): VoiceLeadingPath;
  findOptimalPaths(n: number): VoiceLeadingPath[];
  findOptimalPathFrom(col: number, row: number): VoiceLeadingPath;
  reanchorFrom(col: number, row: number, n: number): VoiceLeadingPath[];
}
