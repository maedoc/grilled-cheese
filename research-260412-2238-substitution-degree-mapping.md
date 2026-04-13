# Voice Leading Through Degree-Preserving Substitutions

## Revised Understanding: Cross-Column Root-Leading

The key insight from the user:

1. **Generating candidates** for each column requires key-context understanding
2. **Root-leading heuristic** applies to SUBSTITUTES at adjacent positions:
   - Bdim (substitute for E7) → Bbm6 (substitute for A7)
   - The root B leads smoothly to root Bb (1 semitone)
   - This is cross-column, not within a column

## Diagram 1: Overall Processing Flow

![Substitution Flow](/tmp/substitution-flow.jpg)

## Diagram 2: Root-Leading Across Columns

![Root Leading](/tmp/root-leading.jpg)

---

## Implementation Status: What's Done vs What's Missing

### ✅ Already Implemented

1. **Key-context for likely variant** (`mapper.ts`)
   - E7 in C major resolving to A7 (which goes to D minor)
   - Detects it resolves to minor → assigns phrygianDominant scale
   - Generates b9, #9, b13 variants

2. **Note pool generation** (`substitutions.ts`)
   - Uses chord tones + scale tensions as candidate pool
   - Overlap ≥2 PCs filters candidates

3. **Categorization explains relationship**
   - `tritone-substitute`, `m6-on-fifth`, etc.

### ❌ Missing: Cross-Column Root-Leading

The current path finding in `voicing/path.ts`:

- Computes voice-leading distance between 4-note voicings
- Adds repetition penalty
- Adds extension penalty

**What's NOT computed:**

- How well does candidate X in column 0's root lead to candidate Y in column 1's root?
- Bdim (root B) → Bbm6 (root Bb) = 1 semitone up = SMOOTH
- Bdim (root B) → Edim (root E) = 2 semitones = less smooth

This cross-column root-leading scoring is not in the distance metric.

---

## What Code Does vs User Expects

| User Expectation | Code Reality |
|------------------|---------------|
| E7 in C, resolves to minor → b9b13 variant shown first | ✅ `assignDominant` does this routing |
| Candidates for E7 generated from note pool | ✅ `generateSubstitutionVariants` does this |
| Path explores Bdim → Bbm6 because roots lead smoothly | ❌ No cross-column root-leading in distance |

---

## Gap to Close

Add to `computeDistance` or create a new `computeRootLeadingScore`:

```
rootLeadingScore(fromRoot, toRoot) = {
  // Circular semitone distance (wrapping around)
  // B(11) to Bb(10) = 1 (up) - smooth
  // B(11) to E(4) = 5 (down) or 7 (up) - less smooth
}
```

Then combine with existing voice-leading distance to score paths.

---
*Document date: 2026-04-12*
*Key insight: cross-column root-leading between substitutes*