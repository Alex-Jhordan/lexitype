import type { WordItem } from '../types/game'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchWordsByTopic(topic: string): Promise<WordItem[]> {
  const response = await fetch(`${API_URL}/api/generate-words`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.words
}
