# Grilled Cheese

A web app that helps jazz musicians explore **voice leading paths** through chord progressions.

Enter chord symbols and a song key, and the app generates a **matrix of voice-leading paths** — each row is a complete path through the progression, sorted by total voice-leading displacement. Click any cell to re-anchor all paths from that chord choice and see the smoothest substitutions in real time.

## Quick Start

```
npm install
npm run dev        # dev server at localhost:5173
npm test           # run 435 tests
npm run build      # library build
```

## Architecture

```
src/
  lib/             # Pure TypeScript music theory library
    core/          # Types, constants, pitch-class math
    chord/         # Chord parsing and construction
    harmony/       # Key analysis, Roman numerals, functional harmony
    chord-scale/   # Chord-scale mapping, tensions, avoid notes
    variants/      # Same-root + cross-root substitution generation
    voicing/       # Voicing extraction, distance computation, path finding
    matrix/        # Matrix assembly and public API
    index.ts       # Re-exports
  web/             # HTML UI (view + controller)
    main.ts
    controller.ts
    view.ts
    styles.css
tests/             # Vitest specs mirroring src/lib/ structure
index.html         # Web app entry point
```

### Library Modules

| Module | Purpose |
|--------|---------|
| `core/types.ts` | Shared types: `PitchClass`, `ChordVariant`, `VoiceLeadingMatrix`, etc. |
| `core/constants.ts` | Scale/chord lookup tables, pitch-class math, permutation generator |
| `chord/parser.ts` | Chord symbol parsing via `chord-symbol` |
| `chord/builder.ts` | Pitch class construction, guide tone extraction |
| `harmony/` | Key context, Roman numeral analysis, functional harmony |
| `chord-scale/mapper.ts` | Assigns scales (Dorian, Mixolydian, Altered, etc.) |
| `variants/generator.ts` | Same-root voicing variants |
| `variants/substitutions.ts` | Cross-root substitutions via pitch-class overlap |
| `variants/filter.ts` | Ranking and filtering (30-variant cap) |
| `voicing/voicing.ts` | Extracts 4-note voicings from chord variants |
| `voicing/distance.ts` | Voice-leading distance with repetition + extension penalties |
| `voicing/path.ts` | Viterbi-style optimal path finding with diversity |
| `matrix/matrix.ts` | Assembles the full matrix: columns, distances, paths |

## Voice Leading Model

- **Voicing**: 4 notes extracted per chord variant (root, guide tones, fifth or extension)
- **Distance**: Brute-force minimum over all 24 voice permutations, using circular semitone distance
- **Repetition penalty**: +20 semitones when consecutive voicings are identical (prevents static paths)
- **Extension penalty**: +1 per extension on both chords
- **Path finding**: Viterbi dynamic programming with diversity penalty (+5) for previously used variants
- **Substitutions**: Pitch-class overlap against chord scale (7-note), minimum 2 shared PCs

## Dependencies

- [`@tonaljs/tonal`](https://github.com/tonaljs/tonal) — Pitch/interval math
- [`chord-symbol`](https://github.com/no-chris/chord-symbol) — Chord symbol parsing
- TypeScript strict mode, Vite, Vitest
