# AGENTS.md

## Build & Test Commands

```
npm test           # run all tests (vitest)
npm run build      # vite build (web app, outputs to dist/)
npm run build:lib  # BUILD_LIB=1 vite build (library bundle)
npm run typecheck  # tsc --noEmit
npm run dev        # dev server
```

Always run `npm test` and `npm run typecheck` after making changes.

## Deployment

- GitHub Pages auto-deploys on push to `main` via `.github/workflows/deploy.yml`
- Site URL: https://maedoc.github.io/grilled-cheese/
- Remote: `git@github.com:maedoc/grilled-cheese` (main branch)
- `npm run build` produces the web app; `npm run build:lib` produces the library bundle
- Vite base path is `/grilled-cheese/` for the web app build (controlled by `BUILD_LIB` env var in `vite.config.ts`)
- Check deploy status: `gh run list --limit 1` / `gh run watch <run-id>`

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
- All initial paths use unanchored `findOptimalPaths` so column 0 shows diverse roots (not all the same chord)
