import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge, Node } from 'reactflow';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  loading: false,
  error: null
};

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setNodes, setEdges, setLoading, setError } = workflowSlice.actions;
export default workflowSlice.reducer;
