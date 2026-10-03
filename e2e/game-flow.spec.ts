import { expect, test } from 'playwright/test'

const generatedWords = [
  { word: 'alpha', display_word: 'alpha', meaning: 'first' },
  { word: 'bravo', display_word: 'bravo', meaning: 'second' },
  { word: 'charlie', display_word: 'charlie', meaning: 'third' },
  { word: 'delta', display_word: 'delta', meaning: 'fourth' },
  { word: 'echo', display_word: 'echo', meaning: 'fifth' },
]

test('test_full_game_loop_with_mock_api', async ({ page }) => {
  await page.route('**/api/generate-words', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ topic: 'Vue.js', language: 'en', words: generatedWords }),
    })
  })

  await page.goto('/')
  await page.getByTestId('start-btn').click()
  await page.getByTestId('topic-input').fill('Vue.js')

  const generatedWordsResponse = page.waitForResponse(
    (response) => response.url().includes('/api/generate-words'),
  )
  await page.getByTestId('submit-topic-btn').click()
  await generatedWordsResponse
  await expect(page.getByTestId('game-canvas')).toBeVisible()

  for (const { word } of generatedWords) {
    for (const character of word) {
      await page.keyboard.press(character)
    }
  }

  await expect(page.getByTestId('game-canvas')).toBeVisible()
  await expect(page.getByRole('group', { name: '5 lives remaining' })).toBeVisible()
})

test('test_service_unavailable_flow', async ({ page }) => {
  await page.route('**/api/generate-words', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Word generation is temporarily unavailable' }),
    })
  })

  await page.goto('/')
  await page.getByTestId('start-btn').click()
  await page.getByTestId('topic-input').fill('Vue.js')
  await page.getByTestId('submit-topic-btn').click()

  await expect(page.getByTestId('retry-btn')).toBeVisible()
})