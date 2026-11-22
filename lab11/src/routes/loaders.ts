import { redirect, type LoaderFunctionArgs } from 'react-router'
import { loginPath, safeRedirect } from '../auth/redirect'
import { session } from '../auth/session'
import { userRepository } from '../repositories/userRepository'

/**
 * Loader-и Data Mode. Це звичайні async-функції поза React: hooks тут недоступні,
 * тому сесію читаємо з модуля session, а не з AuthContext.
 */

/** Root loader: до першого рендеру відновлюємо сесію зі збереженого token. */
export async function rootLoader() {
  await session.restore()
  return null
}

function currentPath(request: Request): string {
  const url = new URL(request.url)
  return url.pathname + url.search
}

/** Protected route: без сесії — redirect на /login з поверненням назад. */
export async function requireUser({ request }: LoaderFunctionArgs) {
  await session.restore()
  const user = session.getUser()
  if (!user) throw redirect(loginPath(currentPath(request)))
  return user
}

/** Адміністративний маршрут: потрібна роль admin. */
export async function requireAdmin(args: LoaderFunctionArgs) {
  const user = await requireUser(args)
  if (user.role !== 'admin') throw redirect('/profile')
  return user
}

/** Авторизованому користувачу сторінка входу не потрібна. */
export async function loginLoader({ request }: LoaderFunctionArgs) {
  await session.restore()
  if (session.getUser()) {
    throw redirect(safeRedirect(new URL(request.url).searchParams.get('redirectTo')))
  }
  return null
}

export async function adminLoader(args: LoaderFunctionArgs) {
  await requireAdmin(args)
  // дані сторінки завантажує loader; request.signal скасовує запит при переході
  return userRepository.getUsers(10, args.request.signal)
}
