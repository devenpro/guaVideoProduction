# VPM Quick Reference

## Field Selectors
```javascript
// JSON Data Fields
$('#edit-field-json-data-0-value')      // S.data — video content
$('#edit-field-json-meta-0-value')      // S.meta — config/settings
$('#edit-field-activity-log-0-value')   // S.activity — event log

// Gallery Wrappers
$('#edit-field-looks-gallery-wrapper')
$('#edit-field-environments-gallery-wrapper')
$('#edit-field-frames-gallery-wrapper')

// Submit
$('#edit-submit')   // or .form-submit[value="Save"]
```

## Global Resource Access
```javascript
// --- AI ---
LLMService.isConfigured()                    // → boolean
LLMService.getDefault()                      // → {provider, model, api_key}
LLMService.callAI(prompt, onOk, onErr, actionId, sysPrompt, opts)
LLMService.getActiveProviders()              // → [{id, label, api_key, activeModels}]
LLMService.renderInlinePicker('action-id')   // → HTML for selects
// Source: $('.llm-config-data') parsed in Part 2B init

// --- Brand ---
S.brand.name          // from .brand-data .brand-name
S.brand.core          // from .brand-data .brand-core-data (JSON)
S.brand.video         // from .brand-data .brand-video-data (JSON)
BrandService.isConfigured()       // → boolean
BrandService.getSystemPrompt()    // → brand context string for AI
// Overrides: S.meta.brandOverrides.enabled → uses S.meta.brandOverrides.*

// --- User ---
S.user.id             // from #guau-userid
S.user.name           // from #guau-username
S.user.email          // from #guau-useremail
S.user.fullName       // from #guau-userfullname
S.user.timezone       // from #guau-usertimezone
S.user.roles          // from #guau-userroles

// --- Brand Studio (read-only global libraries) ---
S.brandStudio.looks           // [{id, name, ..., source:'brand'}]
S.brandStudio.environments    // same
S.brandStudio.scenes          // same
// Source: $('.brand-studio-library .brand-studio-looks') etc.
```

## App Library Access
```javascript
// Video-specific entities (editable)
S.meta.lookLibrary          // [{id, name, source:'video', ...}]
S.meta.environmentLibrary   // same
S.meta.sceneLibrary         // same

// Merged (brand + video) — for display
S.allLooks           // brand looks + video looks
S.allEnvironments    // brand envs + video envs
S.allScenes          // brand scenes + video scenes

// Lookup maps
S.clipMap[clipId]    // → clip object
S.sceneMap[sceneId]  // → scene object
S.lookMap[lookId]    // → look object
S.envMap[envId]      // → environment object
```

## State Update Pattern
```javascript
// EVERY data change must follow this:
S.data.someField = newValue;         // 1. Update state
_snapshotFull('description');        // 2. Undo snapshot
buildMaps();                         // 3. Rebuild maps
syncToTextarea();                    // 4. Write to fields
render();                            // 5. Refresh UI
toast('Done!', 'success');           // 6. User feedback
```

## Event Handler Pattern
```javascript
// ALWAYS: off → on, delegated, namespaced
$(document).off('click.vpm2a-myaction')
  .on('click.vpm2a-myaction', '[data-action="my-action"]', function() {
    var id = $(this).data('id');
    // handle...
  });
```

## AI Call Pattern
```javascript
// Use retry wrapper for all AI actions:
_callAIWithRetry(prompt, systemPrompt, actionId, progressId, isBig,
  function(parsedResult) {
    var items = _extractArray(parsedResult, 'clips'); // normalize shape
    // process items...
  },
  ['clips'],            // required keys
  { max_tokens: 16000 } // overrides
);
```

## Clip Creation
```javascript
// AI generation → lightweight (no prompt_set)
var clip = createLightweightClip('ai-visual', 'sec_123', 1);
clip.title = 'My Clip';
clip.script_text = 'Voiceover text';

// Manual creation → full (with prompt_set)
var clip = createDefaultClip('ai-visual', 'sec_123');

// On detail open → lazy-ensure
ensurePromptSet(clip);         // creates prompt_set if missing
ensureNonAiPlanning(clip);     // creates non_ai_planning if missing
ensureProductionConfig(clip);  // creates production_config if missing
```

## Normalization
```javascript
normalizeClipType('AI Visual')    // → 'ai-visual'
normalizeClipType('screen')       // → 'screen-recording'
normalizeClipType('chapter')      // → 'chapter-title'

resolveSectionId('Stage 1')       // → 'sec_abc123' (matched by label)
resolveSectionId('sec_abc123')    // → 'sec_abc123' (exact match)

normalizeToHtml('line1\n\nline2') // → '<p>line1</p><p>line2</p>'
```

## Key Constants
```javascript
Constants.APP_STAGES          // {start, research, blueprint, script, studio, clips, publish}
Constants.CLIP_TYPES          // 12 types with track, color, defaultDuration
Constants.VIDEO_MODELS        // 4 models with durations, constraints
Constants.IMAGE_MODELS        // 2 models
Constants.AI_CLIP_STATUS_ORDER // ['draft','script-ready','scene-set',...]
Constants.PLATFORMS           // youtube, youtube-shorts, instagram-reels, tiktok, linkedin
Constants.PRODUCTION_MODES    // full-ai, hybrid, screen-recording, live-action, template-based
```

## Common Operations
```javascript
// Navigate to stage
navigateToStage('clips');

// Show toast
toast('Saved!', 'success');           // 3s
toast('Something wrong', 'error');    // 6s
toast('Watch out', 'warning');        // 5s

// Generate ID
generateId('clip');   // → 'clip_a8f3k2j9'

// Clip status
maybeAdvanceClipStatus(clip, 'frame prompt generated');
var status = evaluateClipStatus(clip);

// Duration validation
var result = validateClipDuration(clip);
// → { valid: true } or { valid: false, warning: '...', snapped: 8 }

// Activity log
logActivity('clip_edited', 'Updated clip #3 script text');

// Modal
openModal('Edit Clip', '<div>form html</div>', {
  saveLabel: 'Save',
  onSave: function() { var data = collectModalFields(); /* ... */ closeModal(); }
});

// Confirm dialog
openConfirmDialog({
  title: 'Delete?',
  message: 'This cannot be undone.',
  danger: true,
  onConfirm: function() { /* delete */ }
});

// Copy to clipboard
copyToClipboard(someText);

// Export file
exportFile('prompts.json', JSON.stringify(data, null, 2), 'application/json');
```

## CSS Quick Reference
```css
/* Colors — NEVER hardcode */
var(--vpm-primary)    /* #1a73e8 */
var(--vpm-accent)     /* #7c3aed */
var(--vpm-success)    /* #0d904f */
var(--vpm-error)      /* #d93025 */
var(--vpm-warning)    /* #e37400 */

/* Spacing */
var(--vpm-space-1) to var(--vpm-space-6)  /* 4px to 24px */

/* Class prefix: always vpm- */
.vpm-panel, .vpm-btn, .vpm-modal, .vpm-inner-tab, .vpm-form-group

/* Button variants */
.vpm-btn-primary, .vpm-btn-outline, .vpm-btn-ai, .vpm-btn-danger, .vpm-btn-sm

/* Icon */
icon('sparkles')  →  <i class="fa-light fa-sparkles vpm-icon"></i>
```

## File Quick Map
| Need to change... | Edit this file |
|-------------------|---------------|
| Stage navigation, state, init | `vpm-part1.js` |
| View rendering, modals, events | `vpm-part2a.js` |
| AI actions, settings, shortcuts | `vpm-part2b.js` |
| Design tokens, shell, sidebar | `vpm-part1.css` |
| Stage styles, modals, clips CSS | `vpm-part2.css` |
