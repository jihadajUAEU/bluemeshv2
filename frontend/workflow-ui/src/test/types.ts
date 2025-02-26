import type { ReactElement } from 'react';
import type { EnhancedStore } from '@reduxjs/toolkit';

// Re-export specific types from testing-library/react to avoid namespace issues
export interface RenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  hydrate?: boolean;
  wrapper?: React.ComponentType<{children: React.ReactNode}>;
}

export interface RenderResult {
  container: HTMLElement;
  baseElement: HTMLElement;
  debug: (baseElement?: HTMLElement | DocumentFragment) => void;
  rerender: (ui: ReactElement) => void;
  unmount: () => void;
  asFragment: () => DocumentFragment;
}

// Custom test types
export interface TestStoreConfig {
  preloadedState?: Record<string, unknown>;
}

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, unknown>;
  store?: EnhancedStore;
}

export interface CustomRenderResult extends RenderResult {
  store: EnhancedStore;
}
