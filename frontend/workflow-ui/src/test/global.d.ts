/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VITE_API_URL: string;
    readonly VITE_KEYCLOAK_URL: string;
    readonly VITE_KEYCLOAK_REALM: string;
    readonly VITE_KEYCLOAK_CLIENT_ID: string;
    [key: string]: string | undefined;
  }
}

declare module '@testing-library/react' {
  export interface RenderOptions {
    wrapper?: React.ComponentType;
  }
}

declare module '@testing-library/user-event' {
  interface UserEvent {
    setup(): UserEvent;
  }
}

declare module 'vitest' {
  export interface Assertion<T = any> extends jest.Matchers<void, T> {
    toHaveBeenCalledWithMatch(...args: unknown[]): void;
  }

  export interface AsymmetricMatchersContaining extends Assertion {}
}

declare global {
  namespace jest {
    interface Matchers<R = void> {
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

  interface Window {
    ResizeObserver: ResizeObserverConstructor;
    IntersectionObserver: IntersectionObserverConstructor;
    matchMedia: (query: string) => MediaQueryList;
  }
}

declare interface ResizeObserverConstructor {
  new (callback: ResizeObserverCallback): ResizeObserver;
  prototype: ResizeObserver;
}

declare interface IntersectionObserverConstructor {
  new (callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
  prototype: IntersectionObserver;
}

// Augment the Vite env
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
