import { render } from '@testing-library/react';
import { vi } from 'vitest';
import WorkflowBuilder from '../WorkflowBuilder';

// Mock the hooks and Redux store
vi.mock('@/hooks/useAppStore', () => ({
  useAppDispatch: () => vi.fn(),
  useCurrentWorkflow: () => null,
  useWorkflowNodes: () => [],
  useWorkflowEdges: () => [],
}));

// Mock the Redux actions
vi.mock('@/store/workflowSlice', () => ({
  createWorkflow: vi.fn(),
  updateWorkflow: vi.fn(),
  updateNodes: vi.fn(),
  updateEdges: vi.fn(),
}));

// Mock ReactFlow
vi.mock('reactflow', () => ({
  Background: () => null,
  Controls: () => null,
  Panel: ({ children }: { children: React.ReactNode }) => <div data-testid="panel">{children}</div>,
  ReactFlow: ({ children }: { children: React.ReactNode }) => <div data-testid="reactflow">{children}</div>,
  addEdge: vi.fn(),
  applyNodeChanges: vi.fn(),
  applyEdgeChanges: vi.fn(),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: () => ({}),
  useNavigate: () => vi.fn(),
}));

test('WorkflowBuilder renders with agent node buttons', () => {
  const { getByText, getByTestId } = render(<WorkflowBuilder />);
  
  // Check that the component renders
  expect(getByText('Create New Workflow')).toBeDefined();
  
  // Check that the ReactFlow component is rendered
  expect(getByTestId('reactflow')).toBeDefined();
  
  // Check that the panel with node buttons is rendered
  expect(getByTestId('panel')).toBeDefined();
  
  // Check that all agent node buttons are rendered
  expect(getByText('Add Task Node')).toBeDefined();
  expect(getByText('Add Research Agent')).toBeDefined();
  expect(getByText('Add Analysis Agent')).toBeDefined();
  expect(getByText('Add Implementation Agent')).toBeDefined();
  expect(getByText('Add QA Agent')).toBeDefined();
});
