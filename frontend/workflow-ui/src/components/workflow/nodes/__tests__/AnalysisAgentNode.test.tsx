import { render } from '@testing-library/react';
import AnalysisAgentNode from '../AnalysisAgentNode';
import { vi } from 'vitest';

// Mock ReactFlow's Handle component
vi.mock('reactflow', () => ({
  Handle: () => null,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
}));

describe('AnalysisAgentNode', () => {
  const mockProps = {
    id: 'node-1',
    data: {
      type: 'analysis',
      label: 'Analysis Node',
      agent_type: 'analysis',
      status: 'running' as const,
      analysis_type: 'Data Pattern Analysis',
      data_points: 150,
      progress: 75,
      insights: ['Pattern A detected', 'Anomaly in sector B'],
    },
    selected: false,
    type: 'analysis',
    zIndex: 1,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    dragging: false,
  };

  test('renders basic node information correctly', () => {
    const { getByText } = render(<AnalysisAgentNode {...mockProps} />);
    
    expect(getByText('Analysis Node')).toBeDefined();
    expect(getByText(/Agent Type: analysis/i)).toBeDefined();
    expect(getByText('running')).toBeDefined();
  });

  test('renders analysis specific details', () => {
    const { getByText } = render(<AnalysisAgentNode {...mockProps} />);
    
    expect(getByText(/Analysis Type: Data Pattern Analysis/i)).toBeDefined();
    expect(getByText(/Data Points: 150/i)).toBeDefined();
    expect(getByText(/Progress: 75%/i)).toBeDefined();
  });

  test('renders insights when provided', () => {
    const { getByText } = render(<AnalysisAgentNode {...mockProps} />);
    
    expect(getByText('Key Insights:')).toBeDefined();
    expect(getByText('Pattern A detected')).toBeDefined();
    expect(getByText('Anomaly in sector B')).toBeDefined();
  });

  test('renders error state correctly', () => {
    const errorProps = {
      ...mockProps,
      data: {
        ...mockProps.data,
        status: 'failed' as const,
        error: 'Analysis failed: insufficient data',
      },
    };

    const { getByText } = render(<AnalysisAgentNode {...errorProps} />);
    
    expect(getByText('failed')).toBeDefined();
    expect(getByText(/Analysis failed: insufficient data/i)).toBeDefined();
  });
});
