<template>
  <main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">项目</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">共 {{ projectsData.length }} 个项目</p>

      <!-- Tags row -->
      <div v-if="tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <button
          @click="selectedTag = ''"
          :class="selectedTag === '' ? 'bg-accent text-white' : 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
        >
          全部 ({{ projectsData.length }})
        </button>
        <button
          v-for="tag in tags"
          :key="tag.name"
          @click="selectedTag = tag.name"
          :class="selectedTag === tag.name ? 'bg-accent text-white' : 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
        >
          {{ tag.name }} ({{ tag.count }})
        </button>
      </div>

      <!-- View mode toggle (separate row, right-aligned) -->
      <div class="flex justify-end mb-6">
        <div class="flex gap-2 p-1 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-white/10">
          <button
            @click="viewMode = 'timeline'"
            :class="viewMode === 'timeline' ? 'bg-accent text-white shadow-md' : 'text-slate-500 hover:text-accent'"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
            中枢链路
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-accent text-white shadow-md' : 'text-slate-500 hover:text-accent'"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            矩阵网格
          </button>
        </div>
      </div>

      <!-- Timeline View -->
      <div v-if="viewMode === 'timeline'" class="relative overflow-hidden p-2 md:p-8 min-h-[400px]">
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" :style="{ background: 'linear-gradient(to bottom, hsla(var(--hue), 70%, 55%, 0.5), hsla(270, 70%, 50%, 0.3), transparent)' }" />
        <div class="relative z-10 flex flex-col gap-12 md:gap-16">
          <div
            v-for="(project, i) in filteredProjects"
            :key="project.id"
            class="relative flex flex-row items-center w-full"
          >
            <div class="hidden md:block w-5/12 pr-4">
              <a
                v-if="i % 2 === 0"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group block rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div class="p-5">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="text-3xl">{{ project.icon }}</span>
                    <h3 class="text-base font-black text-slate-800 dark:text-white group-hover:text-accent transition-colors">{{ project.name }}</h3>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed mb-3">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in project.tags" :key="tag" class="px-2 py-1 bg-accent-soft text-accent rounded-md text-xs font-bold">{{ tag }}</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="z-20 flex items-center justify-center w-6 h-6 rounded-full bg-accent border-4 border-white dark:border-slate-900 shadow-lg shrink-0">
              <div class="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
            <div class="w-full md:w-5/12 pl-4">
              <a
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group block rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div class="p-5">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="text-3xl">{{ project.icon }}</span>
                    <h3 class="text-base font-black text-slate-800 dark:text-white group-hover:text-accent transition-colors">{{ project.name }}</h3>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed mb-3">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in project.tags" :key="tag" class="px-2 py-1 bg-accent-soft text-accent rounded-md text-xs font-bold">{{ tag }}</span>
                  </div>
                  <span class="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform inline-block mt-2">GitHub →</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <a
          v-for="(project, i) in filteredProjects"
          :key="project.id"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 100 } }"
          class="group rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
        >
          <div class="p-5">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl">{{ project.icon }}</span>
              <h3 class="text-base font-black text-slate-800 dark:text-white group-hover:text-accent dark:group-hover:text-accent-light transition-colors">
                {{ project.name }}
              </h3>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed flex-1 mb-3">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-1.5 mb-2">
              <span v-for="tag in project.tags" :key="tag" class="px-2 py-1 bg-accent-soft text-accent dark:text-accent-light rounded-md text-xs font-bold">{{ tag }}</span>
            </div>
            <span class="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform inline-block">GitHub →</span>
          </div>
        </a>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { projectsData } from '@/data/projects'
import BackButton from '@/components/BackButton.vue'

const selectedTag = ref('')
const viewMode = ref<'timeline' | 'grid'>('grid')

const tags = computed(() => {
  const counts: Record<string, number> = {}
  projectsData.forEach((p) => {
    p.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredProjects = computed(() => {
  if (!selectedTag.value) return projectsData
  return projectsData.filter((p) => p.tags.includes(selectedTag.value))
})
</script>
