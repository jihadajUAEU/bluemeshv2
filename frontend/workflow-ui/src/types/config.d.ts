/// <reference types="vite/client" />

declare module 'vitest/config' {
  import { UserConfig as ViteConfig } from 'vite';
  
  export interface UserConfig extends ViteConfig {
    test?: {
      name?: string;
      globals?: boolean;
      environment?: string;
      setupFiles?: string[];
      include?: string[];
      exclude?: string[];
      testTimeout?: number;
      coverage?: {
        provider?: string;
        reporter?: string[];
        exclude?: string[];
      };
      deps?: {
        inline?: (string | RegExp)[];
      };
    };
  }

  export function defineConfig(config: UserConfig): UserConfig;
  export function mergeConfig(defaults: UserConfig, overrides: UserConfig): UserConfig;
}

declare module '@vitejs/plugin-react' {
  import { Plugin } from 'vite';
  
  interface PluginOptions {
    include?: string | RegExp | (string | RegExp)[];
    exclude?: string | RegExp | (string | RegExp)[];
    babel?: Record<string, any>;
    jsxRuntime?: 'classic' | 'automatic';
    jsxImportSource?: string;
    fastRefresh?: boolean;
  }

  export default function react(options?: PluginOptions): Plugin;
}

declare module 'vite' {
  export interface UserConfig {
    plugins?: any[];
    test?: any;
    resolve?: {
      alias?: Record<string, string>;
    };
    [key: string]: any;
  }

  export function defineConfig(config: UserConfig): UserConfig;
  export function mergeConfig(defaults: UserConfig, overrides: UserConfig): UserConfig;
  export const Plugin: any;
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom/matchers';
}
