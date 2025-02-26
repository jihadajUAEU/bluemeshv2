import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Workflow {
  id: string;
  name: string;
  nodes: any[];  // Will be typed properly when implementing nodes
  edges: any[];  // Will be typed properly when implementing edges
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

export default workflowSlice.reducer;
