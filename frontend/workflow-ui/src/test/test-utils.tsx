import React, { PropsWithChildren, ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { ReactFlowProvider } from 'reactflow';
import workflowReducer from '../store/workflowSlice';
import type { 
  CustomRenderOptions, 
  CustomRenderResult, 
  TestStoreConfig 
} from './types';

const rootReducer = combineReducers({
  workflow: workflowReducer
});

type RootState = ReturnType<typeof rootReducer>;

function createTestStore({ preloadedState = {} }: TestStoreConfig = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState
  });
}

function customRender(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore({ preloadedState }),
    ...renderOptions
  }: CustomRenderOptions = {}
): CustomRenderResult {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return (
      <Provider store={store}>
        <MantineProvider>
          <ReactFlowProvider>
            {children}
          </ReactFlowProvider>
        </MantineProvider>
      </Provider>
    );
  }

  const renderResult = render(ui, {
    wrapper: Wrapper,
    ...renderOptions
  });

  return {
    ...renderResult,
    store
  };
}

// Export all necessary testing utilities
export { customRender as render, screen, userEvent };
export { createTestStore };
export type { RootState };

// Re-export everything else from testing-library/react
export * from '@testing-library/react';
