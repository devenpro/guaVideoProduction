# VPM Architecture Guide

## Platform: Drupal 11 Node-Based SPA

VPM runs as a jQuery SPA inside a Drupal 11 node edit page. The app detects `node--type-video-production` body class, hides the native form, parses JSON from textarea fields, and renders its own UI.

## 3-Field Data Architecture

| Field | Drupal Field Name | Selector | State Key | Purpose |
|-------|-------------------|----------|-----------|---------|
| Data | `field_json_data` | `#edit-field-json-data-0-value` | `S.data` | All working content: start prefs, video metadata, research, blueprint, script, clips, publishing, thumbnails |
| Meta | `field_json_meta` | `#edit-field-json-meta-0-value` | `S.meta` | Configuration: settings, AI preferences, entity libraries (looks/environments/scenes), brand overrides |
| Activity | `field_activity_log` | `#edit-field-activity-log-0-value` | `S.activity` | Chronological event log (array of {id, type, description, timestamp, user_id, user_name}) |

## File Organization

### JavaScript (3 files, 8,079 lines)

**vpm-part1.js (1,965 lines) — Core Engine**
| Section | Contents |
|---------|----------|
| 1 | Constants: APP_STAGES, CLIP_TYPES, VIDEO_MODELS, PLATFORMS, etc. (20+ constant objects) |
| 2 | State object S with all UI state flags |
| 3 | Initialization: body class detection, CKEditor strip, JSON parse, user data, brand data |
| 4 | Brand Studio Library parser |
| 5 | Map builders (clipMap, sceneMap, lookMap, envMap) + status engine |
| 6 | Stage navigation with gate warnings |
| 7 | Utilities: esc, icon, badge helpers, formatters, parseAIResponse (robust 5-step), normalizeClipType, resolveSectionId, normalizeToHtml |
| 8 | App shell: renderApp, renderHeader, renderSidebar (collapsible icon-rail) |
| 9 | Compact view renderers (fallbacks before Part 2A loads) |
| 10 | Shared helpers: renderNavButtons, renderClipList, renderTimelineBar, renderProductionProgress |
| 11 | Event handlers (navigation, sidebar, save, clip selection, timeline) |
| 12 | Sync/save: syncToTextarea, triggerDrupalSave, startAutoSave |
| 13 | Toast notifications (typed durations, close button, max stack 4) |
| 14 | Factory functions: getDefaultData, getDefaultMeta, createDefaultClip, createLightweightClip, ensure*, normalize* |
| 15 | API exports (85 window._vpm* globals) |

**vpm-part2a.js (3,426 lines) — Views & UI**
| Section | Contents |
|---------|----------|
| 1 | Init: polls for Part 1, imports 70+ globals |
| 2 | Modal system: open/close/collect, confirm dialog |
| 3 | Undo/redo with snapshot stack |
| 4 | Tiptap loading from CDN, N-section editor management |
| 5-8 | Full view renderers: Start, Research, Blueprint, Script, Studio |
| 9-11 | Entity cards, image picker, entity edit modals |
| 12 | Clips view: split layout, per-track progress, list with reorder, clip detail with tabs |
| 13 | AI clip tabs: Script&Config (scene preview, collapsible config), Frame (status badges, keyword chips), Video (model card, duration chips) |
| 14 | Frame image picker (gallery + URL paste + version tracking) |
| 15-16 | Publish view + Thumbnail workshop (3-step: ideas → chat → finalize) |
| 17-18 | Export helpers, Activity view |
| 19 | Event handlers (74 handler groups with vpm2a- namespacing) |

**vpm-part2b.js (1,688 lines) — AI & Settings**
| Section | Contents |
|---------|----------|
| 1 | Init: polls for Part 1 + 2A |
| 2 | LLMService: 8 providers, API formatting, callAI with AbortController |
| 3 | BrandService: page-level + override brand context |
| 4 | AI action system: registry (16 actions), preflight modal, progress overlay, cancel, _callAIWithRetry |
| 5 | Context builders: buildVideoContext, buildScriptContext, buildClipContext, buildSceneContext |
| 6-12B | 17 AI action functions (idea, research, blueprint, script gen/enhance, clips, frame/video prompts, studio, scenes, metadata, chapters, brief, thumbnails) |
| 13 | Settings view: 5 tabs (General, AI Providers, Defaults, Brand Context, Import/Export) |
| 14 | Import/export helpers |
| 15 | Event handlers |
| 16 | Keyboard shortcuts |
| 17 | API exports |

### CSS (2 files, 1,151 lines)

**vpm-part1.css (382 lines)**
S1: Design tokens (40+ CSS variables), S2: Reset, S3: App shell, S4: Header, S5: Sidebar + collapsed mode, S5B: Icon-rail, S6: Content, S7: Panels, S8: Buttons (8 variants), S9: Forms, S10: Badges, S11-S21: Various component styles, S22: Responsive (4 breakpoints), S23: Keyboard shortcuts

**vpm-part2.css (769 lines)**
S1: Modals, S2: Confirm, S3: Inner tabs, S4-S10: Stage-specific styles, S11: Clips (131 rules), S14-S17: Frame/prompt/entity styles, S18B: Settings page, S19: Responsive overrides

## Initialization Flow

```
1. DOMContentLoaded / Drupal.behaviors.vpmApp
2. Check body class: node--type-video-production
3. Strip CKEditor5 attributes from JSON textareas
4. Parse JSON from 3 fields into S.data, S.meta, S.activity
5. Parse user data from #guau-userdata
6. Parse brand data from .brand-data
7. Parse Brand Studio Library from .brand-studio-library
8. Run migrateMeta() for deprecated model IDs
9. buildMaps() — creates clipMap, sceneMap, lookMap, envMap, allLooks, allEnvironments, allScenes
10. Set S.initialized = true
11. renderApp() — full page render
12. setupEventHandlers()
13. startAutoSave() — 30s interval
14. Export all globals to window._vpm*
15. Part 2A detects S.initialized, imports, registers renderers, events
16. Part 2B detects Part 2A ready, imports, inits AI services, events
```

## Render Cycle

```
render() = _refreshSidebarNav() + renderCurrentView()

renderCurrentView():
1. Trigger vpm:beforeRender (destroys Tiptap editors)
2. Switch on S.currentStage → call appropriate renderer
3. Fade transition if stage changed (opacity 0→1 with 6px translateY)
4. Inject HTML into #vpmContent
5. Trigger vpm:afterRender
6. Update last-saved indicator
```

## State Object (S)

Key properties:
- `S.data` — video project data (from field_json_data)
- `S.meta` — configuration (from field_json_meta)
- `S.activity` — event log array
- `S.mode` — 'standard' or 'advanced'
- `S.currentStage` — active stage key
- `S.previousStage` — for fade transitions
- `S.selectedClipId` — selected clip in Clips view
- `S.clipMap`, `S.sceneMap`, `S.lookMap`, `S.envMap` — lookup maps
- `S.clipStats` — computed stats (totalAI, aiDone, etc.)
- `S.allLooks`, `S.allEnvironments`, `S.allScenes` — merged brand + video entities
- `S.sidebarCollapsed` — icon-rail toggle
- `S.brand` — parsed brand data from page
- `S.user` — parsed user data
- `S.galleries` — parsed Drupal gallery images
- `S.dirty` — unsaved changes flag
