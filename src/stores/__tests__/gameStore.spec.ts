import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from '../gameStore'

describe('useGameStore state machine', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('test_initial_state_is_instructions', () => {
    const gameStore = useGameStore()

    expect(gameStore.currentState).toBe('INSTRUCTIONS')
  })

  it('test_valid_state_transitions', () => {
    const gameStore = useGameStore()

    gameStore.setState('TOPIC_INPUT')
    expect(gameStore.currentState).toBe('TOPIC_INPUT')

    gameStore.setState('LLM_LOADING')
    expect(gameStore.currentState).toBe('LLM_LOADING')

    gameStore.setState('PLAYING')
    expect(gameStore.currentState).toBe('PLAYING')

    gameStore.setState('GAME_OVER')
    expect(gameStore.currentState).toBe('GAME_OVER')
  })

  it('test_invalid_state_transition', () => {
    const gameStore = useGameStore()

    expect(() => gameStore.setState('PLAYING')).toThrow()
    expect(gameStore.currentState).toBe('INSTRUCTIONS')
  })
})