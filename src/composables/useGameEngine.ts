import { ref, shallowRef } from 'vue'

export interface GameWord {
  word: string
  y: number
  speed?: number
}

export const MIN_WORD_SPEED = 60
export const MAX_WORD_SPEED = 100

export function createWordSpeed(): number {
  return MIN_WORD_SPEED + Math.random() * (MAX_WORD_SPEED - MIN_WORD_SPEED)
}

export function updateWordPosition(y: number, speed: number, seconds: number): number {
  return y + speed * seconds
}

export function calculateWPM(correctChars: number, seconds: number): number {
  if (seconds <= 0) return 0

  return (correctChars * 60) / (5 * seconds)
}

export function calculateAccuracy(correctKeys: number, totalKeys: number): number {
  if (totalKeys <= 0) return 0

  return Number(((correctKeys / totalKeys) * 100).toFixed(2))
}

export function calculateMetrics(
  correctChars: number,
  incorrectKeys: number,
  seconds: number,
): { wpm: number; accuracy: number } {
  const totalKeys = correctChars + incorrectKeys

  return {
    wpm: calculateWPM(correctChars, seconds),
    accuracy: calculateAccuracy(correctChars, totalKeys),
  }
}

export function useGameEngine(words: GameWord[]) {
  const targetWord = shallowRef<GameWord | null>(null)
  const typingBuffer = ref('')
  const correctKeys = ref(0)
  const incorrectKeys = ref(0)
  const totalKeys = ref(0)

  function selectTarget(key: string): GameWord | null {
    const candidates = words.filter((word) =>
      word.word.toLocaleLowerCase().startsWith(key.toLocaleLowerCase()),
    )

    return candidates.reduce<GameWord | null>(
      (closest, candidate) =>
        closest === null || candidate.y > closest.y ? candidate : closest,
      null,
    )
  }

  function handleKeyDown(key: string): void {
    if (key === 'Backspace') {
      if (typingBuffer.value.length > 0) {
        typingBuffer.value = typingBuffer.value.slice(0, -1)
      }

      if (typingBuffer.value.length === 0) {
        targetWord.value = null
      }

      return
    }

    if (key.length !== 1) return

    if (targetWord.value === null) {
      targetWord.value = selectTarget(key)
    }

    totalKeys.value += 1
    const selectedWord = targetWord.value
    const expectedCharacter = selectedWord?.word[typingBuffer.value.length]

    if (
      selectedWord !== null &&
      expectedCharacter?.toLocaleLowerCase() === key.toLocaleLowerCase()
    ) {
      correctKeys.value += 1
      typingBuffer.value += key

      if (typingBuffer.value.length === selectedWord.word.length) {
        const completedWordIndex = words.indexOf(selectedWord)
        if (completedWordIndex >= 0) words.splice(completedWordIndex, 1)
        targetWord.value = null
        typingBuffer.value = ''
      }
    } else {
      incorrectKeys.value += 1
    }
  }

  function updateWordPositions(seconds: number): void {
    for (const word of words) {
      word.speed ??= createWordSpeed()
      word.y = updateWordPosition(word.y, word.speed, seconds)
    }
  }

  return {
    targetWord,
    typingBuffer,
    correctKeys,
    incorrectKeys,
    totalKeys,
    handleKeyDown,
    updateWordPositions,
  }
}