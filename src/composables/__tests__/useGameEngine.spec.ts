import { describe, expect, it } from 'vitest'
import { calculateMetrics, useGameEngine } from '../useGameEngine'

describe('useGameEngine', () => {
  it('test_target_selection_closest_to_bottom', () => {
    const upperWord = { word: 'asteroid', y: 100 }
    const lowerWord = { word: 'alien', y: 300 }
    const gameEngine = useGameEngine([upperWord, lowerWord])

    gameEngine.handleKeyDown('a')

    expect(gameEngine.targetWord.value).toBe(lowerWord)
  })

  it('test_target_unlock_on_backspace', () => {
    const word = { word: 'asteroid', y: 100 }
    const gameEngine = useGameEngine([word])

    gameEngine.handleKeyDown('a')
    const selectedWord = gameEngine.targetWord.value
    gameEngine.handleKeyDown('s')

    expect(gameEngine.targetWord.value).toBe(selectedWord)

    gameEngine.handleKeyDown('Backspace')
    expect(gameEngine.targetWord.value).toBe(selectedWord)

    gameEngine.handleKeyDown('Backspace')
    expect(gameEngine.targetWord.value).toBeNull()
  })

  it('test_wpm_and_accuracy_calculation', () => {
    const metrics = calculateMetrics(50, 10, 20)

    expect(metrics.wpm).toBe(30)
    expect(metrics.accuracy).toBeCloseTo(83.33, 2)
  })
})