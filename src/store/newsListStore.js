import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useNewsListStore = defineStore('counter', () => {
    // TODO 임시
    const articles = ref([])

    const loadArticles = async () => {
      const res = await axios.get('/articles', { headers: {'Content-Type': 'application/json'} })
      articles.value = res.data
      articles.value.forEach((article) => { if (article.category === "") article.category = '기타' })
    }
    
  return {
    articles,
    loadArticles,
  }
})
