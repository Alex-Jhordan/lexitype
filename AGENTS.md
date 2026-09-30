# Agent Instructions & Workflow Guidelines (AGENTS.md)

This file defines the operational guidelines, project context, and mandatory protocols for AI agents and assistants working inside the `lexitype-frontend` repository.

---

## 1. Core Operating Principles

1. **Specification-Driven Development (SDD):**
   - Do not make major architectural decisions, change component structures, or introduce new core dependencies without consulting the project specs located in `.github/docs/`.
   - Before executing non-trivial tasks, review the corresponding documentation file based on the task domain.

2. **Task Execution & Status Tracking:**
   - **Do NOT auto-mark tasks as completed.**
   - Do **NOT** update, check off, or annotate task checklists (e.g., in `TASKLOG.md` or issue boards) anywhere upon finishing a feature, fix, or refactor. 
   - Task completion status must be explicitly verified and updated by the human engineer after review.

3. **Codebase Standards & Testing:**
   - Maintain full TypeScript strictness.
   - Follow Test-Driven Development (TDD) and component unit testing principles using Vitest and Vue Test Utils wherever applicable.
   - Ensure clean state management using Pinia and strict reactive patterns in Vue 3 (Composition API / `<script setup>`).

---

## 2. Documentation Architecture (`.github/docs/`)

All foundational specifications, architecture rules, and functional domain references are located at the root of the project under `./github/docs/`:

| Spec File | Purpose & Task Domain |
| :--- | :--- |
| **`overview_and_game_flow.md`** | Core game loop, player progression, start/pause/game-over states, typing mechanics, and win/loss conditions. **Consult when modifying game states or flow.** |
| **`architecture_and_technology_stack.md`** | High-level system architecture, Vue 3 + Vite setup, TypeScript standards, Pinia state stores, and dependency definitions. **Consult for refactoring or adding dependencies.** |
| **`2d_canvas_mechanics_and_game_physics.md`** | HTML5 Canvas 2D rendering loop, sprite motion, collision detection, coordinate scaling, and frame timing. **Consult when working on game rendering or physics.** |
| **`backend_api_llm_configuration.md`** | Integration contracts with `lexitype-api` (FastAPI), LLM word generator endpoints, payload schemas, and offline/fallback behaviors. **Consult for API calls or network state.** |
| **`ui_component_structure.md`** | Vue component hierarchy, layout primitives, Tailwind CSS design system rules, Lucide icon usage, and overlays. **Consult when creating or editing UI components.** |

---

## 3. Workflow Protocol for Agents

When assigned a user query or issue:

1. **Identify the Task Domain:** Map the request to one or more specification files in `./github/docs/`.
2. **Consult Specifications:** Read the relevant markdown files in `./github/docs/` prior to generating or modifying code to ensure compliance with existing patterns.
3. **Execute Changes:** Write clean, modular, and type-safe code adhering strictly to the architectural constraints.
4. **Halt Checklist Updates:** Deliver the code changes and summary without altering completion markers in task tracking files.