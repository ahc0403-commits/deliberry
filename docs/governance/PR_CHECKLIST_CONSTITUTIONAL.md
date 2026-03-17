# PR Review Checklist — Constitutional Compliance

> **Classification: Supporting Operational Artifact** — This is NOT a canonical governance document.
> Canonical enforcement procedures are defined in ENFORCEMENT_CHECKLIST.md.
> This file provides a detailed PR-specific review checklist derived from constitutional rules.

Status: active
Authority: operational (supporting artifact, derived from CONSTITUTION.md)
Surface: cross-surface
Domains: review, governance, compliance
Last updated: 2026-03-14
Last verified: 2026-03-16
Retrieve when:
- reviewing a pull request for governance compliance
- turning constitutional rules into an applied review checklist
Related files:
- docs/governance/CONSTITUTION.md
- docs/governance/DECAY_PATH.md
- docs/governance/ENFORCEMENT_POINTS.md

> Every pull request that modifies code in any surface or `shared` MUST be reviewed
> against this checklist before merge. Reviewers MUST check all applicable items.

References: CONSTITUTION.md

---

## 1. Surface Boundary (R-001 — R-005)

- [ ] No runtime imports cross surface boundaries (e.g., no `import from '../../merchant-console/...'`)
- [ ] No UI components, routing logic, or session state added to `shared/`
- [ ] Web surfaces import from repo-level `shared` only through `src/shared/domain.ts` adapter
- [ ] No new surface added without updating CONSTITUTION.md
- [ ] Each surface builds and typechecks independently

## 2. Money Integrity (R-010 — R-014)

- [ ] All new monetary values use integer centavos (not float)
- [ ] No `parseFloat` or floating-point arithmetic on money values
- [ ] Currency references use `'ARS'` as primary (not `'VND'`)
- [ ] Money display uses `formatMoney()` utility — no inline currency formatting
- [ ] Settlement, refund, and commission amounts use centavo representation

## 3. Identity & Permissions (R-020 — R-024)

- [ ] All new mutations attribute an actor (`actor_id` + `actor_type`)
- [ ] No client-side-only permission checks on sensitive operations
- [ ] Admin role checks reference `PERMISSION_ROLES` enum
- [ ] Merchant operations are scoped to a specific `store_id`
- [ ] Guest access limited to browse and cart — no order placement without auth

## 4. Data Immutability (R-030 — R-033)

- [ ] No `DELETE` operations on orders, payments, settlements, or audit logs
- [ ] Status changes use state machine transitions, not direct field updates
- [ ] Settlement corrections use new adjustment entries, not retroactive modification
- [ ] Audit log entries are append-only

## 5. Status Enums (R-040 — R-043)

- [ ] All new status values exist in the canonical enum at `shared/constants/domain.constants.ts`
- [ ] No surface-local status values invented without updating canonical first
- [ ] Mock data uses only canonical status values
- [ ] Switch/case statements on status fields handle all canonical values

## 6. Timestamps (R-050 — R-053)

- [ ] All new timestamps stored as UTC ISO 8601 (ending with `Z`)
- [ ] No local Argentine time strings stored in database or API fields
- [ ] Timezone conversion to Buenos Aires happens only in presentation/display code
- [ ] No `new Date()` without UTC context in server-side code
- [ ] No relative time strings (`"2 min ago"`) in persistent storage

## 7. Audit Trail (R-060 — R-062)

- [ ] Mutations to governed entities (Order, Payment, Settlement, User, Merchant) produce audit log entries
- [ ] Audit entries include: `actor_id`, `actor_type`, `action`, `resource_type`, `resource_id`, `timestamp_utc`
- [ ] Audit log writes are not performed by the actor who triggered the event (system-level write)

## 8. Forbidden Patterns (R-070 — R-074)

- [ ] No direct database mutations bypassing business logic layer
- [ ] No feature flags or dev shortcuts deployed without governance review
- [ ] No hardcoded credentials, API keys, or secrets in code or docs
- [ ] No cross-surface session sharing
- [ ] No real payment/money movement without finance and legal review

## 9. Naming Conventions

- [ ] TypeScript files use kebab-case
- [ ] Dart files use snake_case
- [ ] React/Flutter components use PascalCase
- [ ] Functions/methods use camelCase
- [ ] Constants use SCREAMING_SNAKE_CASE
- [ ] Database tables use snake_case plural
- [ ] Events use past-tense verb + noun pattern
- [ ] No `any` type in contract or schema files

## 10. Test Coverage

- [ ] New business logic has corresponding test coverage
- [ ] State machine transitions have positive and negative test cases
- [ ] Money calculations have test cases verifying integer centavo behavior
- [ ] Permission checks have test cases for allowed and denied scenarios
- [ ] No test-only hacks that weaken production code

---

## Reviewer Notes

- If any checkbox fails, the PR MUST NOT be merged until the issue is resolved.
- For items not applicable to the PR, mark as N/A with a brief reason.
- Exception requests follow the process in CONSTITUTION.md Section 4.
- When in doubt, check CONSTITUTION.md for the authoritative rule.
