// Налаштування середовища з .env (див. .env.example).

/** Базова адреса REST API, наприклад https://dummyjson.com */
export const API_URL = import.meta.env.VITE_API_URL

/** Час життя accessToken у хвилинах (expiresInMins для /auth/login і /auth/refresh). */
export const TOKEN_TTL_MINUTES = Number(import.meta.env.VITE_TOKEN_TTL_MINUTES) || 30
