<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from '@lucide/vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const formattedTime = computed(() => {
  const minutes = Math.floor(gameStore.elapsedTime / 60)
  const seconds = gameStore.elapsedTime % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
</script>

<template>
  <header class="flex min-h-16 items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 px-4 sm:px-7">
    <div class="min-w-0">
      <p class="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Lexitype / {{ gameStore.topic || 'Mission' }}</p>
      <p data-testid="game-timer" class="mt-1 font-mono text-lg font-bold tabular-nums text-cyan-300">{{ formattedTime }}</p>
    </div>

    <div class="flex shrink-0 items-center gap-2" role="group" :aria-label="`${gameStore.lives} lives remaining`">
      <Heart
        v-for="life in 5"
        :key="life"
        data-testid="heart-icon"
        :class="life <= gameStore.lives ? 'text-rose-400' : 'text-zinc-700'"
        :fill="life <= gameStore.lives ? 'currentColor' : 'none'"
        :aria-hidden="true"
        :size="20"
        :stroke-width="2.5"
      />
    </div>
  </header>
</template>