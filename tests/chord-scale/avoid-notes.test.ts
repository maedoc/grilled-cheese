import { describe, it, expect } from 'vitest';
import { detectAvoidNotes } from '@grilled-cheese/lib';

describe('detectAvoidNotes', () => {
  it('Cmaj7 (C,E,G,B) in Ionian (C,D,E,F,G,A,B) → avoid: F', () => {
    const chordTones = [0, 4, 7, 11] as const;
    const scale = [0, 2, 4, 5, 7, 9, 11];
    expect(detectAvoidNotes([...chordTones], scale)).toEqual([5]);
  });

  it('Cmaj7 in Lydian (C,D,E,F#,G,A,B) → avoid: none', () => {
    const chordTones = [0, 4, 7, 11] as const;
    const scale = [0, 2, 4, 6, 7, 9, 11];
    expect(detectAvoidNotes([...chordTones], scale)).toEqual([]);
  });

  it('Dm7 (D,F,A,C) in Dorian (D,E,F,G,A,B,C) → avoid: none', () => {
    const chordTones = [2, 5, 9, 0] as const;
    const scale = [2, 4, 5, 7, 9, 11, 0];
    expect(detectAvoidNotes([...chordTones], scale)).toEqual([]);
  });

  it('G7 (G,B,D,F) in Mixolydian (G,A,B,C,D,E,F) → avoid: C', () => {
    const chordTones = [7, 11, 2, 5] as const;
    const scale = [7, 9, 11, 0, 2, 4, 5];
    expect(detectAvoidNotes([...chordTones], scale)).toEqual([0]);
  });

  it('Bm7b5 (B,D,F,A) in Locrian (B,C,D,Eb,F,G,Ab) → avoid: C, Eb', () => {
    const chordTones = [11, 2, 5, 9] as const;
    const scale = [11, 0, 2, 3, 5, 7, 8];
    expect(detectAvoidNotes([...chordTones], scale)).toEqual([0, 3]);
  });

  it('returns empty when chord tones and scale have no minor 9th conflicts', () => {
    const chordTones = [0, 4, 7, 11] as const;
    const scale = [0, 2, 4, 6, 7, 9, 11];
    expect(detectAvoidNotes([...chordTones], scale)).toEqual([]);
  });

  it('handles multiple avoid notes', () => {
    const chordTones = [0, 3, 7] as const;
    const scale = [0, 1, 2, 3, 4, 7, 8];
    expect(detectAvoidNotes([...chordTones], scale)).toEqual([1, 4, 8]);
  });
});
