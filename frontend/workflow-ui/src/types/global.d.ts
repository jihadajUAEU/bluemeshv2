/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

// Augment the global NodeJS namespace
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_URL: string;
    VITE_KEYCLOAK_URL: string;
    VITE_KEYCLOAK_REALM: string;
    VITE_KEYCLOAK_CLIENT_ID: string;
    [key: string]: string | undefined;
  }
}

// Extend the Window interface
interface Window {
  ResizeObserver: typeof ResizeObserver;
  IntersectionObserver: typeof IntersectionObserver;
  matchMedia: (query: string) => MediaQueryList;
}

// Vite environment variables type augmentation
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Testing Library types augmentation
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveClass(className: string): R;
    toHaveStyle(css: Record<string, any>): R;
    toHaveTextContent(text: string | RegExp): R;
    toBeVisible(): R;
    toBeDisabled(): R;
    toHaveValue(value: string | number | string[]): R;
  }
}

// Vitest types augmentation
declare namespace Vi {
  interface Assertion extends jest.Matchers<void> {}
  interface AsymmetricMatchersContaining extends jest.Matchers<void> {}
}

// React Testing Library types augmentation
declare namespace Testing {
  interface RenderOptions {
    wrapper?: React.ComponentType;
  }
}
