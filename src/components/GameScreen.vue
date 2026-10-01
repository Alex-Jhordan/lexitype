<script setup lang="ts">
import { ref } from 'vue'
import GameCanvas from './GameCanvas.vue'
import GameHeader from './GameHeader.vue'
import TypingInputDisplay from './TypingInputDisplay.vue'
import { useGameStore } from '../stores/gameStore'
import type { GameMetrics } from '../types/game'

const gameStore = useGameStore()
const typingBuffer = ref('')

function handleWordMissed(metrics: GameMetrics): void {
  gameStore.lives = Math.max(0, gameStore.lives - 1)
  if (gameStore.lives === 0 && gameStore.currentState === 'PLAYING') {
    gameStore.gameMetrics = metrics
    gameStore.setState('GAME_OVER')
  }
}

function handleGameFinished(metrics: GameMetrics): void {
  gameStore.gameMetrics = metrics
  if (gameStore.currentState === 'PLAYING') {
    gameStore.setState('GAME_OVER')
  }
}
</script>

<template>
  <main class="flex h-screen min-h-105 flex-col overflow-hidden bg-zinc-950 text-zinc-100">
    <GameHeader />
    <section class="relative min-h-0 flex-1" aria-label="Active typing game">
      <GameCanvas
        @typing-update="typingBuffer = $event"
        @second-elapsed="gameStore.elapsedTime += 1"
        @word-missed="handleWordMissed"
        @finished="handleGameFinished"
      />
    </section>
    <TypingInputDisplay :buffer="typingBuffer" />
  </main>
</template>