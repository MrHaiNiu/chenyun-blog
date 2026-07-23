<template>
  <div
    class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-5"
  >
    <h4 class="text-sm font-black text-slate-800 dark:text-white mb-3 border-l-4 border-accent pl-2">
      今日一言
    </h4>
    <div class="flex flex-col items-center text-center">
      <svg class="w-6 h-6 text-accent/60 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
      </svg>
      <blockquote class="text-sm text-slate-600 dark:text-slate-400 italic font-serif leading-relaxed">
        “{{ quote.text }}”
      </blockquote>
      <p class="text-xs text-slate-500 dark:text-slate-500 mt-2 font-bold">—— {{ quote.author }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DailyQuote {
  text: string
  author: string
}

const quotes: DailyQuote[] = [
  { text: '代码改变世界', author: 'Linus Torvalds' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: '把代码当作诗歌来写', author: 'unknown' },
  { text: '在代码与学术间穿梭，每个bug都是成长的契机', author: 'Chenyun' },
  { text: '最简单的往往是最有效的', author: 'unknown' },
  { text: '不要只是改正错误，要理解它为什么会发生', author: 'unknown' },
  { text: '写代码就像写日记，未来的你会感谢现在的你', author: 'unknown' },
]

function getDailyQuote(): DailyQuote {
  // Deterministic quote based on current date
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return quotes[dayOfYear % quotes.length]
}

const quote = getDailyQuote()
</script>
