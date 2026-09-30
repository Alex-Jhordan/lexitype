import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import TopicInputScreen from '../TopicInputScreen.vue'

describe('TopicInputScreen', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('test_submit_button_requires_at_least_two_characters', async () => {
    const wrapper = mount(TopicInputScreen)
    const topicInput = wrapper.get('[data-testid="topic-input"]')
    const submitButton = wrapper.get('[data-testid="submit-topic-btn"]')

    await topicInput.setValue('a')
    expect((submitButton.element as HTMLButtonElement).disabled).toBe(true)

    await topicInput.setValue('ab')
    expect((submitButton.element as HTMLButtonElement).disabled).toBe(false)
  })
})