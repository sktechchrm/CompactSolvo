/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_QUERY_DEVTOOLS: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SHEETS_BASE_URL: string;
  readonly VITE_DB_ADAPTER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
