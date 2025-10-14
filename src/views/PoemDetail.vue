<template>
  <div v-if="poem" class="max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <!-- 诗歌标题和作者信息 -->
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-kai text-primary dark:text-dark-primary mb-2">{{ poem.title }}</h1>
        <p class="text-gray-600 dark:text-gray-400">
          <router-link :to="`/poet/${getPoetId(poem.author)}`" class="hover:underline">
            {{ poem.dynasty }} · {{ poem.author }}
          </router-link>
        </p>
      </div>
      
      <!-- 功能控制栏 -->
      <div class="flex flex-wrap justify-center gap-4 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <button 
          @click="showPinyin = !showPinyin" 
          class="btn" 
          :class="showPinyin ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-600'"
        >
          {{ showPinyin ? '隐藏拼音' : '显示拼音' }}
        </button>
        <button 
          @click="showAnnotations = !showAnnotations" 
          class="btn" 
          :class="showAnnotations ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-600'"
        >
          {{ showAnnotations ? '隐藏注释' : '显示注释' }}
        </button>
        <div class="flex items-center space-x-2">
          <button @click="setFontSize('small')" class="px-2 py-1 rounded" :class="fontSize === 'small' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600'">小</button>
          <button @click="setFontSize('medium')" class="px-2 py-1 rounded" :class="fontSize === 'medium' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600'">中</button>
          <button @click="setFontSize('large')" class="px-2 py-1 rounded" :class="fontSize === 'large' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600'">大</button>
        </div>
        <button @click="speakPoem" class="btn bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
          <VolumeIcon size="18" class="mr-1" />
          朗读
        </button>
      </div>
      
      <!-- 诗歌内容 -->
      <div 
        class="mb-8 text-center" 
        :class="{
          'text-base': fontSize === 'small',
          'text-xl': fontSize === 'medium',
          'text-2xl': fontSize === 'large'
        }"
      >
        <div v-for="(part, index) in poem.content" :key="index" class="mb-4">
          <div v-if="showPinyin" class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ part.pinyin }}</div>
          <div class="poem-line">
            <template v-for="(char, charIndex) in splitSentence(part.sentence)" :key="charIndex">
              <span 
                v-if="isAnnotated(part, char) && showAnnotations" 
                class="relative group cursor-help border-b border-dashed border-gray-400"
              >
                {{ char }}
                <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-48 bg-white dark:bg-gray-700 p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 text-sm">
                  {{ getAnnotation(part, char) }}
                </span>
              </span>
              <span v-else>{{ char }}</span>
            </template>
          </div>
        </div>
      </div>
      
      <!-- 互动功能 -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center space-x-4">
          <button 
            @click="likePoem" 
            class="flex items-center space-x-1 focus:outline-none"
            :class="{ 'text-red-500': isLiked, 'text-gray-400 hover:text-red-500': !isLiked }"
          >
            <HeartIcon size="20" />
            <span>{{ poem.likes }}</span>
          </button>
          <button 
            @click="toggleFavorite" 
            class="flex items-center space-x-1 focus:outline-none"
            :class="{ 'text-yellow-500': isFavorited, 'text-gray-400 hover:text-yellow-500': !isFavorited }"
          >
            <BookmarkIcon size="20" />
            <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </button>
        </div>
        <button @click="sharePoem" class="flex items-center space-x-1 text-gray-600 dark:text-gray-400 focus:outline-none">
          <ShareIcon size="20" />
          <span>分享</span>
        </button>
      </div>
      
      <!-- 评论区 -->
      <div class="mt-10">
        <h3 class="text-xl font-kai text-primary dark:text-dark-primary mb-4">评论区</h3>
        
        <!-- 评论表单 -->
        <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <div class="mb-4">
            <label for="nickname" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">昵称</label>
            <input 
              type="text" 
              id="nickname" 
              v-model="commentForm.nickname" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入您的昵称"
            >
          </div>
          <div class="mb-4">
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">评论内容</label>
            <textarea 
              id="content" 
              v-model="commentForm.content" 
              rows="3" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入您的评论"
            ></textarea>
          </div>
          <button 
            @click="submitComment" 
            class="btn btn-primary"
            :disabled="!commentForm.nickname || !commentForm.content"
          >
            提交评论
          </button>
        </div>
        
        <!-- 评论列表 -->
        <div v-if="comments.length > 0">
          <div v-for="(comment, index) in comments" :key="index" class="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
            <div class="flex justify-between mb-2">
              <span class="font-medium">{{ comment.nickname }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(comment.timestamp) }}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
          暂无评论，快来发表第一条评论吧！
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
import { HeartIcon, BookmarkIcon, ShareIcon, VolumeIcon } from 'lucide-vue-next';

const route = useRoute();
const poemStore = usePoemStore();

const poem = ref(null);
const showPinyin = ref(false);
const showAnnotations = ref(false);
const fontSize = ref('medium');
const isLiked = ref(false);
const isFavorited = ref(false);
const comments = ref([]);
const commentForm = ref({
  nickname: localStorage.getItem('commentNickname') || '',
  content: ''
});

// 获取诗歌详情
onMounted(async () => {
  if (poemStore.poems.length === 0) {
    await poemStore.fetchPoems();
  }
  
  if (poemStore.poets.length === 0) {
    await poemStore.fetchPoets();
  }
  
  const poemId = route.params.id;
  poem.value = poemStore.getPoemById(poemId);
  
  if (poem.value) {
    isLiked.value = poemStore.isPoemLiked(poemId);
    isFavorited.value = poemStore.isPoemFavorited(poemId);
    loadComments(poemId);
  }
});

// 获取诗人ID
const getPoetId = (poetName) => {
  const poet = poemStore.poets.find(p => p.name === poetName);
  return poet ? poet.id : '';
};

// 设置字体大小
const setFontSize = (size) => {
  fontSize.value = size;
};

// 分割句子为字符
const splitSentence = (sentence) => {
  return sentence.split('');
};

// 检查字符是否有注释
const isAnnotated = (part, char) => {
  return part.annotations && part.annotations.some(anno => anno.word.includes(char));
};

// 获取字符的注释
const getAnnotation = (part, char) => {
  const annotation = part.annotations.find(anno => anno.word.includes(char));
  return annotation ? annotation.explanation : '';
};

// 点赞诗歌
const likePoem = () => {
  if (!isLiked.value) {
    poemStore.likePoem(poem.value.id);
    isLiked.value = true;
  }
};

// 切换收藏状态
const toggleFavorite = () => {
  if (isFavorited.value) {
    poemStore.unfavoritePoem(poem.value.id);
  } else {
    poemStore.favoritePoem(poem.value.id);
  }
  isFavorited.value = !isFavorited.value;
};

// 分享诗歌
const sharePoem = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url)
    .then(() => {
      alert('链接已复制到剪贴板，可以分享给好友了！');
    })
    .catch(err => {
      console.error('无法复制链接: ', err);
    });
};

// 朗读诗歌
const speakPoem = () => {
  if ('speechSynthesis' in window) {
    const text = poem.value.content.map(part => part.sentence).join('，');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    speechSynthesis.speak(utterance);
  } else {
    alert('您的浏览器不支持语音合成功能');
  }
};

// 加载评论
const loadComments = (poemId) => {
  const savedComments = localStorage.getItem(`comments_${poemId}`);
  if (savedComments) {
    comments.value = JSON.parse(savedComments);
  }
};

// 提交评论
const submitComment = () => {
  if (!commentForm.value.nickname || !commentForm.value.content) {
    return;
  }
  
  const newComment = {
    nickname: commentForm.value.nickname,
    content: commentForm.value.content,
    timestamp: new Date().toISOString()
  };
  
  comments.value.unshift(newComment);
  
  // 保存评论到本地存储
  localStorage.setItem(`comments_${poem.value.id}`, JSON.stringify(comments.value));
  
  // 保存昵称
  localStorage.setItem('commentNickname', commentForm.value.nickname);
  
  // 清空评论内容
  commentForm.value.content = '';
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
</script>

<style scoped>
.poem-line {
  letter-spacing: 0.1em;
  line-height: 1.8;
}
</style>