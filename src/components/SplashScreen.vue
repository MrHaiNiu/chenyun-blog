<template>
  <Transition name="splash">
    <div
      v-if="show"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950"
      :class="{ 'splash-exit': exiting }"
    >
      <div class="flex flex-col items-center">
        <div class="relative mb-8">
          <div class="absolute inset-0 rounded-full bg-accent-softer blur-2xl animate-pulse" />
          <img
            :src="siteConfig.avatarUrl"
            :alt="siteConfig.authorName"
            class="relative w-24 h-24 rounded-full object-cover border-2 border-white/20"
          />
        </div>

        <h1 class="text-2xl font-black text-white mb-2 tracking-[0.2em] uppercase">
          {{ siteConfig.authorName }}
        </h1>
        <p class="text-[10px] font-black text-slate-400 tracking-[0.5em] mb-12">INITIALIZING SYSTEM</p>

        <div class="w-40 h-[1.5px] bg-slate-800 relative">
          <div
            class="absolute top-0 left-0 h-full bg-accent splash-progress"
            :style="{ boxShadow: '0 0 12px hsla(var(--hue), 70%, 55%, 0.8)' }"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { siteConfig } from '@/siteConfig'

const show = ref(false)
const exiting = ref(false)

onMounted(() => {
  const hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true'

  if (!hasSeenSplash) {
    show.value = true
    setTimeout(() => {
      exitSplash()
    }, 900)
  } else {
    document.documentElement.classList.add('splash-seen')
  }
})

function exitSplash() {
  exiting.value = true
  setTimeout(() => {
    show.value = false
    sessionStorage.setItem('hasSeenSplash', 'true')
    document.documentElement.classList.add('splash-seen')
  }, 300)
}
</script>

<style scoped>
.splash-enter-active,
.splash-leave-active {
  transition: opacity 0.6s ease;
}

.splash-enter-from,
.splash-leave-to {
  opacity: 0;
}

.splash-progress {
  animation: splashProgress 0.9s ease-in-out forwards;
}

@keyframes splashProgress {
  from { width: 0%; }
  to { width: 100%; }
}

.splash-exit {
  animation: splashExit 0.6s ease-in forwards;
}

@keyframes splashExit {
  to {
    opacity: 0;
    transform: scale(1.05);
    pointer-events: none;
  }
}
</style>
