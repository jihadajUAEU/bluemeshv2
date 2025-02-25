import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  selectWorkflows,
  selectCurrentWorkflow,
  selectWorkflowNodes,
  selectWorkflowEdges,
  selectLoading,
  selectError,
  selectExecutionStatus,
  selectTotal,
} from '../store/workflowSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAppStore() {
  const dispatch = useAppDispatch();

  return {
    workflows: useAppSelector(selectWorkflows),
    currentWorkflow: useAppSelector(selectCurrentWorkflow),
    workflowNodes: useAppSelector(selectWorkflowNodes),
    workflowEdges: useAppSelector(selectWorkflowEdges),
    loading: useAppSelector(selectLoading),
    error: useAppSelector(selectError),
    executionStatus: useAppSelector(selectExecutionStatus),
    total: useAppSelector(selectTotal),
    dispatch,
  };
}

// Custom hooks for specific workflow data
export function useWorkflows() {
  return useAppSelector(selectWorkflows);
}

export function useCurrentWorkflow() {
  return useAppSelector(selectCurrentWorkflow);
}

export function useWorkflowNodes() {
  return useAppSelector(selectWorkflowNodes);
}

export function useWorkflowEdges() {
  return useAppSelector(selectWorkflowEdges);
}

export function useWorkflowLoading() {
  return useAppSelector(selectLoading);
}

export function useWorkflowError() {
  return useAppSelector(selectError);
}

export function useExecutionStatus() {
  return useAppSelector(selectExecutionStatus);
}

export function useTotal() {
  return useAppSelector(selectTotal);
}

// Error type guard
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
