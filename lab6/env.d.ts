/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базова адреса REST API, наприклад https://dummyjson.com */
  readonly VITE_API_URL: string
  /** Час життя accessToken у хвилинах (параметр expiresInMins для /auth/login і /auth/refresh). */
  readonly VITE_TOKEN_TTL_MINUTES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
