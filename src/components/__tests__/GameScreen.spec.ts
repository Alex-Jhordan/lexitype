import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import GameScreen from '../GameScreen.vue'
import { useGameStore } from '../../stores/gameStore'
import type { GameMetrics } from '../../types/game'

const GameCanvasStub = defineComponent({
  emits: {
    'word-missed': (_metrics: GameMetrics) => true,
  },
  template: '<canvas />',
})

describe('GameScreen', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('ends the game when the fifth life is lost', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const gameStore = useGameStore()
    gameStore.currentState = 'PLAYING'
    const metrics: GameMetrics = {
      wpm: 0,
      accuracy: 0,
      destroyedWords: 0,
      fallenWords: 5,
    }

    const wrapper = mount(GameScreen, {
      global: {
        plugins: [pinia],
        stubs: { GameCanvas: GameCanvasStub },
      },
    })
    const canvas = wrapper.findComponent(GameCanvasStub)

    for (let life = 0; life < 5; life += 1) {
      await canvas.vm.$emit('word-missed', metrics)
    }

    expect(gameStore.lives).toBe(0)
    expect(gameStore.currentState).toBe('GAME_OVER')
    expect(gameStore.gameMetrics).toEqual(metrics)
  })
})