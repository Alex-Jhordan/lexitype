<script setup lang="ts">
import { onMounted } from 'vue'
import confetti from 'canvas-confetti'
import { useGameStore } from '../stores/gameStore'
import type { GameMetrics } from '../types/game'

defineProps<{
  metrics: GameMetrics
}>()

const gameStore = useGameStore()

onMounted(() => {
  confetti({
    particleCount: 90,
    spread: 65,
    origin: { y: 0.7 },
    colors: ['#22d3ee', '#a3e635', '#fbbf24'],
  })
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6">
    <section class="w-full max-w-4xl border border-zinc-700 bg-zinc-900 shadow-[0_0_80px_rgba(34,211,238,0.08)]">
      <header class="border-b border-zinc-700 px-6 py-6 sm:px-9">
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Mission complete</p>
        <h1 class="text-xl leading-relaxed text-white sm:text-2xl" style="font-family: 'Press Start 2P', monospace">
          Run summary
        </h1>
      </header>

      <div class="grid gap-8 px-6 py-7 sm:px-9 md:grid-cols-[1.15fr_0.85fr]">
        <section aria-labelledby="cleared-words-heading">
          <h2 id="cleared-words-heading" class="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-300">
            Cleared words
          </h2>
          <ul class="divide-y divide-zinc-800 border-y border-zinc-800">
            <li
              v-for="(word, index) in gameStore.words"
              :key="`${word.word}-${index}`"
              class="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <span class="text-white">{{ word.display_word }}</span>
              <span class="text-right text-xs text-zinc-500">{{ word.meaning }}</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="performance-heading">
          <h2 id="performance-heading" class="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-300">
            Performance
          </h2>
          <dl class="divide-y divide-zinc-800 border-y border-zinc-800">
            <div class="flex items-baseline justify-between gap-3 py-4">
              <dt class="text-sm text-zinc-400">Words per minute</dt>
              <dd data-testid="wpm-metric" class="text-2xl font-bold tabular-nums text-cyan-300">{{ metrics.wpm }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3 py-4">
              <dt class="text-sm text-zinc-400">Accuracy</dt>
              <dd data-testid="accuracy-metric" class="text-xl font-bold tabular-nums text-lime-300">{{ metrics.accuracy }}%</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3 py-4">
              <dt class="text-sm text-zinc-400">Words cleared</dt>
              <dd data-testid="words-count-metric" class="text-xl font-bold tabular-nums text-amber-300">{{ metrics.wordsCount }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <footer class="border-t border-zinc-700 px-6 py-5 text-right sm:px-9">
        <button
          data-testid="play-again-btn"
          class="w-full border border-cyan-300 bg-cyan-300 px-5 py-3 text-sm font-bold uppercase tracking-widest text-zinc-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:w-auto"
          type="button"
          @click="gameStore.setState('INSTRUCTIONS')"
        >
          Play again
        </button>
      </footer>
    </section>
  </main>
</template>