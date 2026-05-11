# tools/

Build and maintenance scripts for the VPM repo.

## Current tools

- **`build.js`** — concatenates the source files listed in `build.config.json` into `dist/vpm.js` and `dist/vpm.css`. Run via `npm run build` from the project root, or `node tools/build.js` from anywhere inside the repo. Zero dependencies (uses only Node's standard library).
- **`build.config.json`** — load-order manifest. Two arrays (`js`, `css`), each holding source-file paths **relative to the project root**, in the order they should be concatenated. As `src/` gets decomposed into smaller modules, append new entries here.

## How the build works

1. Reads `build.config.json` relative to this script's own location.
2. For each file listed under `js` and `css`, reads its contents from `<repo-root>/<path>`.
3. Concatenates with a `/* ===== <path> ===== */` separator between files and a timestamped banner at the top.
4. Writes the result to `dist/vpm.js` and `dist/vpm.css` (creates `dist/` if missing).
5. Prints final sizes.

No transpilation, no minification, no source maps. The output is plain readable JS/CSS — exactly what's served to Drupal via jsDelivr.

## Adding a new source file

1. Drop the file into the appropriate `src/<category>/` folder.
2. Add its path (relative to repo root, forward slashes) to the right array in `build.config.json`, **at the position where it should load**. Order matters for the JS bundle — later files can depend on globals set by earlier ones.
3. `npm run build`.
4. Commit both the source file and the rebuilt `dist/*` outputs.

## Planned tools (not yet built)

- **`purge-cdn.js`** — hit `https://purge.jsdelivr.net/gh/...` for each bundle to force jsDelivr to refetch from GitHub immediately after a push (otherwise the `@main` URL caches for ~12h).
- **`watch.js`** — watch `src/` and auto-rebuild on save for fast local iteration.
- **`release.js`** — bump version in `package.json`, create an annotated git tag, push the tag, optionally update Drupal Asset Injector URLs.
