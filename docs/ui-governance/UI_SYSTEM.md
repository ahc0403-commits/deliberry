# UI System

Status: active
Authority: advisory
Surface: customer-app
Domains: tokens, theme, spacing, surfaces
Last updated: 2026-03-16
Last verified: 2026-03-16
Retrieve when:
- touching colors, spacing, type, card surfaces, or reusable visual patterns
- checking whether a new visual token is already covered by the current customer theme
Related files:
- customer-app/lib/core/theme/app_theme.dart
- customer-app/lib/features/common/presentation/widgets.dart
- customer-app/lib/app/shells/main_shell.dart

## Baseline Source
- Theme: `customer-app/lib/core/theme/app_theme.dart`
- Shared widgets: `customer-app/lib/features/common/presentation/widgets.dart`
- Shell: `customer-app/lib/app/shells/main_shell.dart`

## Design Tokens Already Present

### Color Roles
- `Primary`: `#FF4B3A`
  - Use for filled CTAs, active nav, selected chips, key highlights, and high-priority badges.
- `Secondary`: `#FFB74D`
  - Use for ratings, warm accents, and supportive highlight moments.
- `Surface`: `#FFFFFF`
  - Use for cards, sheets, app bars, nav containers.
- `Background`: `#FAFAFA`
  - Use for page canvas and recessed areas.
- `Text Primary`: `#1A1A2E`
  - Use for all primary reading and headline text.
- `Text Secondary`: `#6B7280`
  - Use for metadata, helper text, timestamps, and secondary labels.
- `Border`: `#E5E7EB`
  - Use as the default outline and divider color.
- `Success`: `#22C55E`
  - Use for positive status, delivered states, and discount values.
- `Error`: `#EF4444`
  - Use for destructive actions and hard failures.

### Global Color Rules
- Orange is the only strong universal action color.
- Status colors must map to meaning, not decoration.
- Do not invent new accent colors for each screen when an existing role already fits.
- If a screen needs a special hero gradient, it still has to resolve back to the app palette.

## Typography Roles
- `Headline Large`: `28 / 800`
- `Headline Medium`: `24 / 700`
- `Headline Small`: `20 / 700`
- `Title Large`: `18 / 700`
- `Title Medium`: `16 / 600`
- `Body Large`: `16 / 400`
- `Body Medium`: `14 / 400`
- `Body Small`: `12 / 400`
- `Label Large`: `14 / 600`
- `Label Medium`: `12 / 500`

### Typography Rules
- Use weight before size to create hierarchy.
- Reserve the heaviest headlines for entry, auth, onboarding, status hero, and primary feature intros.
- Keep dense metadata at `12-14`.
- Do not drop below `12` for important readable copy.

## Spacing System
- Page horizontal padding:
  - `16` for list/feed/detail surfaces
  - `20-24` for focused forms and modal sheets
- Card internal padding:
  - `12-16` for compact cards and rows
  - `20-24` for major sections and hero cards
- Vertical rhythm:
  - `8` between related label/value or chip groups
  - `12` between adjacent cards or row blocks
  - `16` between major stacked sections
  - `24-32` between page-level content groups
- Sticky bars and sheets:
  - always add safe-area bottom padding plus `16`

## Radius And Elevation Usage
- Cards: `16`
- Buttons and inputs: `14`
- Chips and pills: `24`
- Bottom sheets: top radius `24`
- Icon chips / small inner blocks: `8-12`
- Elevation:
  - default cards stay flat with borders
  - shell nav may use subtle shadow
  - do not rely on deep shadows for hierarchy

## Icon Usage
- Icons are structural and semantic.
- Use rounded icons consistently, following the current app style.
- Pair icons with labels for actions and settings rows.
- Decorative icons may sit inside tinted chips or colored circles.
- Do not use an icon as the only meaning carrier when the action is not universally obvious.

## Section Spacing Rhythm
- Each screen should read as a sequence of clear blocks.
- Preferred order:
  - context/header
  - selection or information cards
  - detail or supporting blocks
  - primary CTA
- Feed screens may add merchandising rails between header and list.
- Form screens should avoid more than three major blocks before the CTA.

## Surface Hierarchy
- Level 1: page canvas on `Background`
- Level 2: white cards and white structural bars
- Level 3: tinted chips, badges, promo gradients, icon wells
- Level 4: primary CTA and selected state accents

## Global Consistency Vs Screen-Specific Expression

### Globally Consistent
- palette
- typography scale
- card shapes
- chip shapes
- input styling
- button sizing
- bottom CTA structure
- empty state format
- order/status badge treatment
- shell navigation style

### Screen-Specific
- hero gradients for entry, onboarding, promotions, and order status
- store hero color from store presentation data
- category icon colors from `MockData`
- section ordering by screen type

## Hard Rules
- Do not create a new token layer disconnected from `AppTheme`.
- Do not bypass shared customer widgets for common patterns that already exist.
- Do not move customer UI widgets into repo-level `shared`.
