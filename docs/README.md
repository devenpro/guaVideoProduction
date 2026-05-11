# VPM Documentation

Reference docs for the Video Production Manager codebase.

## Index

- [PROJECT.md](PROJECT.md) — Project overview, goals, scope.
- [ARCHITECTURE.md](ARCHITECTURE.md) — How the app boots inside Drupal, module wiring, runtime structure.
- [DATA-MODEL.md](DATA-MODEL.md) — JSON shape of `field_json_data`, `field_json_meta`, `field_activity_log`.
- [API-REFERENCE.md](API-REFERENCE.md) — Public functions and events exposed by the app.
- [DEVELOPMENT-GUIDE.md](DEVELOPMENT-GUIDE.md) — Setting up locally, coding conventions, debugging tips.
- [STYLE-REFERENCE.md](STYLE-REFERENCE.md) — CSS variables, design tokens, component styling rules.
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) — Frequently-needed snippets and cheat-sheet.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Known issues and their fixes.
- [CHANGELOG.md](CHANGELOG.md) — Release history.

### Feature docs

- [features/AI-INTEGRATION.md](features/AI-INTEGRATION.md) — LLM client wiring, prompt templates, per-model behavior (Seedance, VEO 3.1, etc.).

---

## Where to put new docs

| If the doc is… | Put it in… |
|----------------|------------|
| General architecture, data model, API surface | `docs/` (top level) |
| Specific to one feature category (ai/editing/library/research/…) | `docs/features/<NAME>.md` |
| Runtime-loaded by the app (e.g. prompt-building guides) | `resources/` (not `docs/`) |
