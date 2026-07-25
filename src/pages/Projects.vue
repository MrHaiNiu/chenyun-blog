<template>
  <div class="flex-1 flex flex-col">
    <BannerSection />
    <main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-4 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">项目</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">共 {{ projectsData.length }} 个项目</p>
        </div>
        <div class="max-w-sm mt-3 sm:mt-0 sm:ml-4 shrink-0"><SearchBar inline :search-fn="searchProjects" placeholder="搜索项目..." /></div>
      </div>

      <!-- Tags row -->
      <div v-if="tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <button
          @click="selectedTag = ''"
          :class="selectedTag === '' ? 'bg-accent text-white' : 'bg-glass-50 text-slate-700 dark:text-slate-300'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
        >
          全部 ({{ projectsData.length }})
        </button>
        <button
          v-for="tag in tags"
          :key="tag.name"
          @click="selectedTag = tag.name"
          :class="selectedTag === tag.name ? 'bg-accent text-white' : 'bg-glass-50 text-slate-700 dark:text-slate-300'"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-white/40 dark:border-white/10"
        >
          {{ tag.name }} ({{ tag.count }})
        </button>
      </div>

      <!-- View mode toggle (separate row, right-aligned) -->
      <div class="flex justify-end mb-6">
        <div class="flex gap-2 p-1 bg-glass-50 rounded-xl border border-white/40 dark:border-white/10">
          <!-- Sort toggle -->
          <button
            @click="sortAscending = !sortAscending"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all"
            :class="sortAscending ? 'bg-accent text-white shadow-md' : 'text-slate-500 hover:text-accent'"
            :title="sortAscending ? '从新到旧' : '从旧到新'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
          <div class="w-px bg-slate-200 dark:bg-slate-600/50" />
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
              <div
                v-if="i % 2 === 0"
                class="rounded-2xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <!-- Clickable body → project detail page -->
                <div @click="goToProject(project)" class="group cursor-pointer p-5">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="text-3xl">{{ project.icon }}</span>
                    <h3 class="text-base font-black text-slate-800 dark:text-white group-hover:text-accent transition-colors">{{ project.name }}</h3>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed mb-3">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in project.tags" :key="tag" class="px-2 py-1 bg-accent-soft text-accent rounded-md text-xs font-bold">{{ tag }}</span>
                  </div>
                </div>
                <!-- GitHub link -->
                <div class="px-5 pb-5">
                  <a
                    :href="project.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click.stop
                    class="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:translate-x-1 transition-transform"
                  >
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub →
                  </a>
                </div>
              </div>
            </div>
            <div class="z-20 flex items-center justify-center w-6 h-6 rounded-full bg-accent border-4 border-white dark:border-slate-900 shadow-lg shrink-0">
              <div class="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
            <div class="w-full md:w-5/12 pl-4">
              <div class="rounded-2xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
                <!-- Clickable body → project detail page -->
                <div @click="goToProject(project)" class="group cursor-pointer p-5">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="text-3xl">{{ project.icon }}</span>
                    <h3 class="text-base font-black text-slate-800 dark:text-white group-hover:text-accent transition-colors">{{ project.name }}</h3>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed mb-3">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in project.tags" :key="tag" class="px-2 py-1 bg-accent-soft text-accent rounded-md text-xs font-bold">{{ tag }}</span>
                  </div>
                </div>
                <!-- GitHub link -->
                <div class="px-5 pb-5">
                  <a
                    :href="project.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click.stop
                    class="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:translate-x-1 transition-transform"
                  >
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="(project, i) in filteredProjects"
          :key="project.id"
          class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-in-up"
          :style="{ animationDelay: `${i * 30}ms` }"
        >
          <!-- Clickable body → project detail page -->
          <div @click="goToProject(project)" class="group cursor-pointer p-5">
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
          </div>
          <!-- GitHub link -->
          <div class="px-5 pb-5">
            <a
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
              class="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:translate-x-1 transition-transform"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProjects } from '@/utils/content-loader'
import type { Project } from '@/types'
import BannerSection from '@/components/BannerSection.vue'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { SearchResultItem } from '@/components/SearchBar.vue'

const router = useRouter()

const projectsData = ref<Project[]>([])
const selectedTag = ref('')
const viewMode = ref<'timeline' | 'grid'>('grid')
const sortAscending = ref(false)

/** 检查 projects 列表是否发生了变化（基于 id 列表） */
function projectsHaveChanged(a: Project[], b: Project[]): boolean {
  if (a.length !== b.length) return true
  const idsA = a.map(p => p.id).sort().join(',')
  const idsB = b.map(p => p.id).sort().join(',')
  return idsA !== idsB
}

let pollTimer: ReturnType<typeof setInterval> | null = null

const tags = computed(() => {
  const counts: Record<string, number> = {}
  projectsData.value.forEach((p) => {
    p.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredProjects = computed(() => {
  let result = projectsData.value
  if (selectedTag.value) {
    result = projectsData.value.filter((p) => p.tags.includes(selectedTag.value))
  }
  let sorted = [...result]
  if (sortAscending.value) {
    sorted.reverse()
  }
  return sorted
})

function searchProjects(query: string): SearchResultItem[] {
  const q = query.toLowerCase()
  return projectsData.value
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
    .map(p => ({
      title: p.name,
      description: p.description,
      tag: 'a',
      bindings: { href: p.githubUrl, target: '_blank', rel: 'noopener noreferrer' },
    }))
}

function goToProject(project: Project) {
  router.push(`/project/${project.slug}`)
}

onMounted(async () => {
  projectsData.value = await fetchProjects()

  // 每 3 秒轮询一次，检测 Projects 是否有新增/删除的文件
  pollTimer = setInterval(async () => {
    const fresh = await fetchProjects()
    if (projectsHaveChanged(projectsData.value, fresh)) {
      projectsData.value = fresh
    }
  }, 3000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
