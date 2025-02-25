import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { vi } from 'vitest';

import { store } from '@/store';
import type { RootState } from '@/store';

interface CustomRenderOptions {
  initialRoute?: string;
  routerProps?: Omit<MemoryRouterProps, 'children'>;
  preloadedState?: Partial<RootState>;
  wrapper?: React.ComponentType;
  container?: HTMLElement;
  baseElement?: HTMLElement;
  hydrate?: boolean;
}

type TestingLibraryResult = ReturnType<typeof render>;
type TestingUserEvent = ReturnType<typeof userEvent.setup>;

interface CustomRenderResult extends TestingLibraryResult {
  user: TestingUserEvent;
  store: typeof store;
}

/**
 * Custom render function that includes providers
 */
function customRender(
  ui: React.ReactElement,
  {
    initialRoute = '/',
    routerProps = {},
    preloadedState = {},
    ...renderOptions
  }: CustomRenderOptions = {}
): CustomRenderResult {
  // Create wrapped component with all providers
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]} {...routerProps}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...renderResult,
    store,
    user: userEvent.setup(),
  };
}

// Mock types for Intersection Observer
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    // Constructor implementation is just for type satisfaction
    return this;
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Mock types for Resize Observer
class MockResizeObserver implements ResizeObserver {
  constructor() {
    // Constructor implementation is just for type satisfaction
    return this;
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

/**
 * Setup global test mocks
 */
export function setupTestMocks(): void {
  // Mock IntersectionObserver
  window.IntersectionObserver = MockIntersectionObserver as any;
  window.ResizeObserver = MockResizeObserver as any;

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
}

// Re-export commonly used test utilities
export {
  customRender as render,
  userEvent,
  store,
  vi,
};

// Re-export testing library utilities
export * from '@testing-library/react';
