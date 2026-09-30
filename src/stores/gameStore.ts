import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameMetrics, GameState, WordItem } from '../types/game'

const allowedTransitions: Record<GameState, readonly GameState[]> = {
  INSTRUCTIONS: ['TOPIC_INPUT'],
  TOPIC_INPUT: ['LLM_LOADING', 'INSTRUCTIONS'],
  LLM_LOADING: ['PLAYING', 'SERVICE_UNAVAILABLE'],
  SERVICE_UNAVAILABLE: ['LLM_LOADING', 'TOPIC_INPUT', 'INSTRUCTIONS'],
  PLAYING: ['GAME_OVER'],
  GAME_OVER: ['INSTRUCTIONS'],
}

export const useGameStore = defineStore('game', () => {
  const currentState = ref<GameState>('INSTRUCTIONS')
  const topic = ref('')
  const words = ref<WordItem[]>([])
  const lives = ref(5)
  const elapsedTime = ref(0)
  const gameMetrics = ref<GameMetrics | null>(null)

  function setState(newState: GameState): void {
    if (!allowedTransitions[currentState.value].includes(newState)) {
      throw new Error(`Invalid game state transition: ${currentState.value} -> ${newState}`)
    }

    currentState.value = newState
  }

  return {
    currentState,
    topic,
    words,
    lives,
    elapsedTime,
    gameMetrics,
    setState,
  }
})