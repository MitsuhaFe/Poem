<template>
  <div>
    <h1 class="text-3xl font-kai text-primary dark:text-dark-primary mb-6">搜索结果</h1>
    
    <div class="mb-6">
      <p class="text-gray-600 dark:text-gray-400">
        关键词 "{{ searchQuery }}" 的搜索结果：共找到 {{ searchResults.length }} 条结果
      </p>
    </div>
    
    <div v-if="isLoading" class="text-center py-10">
      <p>搜索中...</p>
    </div>
    
    <div v-else-if="searchResults.length === 0" class="text-center py-10">
      <p>没有找到符合条件的诗歌</p>
    </div>
    
    <div v-else class="space-y-6">
      <div v-for="poem in searchResults" :key="poem.id" class="poem-card bg-white dark:bg-gray-800">
        <h2 class="text-xl font-kai mb-2">{{ poem.title }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ poem.dynasty }} · {{ poem.author }}</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          <span v-for="(part, index) in poem.content" :key="index">
            <span v-html="highlightKeyword(part.sentence, searchQuery)"></span>
            <br v-if="index < poem.content.length - 1">
          </span>
        </p>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <button 
              @click="toggleFavorite(poem.id)" 
              class="mr-4 focus:outline-none"
              :class="{ 'text-yellow-500': isPoemFavorited(poem.id), 'text-gray-400': !isPoemFavorited(poem.id) }"
            >
              <BookmarkIcon size="18" />
            </button>
            <span class="flex items-center text-gray-600 dark:text-gray-400">
              <HeartIcon size="18" class="mr-1 text-red-500" />
              {{ poem.likes }}
            </span>
          </div>
          <router-link :to="`/poem/${poem.id}`" class="btn btn-primary text-sm">
            查看详情
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePoemStore } from '../stores/poemStore';
import { HeartIcon, BookmarkIcon } from 'lucide-vue-next';

const route = useRoute();
const poemStore = usePoemStore();
const isLoading = ref(true);
const searchResults = ref([]);

// 获取搜索关键词
const searchQuery = computed(() => route.query.q || '');

// 搜索诗歌
const searchPoems = () => {
  if (searchQuery.value) {
    searchResults.value = poemStore.searchPoems(searchQuery.value);
  } else {
    searchResults.value = [];
  }
  isLoading.value = false;
};

// 高亮关键词
const highlightKeyword = (text, keyword) => {
  if (!keyword) return text;
  
  const regex = new RegExp(keyword, 'gi');
  return text.replace(regex, match => `<span class="bg-yellow-200 dark:bg-yellow-700">${match}</span>`);
};

// 切换收藏状态
const toggleFavorite = (poemId) => {
  if (poemStore.isPoemFavorited(poemId)) {
    poemStore.unfavoritePoem(poemId);
  } else {
    poemStore.favoritePoem(poemId);
  }
};

// 检查诗歌是否已收藏
const isPoemFavorited = (poemId) => {
  return poemStore.isPoemFavorited(poemId);
};

// 监听搜索关键词变化
watch(searchQuery, () => {
  isLoading.value = true;
  searchPoems();
});

onMounted(async () => {
  if (poemStore.poems.length === 0) {
    await poemStore.fetchPoems();
  }
  
  searchPoems();
});
</script>