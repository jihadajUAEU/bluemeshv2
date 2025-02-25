import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import workflowReducer from './workflowSlice';

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: [
          'workflow/fetchWorkflows/fulfilled',
          'workflow/fetchWorkflowById/fulfilled',
          'workflow/createWorkflow/fulfilled',
          'workflow/updateWorkflow/fulfilled',
        ],
        ignoredPaths: [
          'workflow.currentWorkflow.created_at',
          'workflow.currentWorkflow.updated_at',
          'workflow.currentWorkflow.last_executed_at',
          'workflow.currentWorkflow.last_accessed_at',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Add type assertion helper for thunks
export function assertIsError(error: unknown): error is Error {
  return error instanceof Error;
}

export default store;
