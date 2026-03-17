# Visual Polish Rules

Status: active
Authority: binding (UI quality)
Surface: cross-surface
Last updated: 2026-03-17

---

## Purpose

These rules define the minimum visual quality bar for all Deliberry surfaces. Every implementation must meet these standards. If a screen does not meet these rules, it is not ready for review.

---

## 1. Card Quality

### Rest State
- Background: `surface` (#FFFFFF)
- Border: 1px solid `border` (#E5E7EB)
- Shadow: `shadow-sm` (REQUIRED — flat borderless cards are not acceptable)
- Border radius: `radius-md` (10px web), `radius-xl` (16px mobile)
- Padding: 20px (web), 16px (mobile)

### Hover State (Web Only)
- Shadow: `shadow-md`
- Transform: `translateY(-1px)`
- Transition: `all 0.15s ease`
- Border color may shift to `border` (slightly darker) or `primary-light`

### Active/Selected State
- Border: 2px solid `primary`
- Background: `primary-light` tint
- Shadow: `shadow-sm` (maintained, not removed)

### Forbidden
- No cards with border-only and no shadow
- No cards with zero padding
- No cards with inconsistent border radius within the same screen

---

## 2. Table Quality

### Header Row
- Background: `surface-alt`
- Text: overline style (11px, uppercase, weight 700, letter-spacing 0.05em, `text-muted`)
- Padding: 10px 16px
- Bottom border: 1px solid `border`

### Data Rows
- Padding: 10px 16px
- Bottom border: 1px solid `border-light`
- Hover: background shifts to `surface-alt`
- Transition: `background-color 0.1s ease`

### Numeric Columns
- Right-aligned
- Monospace font for money values
- Use `formatMoney()` — never raw numbers or inline division

### Status Columns
- Display as badge (never plain text)
- Badge follows semantic color mapping

### Empty Table
- Full-width centered empty state with icon + title + description
- Minimum height: 200px
- Never show an empty `<tbody>` with no feedback

### Forbidden
- No tables without header styling
- No tables with only hover as row separator (must have bottom border)
- No money columns without right alignment
- No status displayed as plain text

---

## 3. Button Quality

### Primary Button
- Background: `primary`, text: white
- Hover: `primary-dark`, shadow: `shadow-primary`
- Active: scale 0.98
- Disabled: opacity 0.5, cursor `not-allowed`
- Loading: spinner replaces text, same button dimensions maintained

### Secondary Button
- Background: `surface`, text: `text-secondary`, border: 1px `border`
- Hover: background `surface-alt`, border `border` (darker)
- Disabled: opacity 0.5

### Ghost Button
- Background: transparent, text: `text-secondary`
- Hover: background `surface-alt`

### Sizing
- Mobile: height 52px, full-width, text 16px weight 700, radius 14px
- Web standard: padding 8px 16px, text 14px weight 600, radius 8px
- Web primary CTA: padding 10px 20px, text 14px weight 700, radius 8px

### Forbidden
- No buttons without hover state
- No buttons without disabled state
- No buttons that change dimensions during loading
- No ghost buttons as primary actions

---

## 4. Badge Quality

### Structure
- Padding: 4px 10px
- Border radius: 6px
- Font: 12px, weight 600
- Border: 1px solid (matching semantic color, lighter shade)

### Color Application
- Background: lightest semantic shade (e.g., `#F0FDF4` for success)
- Text: darkest semantic shade (e.g., `#15803D` for success)
- Border: medium semantic shade (e.g., `#BBF7D0` for success)

### Forbidden
- No badges with only background color (must have text + border contrast)
- No badges larger than caption size
- No badges used for primary actions (badges are read-only indicators)

---

## 5. Form Quality

### Labels
- Position: above input, never inside
- Style: caption weight (12px, weight 500, `text-secondary`)
- Required indicator: red asterisk after label text

### Inputs
- Height: 44px (web), 52px (mobile)
- Background: `background` (#FAFAFA)
- Border: 1px `border`, focused: 2px `primary`
- Error: 2px `error` border, error message below (12px, `error` color)
- Placeholder: `text-muted`, weight 400

### Validation Timing
- Validate on blur (not on every keystroke)
- Show error state after first blur if invalid
- Clear error state immediately on valid input
- Submit button validates all fields and scrolls to first error

### Forbidden
- No floating labels (use static labels above inputs)
- No inputs without focus state
- No forms without validation feedback
- No submit buttons that do not show loading state during submission

---

## 6. Empty State Quality

### Structure
- Centered, max-width 320px
- Top: icon (48px, `text-muted` at 20% opacity)
- Title: H3 size, `text` color, weight 700
- Description: body size, `text-secondary`, 1-2 lines max
- CTA: primary or secondary button below description
- Vertical padding: 64px minimum

### Personality
- Title should be empathetic, not technical ("No orders yet" not "Error: 0 records")
- Description should guide next action ("Browse restaurants to place your first order")
- CTA should match the guidance ("Browse Restaurants")

### Forbidden
- No blank screens (every empty data state must have an explicit empty state)
- No error codes in empty state titles
- No empty states without a CTA when action is possible

---

## 7. Loading State Quality

### Skeleton Screens
- Use for any content that takes > 200ms to load
- Shape: match the content layout (rectangles for text, circles for avatars)
- Animation: shimmer gradient, left-to-right, 1.5s infinite
- Color: `border-light` → `surface-alt` → `border-light`

### Button Loading
- Replace button text with 20px spinner
- Maintain exact button dimensions (no layout shift)
- Disable button during loading
- Never show both spinner and text simultaneously

### Page Loading
- Render shell immediately (sidebar, header, page title)
- Content area shows skeleton
- Never show a full-page spinner
- Never show a blank white screen during load

### Forbidden
- No screens without loading indication
- No spinners as the only loading pattern (prefer skeletons for content)
- No layout shifts when content arrives

---

## 8. Transition Quality

### Standard Transitions
- Color changes: 0.15s ease
- Shadow changes: 0.15s ease
- Transform (hover lift): 0.15s ease
- Opacity: 0.2s ease
- Content appearing: 0.2s ease-out

### Page Transitions (Mobile)
- Forward: slide from right
- Back: slide from left
- Modal: slide from bottom
- Sheet: slide from bottom with backdrop fade

### Forbidden
- No instant state changes on interactive elements (must transition)
- No transitions longer than 0.3s for micro-interactions
- No transitions on initial page render (only on state change)

---

## 9. Spacing Discipline

### Minimum Spacing Rules
- Between interactive elements: 8px minimum
- Card internal content to card edge: 16px minimum (mobile), 20px minimum (web)
- Section title to content below: 16px
- Page title to first section: 24px
- Between stacked cards: 12px
- Between form fields: 16px
- Text baseline to next text baseline: follow line-height (1.5 for body, 1.3 for headings)

### Forbidden
- No elements touching card edges (always maintain inner padding)
- No interactive elements closer than 8px
- No inconsistent spacing between identical element types on the same screen

---

## 10. Icon Quality

### SVG Only
- All icons must be SVG-based
- Mobile: Material Icons (Flutter)
- Web: Lucide React or Heroicons (consistent library per surface)
- Size: 20px inline, 24px navigation, 48px decorative

### Forbidden
- No emoji characters as icons in production UI
- No Unicode symbols as icons (arrows, bullets — use SVG)
- No mixing icon libraries within a single surface
- No icons without consistent stroke width (1.5px standard)

---

*Polish rules established: 2026-03-17*
