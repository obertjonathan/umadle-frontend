/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly UMADLE_BACKEND_API_BASE_URL?: string
  readonly UMADLE_PRACTICE_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
