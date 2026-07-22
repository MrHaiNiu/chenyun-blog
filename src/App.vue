<template>
  <div
    class="relative w-screen min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950"
    style="transition: background-color 0.3s ease;"
  >
    <!-- Background layers -->
    <BackgroundSlider />
    <BackgroundEffects />

    <!-- Dark overlay for readability (lighter for performance) -->
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-black/20 dark:bg-black/40"
      style="transition: background-color 0.3s ease;"
    />

    <!-- Top gradient highlight (Mizuki-inspired) -->
    <div class="top-gradient-highlight" />

    <!-- Splash screen -->
    <SplashScreen />

    <!-- Main content -->
    <div class="relative z-10 flex flex-col flex-1">
      <PageProgressBar />
      <Navbar />
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Floating buttons (back to top + music) -->
    <FloatingButtons />

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toastStore.toast"
        :class="toastClass"
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-xl border backdrop-blur-md"
      >
        {{ toastStore.toast.text }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import BackgroundSlider from '@/components/BackgroundSlider.vue'
import BackgroundEffects from '@/components/BackgroundEffects.vue'
import SplashScreen from '@/components/SplashScreen.vue'
import Navbar from '@/components/Navbar.vue'
import PageProgressBar from '@/components/PageProgressBar.vue'
import FloatingButtons from '@/components/FloatingButtons.vue'
import { useThemeStore } from '@/stores/theme'
import { useToastStore } from '@/stores/toast'
import '@vueuse/motion'

const themeStore = useThemeStore()
const toastStore = useToastStore()

const toastClass = computed(() => {
  const type = toastStore.toast?.type
  return {
    'bg-green-500/90 border-green-400': type === 'success',
    'bg-amber-500/90 border-amber-400': type === 'warning',
    'bg-red-500/90 border-red-400': type === 'error',
    'bg-accent/90 border-accent': type === 'info',
  }
})

onMounted(() => {
  themeStore.init()
})
</script>

<style>
/* Use shorter transitions to reduce jank */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
}
.fade-slide-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* Global wave animations */
@keyframes wave-move-1 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes wave-move-2 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes wave-move-3 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.wave-svg {
  animation: wave-move-1 8s linear infinite;
}
.wave-svg-2 {
  animation: wave-move-2 12s linear infinite;
}
.wave-svg-3 {
  animation: wave-move-3 16s linear infinite;
}

/* Cursor blink for typewriter */
@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.animate-cursor {
  animation: cursor-blink 0.8s step-end infinite;
}

/* Performance: GPU acceleration for animated elements */
.wave-svg,
.wave-svg-2,
.wave-svg-3 {
  will-change: transform;
  transform: translateZ(0);
}
</style>
