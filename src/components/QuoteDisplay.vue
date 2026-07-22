<template>
  <div
    class="rounded-3xl bg-glass-40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-5 md:p-6 relative overflow-hidden"
  >
    <!-- Subtle gradient accent -->
    <div class="absolute -top-8 -right-8 w-24 h-24 bg-accent-soft rounded-full blur-2xl pointer-events-none" />

    <Transition name="quote-fade" mode="out-in">
      <div :key="currentIndex" class="relative z-10 flex items-start gap-3">
        <!-- Quote icon -->
        <svg class="w-5 h-5 text-accent-light/60 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 7v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <div class="flex-1">
          <p class="text-sm md:text-base font-serif text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ currentQuote.text }}
          </p>
          <p v-if="currentQuote.author" class="text-xs text-slate-400 dark:text-slate-500 mt-2 tracking-wider">
            —— {{ currentQuote.author }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Dots -->
    <div v-if="quotes.length > 1" class="flex justify-center gap-1.5 mt-4">
      <button
        v-for="(_, i) in quotes"
        :key="i"
        @click="setCurrentIndex(i)"
        :class="i === currentIndex ? 'w-5 bg-accent-light' : 'w-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'"
        class="h-1.5 rounded-full transition-all duration-500"
        :aria-label="`切换到第 ${i + 1} 句`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { quotes } from '@/data/quotes'

const currentIndex = ref(Math.floor(Math.random() * quotes.length))
let timer: ReturnType<typeof setInterval> | null = null

const currentQuote = computed(() => quotes[currentIndex.value])

function setCurrentIndex(i: number) {
  currentIndex.value = i
  restartTimer()
}

function restartTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % quotes.length
  }, 8000)
}

onMounted(restartTimer)
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.quote-fade-enter-active {
  transition: all 0.6s ease;
}
.quote-fade-leave-active {
  transition: all 0.4s ease;
}
.quote-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.quote-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
