<template>
  <main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">相册</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">共 {{ albums.length }} 个相册</p>
        </div>
        <div class="max-w-sm mt-3 sm:mt-0 sm:ml-4 shrink-0"><SearchBar inline :search-fn="searchAlbums" placeholder="搜索相册..." /></div>
      </div>



      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div
          v-for="(album, i) in albums"
          :key="album.id"
          @click="openAlbum(album)"
          class="group rounded-3xl bg-glass-40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer animate-fade-in-up"
          :style="{ animationDelay: `${i * 30}ms` }"
        >
          <div class="relative aspect-[16/10] overflow-hidden">
            <img
              :src="album.cover"
              :alt="album.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-lg font-black text-white drop-shadow-lg">{{ album.title }}</h3>
              <p class="text-xs text-white/80 font-serif mt-1">{{ album.description }}</p>
              <p class="text-[10px] text-white/60 mt-1">{{ album.photos.length }} 张照片 · {{ album.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Album Modal -->
    <Teleport to="body">
      <Transition name="album-modal">
        <div
          v-if="selectedAlbum"
          @click.self="selectedAlbum = null"
          class="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div class="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/10">
            <div class="sticky top-0 bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
              <div>
                <h3 class="text-xl font-black text-white">{{ selectedAlbum.title }}</h3>
                <p class="text-xs text-slate-400">{{ selectedAlbum.photos.length }} 张照片</p>
              </div>
              <button @click="selectedAlbum = null" class="text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="photo in selectedAlbum.photos" :key="photo.url" class="rounded-2xl overflow-hidden group relative">
                <img :src="photo.url" :alt="photo.caption" class="w-full h-auto" loading="lazy" />
                <p v-if="photo.caption" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm text-white font-serif">
                  {{ photo.caption }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { albums } from '@/data/albums'
import type { Album } from '@/types'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { SearchResultItem } from '@/components/SearchBar.vue'

const selectedAlbum = ref<Album | null>(null)

function openAlbum(album: Album) {
  selectedAlbum.value = album
}

function searchAlbums(query: string): SearchResultItem[] {
  const q = query.toLowerCase()
  return albums
    .filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    )
    .map(a => ({
      title: a.title,
      description: a.description,
      tag: 'div',
      bindings: {},
    }))
}
</script>

<style scoped>
.album-modal-enter-active,
.album-modal-leave-active {
  transition: opacity 0.3s ease;
}

.album-modal-enter-from,
.album-modal-leave-to {
  opacity: 0;
}
</style>
