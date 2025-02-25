import { render } from '@testing-library/react';
import TaskNode from '../TaskNode';
import { vi } from 'vitest';

// Mock ReactFlow's Handle component
vi.mock('reactflow', () => ({
  Handle: () => null,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
}));

describe('TaskNode', () => {
  const mockProps = {
    id: 'node-1',
    data: {
      type: 'custom-task',
      label: 'Custom Task',
      config: {
        priority: 'high',
      },
    },
    selected: false,
    type: 'task',
    zIndex: 1,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    dragging: false,
  };

  test('renders basic node information correctly', () => {
    const { getByText } = render(<TaskNode {...mockProps} />);
    
    expect(getByText('Custom Task')).toBeDefined();
    expect(getByText('custom-task')).toBeDefined();
  });

  test('renders with minimal props', () => {
    const minimalProps = {
      id: 'node-1',
      data: {
        type: 'task',
        label: 'Basic Task',
      },
      selected: false,
      type: 'task',
      zIndex: 1,
      isConnectable: true,
      xPos: 0,
      yPos: 0,
      dragging: false,
    };

    const { getByText } = render(<TaskNode {...minimalProps} />);
    
    expect(getByText('Basic Task')).toBeDefined();
    expect(getByText('task')).toBeDefined();
  });

  test('renders default task type using createNewNode helper', () => {
    const defaultNodeProps = {
      id: 'node-1',
      data: {
        type: 'task',
        label: 'New Node',
        config: {},
      },
      selected: false,
      type: 'default',
      zIndex: 1,
      isConnectable: true,
      xPos: 0,
      yPos: 0,
      dragging: false,
    };

    const { getByText } = render(<TaskNode {...defaultNodeProps} />);
    
    expect(getByText('New Node')).toBeDefined();
    expect(getByText('task')).toBeDefined();
  });
});
