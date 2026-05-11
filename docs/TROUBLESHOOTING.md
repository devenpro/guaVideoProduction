# VPM Troubleshooting Guide

## Common Issues & Fixes

### 1. App Doesn't Load / White Screen
**Symptoms:** Drupal form visible instead of VPM UI
**Causes & Fixes:**
- Body class missing: Ensure content type machine name is `video_production` → body class `node--type-video-production`
- JS load order: Part 1 must load before Part 2A, Part 2A before Part 2B. Check Drupal library weights
- JSON parse error: Check browser console for `[VPM] JSON parse error`. Usually means corrupt data in textarea field — manually fix in Drupal field editor
- CKEditor5 conflict: Part 1 strips `data-cke-*` attributes from textareas. If CKEditor5 attaches first, the textarea may be replaced. Ensure VPM JS runs in Drupal.behaviors

### 2. Changes Don't Persist After Save
**Symptoms:** Edits disappear after clicking Save and reloading
**Cause:** `syncToTextarea()` not called before `triggerDrupalSave()`
**Fix:** Every data change must call `syncToTextarea()`. Check the handler — does it follow the state update pattern? (update → snapshot → buildMaps → syncToTextarea → render)

### 3. AI Parsing Fails ("Parse error" toast)
**Symptoms:** AI action completes but shows "Parse error" or "No sections parsed"
**Diagnosis:** Check browser console for `[VPM] Parse failed on first attempt` and `[VPM] parseAIResponse failed. Raw text:` — this shows what the LLM actually returned
**Common LLM issues:**
- Trailing commas: `[{...},{...},]` — handled by `_fixLLMJson()`
- Text wrapping: "Here's the result:\n{...}" — handled by `_extractJsonBlock()`
- Wrong field names: LLM returns `"text"` instead of `"content"` — add fallback fields in handler
- Nested wrapper: `{script:{sections:[...]}}` instead of `{sections:[...]}` — handled by `_extractArray()`
**If auto-retry also fails:** The LLM is returning something fundamentally non-JSON. Check if the model is correct (some models don't follow JSON instructions well)

### 4. Clips All Assigned to "body" Section
**Cause:** `resolveSectionId()` can't match LLM section output to blueprint IDs
**Fix:** The clip generation prompt now includes explicit section IDs. If still failing, check that blueprint is confirmed (sections have IDs) and that the prompt includes them

### 5. Sidebar Doesn't Collapse on Desktop
**Cause:** Missing `sidebarCollapsed` state or CSS class
**Fix:** Check that `toggle-sidebar-collapse` handler exists in Part 1 Section 11, and `.vpm-sidebar-collapsed` CSS exists in Part 1 CSS Section S5B

### 6. Event Handler Fires Twice / Doesn't Fire
**Double-fire:** Missing `.off()` before `.on()` — every handler must use `$(document).off('event.ns').on('event.ns', ...)`
**Doesn't fire:** DOM rebuilt after render — handler must use event delegation on `$(document)`, not bound to specific elements

### 7. Tiptap Editors Not Loading
**Symptoms:** Script sections show textareas instead of rich editors
**Cause:** CDN load failure or `_destroyAllEditors()` not called before re-render
**Fix:** Check browser Network tab for Tiptap CDN requests. Ensure `vpm:beforeRender` event fires `_destroyAllEditors()`. Fallback: textareas work as graceful degradation

### 8. Clip Type Shows as "ai-visual" for Everything
**Cause:** `normalizeClipType()` falling back to default because LLM returned unrecognized type
**Fix:** Check the raw AI response in console. Add missing mapping to the fuzzy map in `normalizeClipType()` (Part 1, Section 14)

### 9. Toast Notifications Stack Infinitely
**Fixed in current version:** Toast system limits to 4 max, oldest auto-removed. If you see unlimited stacking, check that `$existing.length >= 4` check exists in the `toast()` function

### 10. Settings Don't Save
**Cause:** Settings handlers use `syncToTextarea()` without render, or toggle handler uses wrong path
**Fix:** Check that `data-setting-path` matches the key in `S.meta.settings`. For toggle switches, check the unified `toggle-setting-bool` handler handles the `_brand_override` special case

## Debugging Tips

### Console Markers
- `[VPM] Part 1 v1.0 loaded` — Part 1 initialized
- `[VPM] Part 2A ready` — Part 2A initialized
- `[VPM] Part 2B v1.0 loaded` — Part 2B initialized
- `[VPM] Parse failed on first attempt, retrying` — AI retry happening
- `[VPM] parseAIResponse failed. Raw text:` — complete parse failure

### State Inspection
In browser console:
```js
window._vpmState              // Full state object
window._vpmState.data.clips   // All clips
window._vpmState.meta.settings // Settings
window._vpmState.clipMap      // Clip lookup map
```

### Force Re-render
```js
window._vpmRender()           // Re-render current view
window._vpmRefreshSidebarNav() // Refresh sidebar only
```

### Manual Sync
```js
window._vpmSyncToTextarea()   // Write current state to textareas
```
