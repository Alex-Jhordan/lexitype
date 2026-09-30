import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import InstructionsModal from '../InstructionsModal.vue'
import { useGameStore } from '../../stores/gameStore'

describe('InstructionsModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('test_start_button_transitions_to_topic_input', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(InstructionsModal, {
      global: { plugins: [pinia] },
    })

    await wrapper.get('[data-testid="start-btn"]').trigger('click')

    expect(useGameStore().currentState).toBe('TOPIC_INPUT')
  })
})