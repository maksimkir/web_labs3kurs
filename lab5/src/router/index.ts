import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { checkAccess } from './guards'

declare module 'vue-router' {
  interface RouteMeta {
    /** Заголовок вкладки браузера. */
    title?: string
    layout?: 'default' | 'auth'
    /** Лише для авторизованих, діє й на вкладені маршрути. */
    requiresAuth?: boolean
    /** Лише для гостей (сторінка логіну). */
    guestOnly?: boolean
  }
}

// Сторінки завантажуються ліниво: кожна потрапляє в окремий чанк.
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'Users' },
      },
      {
        // динамічний сегмент; id передається в компонент як prop
        path: ':id(\\d+)',
        name: 'user',
        component: () => import('@/views/UserDetailsView.vue'),
        props: true,
        meta: { title: 'Профіль учасника' },
        children: [
          {
            // вкладений маршрут рендериться в <RouterView> сторінки учасника
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
            props: true,
            meta: { title: 'Редагування учасника' },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth', guestOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Сторінку не знайдено' },
  },
]

const APP_NAME = 'Vue Lottery'

export const router = createRouter({
  // hash-режим: на GitHub Pages немає серверного fallback на index.html
  history: createWebHashHistory(),
  routes,
  // зміна лише query (сторінка, пошук) не прокручує сторінку вгору
  scrollBehavior: (to, from, savedPosition) =>
    savedPosition ?? (to.path === from.path ? false : { top: 0 }),
})

// Navigation guard: /users і вкладені сторінки лише після входу, /login лише для гостей.
router.beforeEach((to) => checkAccess(to, useAuthStore().isAuthenticated))

// Заголовок вкладки береться з meta.title сторінки.
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${APP_NAME}` : APP_NAME
})
