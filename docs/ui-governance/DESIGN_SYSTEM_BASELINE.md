# Design System Baseline

Status: active
Authority: binding (UI implementation)
Surface: cross-surface
Last updated: 2026-03-17

---

## 1. Color System

### Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #FF4B3A | Primary CTAs, active nav, links, focus rings |
| `primary-dark` | #E5392A | Primary hover, pressed states |
| `primary-light` | #FFF0EE | Primary tint backgrounds, selected states |
| `secondary` | #FFB74D | Accents, highlights, promotional badges |
| `secondary-light` | #FFF8E1 | Secondary tint backgrounds |

### Admin Authority Color
| Token | Value | Usage |
|-------|-------|-------|
| `admin-primary` | #4F46E5 | Admin-console primary (replaces coral) |
| `admin-primary-dark` | #4338CA | Admin hover |
| `admin-primary-light` | #E0E7FF | Admin tint backgrounds |

### Neutral Colors
| Token | Value | Usage |
|-------|-------|-------|
| `surface` | #FFFFFF | Card backgrounds, modals, sheets |
| `surface-alt` | #F8FAFC | Page backgrounds, table header fills |
| `background` | #FAFAFA | Scaffold backgrounds, input fills |
| `border` | #E5E7EB | Card borders, dividers, input borders |
| `border-light` | #F1F5F9 | Subtle separators, table row borders |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `text` | #111827 | Primary text, headings |
| `text-secondary` | #4B5563 | Descriptions, secondary labels |
| `text-muted` | #9CA3AF | Timestamps, metadata, placeholders |
| `text-inverse` | #FFFFFF | Text on dark/colored backgrounds |

### Status Colors
| Token | Value | Background | Border | Usage |
|-------|-------|-----------|--------|-------|
| `success` | #15803D | #F0FDF4 | #BBF7D0 | Delivered, paid, completed |
| `warning` | #A16207 | #FEFCE8 | #FEF08A | Preparing, processing, attention |
| `error` | #DC2626 | #FEF2F2 | #FECACA | Cancelled, failed, critical |
| `info` | #1D4ED8 | #EFF6FF | #BFDBFE | Pending, in-transit, informational |

### Sidebar Colors
| Token | Merchant | Admin | Usage |
|-------|----------|-------|-------|
| `sidebar-bg` | #1E293B | #0F172A | Sidebar background |
| `sidebar-text` | #E2E8F0 | #CBD5E1 | Sidebar labels |
| `sidebar-active-bg` | rgba(255,75,58,0.15) | rgba(79,70,229,0.15) | Active nav item |

---

## 2. Typography

### Font Stack
- **Mobile (Flutter)**: Roboto (Material 3 default)
- **Web**: `'Inter', system-ui, -apple-system, sans-serif`

### Scale

| Level | Size | Weight | Letter Spacing | Usage |
|-------|------|--------|---------------|-------|
| Display | 28px / 1.75rem | 800 | -0.5px / -0.03em | Page titles (mobile) |
| H1 | 24px / 1.5rem | 800 | -0.3px / -0.03em | Page titles (web) |
| H2 | 20px / 1.25rem | 700 | -0.2px / -0.02em | Section titles |
| H3 | 18px / 1.125rem | 700 | 0 | Card titles |
| Subtitle | 16px / 1rem | 600 | 0 | Subtitles, emphasis labels |
| Body | 14px / 0.875rem | 400 | 0 | Default body text |
| Caption | 12px / 0.75rem | 500 | 0 | Timestamps, metadata, badges |
| Overline | 11px / 0.6875rem | 700 | 0.05em | Table headers, section labels (uppercase) |
| Tiny | 10px / 0.625rem | 500 | 0 | Nav labels, dense metadata |

### Rules
- Headlines use negative letter-spacing for tightness and premium feel.
- Body text uses default letter-spacing for readability.
- Table headers are UPPERCASE, overline weight, muted color.
- Monospace is used only for order IDs and technical identifiers: `'SF Mono', 'Fira Code', monospace`.
- Never use more than 3 font weights on a single screen (typically 400, 600, 700 or 800).

---

## 3. Spacing

### Scale
| Token | Value | Common Usage |
|-------|-------|-------------|
| `space-1` | 4px | Dense internal gaps |
| `space-2` | 8px | Icon-to-text gaps, compact padding |
| `space-3` | 12px | Small card padding, list item gaps |
| `space-4` | 16px | Standard padding, mobile content edges |
| `space-5` | 20px | Card internal padding (web) |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Page content padding (web) |
| `space-10` | 40px | Large section spacing |
| `space-12` | 48px | Major section breaks |
| `space-16` | 64px | Page-level vertical rhythm |

### Rules
- Mobile content edge padding: 16px (space-4).
- Web content area padding: 32px (space-8).
- Card internal padding: 20px (web), 16px (mobile).
- Gap between stacked cards: 12px.
- Gap between form fields: 16px.
- Section title to content: 16px.
- Page title to first content: 24px.

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Badges, chips, small tags |
| `radius-md` | 10px | Web cards, inputs |
| `radius-lg` | 14px | Mobile inputs, buttons |
| `radius-xl` | 16px | Mobile cards |
| `radius-2xl` | 24px | Marketing cards, bottom sheets, pills |
| `radius-full` | 9999px | Circular avatars, pill buttons |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | none | Flat elements |
| `shadow-xs` | 0 1px 2px rgba(0,0,0,0.04) | Subtle card rest state |
| `shadow-sm` | 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04) | Cards at rest |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04) | Cards on hover, dropdowns |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04) | Modals, elevated panels |
| `shadow-primary` | 0 4px 14px rgba(255,75,58,0.25) | Primary CTA hover glow |

### Rules
- All cards MUST have `shadow-sm` at rest (not just border).
- Cards gain `shadow-md` on hover with `translateY(-1px)` lift.
- Modals and sheets use `shadow-lg`.
- Primary CTA buttons use `shadow-primary` on hover.
- Sidebars and headers use no shadow (use border instead).

---

## 6. Component Patterns

### Cards
- Background: `surface`
- Border: 1px solid `border`
- Border radius: `radius-md` (web), `radius-xl` (mobile)
- Shadow: `shadow-sm` at rest, `shadow-md` on hover
- Padding: `space-5` (web), `space-4` (mobile)
- Header: title (H3) + optional action link/button
- Footer: flex row of buttons, separated by `space-3`

### Tables (Web Only)
- Width: 100%
- Header: `surface-alt` background, overline text, uppercase
- Cell padding: 12px horizontal, 10px vertical
- Row hover: `surface-alt` background
- Alternating rows: every other row gets `surface-alt` (optional, prefer for dense tables)
- Border: bottom border `border-light` on each row
- Numeric columns: right-aligned, monospace for money values
- Status column: inline badge

### Buttons
| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `primary` | white | none | Main CTAs |
| Secondary | `surface` | `text-secondary` | 1px `border` | Secondary actions |
| Ghost | transparent | `text-secondary` | none | Tertiary actions |
| Danger | `error` | white | none | Destructive actions |
| Success | `success` | white | none | Confirmation actions |

- Size (mobile): height 52px, full width default, radius 14px
- Size (web): padding 8px 16px, radius 8px. Primary actions: 10px 20px.
- Disabled: opacity 0.5, cursor not-allowed
- Loading: spinner icon replaces text, same dimensions

### Status Badges
- Small pill shape: padding 4px 10px, radius 6px, font 12px weight 600
- Color: semantic background + matching text + matching border (1px)
- Mapping:
  - `pending` / `draft` / `open` → info (blue)
  - `confirmed` / `in_progress` / `investigating` → info (blue)
  - `preparing` / `processing` / `scheduled` → warning (amber)
  - `ready` / `awaiting_reply` → warning (amber)
  - `in_transit` → info (blue)
  - `delivered` / `paid` / `resolved` / `closed` → success (green)
  - `cancelled` / `failed` → error (red)
  - `disputed` / `escalated` → error (red)

### Form Inputs
- Height: 44px (web), 52px (mobile)
- Background: `background` (#FAFAFA)
- Border: 1px solid `border`, radius `radius-md` (web) or `radius-lg` (mobile)
- Focus: 2px `primary` border
- Error: 2px `error` border + error message below (12px, error color)
- Success: 2px `success` border + checkmark icon
- Disabled: opacity 0.6, no interaction
- Label: above input, caption weight, `text-secondary`
- Helper text: below input, tiny size, `text-muted`

### Empty States
- Centered layout, max-width 320px
- Icon: 48px, muted color (20% opacity)
- Title: H3, `text` color
- Description: body, `text-secondary`, max 2 lines
- CTA button: primary or secondary variant
- Minimum vertical padding: 64px

### Skeleton Loading
- Shape matches content being loaded (rectangle for text, circle for avatar, full-width for table rows)
- Background: linear gradient animation from `border-light` to `surface-alt` to `border-light`
- Animation: shimmer, 1.5s infinite
- Duration: show immediately, replace when data arrives
- Table skeleton: 5 rows of shimmer bars at varied widths

---

## 7. Icons

### Standard
- **Mobile (Flutter)**: Material Icons (already in use)
- **Web (Next.js)**: Lucide React (recommended) or Heroicons
- Size: 20px for inline, 24px for navigation, 48px for empty states
- Stroke width: 1.5px (Lucide default)
- Color: inherits text color by default

### Rules
- Never use emoji or Unicode characters as icons in production code.
- Icons must be SVG-based for crisp rendering at all sizes.
- Navigation icons: 24px, stroke matching sidebar/nav text color.
- Action icons: 20px, paired with text labels.
- Decorative icons: 48px, muted color, used in empty states and feature highlights.

---

*Baseline established: 2026-03-17*
