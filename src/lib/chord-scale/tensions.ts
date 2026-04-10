import type { ParsedChord, ChordScaleAssignment, PitchClass } from '../core/types.js';
import { getRootPitchClass, getThird, getSeventh, getFifth } from '../chord/builder.js';

export function getAvailableTensionPcs(chord: ParsedChord, assignment: ChordScaleAssignment): PitchClass[] {
  const root = getRootPitchClass(chord);
  const third = getThird(root, chord.quality);
  const fifth = getFifth(root, chord.quality);
  const seventh = getSeventh(root, chord.quality);
  const chordTones: PitchClass[] = [root, third, fifth, seventh];

  const tensions: PitchClass[] = [];

  for (const sp of assignment.scalePitches) {
    if (chordTones.includes(sp)) continue;
    if (assignment.avoidNotes.includes(sp)) continue;
    tensions.push(sp);
  }

  return tensions.sort((a, b) => a - b);
}
