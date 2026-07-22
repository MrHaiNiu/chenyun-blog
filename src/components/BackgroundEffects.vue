<template>
  <div :class="{ 'opacity-100': themeStore.isDark, 'opacity-0': !themeStore.isDark }" class="transition-opacity duration-500">
    <Fireflies />
  </div>
  <div :class="{ 'opacity-0': themeStore.isDark, 'opacity-100': !themeStore.isDark }" class="transition-opacity duration-500">
    <Sakura />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import Fireflies from '@/components/Fireflies.vue'
import Sakura from '@/components/Sakura.vue'

const themeStore = useThemeStore()
</script>
