<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-10 text-zinc-100">
    <section class="w-full max-w-xl border border-cyan-400/30 bg-zinc-900/90 p-7 shadow-[0_0_70px_rgba(34,211,238,0.08)] backdrop-blur-md sm:p-10">
      <p class="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Lexitype / Mission briefing</p>
      <h1 class="mb-6 text-2xl leading-relaxed text-white sm:text-3xl" style="font-family: 'Press Start 2P', monospace">
        Type to survive
      </h1>
      <p class="mb-8 max-w-lg text-sm leading-7 text-zinc-300 sm:text-base">
        Keep the incoming words from reaching your ship. Type each word accurately to clear it, and watch your remaining lives.
      </p>
      <button
        data-testid="start-btn"
        class="cursor-pointer w-full border border-cyan-300 bg-cyan-300 px-5 py-4 text-sm font-bold uppercase tracking-widest text-zinc-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:w-auto"
        type="button"
        @click="gameStore.setState('TOPIC_INPUT')"
      >
        Start mission
      </button>
    </section>
  </main>
</template>