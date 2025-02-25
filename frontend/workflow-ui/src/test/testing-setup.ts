/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="@testing-library/react" />
/// <reference types="node" />

import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

declare module 'vitest' {
  export interface TestContext {
    cleanup: typeof cleanup;
  }
}

// Mock MediaQueryList
interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: () => void;
  removeListener: () => void;
  addEventListener: () => void;
  removeEventListener: () => void;
  dispatchEvent: () => boolean;
}

// Setup and teardown
afterEach(() => {
  cleanup();
});

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock matchMedia
const createMatchMedia = (query: string): MockMediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: () => true,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => createMatchMedia(query)),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage;

vi.stubGlobal('localStorage', localStorageMock);

// Mock fetch
const fetchMock = vi.fn() as unknown as typeof fetch;
vi.stubGlobal('fetch', fetchMock);

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

// Add custom error handling for unhandled promises
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Suppress console errors during tests
const originalError = console.error.bind(console);
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError(...args);
  };
});

// Restore console.error after all tests
afterAll(() => {
  console.error = originalError;
});

export { cleanup };
