<script setup lang="ts">
import FuelLoadingScreen from './components/FuelLoadingScreen.vue'
import GameOverModal from './components/GameOverModal.vue'
import GameScreen from './components/GameScreen.vue'
import InstructionsModal from './components/InstructionsModal.vue'
import ServiceUnavailableScreen from './components/ServiceUnavailableScreen.vue'
import TopicInputScreen from './components/TopicInputScreen.vue'
import { useGameStore } from './stores/gameStore'
import type { GameMetrics } from './types/game'

const gameStore = useGameStore()

const emptyMetrics: GameMetrics = {
  wpm: 0,
  accuracy: 0,
  destroyedWords: 0,
  fallenWords: 0,
}
</script>

<template>
  <InstructionsModal v-if="gameStore.currentState === 'INSTRUCTIONS'" />
  <TopicInputScreen v-else-if="gameStore.currentState === 'TOPIC_INPUT'" />
  <FuelLoadingScreen v-else-if="gameStore.currentState === 'LLM_LOADING'" />
  <ServiceUnavailableScreen v-else-if="gameStore.currentState === 'SERVICE_UNAVAILABLE'" />
  <GameScreen v-else-if="gameStore.currentState === 'PLAYING'" />
  <GameOverModal
    v-else-if="gameStore.currentState === 'GAME_OVER'"
    :metrics="gameStore.gameMetrics ?? emptyMetrics"
  />
</template>
