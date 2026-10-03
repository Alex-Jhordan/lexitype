import { describe, expect, it } from 'vitest'
import { calculateMetrics, type GameWord, useGameEngine } from '../useGameEngine'

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

  it('increases every active and future word speed for each five destructions', () => {
    const words: GameWord[] = [
      { word: 'alpha', y: 0, speed: 20 },
      { word: 'bravo', y: 0, speed: 60 },
    ]
    const gameEngine = useGameEngine(words)

    for (let count = 0; count < 4; count += 1) gameEngine.recordWordDestroyed()
    expect(words.map(({ speed }) => speed)).toEqual([20, 60])

    gameEngine.recordWordDestroyed()
    expect(words.map(({ speed }) => speed)).toEqual([30, 70])

    for (let count = 0; count < 5; count += 1) gameEngine.recordWordDestroyed()
    expect(words.map(({ speed }) => speed)).toEqual([40, 80])

    const respawnedWord: GameWord = { word: 'charlie', y: 0 }
    words.push(respawnedWord)
    gameEngine.updateWordPositions(0)

    expect(respawnedWord.speed).toBeGreaterThanOrEqual(40)
    expect(respawnedWord.speed).toBeLessThanOrEqual(80)
  })
})