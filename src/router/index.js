import { createRouter, createWebHistory } from 'vue-router' // Import from vue-router package

import Index from '../views/index.vue' // Assuming you have this component

const routes = [
  {
    path: '/vue3-vite-screen',
    name: 'index',
    component: Index, // Directly use the imported component
  },
  {
    path: '/:pathMatch(.*)*', // New wildcard syntax in Vue Router 4
    redirect: '/vue3-vite-screen',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
