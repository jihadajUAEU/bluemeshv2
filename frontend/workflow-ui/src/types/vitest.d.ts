/// <reference types="vite/client" />

declare module 'vitest' {
  import { MockInstance } from '@vitest/spy';
  
  export type Mock<T = any> = jest.Mock<T> & MockInstance;

  export interface Vi {
    fn: <T extends (...args: any[]) => any>(implementation?: T) => Mock;
    spyOn: typeof jest.spyOn;
    mock: typeof jest.mock;
    mocked: typeof jest.mocked;
    stubGlobal: (name: string, value: any) => void;
    importActual: <T>(path: string) => Promise<T>;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
    hoisted: (name: string) => void;
    unmock: (name: string) => void;
  }

  export const vi: Vi;

  export interface JestAssertion<T = any> extends jest.Matchers<void, T> {
    toHaveBeenCalledWithMatch(...args: unknown[]): void;
  }

  export interface Assertion extends JestAssertion {}

  export interface TestAPI {
    expect: typeof expect;
    test: typeof test;
    describe: typeof describe;
    beforeAll: typeof beforeAll;
    afterAll: typeof afterAll;
    beforeEach: typeof beforeEach;
    afterEach: typeof afterEach;
  }
}

declare module '@testing-library/react' {
  import { ReactElement } from 'react';

  export interface RenderOptions {
    container?: HTMLElement;
    baseElement?: HTMLElement;
    hydrate?: boolean;
    wrapper?: React.ComponentType<any>;
  }

  export interface RenderResult {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (baseElement?: Element | DocumentFragment) => void;
    rerender: (ui: ReactElement) => void;
    unmount: () => void;
    asFragment: () => DocumentFragment;
  }

  export function render(
    ui: ReactElement,
    options?: RenderOptions
  ): RenderResult & { [key: string]: any };
}

declare module '@testing-library/user-event' {
  export interface UserEvent {
    setup(): UserEvent;
    click(element: Element | Window): Promise<void>;
    type(element: Element, text: string): Promise<void>;
    keyboard(text: string): Promise<void>;
    clear(element: Element): Promise<void>;
    tab(): Promise<void>;
    paste(element: Element, text: string): Promise<void>;
    hover(element: Element): Promise<void>;
    unhover(element: Element): Promise<void>;
  }

  const userEvent: {
    setup(): UserEvent;
  };

  export default userEvent;
}

// Extend window for test environment
declare global {
  interface Window {
    ResizeObserver: ResizeObserverConstructor;
    IntersectionObserver: IntersectionObserverConstructor;
  }

  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWithMatch(...args: unknown[]): R;
    }
  }

  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_KEYCLOAK_URL: string;
    readonly VITE_KEYCLOAK_REALM: string;
    readonly VITE_KEYCLOAK_CLIENT_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
