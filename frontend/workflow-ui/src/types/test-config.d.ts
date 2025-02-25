declare module '@vitejs/plugin-react' {
  import type { Plugin } from 'vite';
  const plugin: (options?: any) => Plugin;
  export default plugin;
}

declare module 'vite' {
  interface UserConfigExport {
    plugins?: any[];
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
    build?: {
      target?: string;
    };
    resolve?: {
      alias?: Record<string, string>;
    };
    configFile?: string;
  }

  export function defineConfig(config: UserConfigExport): UserConfigExport;
}

declare module 'vitest' {
  interface UserConfig {
    test?: {
      globals?: boolean;
      environment?: string;
      include?: string[];
      exclude?: string[];
      setupFiles?: string[];
    };
  }
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom/matchers';
}
