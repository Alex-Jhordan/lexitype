<template>
  <main class="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-5 text-center text-zinc-100">
    <svg
      data-testid="fuel-ship-svg"
      class="mb-8 h-44 w-40"
      viewBox="0 0 160 180"
      role="img"
      aria-label="Ship fuel loading"
    >
      <defs>
        <clipPath id="ship-silhouette">
          <path d="M80 8 101 52 145 77 124 109 108 101 103 150 80 173 57 150 52 101 36 109 15 77 59 52Z" />
        </clipPath>
      </defs>
      <rect class="fuel-fill" x="0" y="92" width="160" height="100" clip-path="url(#ship-silhouette)" />
      <path
        d="M80 8 101 52 145 77 124 109 108 101 103 150 80 173 57 150 52 101 36 109 15 77 59 52Z"
        fill="#18181b"
        stroke="#22d3ee"
        stroke-width="3"
      />
      <path d="M80 43 94 75 80 89 66 75Z" fill="#a5f3fc" />
    </svg>
    <p class="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Fueling the ship</p>
    <h1 class="mt-3 text-lg font-semibold text-white">Preparing your word field</h1>
    <div class="mt-7 h-1 w-48 overflow-hidden bg-zinc-800" aria-hidden="true">
      <div class="h-full w-1/2 animate-pulse bg-cyan-400" />
    </div>
  </main>
</template>

<style scoped>
.fuel-fill {
  fill: #22d3ee;
  animation: fuel-rise 2.4s ease-in-out infinite alternate;
}

@keyframes fuel-rise {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-65px);
  }
}
</style>