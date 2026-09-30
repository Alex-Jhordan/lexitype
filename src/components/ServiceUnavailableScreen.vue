<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-10 text-zinc-100">
    <section class="w-full max-w-lg border border-amber-400/40 bg-zinc-900 p-7 sm:p-10">
      <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Signal interrupted</p>
      <h1 class="mb-4 text-2xl font-bold text-white sm:text-3xl">Service unavailable</h1>
      <p class="mb-8 text-sm leading-7 text-zinc-300">
        Word generation could not be reached. Your mission is on hold; try connecting again.
      </p>
      <button
        data-testid="retry-btn"
        class="border border-amber-300 bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-widest text-zinc-950 transition hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
        type="button"
        @click="gameStore.setState('LLM_LOADING')"
      >
        Retry connection
      </button>
    </section>
  </main>
</template>