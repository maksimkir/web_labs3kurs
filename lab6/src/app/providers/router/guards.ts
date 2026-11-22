import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

/** true — перехід дозволено, інакше маршрут, на який треба перенаправити. */
export function checkAccess(
  to: RouteLocationNormalized,
  isAuthenticated: boolean,
): true | RouteLocationRaw {
  // to.meta об'єднує meta всіх збігів, тож /users/:id/edit успадковує requiresAuth від /users
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'users' }
  }
  return true
}

