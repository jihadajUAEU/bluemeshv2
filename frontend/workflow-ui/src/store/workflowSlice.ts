import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { 
  Workflow,
  WorkflowFilter,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowExecutionRequest,
  WorkflowNode,
  WorkflowEdge,
  WorkflowListResponse
} from '../types/workflow';
import { AppDispatch, RootState } from './index';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  workflowNodes: WorkflowNode[];
  workflowEdges: WorkflowEdge[];
  loading: boolean;
  error: string | null;
  executionStatus: {
    [key: string]: {
      status: string;
      message: string;
    };
  };
  total: number;
}

const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  workflowNodes: [],
  workflowEdges: [],
  loading: false,
  error: null,
  executionStatus: {},
  total: 0,
};

// Create typed thunks
export const fetchWorkflows = createAsyncThunk<
  WorkflowListResponse,
  WorkflowFilter,
  { dispatch: AppDispatch; state: RootState }
>('workflow/fetchWorkflows', async (filter) => {
  return await api.getWorkflows(filter);
});

export const fetchWorkflowById = createAsyncThunk<
  Workflow,
  string,
  { dispatch: AppDispatch; state: RootState }
>('workflow/fetchWorkflowById', async (id) => {
  return await api.getWorkflow(id);
});

export const createWorkflow = createAsyncThunk<
  Workflow,
  CreateWorkflowRequest,
  { dispatch: AppDispatch; state: RootState }
>('workflow/createWorkflow', async (workflow) => {
  return await api.createWorkflow(workflow);
});

export const updateWorkflow = createAsyncThunk<
  Workflow,
  { id: string; workflow: UpdateWorkflowRequest },
  { dispatch: AppDispatch; state: RootState }
>('workflow/updateWorkflow', async ({ id, workflow }) => {
  return await api.updateWorkflow(id, workflow);
});

export const deleteWorkflow = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState }
>('workflow/deleteWorkflow', async (id) => {
  await api.deleteWorkflow(id);
  return id;
});

export const executeWorkflow = createAsyncThunk<
  void,
  WorkflowExecutionRequest,
  { dispatch: AppDispatch; state: RootState }
>('workflow/executeWorkflow', async (request) => {
  await api.executeWorkflow(request);
});

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    updateNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      state.workflowNodes = action.payload;
    },
    updateEdges: (state, action: PayloadAction<WorkflowEdge[]>) => {
      state.workflowEdges = action.payload;
    },
    updateExecutionStatus: (state, action: PayloadAction<{ 
      workflowId: string;
      status: string;
      message: string;
    }>) => {
      const { workflowId, status, message } = action.payload;
      state.executionStatus[workflowId] = { status, message };
    },
    clearCurrentWorkflow: (state) => {
      state.currentWorkflow = null;
      state.workflowNodes = [];
      state.workflowEdges = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workflows
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workflows';
      })
      // Fetch Workflow by ID
      .addCase(fetchWorkflowById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflowById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkflow = action.payload;
        state.workflowNodes = action.payload.nodes || [];
        state.workflowEdges = action.payload.edges || [];
      })
      .addCase(fetchWorkflowById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workflow';
      })
      // Create Workflow
      .addCase(createWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = [...state.workflows, action.payload];
      })
      .addCase(createWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create workflow';
      })
      // Update Workflow
      .addCase(updateWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = state.workflows.map(w => 
          w.id === action.payload.id ? action.payload : w
        );
        if (state.currentWorkflow?.id === action.payload.id) {
          state.currentWorkflow = action.payload;
        }
      })
      .addCase(updateWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update workflow';
      })
      // Delete Workflow
      .addCase(deleteWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = state.workflows.filter(w => w.id !== action.payload);
        if (state.currentWorkflow?.id === action.payload) {
          state.currentWorkflow = null;
        }
      })
      .addCase(deleteWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete workflow';
      });
  },
});

export const { updateNodes, updateEdges, updateExecutionStatus, clearCurrentWorkflow } = workflowSlice.actions;

// Selectors
export const selectWorkflows = (state: RootState) => state.workflow.workflows;
export const selectCurrentWorkflow = (state: RootState) => state.workflow.currentWorkflow;
export const selectWorkflowNodes = (state: RootState) => state.workflow.workflowNodes;
export const selectWorkflowEdges = (state: RootState) => state.workflow.workflowEdges;
export const selectLoading = (state: RootState) => state.workflow.loading;
export const selectError = (state: RootState) => state.workflow.error;
export const selectExecutionStatus = (state: RootState) => state.workflow.executionStatus;
export const selectTotal = (state: RootState) => state.workflow.total;

export default workflowSlice.reducer;
