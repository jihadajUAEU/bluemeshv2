/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';

declare global {
  interface Window {
    matchMedia: (query: string) => {
      matches: boolean;
      media: string;
      onchange: null;
      addListener: jest.Mock;
      removeListener: jest.Mock;
      addEventListener: jest.Mock;
      removeEventListener: jest.Mock;
      dispatchEvent: jest.Mock;
    };
  }

  class ResizeObserver {
    observe: () => void;
    unobserve: () => void;
    disconnect: () => void;
  }

  class IntersectionObserver {
    observe: () => void;
    unobserve: () => void;
    disconnect: () => void;
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

export {};
