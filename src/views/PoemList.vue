<template>
  <div>
    <h1 class="text-3xl font-kai text-primary dark:text-dark-primary mb-6">诗歌列表</h1>
    
    <div class="mb-6 flex flex-wrap gap-4">
      <div class="w-full md:w-auto">
        <select v-model="filterType" class="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <option value="all">全部</option>
          <option value="dynasty">按朝代</option>
          <option value="author">按作者</option>
        </select>
      </div>
      
      <div v-if="filterType === 'dynasty'" class="w-full md:w-auto">
        <select v-model="selectedDynasty" class="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <option value="">选择朝代</option>
          <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">{{ dynasty }}</option>
        </select>
      </div>
      
      <div v-if="filterType === 'author'" class="w-full md:w-auto">
        <select v-model="selectedAuthor" class="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <option value="">选择作者</option>
          <option v-for="poet in poemStore.poets" :key="poet.id" :value="poet.name">{{ poet.name }}</option>
        </select>
      </div>
      
      <div class="w-full md:w-auto ml-auto">
        <select v-model="sortBy" class="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <option value="likes">按热度排序</option>
          <option value="title">按标题排序</option>
        </select>
      </div>
    </div>
    
    <div v-if="isLoading" class="text-center py-10">
      <p>加载中...</p>
    </div>
    
    <div v-else-if="filteredPoems.length === 0" class="text-center py-10">
      <p>没有找到符合条件的诗歌</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="poem in filteredPoems" :key="poem.id" class="poem-card bg-white dark:bg-gray-800">
        <h2 class="text-xl font-kai mb-2">{{ poem.title }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ poem.dynasty }} · {{ poem.author }}</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {{ poem.content.map(part => part.sentence).join(' ') }}
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

const filterType = ref('all');
const selectedDynasty = ref('');
const selectedAuthor = ref('');
const sortBy = ref('likes');

// 从URL参数中获取过滤条件
onMounted(async () => {
  if (route.query.filter) {
    filterType.value = route.query.filter;
  }
  
  if (poemStore.poems.length === 0) {
    await poemStore.fetchPoems();
  }
  
  if (poemStore.poets.length === 0) {
    await poemStore.fetchPoets();
  }
  
  isLoading.value = false;
});

// 获取所有朝代
const dynasties = computed(() => {
  return [...new Set(poemStore.poems.map(poem => poem.dynasty))];
});

// 过滤和排序诗歌
const filteredPoems = computed(() => {
  let result = [...poemStore.poems];
  
  // 按朝代过滤
  if (filterType.value === 'dynasty' && selectedDynasty.value) {
    result = result.filter(poem => poem.dynasty === selectedDynasty.value);
  }
  
  // 按作者过滤
  if (filterType.value === 'author' && selectedAuthor.value) {
    result = result.filter(poem => poem.author === selectedAuthor.value);
  }
  
  // 排序
  if (sortBy.value === 'likes') {
    result.sort((a, b) => b.likes - a.likes);
  } else if (sortBy.value === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  }
  
  return result;
});

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
</script>