/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IPINFO_TOKEN?: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
