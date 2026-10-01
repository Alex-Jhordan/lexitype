import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GameOverModal from '../GameOverModal.vue'
import { useGameStore } from '../../stores/gameStore'

vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

describe('GameOverModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('test_metrics_and_accented_words_are_rendered', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    useGameStore().words = [
      { word: 'arbol', display_word: 'árbol', meaning: 'tree' },
      { word: 'cafe', display_word: 'café', meaning: 'coffee' },
      { word: 'corazon', display_word: 'corazón', meaning: 'heart' },
      { word: 'pinguino', display_word: 'pingüino', meaning: 'penguin' },
      { word: 'accion', display_word: 'acción', meaning: 'action' },
    ]
    const wrapper = mount(GameOverModal, {
      props: {
        metrics: { wpm: 42, accuracy: 95, destroyedWords: 8, fallenWords: 3 },
      },
      global: { plugins: [pinia] },
    })

    expect(wrapper.get('[data-testid="wpm-metric"]').text()).toContain('42')
    expect(wrapper.get('[data-testid="destroyed-words-metric"]').text()).toBe('8')
    expect(wrapper.get('[data-testid="fallen-words-metric"]').text()).toBe('3')

    for (const displayWord of ['árbol', 'café', 'corazón', 'pingüino', 'acción']) {
      expect(wrapper.text()).toContain(displayWord)
    }
  })
})