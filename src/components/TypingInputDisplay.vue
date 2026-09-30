<script setup lang="ts">
defineProps<{
  buffer: string
}>()
</script>

<template>
  <footer
    data-testid="typing-display"
    class="flex min-h-20 shrink-0 items-center border-t border-cyan-400/25 bg-zinc-950 px-5 sm:px-8"
    aria-live="polite"
  >
    <div class="mx-auto flex w-full max-w-5xl items-center gap-4">
      <span class="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Target</span>
      <p class="min-h-8 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xl font-medium text-cyan-200 sm:text-2xl">
        <span>{{ buffer }}</span><span class="ml-0.5 animate-pulse text-cyan-400">▍</span>
      </p>
    </div>
  </footer>
</template>