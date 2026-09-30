# LexiType Space — Web Client (`lexitype`)

**LexiType Space** is a space-themed 2D arcade typing web application designed to combine typing speed with real-time vocabulary learning. Controlled by a Vue 3 frontend and powered by a FastAPI backend integrated with Google Gemini (`gemini-2.5-flash`), the game dynamically generates thematic words and concise definitions based on any topic provided by the user.

This repository contains the Single Page Application (SPA) frontend client for **LexiType Space**.

---

## 🚀 Tech Stack & Core Technologies

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup lang="ts">`)
- **Build Tool & Runner:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **State Management:** [Pinia](https://pinia.vuejs.org/) (Finite State Machine pattern)
- **Graphics & Game Loop:** HTML5 Canvas 2D API + `requestAnimationFrame`
- **Styling & Icons:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Utilities:** [VueUse](https://vueuse.org/) (Keyboard & Event listeners)
- **Testing Suite:** [Vitest](https://vitest.dev/), [Vue Test Utils](https://test-utils.vuejs.org/), [Playwright](https://playwright.dev/) (E2E)
- **Containerization & Deployment:** Docker, Docker Compose, Vercel (CDN)

---

## 🎮 Core Game Mechanics & Features

1. **Dynamic Content Generation:** Enter any topic, technology, or domain (e.g., *Vue.js*, *Quantum Mechanics*, *Gastronomy*). The app automatically receives 5 thematic words and definitions generated in real time.
2. **Finite State Machine:** Clean UI transitions managed via Pinia across six disjoint states: `INSTRUCTIONS`, `TOPIC_INPUT`, `LLM_LOADING`, `SERVICE_UNAVAILABLE`, `PLAYING`, and `GAME_OVER`.
3. **Decoupled 2D Engine Kernel:** Frame-rate independent physics loop running at 60 FPS using delta time ($t$). Features vertical parallax starfields, laser trajectories, target locking algorithms, and particle explosion effects.
4. **Target Lock & Smart Prioritization:** Automatically resolves input conflicts when multiple words on screen share the same starting letter by locking onto the word closest to the bottom (highest $Y$ coordinate).
5. **Real-time Performance Metrics:** Evaluates typing speed (WPM), accuracy percentage, and destroyed vs. fallen word balance upon session completion.

---

## 🏗️ Directory & Architecture Structure

```text
lexitype/
├── .github/
│   ├── docs/                   # Specification-Driven Development (SDD) docs
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI workflow
├── e2e/                        # Playwright End-to-End test suites
│   └── game-flow.spec.ts
├── src/
│   ├── assets/                 # Tailind CSS imports and custom font styles
│   │   └── main.css
│   ├── components/             # Vue 3 Single File Components (SFCs)
│   │   ├── __tests__/          # Component unit tests with Vue Test Utils
│   │   ├── FuelLoadingScreen.vue
│   │   ├── GameCanvas.vue
│   │   ├── GameHeader.vue
│   │   ├── GameOverModal.vue
│   │   ├── GameScreen.vue
│   │   ├── GlossarySection.vue
│   │   ├── InstructionsModal.vue
│   │   ├── MetricsSection.vue
│   │   ├── ServiceUnavailableScreen.vue
│   │   ├── TopicInputScreen.vue
│   │   └── TypingInputDisplay.vue
│   ├── composables/            # Decoupled engine physics & logic hooks
│   │   ├── __tests__/
│   │   │   └── useGameEngine.spec.ts
│   │   └── useGameEngine.ts
│   ├── stores/                 # Pinia state machine store
│   │   ├── __tests__/
│   │   │   └── gameStore.spec.ts
│   │   └── gameStore.ts
│   ├── types/                  # TypeScript schemas and data models
│   │   └── game.ts
│   ├── App.vue                 # Root view orchestrator
│   └── main.ts                 # App entrypoint and plugin registration
├── AGENTS.md                   # AI agent operational guidelines
├── TASKLOG.md                  # Task tracking checklist
├── index.html                  # Main HTML document entrypoint
├── package.json                # Dependencies and script definitions
├── playwright.config.ts        # Playwright E2E configuration
├── vite.config.ts              # Vite & Vitest configuration
└── README.md                   # Project documentation
```

---

## 🛠️ Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- [pnpm](https://pnpm.io/) package manager (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) & Docker Compose (optional for full-stack workspace running)

---

### Option 1: Standalone Frontend Development

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd lexitype
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of `lexitype/`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the Vite development server:**
   ```bash
   pnpm dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

### Option 2: Full Workspace Orchestration with Docker Compose

From the root workspace directory containing both `lexitype` and `lexitype-api`:

```bash
docker compose up --build -d
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`

---

## 🧪 Test-Driven Development (TDD) & Quality Assurance

The codebase strictly follows Test-Driven Development (TDD) principles in a Red-Green-Refactor cycle across Unit, Integration, and E2E tiers.

### Run Unit and Component Tests (Vitest)

Executes tests for the Pinia state store (`gameStore`), physics composable (`useGameEngine`), and UI components (`Vue Test Utils`):

```bash
# Run all unit tests once
pnpm test

# Run tests in watch mode during development
pnpm test:watch
```

### Run End-to-End Tests (Playwright)

Simulates full user interactions in real browsers, mocking external backend payloads and handling error scenarios:

```bash
# Execute headless E2E tests
pnpm exec playwright test

# Launch Playwright test runner with UI mode
pnpm exec playwright test --ui
```

### Type Checking & Linting

```bash
# Validate TypeScript schemas and Vue component types
pnpm vue-tsc --noEmit
```

---

## 🚢 CI/CD & Deployment

- **Continuous Integration (CI):** Every `push` or `pull_request` to `main` executes `.github/workflows/ci.yml`, running type checks (`vue-tsc`), unit tests (`vitest`), and E2E suites (`playwright`).
- **Continuous Deployment (CD):** Connected to Vercel global CDN. Merges into `main` automatically deploy to production pointing `VITE_API_URL` to the production backend (`https://lexitype-api.onrender.com`).

---

## 📚 Specification-Driven Architecture (`.github/docs/`)

All architectural patterns, mathematical formulas, state machine transitions, and design system rules are documented inside `.github/docs/`:

| Specification File | Domain & Scope |
| :--- | :--- |
| **`overview_and_game_flow.md`** | Core game loop, finite state machine definitions, match rules, and performance metrics formulas. |
| **`architecture_and_technology_stack.md`** | Monolith decoupling, Vue 3 + Pinia architecture, dependency rules, and CI/CD pipelines. |
| **`2d_canvas_mechanics_and_game_physics.md`** | 60 FPS render loop, delta time calculations, falling speed algorithms, target lock logic, and collision systems. |
| **`backend_api_llm_configuration.md`** | REST API endpoints, Pydantic response schemas, LLM prompts, and HTTP 503 error handling. |
| **`ui_component_structure.md`** | Vue SFC hierarchy, screen specs, Tailwind CSS color palette, typography rules, and `data-testid` attributes. |

---

## 🛡️ Operational Guidelines (`AGENTS.md`)

AI assistants and developers working on this codebase must adhere to the rules outlined in `AGENTS.md`:

1. **Specification Compliance:** Consult files in `.github/docs/` prior to adding features or changing component boundaries.
2. **Strict TDD Practice:** Write failing tests first before writing production UI or logic code.
3. **Manual Task Verification:** Do **NOT** automatically update or mark task items as completed in `TASKLOG.md` — verification is strictly reserved for human code reviews.