<template>
  <div
    class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-5"
  >
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl">{{ greetingIcon }}</span>
      <div>
        <h4 class="text-base font-black text-slate-900 dark:text-white">{{ greetingText }}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 font-bold">{{ dateStr }}</p>
      </div>
    </div>
    <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed italic">
      “{{ encouragement }}”
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const encouragements = [
  '今天也是元气满满的一天呢！',
  '在代码的世界里，没有解决不了的问题。',
  '每一个bug都是让你变得更强的小怪。',
  '保持热爱，奔赴山海。',
  '今天的努力，是明天的基石。',
  '键盘敲击声，是最动听的旋律。',
  '愿你历尽千帆，归来仍是少年。',
  '路虽远，行则将至。',
  '不要因为没有掌声而放弃努力。',
  '悄悄努力，然后惊艳所有人。',
  '代码不辜负每一个认真的人。',
  '即使是微小的进步，也值得喝彩。',
]

const hour = new Date().getHours()

const greetingText = computed(() => {
  if (hour < 6) return '夜深了'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const greetingIcon = computed(() => {
  if (hour < 6) return '🌙'
  if (hour < 12) return '🌅'
  if (hour < 14) return '☀️'
  if (hour < 18) return '🌤️'
  return '🌆'
})

const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const now = new Date()
const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`

const encouragement = encouragements[now.getDate() % encouragements.length]
</script>
