# VPM AI Integration Guide

## LLMService (Part 2B, Section 2)

### Supported Providers (8)
| Provider | API Format | Key Feature |
|----------|-----------|-------------|
| Gemini | Google AI REST | `responseMimeType: 'application/json'` enforces JSON |
| Claude | Anthropic Messages API | Strong instruction following |
| OpenAI | Chat Completions | GPT-4o, o1 models |
| Grok | xAI REST | Fast responses |
| Groq | OpenAI-compatible | Ultra-fast inference |
| NVIDIA | OpenAI-compatible | Open models |
| HuggingFace | Inference API | Open-source models |
| OpenRouter | OpenAI-compatible | Multi-model router |

### Provider Configuration
API keys come from a Drupal Views block (`.llm-config-data`) that outputs per-provider JSON. Keys are NEVER stored in app JSON — they live in the user's Drupal profile.

### LLMService API
```js
LLMService.isConfigured()              // → boolean
LLMService.getDefault()                // → {provider, model}
LLMService.getActiveProviders()        // → [{id, label, api_key, activeModels}]
LLMService.callAI(prompt, onSuccess, onError, actionId, systemPrompt, opts)
LLMService.renderInlinePicker(id)      // → HTML for provider/model selects
LLMService.resolveSelection(id)        // → {provider, model} from picker
```

## AI Action System (Part 2B, Section 4)

### Action Registry (16 actions)
| Action ID | Label | Size | Used By |
|-----------|-------|------|---------|
| analyze-idea | Analyze Video Idea | big | Start |
| generate-research | Generate Research Brief | big | Research |
| generate-blueprint | Generate Blueprint | big | Blueprint |
| generate-script | Generate Script | big | Script |
| enhance-script | Enhance Script Section | small | Script |
| generate-clips | Generate Clip Breakdown | big | Clips |
| analyze-studio | Analyze Studio Needs | big | Studio |
| generate-scenes | Generate Scenes | big | Studio |
| generate-prompt | Generate Image Prompt | small | Clips (Frame) |
| generate-video | Generate Video Prompt | small | Clips (Video) |
| improve-brief | Improve Production Brief | small | Clips (Non-AI) |
| generate-metadata | Generate YouTube Metadata | big | Publish |
| generate-chapters | Generate Chapters | small | Publish |
| generate-thumbnails | Generate Thumbnail Ideas | big | Publish |
| regen-research | Regenerate Research Section | small | Research |
| regen-thumbnail | Regenerate Thumbnail Idea | small | Publish |

### Action Flow
```
User clicks AI button → _launchAI(actionId, description, fn)
  → If show_ai_preflight: opens modal (model picker + custom instructions)
  → User clicks "Run": fn(customInstructions) called
  → fn builds prompt using context builders
  → _callAIWithRetry(prompt, sp, actionId, ..., onParsed, requiredKeys, opts)
    → _showAIProgress(id, isBig) — shows overlay
    → LLMService.callAI(prompt, ...) — first attempt
    → parseAIResponse(text) — 5-step robust parser
    → If parsed && hasRequiredKeys: onParsed(result)
    → If parse fails: auto-retry with strict "JSON only" prefix
    → If retry fails: toast error + console.log raw response
```

### Robust Parser (parseAIResponse — Part 1)
5-step parsing pipeline:
1. Strip markdown code blocks (` ```json ``` `)
2. Direct JSON.parse (happy path)
3. Fix LLM errors: trailing commas, unquoted keys, escaped newlines
4. String-aware brace extraction (skips braces inside quoted strings)
5. Last resort: regex extraction + fix

### Response Normalization
- `_extractArray(result, key)` — finds array in: `{key:[...]}`, `{wrapper:{key:[...]}}`, or root `[...]`
- `normalizeClipType(raw)` — 19 fuzzy mappings for LLM clip type output
- `resolveSectionId(raw)` — 4-tier matching against blueprint sections
- `normalizeToHtml(content)` — plain text to `<p>` tags

### Context Builders
```js
buildVideoContext()  // → title, idea, language, tone, platform, duration, mode
buildScriptContext() // → all script section content concatenated
buildClipContext(clip) // → clip title, type, section, script_text, visual_direction
buildSceneContext(clip) // → assigned scene + look + environment details
```

### Clip Generation Specifics
The clip generation prompt includes:
- Explicit valid type IDs (EXACT strings, not labels)
- Explicit section IDs from blueprint
- Duration rules per video model
- Presenter preference rules
- Structural rules (NO template clips if auto-inject enabled)
- Auto-injection: branded-intro + chapter-titles + branded-outro added post-generation for YouTube/LinkedIn

### BrandService
```js
BrandService.isConfigured()    // → boolean (page brand or override exists)
BrandService.getSystemPrompt() // → "Brand context: name, voice, audience, colors..."
BrandService.init()            // → re-parse from page + overrides
```
Brand context is automatically appended to AI prompts when configured.

## Adding a New AI Action

1. Add entry to `AI_ACTIONS` registry in Part 2B Section 4
2. Create the action function in appropriate section
3. Use `_callAIWithRetry()` with `_extractArray()` for response handling
4. Add event handler: `$(document).off('click.vpm2b-xxx').on(...)`
5. Add button in the view renderer (Part 2A) with `data-action="ai-xxx"`
6. Add to `_launchAI()` call in event handler
7. Export in `window._vpmPart2B`
