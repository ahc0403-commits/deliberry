# Customer App Shared Adoption Strategy

## Purpose

This document defines the safe, language-neutral adoption path for `customer-app` to consume `shared` contracts without forcing TypeScript runtime coupling into Flutter.

## Current Constraint

- `customer-app` is a Flutter/Dart surface.
- `shared` currently exposes canonical contracts as TypeScript and JSON assets.
- Direct TypeScript imports into Flutter are structurally wrong and are not allowed as a shortcut.

## What Must Not Happen

- do not import `.ts` files directly into Flutter
- do not mirror shared contracts manually in many unrelated Dart files without a sync strategy
- do not move Flutter adapters into repo-level `shared`
- do not treat surface-local placeholder state as if it were the canonical contract source

## Recommended Adoption Path

### Step 1. Treat `shared` as canonical vocabulary

Customer work should treat the following as the source of truth:

- shared constants
- shared domain types
- shared model semantics
- shared validation schemas

This is a contract decision, not a runtime import decision.

### Step 2. Add customer-local adapter layer

When customer adoption begins, add a customer-local adapter layer under `customer-app/lib/core` or `customer-app/lib/shared` that:

- maps shared contract vocabulary into Dart-friendly constants and model shapes
- stays surface-local
- does not become a second canonical contract source

### Step 3. Use language-neutral export strategy if needed

If direct cross-runtime reuse becomes necessary, prefer one of these:

- JSON schema consumption from `shared/validation`
- JSON constant exports from `shared/constants`
- generated Dart models/constants from shared source files
- a documented export step that creates Dart-safe artifacts from shared contracts

### Step 4. Adopt by vocabulary first

Customer should adopt shared in this order:

1. order statuses
2. payment method placeholder labels
3. support/legal vocabulary where relevant
4. store/menu/order DTO vocabulary
5. validation rules

### Step 5. Keep runtime behavior local

Even after adoption:

- customer routing stays in `customer-app/lib/app/router/`
- customer state stays local to customer features
- customer runtime orchestration stays out of `shared`

## Success Criteria

- customer uses canonical shared vocabulary without invalid TypeScript coupling
- customer keeps runtime logic local
- shared remains contract-only
- duplicated customer vocabulary is reduced safely

## Current Implemented Step

The current repository now uses a staged compatibility path:

- language-neutral export file:
  - `shared/constants/domain.constants.json`
- customer-local adapter boundary:
  - `customer-app/lib/core/shared_contracts/domain_contract_bridge.dart`

This keeps Flutter runtime ownership local while reducing duplicated customer vocabulary for order statuses and payment placeholder labels.

## Deferred Until Explicitly Approved

- code generation pipeline for Dart contracts
- build tooling that transforms shared contracts for Flutter consumption
- any attempt to centralize customer runtime logic inside `shared`
