import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePoemStore = defineStore('poem', () => {
  const poems = ref([])
  const poets = ref([])
  const isLoading = ref(true)
  const error = ref(null)

  // 获取所有诗歌
  const fetchPoems = async () => {
    try {
      isLoading.value = true
      const response = await fetch('/data/poems.json')
      poems.value = await response.json()
      isLoading.value = false
    } catch (err) {
      error.value = '加载诗歌数据失败'
      isLoading.value = false
      console.error('Error fetching poems:', err)
    }
  }

  // 获取所有诗人
  const fetchPoets = async () => {
    try {
      isLoading.value = true
      const response = await fetch('/data/poets.json')
      poets.value = await response.json()
      isLoading.value = false
    } catch (err) {
      error.value = '加载诗人数据失败'
      isLoading.value = false
      console.error('Error fetching poets:', err)
    }
  }

  // 根据ID获取诗歌
  const getPoemById = computed(() => {
    return (id) => poems.value.find(poem => poem.id === id)
  })

  // 根据ID获取诗人
  const getPoetById = computed(() => {
    return (id) => poets.value.find(poet => poet.id === id)
  })

  // 获取诗人的所有诗歌
  const getPoemsByPoetId = computed(() => {
    return (poetId) => {
      const poet = poets.value.find(p => p.id === poetId)
      if (!poet) return []
      return poems.value.filter(poem => poet.poems.includes(poem.id))
    }
  })

  // 搜索诗歌
  const searchPoems = (query) => {
    if (!query) return []
    
    const lowerQuery = query.toLowerCase()
    return poems.value.filter(poem => 
      poem.title.toLowerCase().includes(lowerQuery) || 
      poem.author.toLowerCase().includes(lowerQuery) || 
      poem.content.some(part => 
        part.sentence.toLowerCase().includes(lowerQuery)
      )
    )
  }

  // 点赞诗歌
  const likePoem = (poemId) => {
    const poem = poems.value.find(p => p.id === poemId)
    if (poem) {
      poem.likes++
      // 在实际应用中，这里应该调用API保存点赞数据
      saveLikeToLocalStorage(poemId)
    }
  }

  // 保存点赞状态到本地存储
  const saveLikeToLocalStorage = (poemId) => {
    const likedPoems = JSON.parse(localStorage.getItem('likedPoems') || '[]')
    if (!likedPoems.includes(poemId)) {
      likedPoems.push(poemId)
      localStorage.setItem('likedPoems', JSON.stringify(likedPoems))
    }
  }

  // 检查诗歌是否已点赞
  const isPoemLiked = (poemId) => {
    const likedPoems = JSON.parse(localStorage.getItem('likedPoems') || '[]')
    return likedPoems.includes(poemId)
  }

  // 收藏诗歌
  const favoritePoem = (poemId) => {
    const favoritePoems = JSON.parse(localStorage.getItem('favoritePoems') || '[]')
    if (!favoritePoems.includes(poemId)) {
      favoritePoems.push(poemId)
      localStorage.setItem('favoritePoems', JSON.stringify(favoritePoems))
    }
  }

  // 取消收藏诗歌
  const unfavoritePoem = (poemId) => {
    const favoritePoems = JSON.parse(localStorage.getItem('favoritePoems') || '[]')
    const index = favoritePoems.indexOf(poemId)
    if (index !== -1) {
      favoritePoems.splice(index, 1)
      localStorage.setItem('favoritePoems', JSON.stringify(favoritePoems))
    }
  }

  // 检查诗歌是否已收藏
  const isPoemFavorited = (poemId) => {
    const favoritePoems = JSON.parse(localStorage.getItem('favoritePoems') || '[]')
    return favoritePoems.includes(poemId)
  }

  // 获取所有收藏的诗歌
  const getFavoritePoems = computed(() => {
    return () => {
      const favoritePoems = JSON.parse(localStorage.getItem('favoritePoems') || '[]')
      return poems.value.filter(poem => favoritePoems.includes(poem.id))
    }
  })

  return {
    poems,
    poets,
    isLoading,
    error,
    fetchPoems,
    fetchPoets,
    getPoemById,
    getPoetById,
    getPoemsByPoetId,
    searchPoems,
    likePoem,
    isPoemLiked,
    favoritePoem,
    unfavoritePoem,
    isPoemFavorited,
    getFavoritePoems
  }
})