import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tmpArticles } from '@/constant/tempNewsList'

export const useNewsListStore = defineStore('counter', () => {
    // TODO 임시
    const articles = ref(tmpArticles)
    
  return {
    articles,
  }
})
