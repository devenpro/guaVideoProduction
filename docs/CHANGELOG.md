# VPM Changelog

## v1.1.0 — Clips Page Rebuild + AI Parsing Fix (Current)

### Clips Page (8-Phase Rebuild)
- **List panel**: header with count + add button, section group progress bars, two-row items (title + meta), active title turns blue, hover-only ↑↓ reorder buttons, done checkmarks
- **Detail container**: white bordered box, action button group (Edit/Duplicate/Delete), prev/next clip navigation bar, tab status indicators (green check for done, orange dot for partial)
- **Script & Config tab**: word count + estimated duration, scene preview card (name + look + env + camera), collapsible `<details>` production config
- **Frame tabs**: prompt status badges (Generated/Edited), scene info card, green-bordered positive prompts, red-bordered negative prompts, style keyword chips
- **Video tab**: model info card with active duration chips, frame thumbnail previews
- **Non-AI tabs**: type banner with colored icon, styled upload zone with cloud icon, recording ref card, mono-font instructions textarea
- **Template tab**: styled card with type icon + status badge, editable on-screen text + duration
- **Per-track progress**: 4-column grid (AI/Non-AI/Template/Duration) with colored bars, duration over-target warning
- **Empty state**: 3 numbered steps (Finalize script → Generate → Configure)
- **CSS**: 131 clip-related rules, responsive mobile stacking

### AI Parsing Fix (5 Layers)
- **Layer 1**: `parseAIResponse()` — 5-step robust parser replacing old `parseJSON()`. Handles markdown blocks, trailing commas, text wrapping, string-aware brace matching, last-resort regex
- **Layer 2**: `_callAIWithRetry()` — auto-retry wrapper. First attempt normal, retry with strict JSON-only instruction if parse fails
- **Layer 3**: Script generation fix — prompts ask for plain text (not HTML), `normalizeToHtml()` handles both, accepts `rs.content`, `rs.text`, `rs.body` fields, sections inherit blueprint IDs
- **Layer 4**: Clip generation fix — `createLightweightClip()` (no prompt_set), `normalizeClipType()` (19 fuzzy mappings), `resolveSectionId()` (4-tier matching), auto-inject template clips, duration snapping, 16K token limit
- **Layer 5**: Lazy-ensure in clip detail — `ensurePromptSet()`, `ensureNonAiPlanning()`, `ensureProductionConfig()` called on-demand when user opens clip

---

## v1.0.5 — UX Polish

- Stage fade transitions (opacity 0→1, 6px translateY on stage switch)
- Toast type-specific durations (error 6s, warning 5s, success 3s, info 3.5s)
- Toast close buttons (×) on every toast
- Toast max stack of 4 (oldest auto-removed)
- Toast colored left borders matching type
- Nav buttons: auto-resolve labels from APP_STAGES, prerequisite warning tooltips

---

## v1.0.4 — Settings Page Rebuild

5 wireframe-accurate tabs replacing old General/AI/Defaults/Brand/Advanced:
- **General**: 9-row video info dashboard + 6 default preference dropdowns
- **AI Providers**: provider cards with model rows (name, temp, tokens, default star), inline picker, image/video model selects, global negative prompt
- **Defaults**: production defaults, video duration control with custom toggle switches, model duration cards with valid duration chips, AI behavior (preflight toggle + global instructions)
- **Brand Context**: read-only page brand with status dot, override toggle with form fields (colors + voice + audience)
- **Import/Export**: export checklist + security note, inline import textarea, entity grid (3 cards), danger zone (4 actions: reset prompts, delete clips, reset studio, factory reset meta)

---

## v1.0.3 — Sidebar & Menu Overhaul

- Sidebar header with brand mark (film icon + "VPM") + collapse toggle
- Desktop icon-rail collapse: 240px → 56px, step numbers enlarge, labels hide
- Step numbers instead of stage icons (1, 2, 3... with mono font)
- Stage progress bars (2px, primary color, per-stage completion)
- Mobile override: no collapsed mode, full-width slide-in
- All stages show descriptions (active highlighted in primary + bold)

---

## v1.0.2 — AI Action Wiring

17 AI buttons fully wired:
- 6 new functions: generateBlueprint, generateChapters, generateScenes, regenerateResearchSection, regenerateThumbnailIdea, thumbnailChatAI
- Thumbnail chat delegates to real LLMService (replaces placeholder)
- Process Idea delegates to Part 2B analyzeIdea when available
- AI Action Registry expanded to 16 entries

---

## v1.0.1 — Workflow Sync Engine

- Full factory reset clears ALL S.data + entity libraries
- Blueprint confirm cascade: warns about downstream data, clears script/clips/publishing on accept
- Unlock blueprint warning
- Mode switch smart redirect (Advanced→Standard auto-redirects from Research/Studio)
- Stage gate soft warnings (toast on navigate to unprepared stage)
- Sidebar descriptions for all stages
- `_refreshSidebarNav()` with efficient rebuild
- Settings button removed from header (sidebar-only access)

---

## v1.0.0 — Initial Release

### Core Platform
- 2-mode workflow: Standard (5 stages), Advanced (7 stages)
- 3-field JSON architecture (data, meta, activity)
- jQuery SPA inside Drupal 11 node edit page
- 3-part JS + 2-part CSS file organization

### All 9 View Renderers
Start (mode selection + idea input), Research (4-panel AI brief), Blueprint (section editor + confirm), Script (N-section Tiptap + AI generation), Studio (looks/environments/scenes), Clips (split layout + 3-track detail), Publish (YouTube SEO + multi-platform + thumbnail workshop), Activity (date-grouped + search + export), Settings (5 tabs)

### AI Integration
- 8 AI providers via LLMService
- BrandService for brand-aware prompts
- 11 initial AI actions
- Preflight modal with model picker + custom instructions
- Adaptive progress overlay with cancel

### Production System
- 12 clip types across 3 tracks
- Full REVP pipeline: scene → frame prompt → image → video prompt
- Duration control with video model constraints
- Non-AI briefs with AI improvement
- Template clip management
