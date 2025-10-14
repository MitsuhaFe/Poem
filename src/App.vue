<template>
  <div class="min-h-screen" :class="{ 'dark': isDarkMode }">
    <header class="bg-white dark:bg-gray-800 shadow-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-kai text-primary dark:text-dark-primary">诗歌鉴赏平台</router-link>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              @keyup.enter="handleSearch"
              placeholder="搜索诗歌、作者..." 
              class="px-4 py-2 pr-10 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button @click="handleSearch" class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">
              <SearchIcon size="18" />
            </button>
          </div>
          <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <SunIcon v-if="isDarkMode" size="20" class="text-yellow-400" />
            <MoonIcon v-else size="20" class="text-gray-600" />
          </button>
          <router-link to="/favorites" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <BookmarkIcon size="20" class="text-primary dark:text-dark-primary" />
          </router-link>
        </div>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
    
    <footer class="bg-gray-100 dark:bg-gray-800 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <p>诗歌鉴赏平台 &copy; {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { SearchIcon, SunIcon, MoonIcon, BookmarkIcon } from 'lucide-vue-next';

const router = useRouter();
const searchQuery = ref('');
const isDarkMode = ref(false);

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { q: searchQuery.value.trim() } 
    });
  }
};

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value);
  
  // 更新文档类
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// 初始化暗黑模式
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    isDarkMode.value = savedMode === 'true';
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    }
  }
});
</script>