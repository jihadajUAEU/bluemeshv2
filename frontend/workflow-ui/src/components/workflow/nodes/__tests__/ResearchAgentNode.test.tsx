import { render } from '@testing-library/react';
import ResearchAgentNode from '../ResearchAgentNode';
import { vi } from 'vitest';

// Mock ReactFlow's Handle component
vi.mock('reactflow', () => ({
  Handle: () => null,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
}));

test('ResearchAgentNode renders correctly', () => {
  const mockProps = {
    id: 'node-1',
    data: {
      type: 'research',
      label: 'Research Node',
      agent_type: 'research',
      status: 'idle' as const,
      research_topics: ['AI', 'Machine Learning'],
      data_sources: ['Academic Papers', 'Industry Reports'],
    },
    selected: false,
    type: 'research',
    zIndex: 1,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    dragging: false,
  };

  const { getByText } = render(<ResearchAgentNode {...mockProps} />);
  
  // Check that the component renders with the correct content
  expect(getByText('Research Node')).toBeDefined();
  expect(getByText(/Agent Type: research/i)).toBeDefined();
  expect(getByText('idle')).toBeDefined();
  expect(getByText('Research Topics:')).toBeDefined();
  expect(getByText('AI')).toBeDefined();
  expect(getByText('Machine Learning')).toBeDefined();
  expect(getByText('Data Sources:')).toBeDefined();
  expect(getByText('Academic Papers')).toBeDefined();
  expect(getByText('Industry Reports')).toBeDefined();
});
