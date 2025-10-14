<template>
  <div>
    <section class="mb-10">
      <h1 class="text-3xl font-kai text-primary dark:text-dark-primary mb-6 text-center">每日一诗</h1>
      <div v-if="dailyPoem" class="poem-card bg-white dark:bg-gray-800 p-6 max-w-3xl mx-auto">
        <h2 class="text-2xl font-kai mb-2">{{ dailyPoem.title }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ dailyPoem.dynasty }} · {{ dailyPoem.author }}</p>
        <div class="text-lg mb-6">
          <p v-for="(part, index) in dailyPoem.content" :key="index" class="mb-2">
            {{ part.sentence }}
          </p>
        </div>
        <div class="flex justify-end">
          <router-link :to="`/poem/${dailyPoem.id}`" class="btn btn-primary">
            查看详情
          </router-link>
        </div>
      </div>
      <div v-else class="text-center py-10">
        <p>加载中...</p>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-2xl font-kai text-primary dark:text-dark-primary mb-6 text-center">分类浏览</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <router-link to="/poems?filter=dynasty" class="category-card bg-white dark:bg-gray-800 p-6 text-center rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-kai mb-2">按朝代</h3>
          <p class="text-gray-600 dark:text-gray-400">浏览不同朝代的诗歌作品</p>
        </router-link>
        <router-link to="/poems?filter=author" class="category-card bg-white dark:bg-gray-800 p-6 text-center rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-kai mb-2">按诗人</h3>
          <p class="text-gray-600 dark:text-gray-400">探索各位诗人的经典作品</p>
        </router-link>
        <router-link to="/poems" class="category-card bg-white dark:bg-gray-800 p-6 text-center rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-kai mb-2">全部诗歌</h3>
          <p class="text-gray-600 dark:text-gray-400">浏览所有收录的诗歌作品</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePoemStore } from '../stores/poemStore';

const poemStore = usePoemStore();
const dailyPoem = ref(null);

// 获取随机诗歌作为每日一诗
const getRandomPoem = () => {
  if (poemStore.poems.length > 0) {
    const randomIndex = Math.floor(Math.random() * poemStore.poems.length);
    dailyPoem.value = poemStore.poems[randomIndex];
  }
};

onMounted(async () => {
  if (poemStore.poems.length === 0) {
    await poemStore.fetchPoems();
  }
  getRandomPoem();
});
</script>

<style scoped>
.category-card {
  transition: transform 0.2s;
}
.category-card:hover {
  transform: translateY(-5px);
}
</style>