import { render } from '@testing-library/react';
import ConditionalEdge from '../ConditionalEdge';
import { vi } from 'vitest';
import { Position } from 'reactflow';

// Mock ReactFlow's functions and types
vi.mock('reactflow', () => ({
  Position: {
    Bottom: Position.Bottom,
    Top: Position.Top,
  },
  getBezierPath: () => ['M0 0 L100 100', 50, 50],
  BaseEdge: ({ path, style, markerEnd }: any) => (
    <path data-testid="base-edge" d={path} style={style} markerEnd={markerEnd} />
  ),
}));

describe('ConditionalEdge', () => {
  const mockProps = {
    id: 'edge-1',
    source: 'node-1',
    target: 'node-2',
    sourceX: 0,
    sourceY: 0,
    targetX: 100,
    targetY: 100,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    selected: false,
    animated: false,
    data: {
      condition: 'if success',
    },
    style: { stroke: '#000' },
    markerEnd: 'url(#arrow)',
  };

  test('renders edge with condition label', () => {
    const { getByText, getByTestId } = render(<ConditionalEdge {...mockProps} />);
    
    expect(getByTestId('base-edge')).toBeDefined();
    expect(getByText('if success')).toBeDefined();
  });

  test('renders edge without condition label', () => {
    const propsWithoutCondition = {
      ...mockProps,
      data: {},
    };

    const { queryByText, getByTestId } = render(<ConditionalEdge {...propsWithoutCondition} />);
    
    expect(getByTestId('base-edge')).toBeDefined();
    expect(queryByText('if success')).toBeNull();
  });

  test('applies custom styles to edge', () => {
    const propsWithCustomStyle = {
      ...mockProps,
      style: { stroke: '#ff0000', strokeWidth: 2 },
    };

    const { getByTestId } = render(<ConditionalEdge {...propsWithCustomStyle} />);
    const edge = getByTestId('base-edge');
    
    expect(edge).toHaveAttribute('style', expect.stringContaining('stroke: #ff0000'));
    expect(edge).toHaveAttribute('style', expect.stringContaining('stroke-width: 2'));
  });

  test('applies marker end to edge', () => {
    const { getByTestId } = render(<ConditionalEdge {...mockProps} />);
    const edge = getByTestId('base-edge');
    
    expect(edge).toHaveAttribute('marker-end', 'url(#arrow)');
  });

  test('positions label correctly', () => {
    const { getByText } = render(<ConditionalEdge {...mockProps} />);
    const label = getByText('if success');
    
    // getBezierPath mock returns [50, 50] for label position
    expect(label).toHaveStyle({
      left: '35px', // 50 - 15 (labelX - 15 from component)
      top: '40px',  // 50 - 10 (labelY - 10 from component)
    });
  });

  test('renders with minimal props', () => {
    const minimalProps = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      selected: false,
      animated: false,
      data: undefined,
      style: {},
    };

    const { getByTestId } = render(<ConditionalEdge {...minimalProps} />);
    
    expect(getByTestId('base-edge')).toBeDefined();
  });
});
