<template>
  <div
    class="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-4"
  >
    <div class="flex items-center justify-between mb-3">
      <button @click="prevMonth" class="text-slate-500 hover:text-accent transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h3 class="text-sm font-black text-slate-800 dark:text-white">{{ year }}年 {{ month + 1 }}月</h3>
      <button @click="nextMonth" class="text-slate-500 hover:text-accent transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>

    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-1 mb-1">
      <div v-for="day in weekdays" :key="day" class="text-center text-[10px] font-bold text-slate-400 py-1">
        {{ day }}
      </div>
    </div>

    <!-- Calendar days -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, i) in calendarDays"
        :key="i"
        class="aspect-square flex items-center justify-center rounded-md text-[11px] font-medium transition-all duration-200 cursor-pointer relative"
        :class="getDayClass(day)"
        @click="day && selectDay(day)"
      >
        <span v-if="day">{{ day }}</span>
        <span v-if="day && isToday(day)" class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth())
const today = new Date()
const selectedDay = ref(today.getDate())

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDays = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  return days
})

function isToday(day: number): boolean {
  return year.value === today.getFullYear() &&
    month.value === today.getMonth() &&
    day === today.getDate()
}

function getDayClass(day: number | null): string {
  if (!day) return ''
  const isCurrentDay = isToday(day)
  const isSelected = day === selectedDay.value
  if (isCurrentDay) return 'bg-accent text-white font-bold'
  if (isSelected) return 'bg-accent-softer text-accent-dark dark:text-accent-light'
  return 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
}

function selectDay(day: number) {
  selectedDay.value = day
}

function prevMonth() {
  if (month.value === 0) {
    month.value = 11
    year.value--
  } else {
    month.value--
  }
}

function nextMonth() {
  if (month.value === 11) {
    month.value = 0
    year.value++
  } else {
    month.value++
  }
}
</script>
