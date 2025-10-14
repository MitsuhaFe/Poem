import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/poems',
    name: 'poems',
    component: () => import('../views/PoemList.vue')
  },
  {
    path: '/poem/:id',
    name: 'poem-detail',
    component: () => import('../views/PoemDetail.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchResults.vue')
  },
  {
    path: '/poet/:id',
    name: 'poet',
    component: () => import('../views/PoetDetail.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/Favorites.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router