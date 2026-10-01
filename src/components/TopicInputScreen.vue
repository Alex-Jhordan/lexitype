<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-10 text-zinc-100">
    <section class="w-full max-w-xl border border-zinc-700 bg-zinc-900 p-7 sm:p-10">
      <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Mission parameters</p>
      <h1 class="mb-3 text-2xl font-bold text-white sm:text-3xl">Choose a topic</h1>
      <p class="mb-7 text-sm leading-6 text-zinc-400">Your words will be generated from this subject.</p>

      <form class="space-y-4" @submit.prevent="gameStore.setState('LLM_LOADING')">
        <label class="block text-sm font-medium text-zinc-200" for="topic">Topic</label>
        <input
          id="topic"
          v-model="gameStore.topic"
          data-testid="topic-input"
          class="w-full border border-zinc-600 bg-zinc-950 px-4 py-3 text-base text-white outline-none placeholder:text-zinc-600 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300"
          type="text"
          minlength="2"
          maxlength="50"
          autocomplete="off"
          placeholder="e.g. deep sea creatures"
        />
        <button
          data-testid="submit-topic-btn"
          class="cursor-pointer w-full border border-cyan-300 bg-cyan-300 px-5 py-3 text-sm font-bold uppercase tracking-widest text-zinc-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 sm:w-auto"
          type="submit"
          :disabled="gameStore.topic.trim().length < 2"
        >
          Generate words
        </button>
      </form>
    </section>
  </main>
</template>