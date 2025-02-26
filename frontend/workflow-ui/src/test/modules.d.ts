/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {
    toHaveBeenCalledWithMatch(...args: unknown[]): void;
    toBeInTheDocument(): void;
    toHaveAttribute(attr: string, value?: string): void;
    toHaveClass(...classNames: string[]): void;
    toHaveStyle(css: Record<string, unknown>): void;
    toHaveTextContent(text: string | RegExp): void;
    toBeVisible(): void;
    toBeDisabled(): void;
    toHaveValue(value: string | string[] | number): void;
  }
  
  interface AsymmetricMatchersContaining extends Assertion<any> {}
}

declare module '@testing-library/react' {
  import type { ReactElement } from 'react';
  import type { RenderOptions as RTLRenderOptions, RenderResult as RTLRenderResult } from '@testing-library/react';

  export interface RenderOptions extends Omit<RTLRenderOptions, 'wrapper'> {
    wrapper?: React.ComponentType;
  }

  export interface RenderResult extends Omit<RTLRenderResult, 'rerender'> {
    rerender(ui: ReactElement): void;
  }

  export function render(
    ui: ReactElement,
    options?: RenderOptions
  ): RenderResult;
}

declare module '@testing-library/user-event' {
  const userEvent: {
    setup(options?: { delay?: number }): UserEvent;
  };

  export type { UserEvent };
  export default userEvent;
}
