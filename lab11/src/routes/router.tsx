import { createBrowserRouter, redirect } from 'react-router'
import StatusMessage from '../components/StatusMessage'
import AppLayout from '../layouts/AppLayout'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import RouteErrorPage from '../pages/RouteErrorPage'
import TaskDetailsPage from '../pages/TaskDetailsPage'
import TasksPage from '../pages/TasksPage'
import { adminLoader, loginLoader, requireUser, rootLoader } from './loaders'

/**
 * Data Mode: маршрути описані об'єктами, захист — через loader + redirect.
 *
 * /                → redirect на /tasks
 * /tasks           → список (query params: status, priority, page)
 * /tasks/:taskId   → деталі (route param)
 * /login           → вхід
 * /profile         → protected (requireUser), lazy
 * /admin           → protected + роль admin (requireAdmin), lazy
 * *                → 404
 */
export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    Component: AppLayout,
    // до першого рендеру відновлюємо сесію зі збереженого token
    loader: rootLoader,
    // сесію достатньо відновити один раз; без цього root loader перезапускався б
    // при кожній зміні query params (?status=...), і швидкі зміни фільтрів губилися б
    shouldRevalidate: () => false,
    HydrateFallback: () => <StatusMessage variant="loading">Відновлення сесії…</StatusMessage>,
    ErrorBoundary: RouteErrorPage,
    children: [
      {
        // pathless route: помилки дочірніх сторінок показуються всередині layout
        ErrorBoundary: RouteErrorPage,
        children: [
          { index: true, loader: () => redirect('/tasks') },
          {
            path: 'tasks',
            children: [
              { index: true, Component: TasksPage },
              { path: ':taskId', Component: TaskDetailsPage },
            ],
          },
          { path: 'login', loader: loginLoader, Component: LoginPage },
          {
            path: 'profile',
            loader: requireUser,
            // lazy loading: код сторінки завантажується лише при першому переході
            lazy: async () => ({ Component: (await import('../pages/ProfilePage')).default }),
          },
          {
            path: 'admin',
            loader: adminLoader,
            lazy: async () => ({ Component: (await import('../pages/AdminPage')).default }),
          },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])

