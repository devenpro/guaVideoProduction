# VPM Style Reference

## Design Tokens (CSS Variables)

### Colors
| Variable | Value | Usage |
|----------|-------|-------|
| `--vpm-primary` | #1a73e8 | Primary blue, buttons, active states |
| `--vpm-primary-hover` | #1557b0 | Hover state for primary |
| `--vpm-primary-light` | #e8f0fe | Light tint backgrounds |
| `--vpm-primary-subtle` | #f0f6ff | Very light tint for selections |
| `--vpm-accent` | #7c3aed | Purple, AI features |
| `--vpm-success` | #0d904f | Green, completion states |
| `--vpm-error` | #d93025 | Red, destructive actions |
| `--vpm-warning` | #e37400 | Orange, warnings |
| `--vpm-info` | #0891b2 | Teal, informational |
| `--vpm-gray-50` through `--vpm-gray-900` | Gray scale | Backgrounds, borders, text |

### Typography
| Variable | Value |
|----------|-------|
| `--vpm-font-family` | 'Plus Jakarta Sans', -apple-system, sans-serif |
| `--vpm-font-display` | 'Plus Jakarta Sans', sans-serif |
| `--vpm-font-mono` | 'JetBrains Mono', monospace |
| `--vpm-font-xs` | 11px |
| `--vpm-font-sm` | 13px |
| `--vpm-font-base` | 14px |
| `--vpm-font-md` | 15px |
| `--vpm-font-lg` | 16px |
| `--vpm-font-xl` | 18px |

### Spacing
`--vpm-space-1` through `--vpm-space-6` (4px, 8px, 12px, 16px, 20px, 24px)

### Radii
`--vpm-radius-sm` (6px), `--vpm-radius-md` (8px), `--vpm-radius-lg` (12px), `--vpm-radius-full` (9999px)

## Key Component Classes

### Clips Page (131 CSS rules)
| Class | Purpose |
|-------|---------|
| `.vpm-clips-split` | Flex split layout (list + detail) |
| `.vpm-clips-list-panel` | Left panel, 280px, scrollable |
| `.vpm-clips-list-header` | "Clips (N)" header with add button |
| `.vpm-clips-group-head` | Section group header with progress bar |
| `.vpm-clips-list-item` | Clip row (hover shows reorder) |
| `.vpm-clips-list-active` | Active clip highlight (primary bg + border) |
| `.vpm-clip-detail-container` | White bordered detail wrapper |
| `.vpm-clip-nav` | Prev/next clip navigation bar |
| `.vpm-clip-section` | Structured block inside detail tabs |
| `.vpm-clip-workflow` | AI status step bar |
| `.vpm-clip-reorder` | Hover-only ↑↓ buttons |
| `.vpm-scene-preview-card` | Scene assignment info card |
| `.vpm-prompt-box` | Monospace prompt display |
| `.vpm-prompt-positive` | Green left-border prompt |
| `.vpm-prompt-negative` | Red left-border negative prompt |
| `.vpm-model-info-card` | Video model info display |
| `.vpm-dur-chip` / `.vpm-dur-chip-active` | Duration selection chips |
| `.vpm-template-card` | Template clip info card |
| `.vpm-upload-zone` | Dashed upload area (Non-AI) |
| `.vpm-track-progress-*` | Per-track progress bars |

### Settings Page
| Class | Purpose |
|-------|---------|
| `.vpm-settings-grid` | Info row layout |
| `.vpm-provider-card` | AI provider card with models |
| `.vpm-settings-toggle` | Custom toggle switch |
| `.vpm-toggle-track` / `.vpm-toggle-on` | Toggle track + active state |
| `.vpm-dur-model-card` | Duration model config card |
| `.vpm-panel-danger` | Red-bordered danger zone |
| `.vpm-danger-item` | Danger zone action row |
| `.vpm-entity-ie-grid` | Entity import/export grid |

### Sidebar
| Class | Purpose |
|-------|---------|
| `.vpm-sidebar` | Main sidebar container |
| `.vpm-sidebar-collapsed` | 56px icon-rail mode |
| `.vpm-sidebar-header` | Brand + collapse button |
| `.vpm-nav-item` | Navigation button |
| `.vpm-nav-dot` / `.vpm-nav-step` | Step number circle |
| `.vpm-nav-progress` | Per-stage progress bar |

### Toast System
| Class | Purpose |
|-------|---------|
| `.vpm-toast` | Base toast (dark bg, slide-in) |
| `.vpm-toast-success/error/warning/info` | Type variants (colored left border) |
| `.vpm-toast-close` | Dismiss button |
| `.vpm-toast-show` | Visible state (translateX 0) |

## CSS File Organization

### vpm-part1.css (23 sections)
S1: Design Tokens, S2: Reset, S3: App Shell, S4: Header, S5/S5B: Sidebar + Collapsed, S6: Content, S7: Panels, S8: Buttons, S9: Forms, S10/S10A/S10B: Badges/Timeline/Duration, S11-S21: Component styles, S22: Responsive, S23: Keyboard shortcuts

### vpm-part2.css (21 sections)
S1: Modals, S2: Confirm, S3: Inner Tabs, S4-S10: Stage styles, S11: Clips (major section), S12-S17: Frame/Prompt/Entity/Publish/Thumbnail, S18B: Settings, S19: Responsive overrides
