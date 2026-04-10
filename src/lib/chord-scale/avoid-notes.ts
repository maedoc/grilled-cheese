import type { PitchClass } from '../core/types.js';

export function detectAvoidNotes(chordTones: PitchClass[], scalePitches: PitchClass[]): PitchClass[] {
  const avoid: PitchClass[] = [];

  for (const sp of scalePitches) {
    if (chordTones.includes(sp)) continue;

    for (const ct of chordTones) {
      const diff = ((sp - ct) % 12 + 12) % 12;
      if (diff === 1) {
        avoid.push(sp);
        break;
      }
    }
  }

  return avoid.sort((a, b) => a - b);
}
