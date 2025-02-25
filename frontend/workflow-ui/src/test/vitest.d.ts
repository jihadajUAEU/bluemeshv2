/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveAttribute(attr: string, value?: string): R;
  toHaveClass(className: string): R;
  toHaveStyle(css: Record<string, any>): R;
  toHaveTextContent(text: string | RegExp): R;
  toBeVisible(): R;
  toBeDisabled(): R;
  toHaveValue(value: string | number | string[]): R;
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }

  // Globals provided by Vitest
  const describe: typeof import('vitest')['describe'];
  const it: typeof import('vitest')['it'];
  const test: typeof import('vitest')['test'];
  const expect: typeof import('vitest')['expect'];
  const beforeAll: typeof import('vitest')['beforeAll'];
  const beforeEach: typeof import('vitest')['beforeEach'];
  const afterAll: typeof import('vitest')['afterAll'];
  const afterEach: typeof import('vitest')['afterEach'];
  const vi: typeof import('vitest')['vi'];

  interface Window {
    ResizeObserver: typeof ResizeObserver;
    IntersectionObserver: typeof IntersectionObserver;
  }
}

// React Testing Library types
declare module '@testing-library/react' {
  interface RenderOptions {
    wrapper?: React.ComponentType;
  }
}

export {};
