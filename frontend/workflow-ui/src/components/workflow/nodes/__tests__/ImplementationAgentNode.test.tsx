import { render } from '@testing-library/react';
import ImplementationAgentNode from '../ImplementationAgentNode';
import { vi } from 'vitest';

// Mock ReactFlow's Handle component
vi.mock('reactflow', () => ({
  Handle: () => null,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
}));

describe('ImplementationAgentNode', () => {
  const mockProps = {
    id: 'node-1',
    data: {
      type: 'implementation',
      label: 'Implementation Node',
      agent_type: 'implementation',
      status: 'running' as const,
      implementation_type: 'Feature Development',
      technologies: ['React', 'TypeScript', 'Node.js'],
      code_snippets: [
        { language: 'typescript', code: 'const x = 5;' },
        { language: 'python', code: 'x = 5' },
      ],
      progress: 65,
      completion_rate: 70,
    },
    selected: false,
    type: 'implementation',
    zIndex: 1,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    dragging: false,
  };

  test('renders basic node information correctly', () => {
    const { getByText } = render(<ImplementationAgentNode {...mockProps} />);
    
    expect(getByText('Implementation Node')).toBeDefined();
    expect(getByText(/Agent Type: implementation/i)).toBeDefined();
    expect(getByText('running')).toBeDefined();
  });

  test('renders implementation specific details', () => {
    const { getByText } = render(<ImplementationAgentNode {...mockProps} />);
    
    expect(getByText(/Implementation: Feature Development/i)).toBeDefined();
    expect(getByText(/Progress: 65%/i)).toBeDefined();
    expect(getByText(/Completion: 70%/i)).toBeDefined();
  });

  test('renders technologies list', () => {
    const { getByText } = render(<ImplementationAgentNode {...mockProps} />);
    
    expect(getByText('Technologies:')).toBeDefined();
    expect(getByText('React')).toBeDefined();
    expect(getByText('TypeScript')).toBeDefined();
    expect(getByText('Node.js')).toBeDefined();
  });

  test('renders code snippets info', () => {
    const { getByText } = render(<ImplementationAgentNode {...mockProps} />);
    
    expect(getByText('Code Snippets:')).toBeDefined();
    expect(getByText('2 snippet(s) available')).toBeDefined();
  });

  test('renders error state correctly', () => {
    const errorProps = {
      ...mockProps,
      data: {
        ...mockProps.data,
        status: 'failed' as const,
        error: 'Implementation failed: build error',
      },
    };

    const { getByText } = render(<ImplementationAgentNode {...errorProps} />);
    
    expect(getByText('failed')).toBeDefined();
    expect(getByText(/Implementation failed: build error/i)).toBeDefined();
  });

  test('renders with minimal props', () => {
    const minimalProps = {
      id: 'node-1',
      data: {
        type: 'implementation',
        label: 'Basic Implementation',
        agent_type: 'implementation',
      },
      selected: false,
      type: 'implementation',
      zIndex: 1,
      isConnectable: true,
      xPos: 0,
      yPos: 0,
      dragging: false,
    };

    const { getByText } = render(<ImplementationAgentNode {...minimalProps} />);
    
    expect(getByText('Basic Implementation')).toBeDefined();
    expect(getByText(/Agent Type: implementation/i)).toBeDefined();
    expect(getByText('idle')).toBeDefined();
  });
});
