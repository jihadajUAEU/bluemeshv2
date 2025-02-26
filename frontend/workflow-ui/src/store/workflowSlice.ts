import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Workflow {
  id: string;
  name: string;
  nodes: any[];  // Will be typed properly when implementing nodes
  edges: any[];  // Will be typed properly when implementing edges
  status?: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface WorkflowState {
  workflows: Workflow[];
  loading: boolean;
  error: string | null;
  selectedWorkflow: Workflow | null;
}

const initialState: WorkflowState = {
  workflows: [],
  loading: false,
  error: null,
  selectedWorkflow: null,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setWorkflows: (state, action: PayloadAction<Workflow[]>) => {
      state.workflows = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedWorkflow: (state, action: PayloadAction<Workflow | null>) => {
      state.selectedWorkflow = action.payload;
    },
  },
});

export const {
  setWorkflows,
  setLoading,
  setError,
  setSelectedWorkflow,
} = workflowSlice.actions;

// Selectors
export const selectWorkflows = (state: { workflow: WorkflowState }) => state.workflow.workflows;
export const selectCurrentWorkflow = (state: { workflow: WorkflowState }) => state.workflow.selectedWorkflow;
export const selectWorkflowNodes = (state: { workflow: WorkflowState }) => 
  state.workflow.selectedWorkflow?.nodes || [];
export const selectWorkflowEdges = (state: { workflow: WorkflowState }) => 
  state.workflow.selectedWorkflow?.edges || [];
export const selectLoading = (state: { workflow: WorkflowState }) => state.workflow.loading;
export const selectError = (state: { workflow: WorkflowState }) => state.workflow.error;
export const selectExecutionStatus = (state: { workflow: WorkflowState }) => 
  state.workflow.selectedWorkflow?.status || 'idle';
export const selectTotal = (state: { workflow: WorkflowState }) => state.workflow.workflows.length;

export default workflowSlice.reducer;
