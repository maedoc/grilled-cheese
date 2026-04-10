import { describe, it, expect } from 'vitest';
import type { ChordVariant } from '@grilled-cheese/lib';
import { extractVoicing } from '../../src/lib/voicing/voicing.js';

function makeVariant(overrides: Partial<ChordVariant> & Pick<ChordVariant, 'symbol' | 'pitchClasses' | 'guideTones'>): ChordVariant {
  return {
    extensions: [],
    ...overrides,
  };
}

describe('extractVoicing', () => {
  it('extracts 4-voice voicing from Cmaj7', () => {
    const variant = makeVariant({
      symbol: 'Cmaj7',
      pitchClasses: [0, 4, 7, 11],
      guideTones: [4, 11],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toHaveLength(4);
    expect(voicing).toContain(0);
    expect(voicing).toContain(4);
    expect(voicing).toContain(11);
  });

  it('extracts 4-voice voicing from Dm7', () => {
    const variant = makeVariant({
      symbol: 'Dm7',
      pitchClasses: [0, 2, 5, 9],
      guideTones: [5, 0],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toHaveLength(4);
    expect(voicing).toContain(2);
    expect(voicing).toContain(5);
    expect(voicing).toContain(0);
  });

  it('extracts 4-voice voicing from G7', () => {
    const variant = makeVariant({
      symbol: 'G7',
      pitchClasses: [2, 5, 7, 11],
      guideTones: [11, 5],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toHaveLength(4);
    expect(voicing).toContain(7);
    expect(voicing).toContain(11);
    expect(voicing).toContain(5);
  });

  it('extracts 4-voice voicing from Bm7b5', () => {
    const variant = makeVariant({
      symbol: 'Bm7b5',
      pitchClasses: [2, 5, 9, 11],
      guideTones: [2, 9],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toHaveLength(4);
    expect(voicing).toContain(11);
    expect(voicing).toContain(2);
    expect(voicing).toContain(9);
  });

  it('always includes both guide tones', () => {
    const variant = makeVariant({
      symbol: 'Em7',
      pitchClasses: [2, 4, 7, 11],
      guideTones: [7, 2],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toContain(7);
    expect(voicing).toContain(2);
  });

  it('returns sorted ascending pitch classes', () => {
    const variant = makeVariant({
      symbol: 'Cmaj7',
      pitchClasses: [0, 4, 7, 11],
      guideTones: [4, 11],
    });
    const voicing = extractVoicing(variant);
    for (let i = 1; i < voicing.length; i++) {
      expect(voicing[i]!).toBeGreaterThanOrEqual(voicing[i - 1]!);
    }
  });

  it('includes extension pitch class for chord with extensions', () => {
    const variant = makeVariant({
      symbol: 'Dm9',
      pitchClasses: [0, 2, 4, 5, 9],
      guideTones: [5, 0],
      extensions: ['9'],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toContain(4);
    expect(voicing).toHaveLength(4);
  });

  it('includes b9 extension for dominant chord', () => {
    const variant = makeVariant({
      symbol: 'G7b9',
      pitchClasses: [2, 5, 7, 8, 11],
      guideTones: [11, 5],
      extensions: ['b9'],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toContain(8);
    expect(voicing).toHaveLength(4);
  });

  it('includes 13 extension for dominant chord', () => {
    const variant = makeVariant({
      symbol: 'G13',
      pitchClasses: [2, 4, 5, 7, 9, 11],
      guideTones: [11, 5],
      extensions: ['9', '13'],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toContain(4);
    expect(voicing).toHaveLength(4);
  });

  it('uses 5th when no extensions', () => {
    const variant = makeVariant({
      symbol: 'C7',
      pitchClasses: [0, 4, 7, 10],
      guideTones: [4, 10],
    });
    const voicing = extractVoicing(variant);
    expect(voicing).toContain(7);
    expect(voicing).toContain(0);
    expect(voicing).toContain(4);
    expect(voicing).toContain(10);
  });
});
