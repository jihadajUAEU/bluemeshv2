import { render } from '@testing-library/react';
import QAAgentNode from '../QAAgentNode';
import { vi } from 'vitest';

// Mock ReactFlow's Handle component
vi.mock('reactflow', () => ({
  Handle: () => null,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
}));

describe('QAAgentNode', () => {
  const mockProps = {
    id: 'node-1',
    data: {
      type: 'qa',
      label: 'QA Node',
      agent_type: 'qa',
      status: 'running' as const,
      test_count: 100,
      passed_tests: 85,
      failed_tests: 15,
      test_coverage: 78,
      progress: 90,
      issues: [
        { severity: 'critical' as const, description: 'Security vulnerability' },
        { severity: 'high' as const, description: 'Performance bottleneck' },
        { severity: 'medium' as const, description: 'Code smell' },
        { severity: 'low' as const, description: 'Minor style issue' },
      ],
    },
    selected: false,
    type: 'qa',
    zIndex: 1,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    dragging: false,
  };

  test('renders basic node information correctly', () => {
    const { getByText } = render(<QAAgentNode {...mockProps} />);
    
    expect(getByText('QA Node')).toBeDefined();
    expect(getByText(/Agent Type: qa/i)).toBeDefined();
    expect(getByText('running')).toBeDefined();
    expect(getByText(/Progress: 90%/i)).toBeDefined();
  });

  test('renders test statistics correctly', () => {
    const { getByText } = render(<QAAgentNode {...mockProps} />);
    
    expect(getByText(/Tests: 100/)).toBeDefined();
    expect(getByText(/Passed: 85/)).toBeDefined();
    expect(getByText(/Failed: 15/)).toBeDefined();
    expect(getByText(/Pass Rate: 85%/)).toBeDefined();
  });

  test('renders test coverage correctly', () => {
    const { getByText } = render(<QAAgentNode {...mockProps} />);
    
    expect(getByText(/Coverage: 78%/)).toBeDefined();
  });

  test('renders issues with correct severity badges', () => {
    const { getByText } = render(<QAAgentNode {...mockProps} />);
    
    expect(getByText('critical')).toBeDefined();
    expect(getByText('high')).toBeDefined();
    expect(getByText('medium')).toBeDefined();
    expect(getByText('Security vulnerability')).toBeDefined();
    expect(getByText('Performance bottleneck')).toBeDefined();
    expect(getByText('Code smell')).toBeDefined();
  });

  test('truncates issues to show only first 3 with count of remaining', () => {
    const { getByText, queryByText } = render(<QAAgentNode {...mockProps} />);
    
    // Should show first 3 issues
    expect(getByText('Security vulnerability')).toBeDefined();
    expect(getByText('Performance bottleneck')).toBeDefined();
    expect(getByText('Code smell')).toBeDefined();
    
    // Should not show 4th issue
    expect(queryByText('Minor style issue')).toBeNull();
    
    // Should show count of remaining issues
    expect(getByText('+1 more issues')).toBeDefined();
  });

  test('renders error state correctly', () => {
    const errorProps = {
      ...mockProps,
      data: {
        ...mockProps.data,
        status: 'failed' as const,
        error: 'Test execution failed',
      },
    };

    const { getByText } = render(<QAAgentNode {...errorProps} />);
    
    expect(getByText('failed')).toBeDefined();
    expect(getByText(/Test execution failed/i)).toBeDefined();
  });

  test('renders with minimal props', () => {
    const minimalProps = {
      id: 'node-1',
      data: {
        type: 'qa',
        label: 'Basic QA',
        agent_type: 'qa',
      },
      selected: false,
      type: 'qa',
      zIndex: 1,
      isConnectable: true,
      xPos: 0,
      yPos: 0,
      dragging: false,
    };

    const { getByText } = render(<QAAgentNode {...minimalProps} />);
    
    expect(getByText('Basic QA')).toBeDefined();
    expect(getByText(/Agent Type: qa/i)).toBeDefined();
    expect(getByText('idle')).toBeDefined();
  });
});
