/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module 'vitest' {
  import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
  
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom/matchers';
}

declare module '@testing-library/react' {
  import type { ReactElement } from 'react';
  import type { RenderOptions as RTLRenderOptions, RenderResult as RTLRenderResult } from '@testing-library/react';

  export interface RenderOptions extends Omit<RTLRenderOptions, 'wrapper'> {
    wrapper?: React.ComponentType<any>;
  }

  export interface RenderResult extends RTLRenderResult {}

  export function render(
    ui: ReactElement,
    options?: RenderOptions
  ): RenderResult;
}

declare module '@testing-library/user-event' {
  import type { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

  const userEvent: {
    setup(options?: { delay?: number }): UserEvent;
  };

  export type { UserEvent };
  export default userEvent;
}

declare module 'vitest-dom/extend-expect' {
  global {
    namespace Vi {
      interface JestAssertion<T = any> {
        toBeInTheDocument(): void;
        toHaveAttribute(attr: string, value?: string): void;
        toHaveClass(...classNames: string[]): void;
        toHaveStyle(css: Record<string, any>): void;
        toHaveTextContent(text: string | RegExp): void;
        toBeVisible(): void;
        toBeDisabled(): void;
        toHaveValue(value: string | string[] | number): void;
      }
    }
  }
}
