# VPM API Reference

## Core Exports (Part 1 → window._vpm*)

### State & Rendering
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmState` | Object | Main state object `S` — all data, meta, UI state |
| `_vpmRender` | Function | `renderCurrentView()` — re-render active view |
| `_vpmRenderApp` | Function | `renderApp()` — full page re-render |
| `_vpmRefreshSidebarNav` | Function | Rebuild sidebar nav HTML only |
| `_vpmNavigateToStage` | Function(stageKey) | Navigate to stage with gate checks |
| `_vpmRenderers` | Object | View renderer registry (populated by Part 2A) |

### Data Sync
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmSyncToTextarea` | Function | Write S.data/S.meta/S.activity to hidden textareas |
| `_vpmBuildMaps` | Function | Rebuild clipMap, sceneMap, lookMap, envMap + stats |
| `_vpmSnapshot` | Function(label) | Create undo snapshot |
| `_vpmLogActivity` | Function(type, desc) | Add entry to activity log |

### Parsing & Normalization
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmParseJSON` | Function(text) | Legacy alias → calls parseAIResponse |
| `_vpmParseAIResponse` | Function(text) | 5-step robust AI response parser |
| `_vpmNormalizeClipType` | Function(raw) | Fuzzy map LLM output → valid CLIP_TYPES key |
| `_vpmResolveSectionId` | Function(raw) | 4-tier match to blueprint section ID |
| `_vpmNormalizeToHtml` | Function(text) | Plain text → `<p>` wrapped HTML |

### Factory Functions
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmGetDefaultData` | Function | Fresh S.data object |
| `_vpmGetDefaultMeta` | Function | Fresh S.meta object |
| `_vpmCreateDefaultClip` | Function(type, section) | Full clip with prompt_set/non_ai_planning |
| `_vpmCreateLightweightClip` | Function(type, section, order) | Wireframe clip — NO heavy structures |
| `_vpmEnsurePromptSet` | Function(clip) | Lazy-create prompt_set on AI clip |
| `_vpmEnsureNonAiPlanning` | Function(clip) | Lazy-create non_ai_planning on Non-AI clip |
| `_vpmEnsureProductionConfig` | Function(clip) | Lazy-create production_config on any clip |
| `_vpmCreateEmptyPromptSet` | Function(clipType) | Empty prompt_set structure |
| `_vpmCreateEmptyPrompt` | Function | Empty prompt object |
| `_vpmCreateEmptyFrame` | Function | Empty frame object (scene + prompt + image) |
| `_vpmCreateDefaultNonAiPlanning` | Function | Empty non_ai_planning |
| `_vpmCreateDefaultLook` | Function | New look entity |
| `_vpmCreateDefaultEnvironment` | Function | New environment entity |
| `_vpmCreateDefaultScene` | Function | New scene entity |
| `_vpmCreateDefaultBodySection` | Function(order, label) | New script section |

### Status & Validation
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmEvaluateClipStatus` | Function(clip) | Compute clip status from its data |
| `_vpmMaybeAdvanceClipStatus` | Function(clip, reason) | Auto-advance clip status (forward only) |
| `_vpmValidateClipDuration` | Function(clip) | Check duration vs model constraints |
| `_vpmSnapToModelDuration` | Function(dur, modelId) | Round to nearest valid duration |
| `_vpmGetModelDurationConfig` | Function(modelId) | Get model's duration rules |
| `_vpmGetSmartClipDuration` | Function(clipType) | Get best default duration for type |
| `_vpmCanAccessStage` | Function(stageKey) | Check if stage prerequisites met |
| `_vpmGetStageStatus` | Function(stageKey) | Get stage completion status |
| `_vpmGetStageProgress` | Function(stageKey) | Get stage progress percentage (0-100) |
| `_vpmIsStageComplete` | Function(stageKey) | Boolean stage completion check |
| `_vpmComputeFlags` | Function | Recompute all status flags on S |
| `_vpmCalculateVideoStatus` | Function | Compute overall video status string |

### Utilities
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmEsc` | Function(str) | HTML-escape string |
| `_vpmIcon` | Function(name) | Generate Font Awesome icon HTML |
| `_vpmToast` | Function(msg, type, duration) | Show toast notification |
| `_vpmGenerateId` | Function(prefix) | Generate random ID like `clip_a8f3k2` |
| `_vpmDeepClone` | Function(obj) | Deep clone via JSON parse/stringify |
| `_vpmIsEmpty` | Function(obj) | Check if null/empty object |
| `_vpmDebounce` | Function(fn, delay) | Debounce wrapper |
| `_vpmTruncate` | Function(str, len) | Truncate with ellipsis |
| `_vpmStripHtml` | Function(html) | Strip HTML tags |
| `_vpmCountWords` | Function(text) | Word count |
| `_vpmSetNested` | Function(obj, path, val) | Set nested property by dot path |
| `_vpmGetStageOrder` | Function | Get stage array for current mode |
| `_vpmEstimateDuration` | Function(words) | Words → seconds estimate |
| `_vpmGetMaxWordsForDuration` | Function(seconds) | Seconds → max words |

### Formatting
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmFormatDate` | Function(iso) | Format ISO date |
| `_vpmFormatRelativeTime` | Function(iso) | "2h ago" format |
| `_vpmFormatDuration` | Function(seconds) | "2:30" format |
| `_vpmFormatDurationLong` | Function(seconds) | "2 min 30 sec" format |
| `_vpmFormatNumber` | Function(n) | Locale-formatted number |

### Badge Helpers
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmBadge` | Function(text, color) | Generic colored badge |
| `_vpmStatusBadge` | Function(status) | Video status badge |
| `_vpmClipTypeBadge` | Function(type) | Clip type badge |
| `_vpmTrackBadge` | Function(track) | Track badge (ai/non-ai/template) |
| `_vpmClipStatusBadge` | Function(status, track) | Clip status badge |
| `_vpmSourceBadge` | Function(source) | Source badge (brand/video) |
| `_vpmRoleBadge` | Function(role) | Role badge (primary/supporting) |
| `_vpmProgressBar` | Function(pct) | Progress bar HTML |
| `_vpmCsColor` | Function(status, track) | Status dot color |

### Shared View Components
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmRenderNavButtons` | Function(prev, next, nextStage) | Stage navigation buttons |
| `_vpmRenderClipList` | Function(clips, selectedId) | Clip list (used in Part 1 compact) |
| `_vpmRenderClipCard` | Function(clip) | Single clip card |
| `_vpmRenderTimelineBar` | Function(clips) | Visual timeline |
| `_vpmRenderProductionProgress` | Function | Overall progress bar |

### Gallery & Image
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmParseGalleries` | Function | Re-read gallery images from DOM |
| `_vpmQueueGalleryUpload` | Function(type, file) | Queue file for Drupal upload |
| `_vpmTriggerGalleryRemove` | Function(type, idx) | Remove gallery image |
| `_vpmGetEntityPrimaryImage` | Function(entity) | Get first reference image URL |
| `_vpmParseBrandStudioLibrary` | Function | Re-parse Brand Studio from DOM |

### Constants
| Export | Type | Content |
|--------|------|---------|
| `_vpmConstants` | Object | All constant objects: APP_STAGES, CLIP_TYPES, VIDEO_MODELS, IMAGE_MODELS, PLATFORMS, ASPECT_RATIOS, AUDIO_MODES, PRODUCTION_MODES, PRESENTER_PREFS, LANGUAGES, TONES, AI_CLIP_STATUSES, NON_AI_CLIP_STATUSES, TEMPLATE_CLIP_STATUSES, AI_CLIP_STATUS_ORDER, STUDIO_TABS, SETTINGS_TABS, MOTION_STRENGTHS, CAMERA_MOVEMENTS, TRANSITION_STYLES, LOOK_ROLES, ENVIRONMENT_TYPES |

---

## Part 2A Exports

### Modal System
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmOpenModal` | Function(title, bodyHtml, opts) | Open modal dialog |
| `_vpmCloseModal` | Function | Close active modal |
| `_vpmCollectModalFields` | Function | Collect form field values from modal |
| `_vpmOpenConfirmDialog` | Function(opts) | Open confirm/cancel dialog |

### Undo/Redo
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmUndo` | Function | Undo last change |
| `_vpmRedo` | Function | Redo last undone change |

### Tiptap
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmInitAllScriptEditors` | Function | Initialize Tiptap for all script sections |
| `_vpmFlushAllEditors` | Function | Save editor content to state |
| `_vpmDestroyAllEditors` | Function | Cleanup editors before re-render |

### Clipboard & Export
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmCopyToClipboard` | Function(text) | Copy text to clipboard |
| `_vpmExportFile` | Function(name, content, mimeType) | Download file |

### Image Pickers
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmRenderImagePicker` | Function(entity, type) | Entity image picker HTML |
| `_vpmRenderFrameImagePicker` | Function(clip, frameKey) | Frame image picker HTML |
| `_vpmSetEntityImage` | Function(entity, url, type) | Set entity reference image |

### Flags
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmPart2AReady` | Boolean | True when Part 2A fully initialized |

---

## Part 2B Exports

### AI Services
| Export | Type | Purpose |
|--------|------|---------|
| `_vpmPart2B.LLMService` | Object | Full LLMService with init, callAI, getDefault, etc. |
| `_vpmPart2B.BrandService` | Object | BrandService with init, isConfigured, getSystemPrompt |
| `_vpmPart2B.isAIConfigured` | Function | Quick check if any AI provider active |
| `_vpmPart2B.renderInlinePicker` | Function(id) | Render provider/model select HTML |

### AI Action Functions
| Export | Purpose |
|--------|---------|
| `_vpmPart2B.analyzeIdea` | Analyze video idea |
| `_vpmPart2B.generateResearch` | Generate research brief |
| `_vpmPart2B.generateBlueprint` | Generate blueprint sections |
| `_vpmPart2B.generateScript` | Generate full script |
| `_vpmPart2B.enhanceSection` | Enhance one script section |
| `_vpmPart2B.generateClips` | Generate clip breakdown |
| `_vpmPart2B.generateFramePrompt` | Generate frame image prompt |
| `_vpmPart2B.generateVideoPrompt` | Generate video prompt |
| `_vpmPart2B.analyzeStudio` | Analyze studio visual needs |
| `_vpmPart2B.generateScenes` | Auto-generate scenes |
| `_vpmPart2B.generateMetadata` | Generate YouTube metadata |
| `_vpmPart2B.generateChapters` | Generate YouTube chapters |
| `_vpmPart2B.improveBrief` | Improve non-AI production brief |
| `_vpmPart2B.generateThumbnailIdeas` | Generate thumbnail concepts |
| `_vpmPart2B.regenerateResearchSection` | Refresh one research panel |
| `_vpmPart2B.regenerateThumbnailIdea` | Replace one thumbnail concept |
| `_vpmPart2B.thumbnailChatAI` | Thumbnail refinement chat |

### Context Builders
| Export | Purpose |
|--------|---------|
| `_vpmPart2B.buildVideoContext` | Video metadata context string |
| `_vpmPart2B.buildScriptContext` | Full script text context |
| `_vpmPart2B.buildClipContext` | Single clip context |
| `_vpmPart2B.buildSceneContext` | Scene + look + env context |
