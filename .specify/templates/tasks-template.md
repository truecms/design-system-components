---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Constitution Principle III makes tests mandatory. Capture the Jest unit, Pa11y accessibility, and smoke tests required for each story before implementation, and note which GitHub Actions jobs enforce them.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Node 22 baseline

- [ ] T001 Confirm Node 22 toolchain (`.nvmrc`, `package.json` engines) and enable Corepack for pnpm
- [ ] T002 Run `pnpm run bootstrap` to install workspace dependencies and refresh `pnpm-lock.yaml`
- [ ] T003 [P] Configure linting, formatting, and Jest/Pa11y harnesses for the targeted packages
- [ ] T004 [P] Verify baseline GitHub Actions workflows (install/test/release) replace legacy CircleCI coverage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T101 Replace or upgrade Pancake-era dependencies with `@truecms/*` equivalents compatible with Node 22
- [ ] T102 [P] Establish package build pipeline (`pnpm run build`, `pnpm --filter` commands)
- [ ] T103 [P] Configure shared accessibility testing harness (Pa11y scripts, fixtures)
- [ ] T104 Create base models/entities that all stories depend on
- [ ] T105 Configure error handling, logging, and observability needed for regression detection
- [ ] T106 Ensure `pnpm audit --prod` passes with zero vulnerabilities; track remediation tasks
- [ ] T107 Document GitHub Actions migration checkpoints and remove or archive redundant CircleCI steps
- [ ] T108 Record Drupal 11 integration assumptions and smoke-test plan

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (MANDATORY) ⚠️

> **NOTE: Jest unit tests, Pa11y accessibility checks, and smoke tests MUST be written first and fail before implementation (Principle III).**

- [ ] T010 [P] [US1] Jest unit test for [component/utility] in `packages/[name]/__tests__/[file].test.ts`
- [ ] T011 [P] [US1] Pa11y accessibility script for [user journey] in `scripts/accessibility/[story].ts`
- [ ] T012 [US1] Capture the GitHub Actions job(s) that must gate these tests

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T014 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T015 [US1] Implement [Service] in src/services/[service].py (depends on T013, T014)
- [ ] T016 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T017 [US1] Add validation and error handling
- [ ] T018 [US1] Add logging/telemetry for story operations and capture in Install Check output
- [ ] T019 [US1] Document Drupal 11 usage notes or demo snippet if relevant

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (MANDATORY) ⚠️

- [ ] T020 [P] [US2] Jest unit test for [component/utility] in `packages/[name]/__tests__/[file].test.ts`
- [ ] T021 [P] [US2] Pa11y accessibility script for [user journey] in `scripts/accessibility/[story].ts`
- [ ] T022 [US2] Update GitHub Actions matrix coverage if the story adds new packages or tooling

### Implementation for User Story 2

- [ ] T023 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T024 [US2] Implement [Service] in src/services/[service].py
- [ ] T025 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T026 [US2] Integrate with User Story 1 components (if needed)
- [ ] T027 [US2] Update Changeset entry and release notes draft for new behaviour
- [ ] T028 [US2] Validate Drupal 11 usage where applicable or note rationale if N/A

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (MANDATORY) ⚠️

- [ ] T029 [P] [US3] Jest unit test for [component/utility] in `packages/[name]/__tests__/[file].test.ts`
- [ ] T030 [P] [US3] Pa11y accessibility script for [user journey] in `scripts/accessibility/[story].ts`
- [ ] T031 [US3] Confirm GitHub Actions release workflow adjustments remain valid

### Implementation for User Story 3

- [ ] T032 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T033 [US3] Implement [Service] in src/services/[service].py
- [ ] T034 [US3] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T035 [US3] Update Changeset entry and release notes draft for new behaviour
- [ ] T036 [US3] Record Drupal 11 impact assessment or integration update

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in README/docs/feature docs (include GitHub Actions and Drupal notes)
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional Jest and Pa11y coverage for regressions
- [ ] TXXX Security hardening and audit review (`pnpm audit --prod`)
- [ ] TXXX Validate quickstart.md, GitHub Actions release workflow, and Drupal 11 smoke test checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
