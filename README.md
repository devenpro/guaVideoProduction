# VPM — Video Production Manager

Vanilla JS single-page app for AI-driven video production planning, injected into Drupal pages via the **Asset Injector** module. No framework, no transpilation — the bundled output is served directly to the browser by jsDelivr's CDN.

> **Live Drupal pages** load the latest published bundle from
> `https://cdn.jsdelivr.net/gh/devenpro/guaVideoProduction@main/dist/vpm.js`
> and `…/dist/vpm.css`. Edit a source file → `npm run build` → `git push` → done.

---

## Quick Start for Drupal Admins

Open **Configuration → Development → Asset Injector** in Drupal and create two rules, both restricted to nodes whose body class contains `node--type-video-production`.

### 1. CSS Injector
```css
@import url('https://cdn.jsdelivr.net/gh/devenpro/guaVideoProduction@main/dist/vpm.css');
```

### 2. JS Injector
```javascript
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/devenpro/guaVideoProduction@main/dist/vpm.js';
  s.async = false;
  document.head.appendChild(s);
})();
```

That's it — the bundle pulls in the original `part1 → part2a → part2b` load order automatically, plus any future feature modules added under `src/`.

**Production-pinned variant** (after `git tag v1.0.0 && git push origin v1.0.0`):
swap `@main` → `@v1.0.0` in both URLs. Tagged URLs are immutable; future `main` work cannot break Drupal.

---

## Repository Structure

| Path | Contents |
|------|----------|
| `src/` | Source code, organized by feature category. Edit here. |
| `dist/` | Build output — `vpm.js` + `vpm.css`. **Committed** so jsDelivr can serve it. Do not hand-edit. |
| `docs/` | Architecture, data model, API reference, troubleshooting, changelog. |
| `samples/` | Sample JSON payloads (`field_json_data`, `field_json_meta`, `field_activity_log`) for testing/seeding. |
| `resources/` | Reference material loaded at runtime (e.g. the Seedance clip-generation guide). |
| `tools/` | Build script + future maintenance tools. |

---

## Feature Category Map (Source Layout)

Each source file lives under one of these category folders. As the three monolithic `vpm-part*` files get decomposed, new small focused files land in the appropriate bucket.

| Category | Folder | Responsibility |
|----------|--------|----------------|
| **core** | `src/core/` | Constants (`VIDEO_MODELS`, `VIDEO_STYLES`, `SEEDANCE_AUDIO_DIRECTIONS`), state container `S`, init / `Drupal.behaviors` hook, MutationObserver fallback for async Drupal blocks |
| **data** | `src/data/` | JSON schemas, persistence to `field_json_data` / `field_json_meta` / `field_activity_log`, planner JSON import/export |
| **ui** | `src/ui/` | Views, layouts, navigation, rendering, the 3-step Start workflow (Import → Preferences → Review & Launch) |
| **editing** | `src/editing/` | Event handlers, CRUD ops for clips/scenes/timeline, inline editing toggles, Copy/Edit prompt buttons |
| **ai** | `src/ai/` | `PROMPT_TEMPLATES` per model (Seedance plain-text, VEO 3.1 structured JSON), `generateVideoPrompt()`, LLM client adapters, voice profile + audio direction |
| **library** | `src/library/` | Brand Studio integration — reads `.llm-config-data` / `.brand-data` / `.brand-studio-library` Drupal blocks |
| **utils** | `src/utils/` | Shared helpers (`_ensureString()`, `_formatResearchContent()`, polling, sanitization) |
| **styles** | `src/styles/` | CSS split by area — `vpm-part1.css` (core), `vpm-part2.css` (UI). To be subdivided as decomposition proceeds. |

The current source files (`vpm-part1.js` 125 KB, `vpm-part2a.js` 318 KB, `vpm-part2b.js` 196 KB) start their lives in `core/`, `ui/`, and `ai/` respectively and will be decomposed incrementally — one focused area per commit.

---

## Build

```bash
npm run build
# or:
node tools/build.js
```

Reads `tools/build.config.json`, concatenates the listed source files in order, and writes:
- `dist/vpm.js`  (combined JS)
- `dist/vpm.css` (combined CSS)

Zero dependencies. No `npm install` required.

---

## Dev Workflow

```bash
# 1. Edit any file under src/
# 2. Rebuild
npm run build
# 3. Commit and push
git add .
git commit -m "Describe change"
git push
# 4. (Optional) force jsDelivr to refetch your @main URL:
#    open https://purge.jsdelivr.net/gh/devenpro/guaVideoProduction@main/dist/vpm.js
#    open https://purge.jsdelivr.net/gh/devenpro/guaVideoProduction@main/dist/vpm.css
# 5. Hard-refresh the Drupal page (Ctrl+F5)
```

### Cutting a production release

```bash
git tag -a v1.0.0 -m "Production release: <description>"
git push origin v1.0.0
```

Then update Drupal Asset Injector URLs from `@main` → `@v1.0.0`. Tagged URLs are immutable and cached permanently.

---

## Runtime Dependencies (provided by Drupal/CDN — not bundled)

- **jQuery** + **Drupal core** — provided by the Drupal page.
- **Font Awesome Pro** — loaded by the Drupal theme.
- **Plus Jakarta Sans**, **JetBrains Mono** — Google Fonts, referenced by `vpm-part2.css`.
- **Tiptap** — loaded from CDN at runtime by `src/ui/vpm-part2a.js`.

---

## Security / Secrets

The repo is public. **No secrets are committed.** API keys and credentials live in Drupal user-profile fields and are injected at runtime into a `.llm-config-data` block that the app reads from the DOM. Nothing sensitive is in the JS/CSS source.

---

## Architecture & Reference Docs

See [`docs/README.md`](docs/README.md) for the documentation index. Highlights:
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the app boots inside Drupal
- [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md) — JSON shape of `field_json_data` / `field_json_meta` / `field_activity_log`
- [`docs/API-REFERENCE.md`](docs/API-REFERENCE.md) — public functions exposed on `window.VPM`
- [`docs/features/AI-INTEGRATION.md`](docs/features/AI-INTEGRATION.md) — LLM client, prompt templates, model adapters
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — common Drupal/runtime issues
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — release history

---

## Repo

https://github.com/devenpro/guaVideoProduction
