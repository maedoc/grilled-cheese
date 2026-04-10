# AGENTS.md

## Build & Test Commands

```
npm test           # run all tests (vitest)
npm run build      # vite build
npm run typecheck  # tsc --noEmit
npm run dev        # dev server
```

Always run `npm test` and `npm run typecheck` after making changes.

## Code Style

- No comments unless explicitly requested
- ES modules with `.js` extension in imports
- Strict TypeScript throughout
- 4-space indentation

## Project Structure

- `src/lib/` — Pure TypeScript music theory library (no DOM dependencies)
- `src/web/` — HTML UI (view + controller only)
- `tests/` — Vitest specs mirroring `src/lib/` structure
- `index.html` — Web app entry point

## Key Design Decisions

- Voice leading distance uses brute-force over all 24 permutations of 4-voice assignments
- Substitutions use pitch-class overlap against chord scale (not just base chord)
- Repetition penalty (+20) prevents static paths where the same voicing repeats across columns
- Original chord is pinned at index 0 in each column; only substitutions are sorted by proximity
- Variant pool capped at 30 per column to keep path finding tractable
- All displayed paths anchor from column 0 row 0 (the original first chord)
