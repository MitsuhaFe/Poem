<template>
  <div v-if="poet" class="max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-kai text-primary dark:text-dark-primary mb-2 text-center">{{ poet.name }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-center mb-6">{{ poet.dynasty }}代诗人</p>
      
      <div class="mb-8">
        <h2 class="text-xl font-kai text-primary dark:text-dark-primary mb-4">生平简介</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ poet.bio }}</p>
      </div>
      
      <div>
        <h2 class="text-xl font-kai text-primary dark:text-dark-primary mb-4">作品列表</h2>
        <div v-if="poetPoems.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="poem in poetPoems" :key="poem.id" class="poem-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-kai mb-2">{{ poem.title }}</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              {{ poem.content.map(part => part.sentence).join(' ') }}
            </p>
            <div class="flex justify-between items-center">
              <span class="flex items-center text-gray-600 dark:text-gray-400">
                <HeartIcon size="16" class="mr-1 text-red-500" />
                {{ poem.likes }}
              </span>
              <router-link :to="`/poem/${poem.id}`" class="btn btn-primary text-sm">
                查看详情
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
          暂无作品
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-10">
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePoemStore } from '../stores/poemStore';
import { HeartIcon } from 'lucide-vue-next';

const route = useRoute();
const poemStore = usePoemStore();
const poet = ref(null);

// 获取诗人详情
onMounted(async () => {
  if (poemStore.poems.length === 0) {
    await poemStore.fetchPoems();
  }
  
  if (poemStore.poets.length === 0) {
    await poemStore.fetchPoets();
  }
  
  const poetId = route.params.id;
  poet.value = poemStore.getPoetById(poetId);
});

// 获取诗人的所有诗歌
const poetPoems = computed(() => {
  if (!poet.value) return [];
  return poemStore.getPoemsByPoetId(poet.value.id);
});
</script>