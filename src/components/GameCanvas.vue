<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { calculateMetrics, type GameWord, useGameEngine } from '../composables/useGameEngine'
import { useGameStore } from '../stores/gameStore'
import type { GameMetrics } from '../types/game'

interface CanvasWord extends GameWord {
  display_word: string
  meaning: string
  x: number
}

interface Projectile {
  startX: number
  startY: number
  endX: number
  endY: number
  progress: number
}

interface Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  life: number
}

const emit = defineEmits<{
  (event: 'typing-update', buffer: string): void
  (event: 'second-elapsed'): void
  (event: 'word-destroyed', word: CanvasWord): void
  (event: 'word-missed', metrics: GameMetrics): void
  (event: 'finished', metrics: GameMetrics): void
}>()

const gameStore = useGameStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const activeWords = reactive<CanvasWord[]>(
  gameStore.words.map((word, index) => ({
    ...word,
    y: -index * 115 - 32,
    x: 0,
  })),
)
const engine = useGameEngine(activeWords)

const projectiles: Projectile[] = []
const particles: Particle[] = []
const stars = Array.from({ length: 85 }, () => ({
  x: Math.random(),
  y: Math.random(),
  radius: Math.random() * 1.4 + 0.3,
  opacity: Math.random() * 0.55 + 0.2,
}))

let context: CanvasRenderingContext2D | null = null
let canvasWidth = 0
let canvasHeight = 0
let animationFrame = 0
let previousFrameTime = 0
let secondAccumulator = 0
let isFinished = false

function resizeCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const bounds = canvas.getBoundingClientRect()
  const pixelRatio = window.devicePixelRatio || 1
  canvasWidth = bounds.width
  canvasHeight = bounds.height
  canvas.width = Math.round(canvasWidth * pixelRatio)
  canvas.height = Math.round(canvasHeight * pixelRatio)
  context = canvas.getContext('2d')
  context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  for (const [index, word] of activeWords.entries()) {
    if (word.x === 0) {
      const column = index % 3
      const columnWidth = canvasWidth / 3
      word.x = columnWidth * column + columnWidth / 2
    } else {
      word.x = Math.min(Math.max(word.x, 50), canvasWidth - 50)
    }
  }
}

function respawnWord(word: CanvasWord): void {
  const column = Math.floor(Math.random() * 3)
  const columnWidth = canvasWidth / 3
  
  word.x = columnWidth * column + columnWidth / 2
  word.y = -Math.random() * 80 - 40 
  word.speed = undefined
}

function finishGame(): void {
  if (isFinished) return
  isFinished = true
  emit('finished', getMetrics())
}

function getMetrics(): GameMetrics {
  return {
    ...calculateMetrics(engine.correctKeys.value, engine.incorrectKeys.value, gameStore.elapsedTime),
    wordsCount: gameStore.words.length,
  }
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Backspace' && event.key.length !== 1) return
  event.preventDefault()

  const existingWords = [...activeWords]
  const targetBefore = engine.targetWord.value
  const correctCountBefore = engine.correctKeys.value
  engine.handleKeyDown(event.key)
  emit('typing-update', engine.typingBuffer.value)

    if (engine.correctKeys.value > correctCountBefore) {
    const target = (engine.targetWord.value ?? targetBefore) as CanvasWord | null
    if (target) {
        projectiles.push({
        startX: canvasWidth / 2,
        startY: canvasHeight - 22,
        endX: target.x,
        endY: target.y + 8,
        progress: 0,
        })
    }
    }

  for (const word of existingWords) {
    if (!activeWords.includes(word)) {
      emit('word-destroyed', word)
      addExplosion(word.x, word.y)
      activeWords.push(word)
      respawnWord(word)
    }
  }
}

function addExplosion(x: number, y: number): void {
  for (let index = 0; index < 18; index += 1) {
    const angle = (Math.PI * 2 * index) / 18
    const speed = Math.random() * 95 + 35
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: 1,
    })
  }
}

function drawWords(): void {
  if (!context) return

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = '700 20px "JetBrains Mono", monospace'

  for (const word of activeWords) {
    const isTarget = engine.targetWord.value === word
    const typedLength = isTarget ? engine.typingBuffer.value.length : 0
    const typedPart = word.word.slice(0, typedLength)
    const remainingPart = word.word.slice(typedLength)
    const typedWidth = context.measureText(typedPart).width
    const remainingWidth = context.measureText(remainingPart).width
    const startX = word.x - (typedWidth + remainingWidth) / 2

    context.fillStyle = '#34d399'
    context.fillText(typedPart, startX + typedWidth / 2, word.y)
    context.fillStyle = isTarget ? '#f8fafc' : '#a1a1aa'
    context.fillText(remainingPart, startX + typedWidth + remainingWidth / 2, word.y)
  }
}

function renderFrame(timestamp: number): void {
  const frameSeconds = previousFrameTime === 0
    ? 0
    : Math.min((timestamp - previousFrameTime) / 1000, 0.05)
  previousFrameTime = timestamp
  secondAccumulator += frameSeconds

  if (secondAccumulator >= 1) {
    secondAccumulator -= 1
    emit('second-elapsed')

    if (gameStore.elapsedTime >= 20) {
      finishGame()
      return
    }
  }

  engine.updateWordPositions(frameSeconds)

  const missedWords = activeWords.filter((word) => word.y >= canvasHeight - 42)
  for (const word of missedWords) {
    emit('word-missed', getMetrics())
    respawnWord(word)
  }

  if (context) {
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.fillStyle = '#09090b'
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    for (const star of stars) {
      context.globalAlpha = star.opacity
      context.fillStyle = '#d4d4d8'
      context.beginPath()
      context.arc(star.x * canvasWidth, star.y * canvasHeight, star.radius, 0, Math.PI * 2)
      context.fill()
    }
    context.globalAlpha = 1

    drawWords()

    for (let index = projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = projectiles[index]
      projectile.progress += frameSeconds * 3.4
      const progress = Math.min(projectile.progress, 1)
      const x = projectile.startX + (projectile.endX - projectile.startX) * progress
      const y = projectile.startY + (projectile.endY - projectile.startY) * progress
      context.strokeStyle = '#67e8f9'
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(x, y + 12)
      context.lineTo(x, y)
      context.stroke()

      if (progress >= 1) projectiles.splice(index, 1)
    }

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index]
      particle.x += particle.velocityX * frameSeconds
      particle.y += particle.velocityY * frameSeconds
      particle.life -= frameSeconds * 1.5
      context.globalAlpha = Math.max(particle.life, 0)
      context.fillStyle = '#a3e635'
      context.beginPath()
      context.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2)
      context.fill()

      if (particle.life <= 0) particles.splice(index, 1)
    }
    context.globalAlpha = 1
  }

  if (!isFinished) animationFrame = window.requestAnimationFrame(renderFrame)
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('keydown', handleKeyDown)
  animationFrame = window.requestAnimationFrame(renderFrame)
})

onUnmounted(() => {
  window.cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    data-testid="game-canvas"
    class="block h-full min-h-0 w-full"
    aria-label="Typing game field"
  />
</template>