# VPM Development Guide

## JavaScript Patterns

### IIFE Wrapper
Every JS file uses:
```js
(function($, Drupal) { 'use strict'; /* all code */ })(jQuery, Drupal);
```

### State Update Pattern
EVERY data change must follow this sequence:
```
1. Update S.data or S.meta
2. _snapshotFull('description')  // for undo history
3. buildMaps()                    // rebuild lookup maps
4. syncToTextarea()               // write JSON to hidden fields
5. render()                       // refresh UI
6. toast('message', 'success')    // user feedback
```
Skipping any step causes bugs: missing syncToTextarea = data loss on save, missing buildMaps = stale lookups.

### Event Delegation Pattern
The DOM is rebuilt on every render. NEVER bind events to elements directly:
```js
// ✅ CORRECT — delegated, namespaced, off-before-on
$(document).off('click.vpm2a-xyz').on('click.vpm2a-xyz', '[data-action="do-thing"]', function() { ... });

// ❌ WRONG — will break after re-render
$('#myButton').on('click', function() { ... });
```

Namespaces: `vpm1-*` for Part 1, `vpm2a-*` for Part 2A, `vpm2b-*` for Part 2B.

### Cross-File Communication
Part 1 exports globals to `window._vpm*`:
```js
window._vpmState = S;
window._vpmRender = renderCurrentView;
window._vpmToast = toast;
// etc — 85 exports total
```
Part 2A and 2B import via polling:
```js
var checkInterval = setInterval(function() {
  if (window._vpmState && window._vpmState.initialized) {
    clearInterval(checkInterval);
    S = window._vpmState;
    render = window._vpmRender;
    // import all needed functions...
    initPart2A();
  }
}, 100);
```

### Null-Safety
Always guard nested access:
```js
var prefs = (S.data.start && S.data.start.preferences) || {};
var sections = ((S.data.blueprint || {}).sections || []);
var stg = (S.meta && S.meta.settings) || {};
```

### Lightweight Clips
AI clip generation uses `createLightweightClip()` — only wireframe fields. Heavy structures created lazily:
```js
// In generateClips():
var clip = createLightweightClip(clipType, sectionId, i + 1);
// NO prompt_set, NO non_ai_planning, NO production_config

// In _renderClipDetail():
if (track === 'ai') ensurePromptSet(clip);      // created on demand
if (track === 'non-ai') ensureNonAiPlanning(clip);
ensureProductionConfig(clip);
```

### AI Response Parsing
Always use `_callAIWithRetry()` for AI actions:
```js
_callAIWithRetry(prompt, systemPrompt, actionId, progressId, isBig, function(parsedResult) {
  // parsedResult is guaranteed to be valid JSON
  var items = _extractArray(parsedResult, 'clips');  // handles multiple response shapes
}, ['clips'], { max_tokens: 16000 });
```

## CSS Patterns

### Variable-Only Colors
```css
/* ✅ CORRECT */ color: var(--vpm-primary);
/* ❌ WRONG */  color: #1a73e8;
```

### Class Naming
All classes prefixed `vpm-`:
- Components: `vpm-panel`, `vpm-btn`, `vpm-modal`
- Variants: `vpm-btn-primary`, `vpm-btn-ai`, `vpm-btn-sm`
- States: `vpm-nav-active`, `vpm-clips-list-warn`
- Layout: `vpm-flex-between`, `vpm-form-grid`

### Z-Index Scale
| Layer | Z-Index |
|-------|---------|
| App | 100 |
| Sidebar overlay | 250 |
| Mobile sidebar | 350 |
| Modal backdrop | 9200 |
| Confirm dialog | 9500 |
| Toast | 10000 |

### Button System (8 variants)
`vpm-btn` (base), `vpm-btn-primary`, `vpm-btn-outline`, `vpm-btn-ai` (gradient), `vpm-btn-danger`, `vpm-btn-success`, `vpm-btn-sm`, `vpm-btn-full`

### Responsive Breakpoints
| Width | What Changes |
|-------|-------------|
| ≤1200px | Sidebar narrows, grid adapts |
| ≤992px | Sidebar becomes overlay, 1-col grids, clips stack |
| ≤768px | Compact header, smaller modals |
| ≤480px | Full-width everything, minimal padding |

## Adding New Features Checklist

1. Read the relevant uploaded file first
2. Identify which file(s) and section(s) to modify
3. Follow the state update pattern
4. Use event delegation with namespacing
5. Add CSS classes with `vpm-` prefix using CSS variables
6. Call `logActivity()` for significant user actions
7. Add to the appropriate section header comment
8. Describe how to test
9. Verify JS syntax with `node -c filename.js`
