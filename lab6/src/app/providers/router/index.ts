import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useSessionStore } from '@/entities/session'
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
    component: () => import('@/pages/home').then((m) => m.HomePage),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about').then((m) => m.AboutPage),
    meta: { title: 'About author' },
  },
  {
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/pages/users').then((m) => m.UsersPage),
        meta: { title: 'Users' },
      },
      {
        // динамічний сегмент; id передається в компонент як prop
        path: ':id(\\d+)',
        name: 'user',
        component: () => import('@/pages/user-details').then((m) => m.UserDetailsPage),
        props: true,
        meta: { title: 'Профіль учасника' },
        children: [
          {
            // вкладений маршрут рендериться в <RouterView> сторінки учасника
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/pages/user-edit').then((m) => m.UserEditPage),
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
    component: () => import('@/pages/login').then((m) => m.LoginPage),
    meta: { title: 'Login', layout: 'auth', guestOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
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
router.beforeEach((to) => checkAccess(to, useSessionStore().isAuthenticated))

// Заголовок вкладки береться з meta.title сторінки.
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${APP_NAME}` : APP_NAME
})
