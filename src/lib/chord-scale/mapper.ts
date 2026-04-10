import type { ParsedChord, Key, ChordScaleAssignment, PitchClass, Alteration } from '../core/types.js';
import type { FunctionalContext } from '../harmony/function.js';
import { CHORD_SCALES, scaleToPitchClasses } from '../core/constants.js';
import { getRootPitchClass, getThird, getSeventh, getFifth } from '../chord/builder.js';
import { getDegreeInKey } from '../harmony/key.js';
import { detectAvoidNotes } from './avoid-notes.js';

function getChordTones(chord: ParsedChord): PitchClass[] {
  const root = getRootPitchClass(chord);
  const third = getThird(root, chord.quality);
  const fifth = getFifth(root, chord.quality);
  const seventh = getSeventh(root, chord.quality);
  return [root, third, fifth, seventh];
}

function buildAssignment(
  chord: ParsedChord,
  scaleName: string,
  tensions: Alteration[],
): ChordScaleAssignment {
  const root = getRootPitchClass(chord);
  const scaleIntervals = CHORD_SCALES[scaleName];
  const scalePitches = scaleToPitchClasses(root, scaleIntervals!);
  const chordTones = getChordTones(chord);
  const avoidNotes = detectAvoidNotes(chordTones, scalePitches);

  return {
    scaleName,
    scalePitches,
    availableTensions: tensions,
    avoidNotes,
  };
}

function hasAlteration(chord: ParsedChord, alt: Alteration): boolean {
  return chord.alterations.includes(alt);
}

function isDegree(chord: ParsedChord, key: Key, degree: number): boolean {
  const root = getRootPitchClass(chord);
  const d = getDegreeInKey(root, key);
  return d === degree;
}

export function assignChordScale(chord: ParsedChord, key: Key, context: FunctionalContext): ChordScaleAssignment {
  const quality = chord.quality;

  if (quality === 'major7' || quality === 'major6' || quality === 'major') {
    return assignMajor(chord, key, context);
  }

  if (quality === 'minor7' || quality === 'minor6' || quality === 'minor' || quality === 'minorMajor7') {
    return assignMinor(chord, key, context);
  }

  if (quality === 'dominant7') {
    return assignDominant(chord, key, context);
  }

  if (quality === 'halfDiminished') {
    return assignHalfDiminished(chord, key);
  }

  if (quality === 'diminished7') {
    return buildAssignment(chord, 'wholeHalfDim', ['b9', '11', 'b13'] as Alteration[]);
  }

  if (quality === 'augmented' || quality === 'augmented7' || quality === 'augmentedMajor7') {
    return buildAssignment(chord, 'wholeTone', []);
  }

  if (quality === 'suspended4' || quality === 'suspended2') {
    return buildAssignment(chord, 'mixolydian', []);
  }

  return buildAssignment(chord, 'ionian', []);
}

function assignMajor(chord: ParsedChord, key: Key, context: FunctionalContext): ChordScaleAssignment {
  if (hasAlteration(chord, '#11')) {
    return buildAssignment(chord, 'lydian', ['#11']);
  }

  if (context.harmonicFunction === 'subdominant' && isDegree(chord, key, 4)) {
    return buildAssignment(chord, 'lydian', ['#11']);
  }

  if (context.harmonicFunction === 'tonic' && isDegree(chord, key, 1)) {
    return buildAssignment(chord, 'ionian', ['#11']);
  }

  return buildAssignment(chord, 'lydian', ['#11']);
}

function assignMinor(chord: ParsedChord, key: Key, context: FunctionalContext): ChordScaleAssignment {
  if (context.harmonicFunction === 'subdominant' && isDegree(chord, key, 2)) {
    return buildAssignment(chord, 'dorian', []);
  }

  if (context.harmonicFunction === 'tonic' && isDegree(chord, key, 6)) {
    return buildAssignment(chord, 'aeolian', []);
  }

  if (context.harmonicFunction === 'tonic' && isDegree(chord, key, 3)) {
    return buildAssignment(chord, 'phrygian', []);
  }

  if (key.mode === 'minor' && isDegree(chord, key, 1)) {
    return buildAssignment(chord, 'dorian', []);
  }

  if (key.mode === 'minor' && isDegree(chord, key, 4)) {
    return buildAssignment(chord, 'dorian', []);
  }

  return buildAssignment(chord, 'dorian', []);
}

function assignDominant(chord: ParsedChord, key: Key, context: FunctionalContext): ChordScaleAssignment {
  if (hasAlteration(chord, '#11')) {
    return buildAssignment(chord, 'lydianDominant', ['#9', '#11']);
  }

  if (hasAlteration(chord, 'b9') || hasAlteration(chord, '#9') || hasAlteration(chord, 'b13')) {
    return buildAssignment(chord, 'altered', ['b9', '#9', '#11', 'b13']);
  }

  const isV = isDegree(chord, key, 5);
  const isSecDom = context.isSecondaryDominant;

  if (isV && !isSecDom) {
    if (context.resolvesToMajor === false) {
      return buildAssignment(chord, 'phrygianDominant', ['b9', '#9', 'b13']);
    }
    return buildAssignment(chord, 'mixolydian', []);
  }

  if (isSecDom) {
    if (context.resolvesToMajor === false) {
      return buildAssignment(chord, 'phrygianDominant', ['b9', '#9', 'b13']);
    }
    return buildAssignment(chord, 'mixolydian', []);
  }

  return buildAssignment(chord, 'mixolydian', []);
}

function assignHalfDiminished(chord: ParsedChord, key: Key): ChordScaleAssignment {
  if (isDegree(chord, key, 7)) {
    return buildAssignment(chord, 'locrian', ['b9', 'b13']);
  }
  return buildAssignment(chord, 'locrian', ['b9', 'b13']);
}
