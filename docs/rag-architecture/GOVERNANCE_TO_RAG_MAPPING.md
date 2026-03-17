# Governance to RAG Mapping

Status: Proposed
Last updated: 2026-03-16

## 1. Retrieval Priority Model

Retrieval should follow repository authority, not document convenience.

1. Constitutional constraints
2. Identity and ownership constraints
3. Flow and state constraints
4. Time/date constraints
5. Surface-local runtime truth
6. UX/UI governance and pattern rules
7. Reviews, audits, and backlog context

Agents should not retrieve lower-priority implementation notes first when a higher-priority authority exists.

## 2. Authority Mapping

### Constitution
- Source: [docs/governance/CONSTITUTION.md](/Users/andremacmini/Deliberry/docs/governance/CONSTITUTION.md)
- Retrieval role: hard constraint unit
- Influence on RAG:
  - always retrieved for architecture-affecting work
  - provides rule IDs for downstream chunk linking
  - should rank above local code convenience
- Practical triggers:
  - shared-boundary changes
  - auth/role changes
  - money/time/status changes
  - destructive or scope-altering proposals

### Identity
- Source: [docs/governance/IDENTITY.md](/Users/andremacmini/Deliberry/docs/governance/IDENTITY.md)
- Retrieval role: actor/domain vocabulary unit
- Influence on RAG:
  - defines chunk tags for actor, entity, and domain
  - prevents incorrect role mixing across surfaces
- Practical triggers:
  - auth/session work
  - role-based routing
  - domain entity modeling

### Structure
- Source: [docs/governance/STRUCTURE.md](/Users/andremacmini/Deliberry/docs/governance/STRUCTURE.md)
- Retrieval role: file placement and dependency authority
- Influence on RAG:
  - drives file-map retrieval
  - decides whether a change belongs in a surface, shared, or docs
  - should link directly to local feature readmes and filemaps
- Practical triggers:
  - new feature placement
  - cross-surface import questions
  - shared-module questions

### Flow
- Source: [docs/governance/FLOW.md](/Users/andremacmini/Deliberry/docs/governance/FLOW.md)
- Retrieval role: lifecycle/state machine authority
- Influence on RAG:
  - drives flow-based chunking
  - should connect routes, state transitions, and status enums
  - should be retrievable by domain flow, not only by whole document
- Practical triggers:
  - order, payment, settlement, dispute, support flows
  - journey validation
  - status transition fixes

### Date
- Source: [docs/governance/DATE.md](/Users/andremacmini/Deliberry/docs/governance/DATE.md)
- Retrieval role: time-sensitive correctness authority
- Influence on RAG:
  - should be attached to any timestamp, schedule, settlement period, or analytics retrieval
  - requires metadata for time zone, UTC storage, and display transformation
- Practical triggers:
  - timestamp fields
  - analytics ranges
  - settlement/reporting logic

### Decision
- Current state: referenced implicitly, not established as a mature active document family
- Retrieval role: rationale/exception history unit
- Influence on RAG:
  - should exist as a sparse, high-value exception record set
  - should not be fabricated from generic ADR templates
- Practical triggers:
  - rule exceptions
  - architectural forks
  - “why was this done here” questions

### Decay Path
- Source: [docs/governance/DECAY_PATH.md](/Users/andremacmini/Deliberry/docs/governance/DECAY_PATH.md), [docs/ui-governance/UX_DECAY_PATH.md](/Users/andremacmini/Deliberry/docs/ui-governance/UX_DECAY_PATH.md)
- Retrieval role: warning and anti-pattern unit
- Influence on RAG:
  - should be retrieved alongside change planning and PR review
  - should tag code/filemaps with likely decay risks
- Practical triggers:
  - refactors
  - abstraction proposals
  - UI/system consistency work

### UX/UI governance
- Sources: `docs/ui-governance/*.md`
- Retrieval role: customer UI pattern and runtime honesty authority
- Influence on RAG:
  - should chunk by screen type, composition pattern, interaction pattern, state model, and navigation truth
  - should be scoped to customer-app until other surfaces gain equivalent systems
- Practical triggers:
  - customer screen work
  - CTA/state changes
  - navigation truth or runtime honesty changes

## 3. Downstream Retrieval Categories

Governance authorities should feed these retrieval categories:
- `constraint`: constitution, guardrails, surface separation
- `ownership`: identity, surface ownership, structure
- `flow`: lifecycle, route continuity, journey rules
- `runtime_truth`: session controllers, repositories, runtime controllers
- `pattern`: UI system, composition, interaction, state, accessibility
- `rationale`: decisions, exceptions, change logs
- `risk`: decay paths, gap audits, backlog

These categories are not parallel authorities. They are retrieval views over the existing authorities.

## 4. What This Means in Practice

### For code generation
- Retrieve authority first, then local runtime truth, then adjacent file cluster.

### For audits
- Retrieve authority, decay, current gap audit, then code.

### For bug fixing
- Retrieve the flow or runtime-truth unit first, not the whole governance tree.

### For UI work
- Retrieve screen-type, interaction, state, and navigation-truth units together.

## 5. Required RAG Behavior

Any repository RAG layer should:
- prefer binding docs over plans
- prefer active docs over historical reviews
- prefer local feature context over broad repo search when work is already surface-scoped
- expose stale or historical status explicitly
- attach code references to governance chunks wherever possible
