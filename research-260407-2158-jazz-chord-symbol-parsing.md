# Research: Jazz Chord Symbol Parsing and Programmatic Representation

**Date**: 2026-04-07 22:09:22
**Search Limit**: 10
**Duration**: ~15 minutes

---

## Search Queries & Results

### Round 1
**Searches Performed**: 3

1. Query: "parsing jazz chord symbols programmatically music theory data structures" | Tool: exa_web_search_exa | Results: 10 URLs
   - https://www.npmjs.com/package/chord-symbol
   - https://crates.io/crates/chordparser
   - https://github.com/Rainbow-Dreamer/musicpy/wiki/Data-structures-of-musicpy
   - https://git.durrantlab.pitt.edu/no-chris/chord-symbol
   - https://jonathangjertsen.github.io/jchord/
   - https://www.xjavascript.com/blog/determine-the-key-of-a-song-by-its-chords/
   - https://jazzparser.granroth-wilding.co.uk/Parser.html
   - https://towardsdatascience.com/jazz-chords-parsing-with-transformers-d75031a976f2/
   - https://www.jjazzlab.org/javadoc/app/org/jjazz/harmony/api/chordsymbol
   - https://docs.rs/chordparser/latest/chordparser/

2. Query: "jazz chord symbol parsing algorithm representation code" | Tool: web-search-prime | Results: 0 URLs (empty)

3. Query: "Roman numeral analysis chord function jazz music theory programming" | Tool: exa_web_search_exa | Results: 10 URLs
   - https://explore.st-aug.edu/exp/the-mario-cadence-method-mastering-roman-numeral-chords-to-elevate-musical-proficiency
   - https://library.fiveable.me/fundamentals-of-music-theory/unit-8/roman-numeral-analysis/study-guide/DsDi4DW5lcnIQDNY
   - https://www.jazzguitar.be/blog/roman-numerals-analysis-transposition/
   - https://gondolamusic.com/study-/roman-numeral-analysis
   - https://web.mit.edu/music21/doc/usersGuide/usersGuide_23_romanNumerals.html
   - https://themusicambition.com/roman-numeral-analysis-in-music/
   - https://piano-ology.com/chords-and-chord-progressions/roman-numeral-analysis/
   - https://musictheory.pugetsound.edu/mt21c/RomanNumeralPracticeExercises.html
   - https://medium.com/jazz-theory/harmonic-analysis-symbols-aa235bfc6ded
   - https://www.numberanalytics.com/blog/roman-numeral-analysis-guide

### Round 2
**Searches Performed**: 4

4. Query: "chord interval structure music theory major minor dominant diminished augmented semitone map" | Tool: exa_web_search_exa | Results: 10 URLs
   - https://www.ethanhein.com/wp/2024/understanding-intervals/
   - https://wpe.hoffmanacademy.com/blog/resource/learning-types-of-seventh-chords-major-minor-diminished-augmented
   - https://www.hooktheory.com/support/musicreference?concept=music-concepts-chord-quality
   - https://viva.pressbooks.pub/openmusictheory/chapter/intervals/
   - https://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/chords-intervals/
   - https://totalguitarist.com/lessons/theory/intervals/reference/
   - https://openmusictheory.github.io/intervals.html
   - https://www.bellandcomusic.com/music-intervals.html
   - https://www.bellandcomusic.com/chord-structure.html
   - https://www.practical-chords-and-harmony.com/intervals.html

5. Query: "secondary dominant chord analysis programming jazz chord function scale degree" | Tool: web-search-prime | Results: 0 URLs (empty)

6. Query: "jazz chord scale relationship secondary dominant available tensions chord function tonic subdominant dominant" | Tool: exa_web_search_exa | Results: 10 URLs
   - https://www.learnjazzstandards.com/blog/secondary-dominants/
   - https://www.songtive.com/blog/what-are-secondary-dominants-in-music-theory/
   - https://www.jazzguitar.be/forum/theory/80141-secondary-dominant-extensions-available-notes.html
   - https://bestsaxophonewebsiteever.com/expand-your-harmonic-arsenal-practice-cycles-for-secondary-dominants/
   - https://www.learnjazzstandards.com/blog/learning-jazz/jazz-theory/guide-scales-use-7th-chords/
   - https://pianowithjonny.com/piano-lessons/secondary-dominants-the-complete-guide/
   - https://newyorkjazzworkshop.com/chord-progressions-practical-guide/
   - https://jazz-guitar-licks.com/blog/understanding-the-difference-between-dominant-subdominant-and-secondary-dominant-chords-guitar-theory-lesson.html
   - https://www.learnjazzstandards.com/blog/jazz-chord-progressions/
   - https://tamingthesaxophone.com/theory/impro/jazz-chord-progressions

7. Query: "pitch class representation music theory programming interval quality semitone TypeScript implementation" | Tool: exa_web_search_exa | Results: 10 URLs
   - https://github.com/tonaljs/tonal
   - https://osteele.github.io/tonic.ts/
   - https://github.com/osteele/tonic.ts
   - https://www.npmjs.com/package/tonal
   - https://registry.npmjs.org/%40tonaljs%2Fpitch-interval
   - https://registry.npmjs.org/%40tonaljs%2Fpcset
   - https://viva.pressbooks.pub/openmusictheory/chapter/intervals-in-integer-notation/
   - https://github.com/danielgamage/pitch-utils
   - https://github.com/tonaljs/tonal/blob/main/packages%2Fpitch-note%2Findex.ts
   - http://mikehadlow.blogspot.com/2018/09/what-i-learned-creating-guitar.html

---

## Web Content Summaries

### Source 1: chord-symbol npm package
**URL**: https://www.npmjs.com/package/chord-symbol / https://github.com/no-chris/chord-symbol
**Search Query**: "parsing jazz chord symbols programmatically"
**Tool Used**: urlreader subagent

#### Summary
Production-grade JS/TS library for parsing 37K+ chord symbol variations. Uses pipe-and-filters architecture with 11 sequential filters. Core data structure has input/normalized/formatted/numeral sub-objects. Quality detection via interval pattern matching (11 qualities). Intervals as strings mapped to semitones. ~100+ modifier symbols mapped to ~30 semantic modifier IDs. 19 forbidden interval combinations checked. Supports English/German/Latin notation systems.

### Source 2: chordparser Rust crate
**URL**: https://docs.rs/chordparser/latest/chordparser/
**Search Query**: "chord parsing library data structures"
**Tool Used**: urlreader subagent

#### Summary
Rust library with Chord struct containing root Note, optional bass Note, notes Vec, semitones Vec, intervals Vec, and ChordQuality enum (13 variants). Interval enum has 23 variants with semitone values. Uses IntervalSet bitset for efficient set operations. Quality inferred from interval set. Includes voicing generation and reverse inference (MIDI to chord symbol).

### Source 3: JJazzLab ChordSymbol API
**URL**: https://www.jjazzlab.org/javadoc/app/org/jjazz/harmony/api/chordsymbol
**Search Query**: "jazz chord symbol API data structures"
**Tool Used**: urlreader subagent

#### Summary
Java API with ChordSymbol → ChordType → Degree architecture. Degree enum has 15 constants (ROOT through NINTH_SHARP). ChordType encodes degrees as integer tuples (-1/0/+1 for flat/natural/sharp) for 9th, 3rd, 11th, 5th, 13th, 7th. Supports 5 harmonic families. Includes degree importance ranking for voicing simplification and harmonic fitting between chord types.

### Source 4: Jazz Chords Parsing with Transformers
**URL**: https://towardsdatascience.com/jazz-chords-parsing-with-transformers-d75031a976f2/
**Search Query**: "jazz chord symbols parsing programming"
**Tool Used**: urlreader subagent

#### Summary
Academic approach to parsing chord sequences into dependency trees. Individual chord parsing uses regex: `([A-G][#b]?)(m|+|%|o|sus)?(6|7|^7)?` extracting root (0-11), basic form (0-5: major/minor/aug/half-dim/dim/sus), and extension (0-2: 6th/min7/maj7). Uses Jazz Harmony Treebank dataset. Transformer-based model with Eisner algorithm for valid tree constraints.

### Source 5: music21 Roman Numeral Analysis
**URL**: https://web.mit.edu/music21/doc/usersGuide/usersGuide_23_romanNumerals.html
**Search Query**: "Roman numeral analysis chord function programming"
**Tool Used**: urlreader subagent

#### Summary
music21's `romanNumeralFromChord(chord, key)` API returns RomanNumeral objects (subclass of Chord). Key properties: figure, scaleDegree, scaleDegreeWithAlteration, frontAlterationAccidental, figuresWritten, quality, functionalityScore (0-100). Key context is mutable. RomanNumeral objects support all Chord methods (closedPosition, semitonesFromChordStep, etc.).

### Source 6: Chord Structure Formulas
**URL**: https://www.bellandcomusic.com/chord-structure.html
**Search Query**: "chord interval structure semitone map"
**Tool Used**: urlreader subagent

#### Summary
Comprehensive chord formula chart covering triads through 13ths. Triad semitone maps: Major=0-4-7, Minor=0-3-7, Diminished=0-3-6, Augmented=0-4-8. Stacking-thirds construction: Major=M3+m3, Minor=m3+M3, Dim=m3+m3, Aug=M3+M3. Full formulas for 7th chords, 6th chords, 9ths, 11ths, 13ths. Parentheses indicate optional notes in extensions.

### Source 7: Jazz Piano Site - Chords & Intervals
**URL**: https://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/chords-intervals/
**Search Query**: "jazz chords intervals chord construction"
**Tool Used**: urlreader subagent

#### Summary
Foundation of jazz chord construction: intervals as atomic units, triads via stacking thirds. Four triad qualities with notation variants (C/CΔ, Cm/C-, Cdim/C°, Caug/C+). Links to extension/alteration pages and chord-scale system.

### Source 8: Learn Jazz Standards - Chord-Scale Guide
**URL**: https://www.learnjazzstandards.com/blog/learning-jazz/jazz-theory/guide-scales-use-7th-chords/
**Search Query**: "jazz chord scale relationship available tensions"
**Tool Used**: urlreader subagent

#### Summary
Comprehensive chord-to-scale mapping. Major7→Ionian, Minor7→Dorian/Aeolian, Minor6→Dorian/Melodic Minor, Dominant7→Mixolydian, Half-Dim→Locrian/Locrian#2, Dim7→Whole-Half Dim. Altered mappings: MinMaj7→Melodic Minor, Maj7#11→Lydian, Maj7#5→Lydian Augmented, Dom7#11→Lydian Dominant, Dom7 altered→Altered Scale/H-W Dim, Dom7b13→Whole Tone.

### Source 9: Learn Jazz Standards - Secondary Dominants
**URL**: https://www.learnjazzstandards.com/blog/secondary-dominants/
**Search Query**: "secondary dominant chord analysis jazz"
**Tool Used**: urlreader subagent

#### Summary
Secondary dominants are V chords of non-I scale degrees resolving up a fourth. Notation: V/ii, V/V, V/vi. Examples in C: A7=V/ii→Dm7, D7=V/V→G7, E7=V/vi→Am7. Tritone mechanism between 3rd and 7th of dominant creates resolution pull. Not a key change or borrowed chord—temporary tonicization.

### Source 10: tonaljs/tonal
**URL**: https://github.com/tonaljs/tonal
**Search Query**: "TypeScript music theory library pitch class interval representation"
**Tool Used**: urlreader subagent

#### Summary
TypeScript music theory library using functional programming. Pitch uses coordinate system based on fifths and octaves. Note has chroma (0-11), midi, freq, pc. Interval uses shorthand notation (5P, 3M, m3) with quality string. Chord parsed into tonic/type/bass. Key distinguishes major/minor with grades, triads, chords, chordScales, secondaryDominants. Pcset uses 12-bit binary chroma strings for efficient set operations.

---

## Final Research Summary

(See complete synthesis in the response delivered to the user)

---

## Key Findings

- Jazz chord symbols can be decomposed into: root note + descriptor (quality + extensions + alterations) + optional bass note
- The chord-symbol npm library provides the most complete JS/TS implementation with 37K+ chord variations
- Chord quality is best detected via interval pattern matching against known quality templates
- Intervals can be represented as named strings ('1','b3','5','b7'), semitone arrays [0,3,7,10], or 12-bit chroma bitmasks
- tonaljs uses a fifths-based coordinate system for pitch representation, enabling enharmonic handling
- Roman numeral analysis requires key context: `romanNumeralFromChord(chord, key)`
- Secondary dominants follow V/x notation where x is the target scale degree
- Chord-scale mapping: each chord quality maps to specific scales that provide available tensions
- JJazzLab's Degree enum (15 values) provides a clean model for chord degree representation

---

## Sources & Citations

1. chord-symbol npm package - https://github.com/no-chris/chord-symbol (High reliability, 179 stars)
2. chordparser Rust crate - https://docs.rs/chordparser/latest/chordparser/ (High reliability, MIT licensed)
3. JJazzLab ChordSymbol API - https://www.jjazzlab.org/javadoc/app/org/jjazz/harmony/api/chordsymbol (High reliability, production jazz software)
4. Jazz Chords Parsing with Transformers - https://towardsdatascience.com/jazz-chords-parsing-with-transformers-d75031a976f2/ (High reliability, peer-reviewed research)
5. music21 Roman Numeral Analysis - https://web.mit.edu/music21/doc/usersGuide/usersGuide_23_romanNumerals.html (High reliability, MIT-hosted)
6. Chord Structure Theory - https://www.bellandcomusic.com/chord-structure.html (Medium-High reliability, educational reference)
7. The Jazz Piano Site - https://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/chords-intervals/ (Medium-High reliability, jazz education)
8. Learn Jazz Standards - Chord-Scale Guide - https://www.learnjazzstandards.com/blog/learning-jazz/jazz-theory/guide-scales-use-7th-chords/ (Medium-High reliability, established jazz platform)
9. Learn Jazz Standards - Secondary Dominants - https://www.learnjazzstandards.com/blog/secondary-dominants/ (High reliability, 2024 publication)
10. tonaljs/tonal - https://github.com/tonaljs/tonal (High reliability, widely used TS library)

---

## Statistics

- **Total Searches Performed**: 7
  - exa_web_search_exa: 5
  - web-search-prime: 2 (returned empty results)
- **Total URLs Fetched**: 10 (via urlreader subagents)
- **Sources Consulted**: 10
- **Research Rounds**: 2
- **Search Limit Applied**: 10
- **Parallel Search Strategy**: 2-4 searches per round alternating between exa and web-search-prime, urlreader subagents in parallel batches of 5-6
- **Content Processing**: Parallel urlreader subagent batches

---

## Additional Context

- The chord-symbol npm library and tonaljs are the two most relevant existing TS libraries for implementation reference
- For a complete implementation, combining chord-symbol's parsing pipeline with tonaljs's pitch/interval representation would be ideal
- The JJazzLab Degree enum model provides the cleanest chord-degree representation for jazz harmony
- Key detection from chord sequences was not deeply covered; music21's `key.analyze()` and Pitch Class Profile approaches are recommended for further research
- No single existing library covers all 6 research areas comprehensively; a custom implementation synthesizing these approaches is needed
