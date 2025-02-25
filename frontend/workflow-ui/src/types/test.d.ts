/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference path="../test/global.d.ts" />
/// <reference types="@testing-library/jest-dom" />

declare module 'vitest' {
  interface ProxyConstructor {
    new <T extends object>(target: T, handler: ProxyHandler<T>): T;
  }
  
  declare const Proxy: ProxyConstructor;
}

declare module '@testing-library/jest-dom';
declare module '@testing-library/react';
declare module '@testing-library/user-event';
declare module 'jest-mock';

declare module 'node:fs' {
  export * from 'fs';
}

declare module 'node:path' {
  export * from 'path';
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Extend Window interface for test environment
declare interface Window {
  ResizeObserver: ResizeObserverConstructor;
  IntersectionObserver: IntersectionObserverConstructor;
  matchMedia: (query: string) => MediaQueryList;
}

// Extend NodeJS process env
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_URL: string;
    VITE_KEYCLOAK_URL: string;
    VITE_KEYCLOAK_REALM: string;
    VITE_KEYCLOAK_CLIENT_ID: string;
  }
}

// Custom test matchers
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

declare interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveAttribute(attr: string, value?: string): R;
  toHaveClass(className: string): R;
  toHaveStyle(css: Record<string, any>): R;
  toHaveTextContent(text: string | RegExp): R;
  toBeVisible(): R;
  toBeDisabled(): R;
  toHaveValue(value: string | number | string[]): R;
}

// Extend Vitest's Assertion interface
declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
