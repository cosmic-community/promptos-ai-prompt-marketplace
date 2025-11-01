/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COSMIC_BUCKET_SLUG: string
  readonly VITE_COSMIC_READ_KEY: string
  readonly VITE_COSMIC_WRITE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Changed: Enhanced Window interface declaration to ensure TypeScript recognizes all window methods
declare global {
  interface Window {
    alert(message?: string): void;
    confirm(message?: string): boolean;
    prompt(message?: string, defaultValue?: string): string | null;
  }
  
  // Ensure window is available in global scope
  const window: Window & typeof globalThis;
}

export {}