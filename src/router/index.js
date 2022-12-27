import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'item',
      component: import('../views/ItemView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/item',
      name: 'item',
      component: () => import('../views/ItemView.vue')
    },
    {
      path: '/quote',
      name: 'quote',
      component: () => import('../views/QuoteView.vue')
    }
    ,{
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderView.vue')
    }
    ,{
      path: '/menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue')
    }
    ,{
      path: '/ingredient',
      name: 'ingredient',
      component: () => import('../views/IngredientView.vue')
    }
  ]
})

export default router
