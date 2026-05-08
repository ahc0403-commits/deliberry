# Admin Console -- Go-Live Operational Verification Checklist

**Date:** 2026-05-06
**Commit:** working tree
**Surface:** admin-console
**Status:** Local RC verification checkpoint, not a hosted release signoff

---

## Build / Analyze

| Item | Status | Evidence |
|---|---|---|
| `npm run typecheck` passes locally | PROVEN | Latest local typecheck passed after admin long-tail i18n and pane work |
| Protected routes compile under current auth/runtime guards | PROVEN | dashboard, stores, merchants, users, customer-service, disputes, settlements, finance, marketing, announcements, catalog, b2b, analytics, reporting, system-management |
| Graceful degraded states exist for runtime outage | PROVEN | runtime-unavailable surface added instead of Next crash overlay behavior |

---

## Auth / Session / Access Boundary

| Item | Status | Evidence |
|---|---|---|
| Session-required vs invalid-credentials vs auth-unavailable are separated | PROVEN | `auth-actions.ts`, login-screen behavior |
| Session-expired and access-denied are separated at route boundary | PROVEN | `access.ts`, `middleware.ts`, `access-boundary-screen.tsx` |
| Role-required handoff remains explicit | PROVEN | `/access-boundary` route and permissions UI |
| Admin auth remains admin-local and separate from merchant auth | PROVEN | `docs/runtime-truth/admin-auth-session-truth.md`, `docs/runtime-truth/admin-permissions-truth.md` |

**Current limitation:** This checklist only claims the current admin-local boundary model. It does not claim a fully governed enterprise IAM stack.

---

## Runtime / Governance Surfaces

| Area | Status | Evidence |
|---|---|---|
| Dashboard summary and alert surface | PROVEN | runtime-backed and localized |
| Stores / merchants / users detail panes | PROVEN | runtime-backed read-only governance panes |
| Customer-service / disputes | PROVEN | runtime-backed triage panes plus existing audited queue actions |
| Settlements / finance | PARTIAL | oversight copy and runtime reads are in place; no full financial workflow claim |
| Marketing / announcements / catalog / b2b | PROVEN | locale wiring and fixture baseline updated to Vietnam-market tone |
| Analytics / reporting / system-management | PARTIAL | operational surfaces are localized and coherent, but remain lighter-weight than core governance paths |

---

## Visual QA -- Local

| Flow | Status | Evidence |
|---|---|---|
| `/login` locale switching and error copy | PROVEN | EN/KO/VI visual pass |
| `/dashboard`, `/stores`, `/merchants`, `/users` | PROVEN | visual verification after auth/runtime stabilization |
| `/customer-service`, `/disputes` VI labels | PROVEN | runtime enum labels and descriptions verified in VI |
| `/marketing`, `/announcements`, `/catalog`, `/b2b` VI | PROVEN | hero/subtitle/status/type/date layers visually verified |
| B2B partner names | PROVEN | refreshed runtime shows Vietnam-baseline partner names after local reset |

**Local-only caveat:** These checks were performed on local dev runtime and seeded Supabase data. Hosted alias parity is still a separate gate.

---

## Product Readiness Slice

| Area | Status | Notes |
|---|---|---|
| Auth/login/access boundary | PROVEN | reason-aware and no longer crashes on outage |
| Governance directory surfaces | PROVEN | stores/merchants/users now have meaningful runtime panes |
| Triage operations | PROVEN | support/disputes reflect runtime truth and localized labels |
| Settlement / finance oversight | PARTIAL | read/visibility surfaces are present; not a payment-verification workflow |
| Long-tail operations | PARTIAL | localized and structurally coherent, but not all are deep runtime programs |

---

## Release Blocking Items

| # | Blocker | Severity | Detail |
|---|---|---|---|
| 1 | Hosted admin auth/env parity not yet signed off | HIGH | Local admin runtime is stable, but hosted env parity still needs a dedicated smoke pass |
| 2 | Physical device/browser matrix not fully attached | MEDIUM | local browser passes exist; target-device evidence is still separate work |
| 3 | Settlements/finance remain oversight-only | LOW | approved current truth, but must not be oversold as full financial operations |
| 4 | No enterprise IAM claim | LOW | current admin-local session model is intentional and documented |

---

## Manual Local Smoke Order

1. Open `/login` and confirm locale switch and reason-aware error states.
2. Sign in with seeded admin account on local runtime.
3. Visit `/dashboard`, `/stores`, `/merchants`, `/users`.
4. Open detail panes for each governance directory surface.
5. Visit `/customer-service` and `/disputes`; verify queue and pane content.
6. Visit `/settlements` and `/finance`; confirm oversight wording remains honest.
7. Visit `/marketing`, `/announcements`, `/catalog`, `/b2b`, `/analytics`, `/reporting`, and `/system-management`.
8. Sign out and verify protected routes redirect correctly.

---

## Known Non-Claims

- Payment verification
- Finalized settlement reconciliation workflow
- Enterprise IAM / SSO
- Real-time tracking
- Hosted production-alias signoff
