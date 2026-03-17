# Full Product Redesign Strategy

Date: 2026-03-17
Status: Active
Authority: Canonical redesign direction for all surfaces

---

## Design Vision

Deliberry's redesign elevates the product from functional prototype to premium delivery platform. The visual language is warm, confident, and clean — not flashy, not corporate, not generic SaaS. Every surface must feel intentional, with clear hierarchy, generous breathing room, and consistent component quality.

---

## Cross-Surface Design Principles

### 1. Warm Professional
- Primary coral (#FF4B3A) is the brand signature. Use it for primary CTAs and active states.
- Warm secondary (#FFB74D) adds energy. Use it for accents and highlights, never competing with primary.
- Admin uses indigo (#4F46E5) to signal governance authority. This is the only surface that departs from coral.
- No cold grays. Surface backgrounds use warm-tinted neutrals (#FAFAFA, #F8FAFC).

### 2. Hierarchy First
- Every screen has exactly one primary focal point (largest text, strongest color).
- Secondary information uses muted text (#6B7280) and smaller sizes.
- Tertiary information (timestamps, IDs, metadata) uses the lightest weight (#9CA3AF, 12px).
- Never let two elements compete for attention at the same visual level.

### 3. Breathing Room
- Generous padding is not wasted space — it is premium signaling.
- Section padding: 32px minimum on web, 16px minimum on mobile.
- Card internal padding: 20px on web, 16px on mobile.
- Never pack elements edge-to-edge. Minimum gap between interactive elements: 8px.

### 4. Component Consistency
- Same component type must look identical across all instances within a surface.
- Cards, badges, buttons, tables, forms must follow the DESIGN_SYSTEM_BASELINE exactly.
- No one-off inline styling. Every visual treatment must trace to a defined pattern.

### 5. Honest Presentation
- Placeholder data must never pretend to be live.
- Mock data is displayed with full visual quality but honest labeling.
- Empty states guide users, not embarrass them.
- Loading states signal progress, not abandonment.

---

## Surface-Specific Direction

### customer-app
- **Direction**: Retain current Material 3 foundation. Elevate card depth, loading states, and empty states.
- **Key change**: Add subtle shadows to cards (elevation 1-2). Add skeleton screens. Enhance status badge design.
- **Preserve**: 52px buttons, 16px card radius, coral primary, bottom nav at 72px.

### merchant-console
- **Direction**: Upgrade from utilitarian to polished operational tool.
- **Key changes**: Replace emoji icons with Lucide/Heroicons SVG. Add card shadows. Add table row striping. Add form validation states. Increase primary action button size.
- **Preserve**: Dark sidebar, 240px width, KPI grid, tab navigation.

### admin-console
- **Direction**: Match merchant-console polish level while maintaining governance authority.
- **Key changes**: Same icon/shadow/table upgrades as merchant. Indigo primary stays.
- **Preserve**: Indigo authority color, dark sidebar, summary grids.

### public-website
- **Direction**: Already strongest surface. Refine icon treatment and add section variety.
- **Key changes**: Replace emoji icons with SVG. Add illustration-style elements to empty areas.
- **Preserve**: Hero section, pill buttons, generous spacing, eyebrow patterns.

---

## Implementation Priority

1. **Foundation**: DESIGN_SYSTEM_BASELINE + VISUAL_POLISH_RULES (must be established first)
2. **Icons**: Replace all emoji/Unicode icons with SVG icon library
3. **Cards + Shadows**: Upgrade flat cards to subtle shadow + hover elevation
4. **Loading**: Add skeleton screens to all data-loading contexts
5. **Tables**: Add row striping and improved visual separation
6. **Forms**: Add validation states (error, success, loading)
7. **Empty states**: Enhance with illustrations and contextual guidance
8. **Money formatting**: Adopt formatMoney() across all web surface display code

---

*Strategy established: 2026-03-17*
