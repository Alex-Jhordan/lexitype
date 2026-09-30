# TASKLOG - Frontend (lexitype)

## Phase 3: Frontend Initialization and State Machine

- [X] ### Task 3.1: Frontend Structure Setup and Integration into Docker Compose
  - Create the frontend subdirectory in `lexitype-workspace/lexitype/`.
  - In `lexitype-workspace/lexitype/`, run `pnpm create vite . --template vue-ts`.
  - Update the `docker-compose.yml` file in the root of `lexitype-workspace/` to include the `lexitype-frontend` service (mapping `./lexitype` to port 5173).
  - Configure the environment variable `VITE_API_URL=http://localhost:8000` to connect with the backend.
  - Install main dependencies by running `pnpm install pinia @vueuse/core @lucide/vue canvas-confetti` and `pnpm install -D typescript tailwindcss @tailwindcss/vite vitest @vue/test-utils jsdom playwright @types/canvas-confetti`.
  - Configure `vite.config.ts` importing `defineConfig` from `vitest/config`, `@tailwindcss/vite` and defining the block `test: { environment: 'jsdom', globals: true }` to enable Vitest.
  - Configure `src/assets/main.css` with the `@import "tailwindcss";` directive and import Google Fonts "Press Start 2P" and "JetBrains Mono".
  - Run `npx vitest run` to verify the proper initialization of the testing environment.
  - Ensure Docker runtime is running, then run the command `docker compose up --build -d` from `lexitype-workspace/` to verify container orchestration between frontend and backend services.

- [X] ### Task 3.2: TDD RED - Writing Unit Tests for the Pinia State Machine
  - Create the directory `src/stores/` and the file `src/stores/__tests__/gameStore.spec.ts`.
  - In `gameStore.spec.ts`, configure `setActivePinia(createPinia())` in the `beforeEach()` block.
  - Write the test `test_initial_state_is_instructions()` asserting that the initial state of the store is `'INSTRUCTIONS'`.
  - Write the test `test_valid_state_transitions()` evaluating the execution of actions to transition from `'INSTRUCTIONS'` to `'TOPIC_INPUT'`, `'LLM_LOADING'`, `'PLAYING'`, and `'GAME_OVER'`.
  - Write the test `test_invalid_state_transition()` attempting to force a direct change from `'INSTRUCTIONS'` to `'PLAYING'`, asserting with `expect(() => store.setState('PLAYING')).toThrow()` that the operation throws an error and maintains the state in `'INSTRUCTIONS'`.
  - Run `npx vitest run src/stores/__tests__/gameStore.spec.ts` and confirm that it fails (Red).

- [X] ### Task 3.3: TDD GREEN - Implementing the Pinia Store (useGameStore)
  - Create the file `src/types/game.ts` defining the exported type `export type GameState = 'INSTRUCTIONS' | 'TOPIC_INPUT' | 'LLM_LOADING' | 'SERVICE_UNAVAILABLE' | 'PLAYING' | 'GAME_OVER';` and the interfaces `WordItem` and `GameMetrics`.
  - Create the file `src/stores/gameStore.ts` using the Setup Store syntax (`defineStore('game', () => ...)`).
  - Define reactive states: `currentState = ref<GameState>('INSTRUCTIONS')`, `topic = ref('')`, `words = ref<WordItem[]>([])`, `lives = ref(5)`, `elapsedTime = ref(0)`.
  - Implement the function `setState(newState: GameState)` adding a allowed transition validation structure before assigning the value to `currentState.value`.
  - Run `npx vitest run src/stores/__tests__/gameStore.spec.ts` and confirm that all tests pass to green (Green).

---

## Phase 4: Canvas 2D Game Kernel — Physics, Typing, and Metrics

- [X] ### Task 4.1: TDD RED - Writing Tests for Pure Motor Logic (useGameEngine)
  - Create the directory `src/composables/__tests__/` and the file `useGameEngine.spec.ts`.
  - Write the test `test_target_selection_closest_to_bottom()` instantiating two words on screen with the same starting letter (Word A at Y=100, Word B at Y=300); simulate key press and assert that the selected target word is the one at Y=300.
  - Write the test `test_target_unlock_on_backspace()` verifying that typing characters locks the target, and pressing Backspace until emptying the buffer (`""`) changes the `targetWord` variable to `null`.
  - Write the test `test_wpm_and_accuracy_calculation()` verifying that with 50 correct keys, 10 incorrect keys, and 20 seconds elapsed, the `calculateMetrics()` function returns WPM = 30 and Accuracy = 83.33%.
  - Run `npx vitest run src/composables/__tests__/useGameEngine.spec.ts` and confirm failure (Red).

- [X] ### Task 4.2: TDD GREEN - Implementing Physics and Typing Kernel (useGameEngine.ts)
  - Create the file `src/composables/useGameEngine.ts` exporting the function/class with pure mathematical logic decoupled from Canvas.
  - Implement position update functions: `Y_new = Y_current + (speed * t)` with speeds between 120 and 160 px/s.
  - Implement target selection algorithm in `handleKeyDown(key: string)` searching for words starting with the character, applying `.reduce()` to find the one with the highest Y coordinate.
  - Implement editing logic for Backspace releasing word reference when emptying buffer, and register correct and incorrect key presses in pure counters.
  - Implement exported formulas `calculateWPM(correctChars, seconds)` and `calculateAccuracy(correctKeys, totalKeys)`.
  - Run `npx vitest run src/composables/__tests__/useGameEngine.spec.ts` and verify suite passes to green (Green).

---

## Phase 5: UI Components, Modals, and Canvas 2D Rendering

- [X] ### Task 5.1: TDD RED - Writing UI Component Tests with Vue Test Utils
  - Create directory `src/components/__tests__/` and inside instantiate `InstructionsModal.spec.ts`, `TopicInputScreen.spec.ts`, and `GameOverModal.spec.ts`.
  - In `InstructionsModal.spec.ts`, mount component with `mount()` from Vue Test Utils and assert that simulating a click on `[data-testid="start-btn"]` transitions store to `'TOPIC_INPUT'` state.
  - In `TopicInputScreen.spec.ts`, assert that button `[data-testid="submit-topic-btn"]` is disabled with a 1-character input and enabled when typing 2 or more characters.
  - In `GameOverModal.spec.ts`, mount component passing test metrics and verify `[data-testid="wpm-metric"]` shows correct numerical value and the left column lists all 5 accented words (`display_word`).
  - Run `npx vitest run src/components/__tests__/` and confirm failure (Red).

- [X] ### Task 5.2: TDD GREEN - Implementing Initial Views and Modals
  - Create `src/components/InstructionsModal.vue` styled with Tailwind CSS (`bg-zinc-900/90 backdrop-blur-md`), including title with font "Press Start 2P" and button with attribute `data-testid="start-btn"`.
  - Create `src/components/TopicInputScreen.vue` with field `<input data-testid="topic-input">` bound via `v-model`, and button `<button data-testid="submit-topic-btn" :disabled="topic.length < 2">`.
  - Create `src/components/FuelLoadingScreen.vue` including SVG silhouette of the ship (`data-testid="fuel-ship-svg"`) with vertical fill animation in CSS/Tailwind (`bg-cyan-500`).
  - Create `src/components/ServiceUnavailableScreen.vue` with maintenance message and `data-testid="retry-btn"` button.
  - Create `src/components/GameOverModal.vue` implementing two-column layout without scroll; in `onMounted()`, import and trigger `confetti()` from `canvas-confetti`. Include identifiers `data-testid="wpm-metric"`, `data-testid="accuracy-metric"`, `data-testid="words-count-metric"`, and `data-testid="play-again-btn"`.
  - Run `npx vitest run src/components/__tests__/` and verify pass to green (Green).

- [X] ### Task 5.3: Implementing Active Game Area (GameScreen.vue and Subcomponents)
  - Create `src/components/GameHeader.vue` showing timer `data-testid="game-timer"` and a `v-for` loop rendering 5 Lucide heart icons (`data-testid="heart-icon"`).
  - Create `src/components/TypingInputDisplay.vue` with fixed bottom container `data-testid="typing-display"` projecting active text buffer in neon cyan monospace font.
  - Create `src/components/GameCanvas.vue` with tag `<canvas data-testid="game-canvas">`. Bind `requestAnimationFrame` loop to consume state exposed by `useGameEngine.ts` and render 4 layers: starfield background, word entities (highlighting correct letters in `emerald-500`), laser projectiles, and explosion particles.
  - Create `src/components/GameScreen.vue` integrating `GameHeader`, `GameCanvas`, and `TypingInputDisplay` in a vertical layout.

- [ ] ### Task 5.4: Main Orchestration in App.vue
  - In `src/App.vue`, import store `useGameStore()`.
  - Use conditional rendering with `v-if` / `v-else-if` evaluating `store.currentState` to switch between `InstructionsModal`, `TopicInputScreen`, `FuelLoadingScreen`, `ServiceUnavailableScreen`, `GameScreen`, and `GameOverModal`.

---

## Phase 6: End-to-End (E2E) Testing and Frontend Deployment

- [ ] ### Task 6.1: TDD E2E - Implementing E2E Suite with Playwright
  - Create `e2e/` directory in root of `lexitype` and file `e2e/game-flow.spec.ts`.
  - Configure `playwright.config.ts` to launch Vite development server (`http://localhost:5173`) before running tests.
  - In `e2e/game-flow.spec.ts`, write test `test_full_game_loop_with_mock_api()` intercepting route `/api/generate-words` via `page.route()` to return static JSON of 5 words with HTTP 200 code.
  - Simulate real interaction: click `[data-testid="start-btn"]`, type "Vue.js" in `[data-testid="topic-input"]`, click `[data-testid="submit-topic-btn"]`, wait for loading screen, simulate keyboard key presses `page.keyboard.press()` to destroy words, and assert visibility of `[data-testid="wpm-metric"]` in final modal.
  - Write test `test_service_unavailable_flow()` intercepting `/api/generate-words` with HTTP 503 response and asserting that screen displays `[data-testid="retry-btn"]`.
  - Run `npx playwright test` and confirm complete suite executes successfully in headless mode.

- [ ] ### Task 6.2: Frontend CI/CD Pipeline
  - In `lexitype` repository, create file `.github/workflows/ci.yml` configuring steps: `actions/checkout`, `actions/setup-node`, `pnpm ci`, `npx vue-tsc --noEmit`, `npx vitest run`, and `npx playwright test`.
  - In Vercel, connect `lexitype` repository, setting framework as Vue.js, build root, and environment variable `VITE_API_URL` pointing to Koyeb (`https://lexitype-api.koyeb.app`).
  - Execute a test deployment and perform a manual End-to-End verification navigating to the domain assigned by Vercel to mark the complete project workflow as completed.