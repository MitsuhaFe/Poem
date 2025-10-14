<template>
  <div>
    <h1 class="text-3xl font-kai text-primary dark:text-dark-primary mb-6">我的收藏</h1>
    
    <div v-if="isLoading" class="text-center py-10">
      <p>加载中...</p>
    </div>
    
    <div v-else-if="favoritePoems.length === 0" class="text-center py-10">
      <p>您还没有收藏任何诗歌</p>
      <router-link to="/poems" class="btn btn-primary mt-4">浏览诗歌</router-link>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="poem in favoritePoems" :key="poem.id" class="poem-card bg-white dark:bg-gray-800">
        <h2 class="text-xl font-kai mb-2">{{ poem.title }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ poem.dynasty }} · {{ poem.author }}</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {{ poem.content.map(part => part.sentence).join(' ') }}
        </p>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <button 
              @click="unfavoritePoem(poem.id)" 
              class="mr-4 focus:outline-none text-yellow-500"
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
import { ref, computed, onMounted } from 'vue';
import { usePoemStore } from '../stores/poemStore';
import { HeartIcon, BookmarkIcon } from 'lucide-vue-next';

const poemStore = usePoemStore();
const isLoading = ref(true);

// 获取收藏的诗歌
const favoritePoems = computed(() => {
  return poemStore.getFavoritePoems();
});

// 取消收藏
const unfavoritePoem = (poemId) => {
  poemStore.unfavoritePoem(poemId);
};

onMounted(async () => {
  if (poemStore.poems.length === 0) {
    await poemStore.fetchPoems();
  }
  
  isLoading.value = false;
});
</script>