export type GameState =
  | 'INSTRUCTIONS'
  | 'TOPIC_INPUT'
  | 'LLM_LOADING'
  | 'SERVICE_UNAVAILABLE'
  | 'PLAYING'
  | 'GAME_OVER'

export interface WordItem {
  word: string
  display_word: string
  meaning: string
}

export interface GameMetrics {
  wpm: number
  accuracy: number
  wordsCount: number
}