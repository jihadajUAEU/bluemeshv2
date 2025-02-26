import * as React from 'react';
import { render, screen } from '../../test/test-utils';
import { vi } from 'vitest';

interface TestComponentProps {
  text?: string;
}

const TestComponent: React.FC<TestComponentProps> = ({ text = 'Test Component' }) => (
  <div data-testid="test-component">{text}</div>
);

describe('TestComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default text', () => {
    render(<TestComponent />);
    
    const element = screen.getByTestId('test-component');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test Component');
  });

  it('renders with custom text', () => {
    const customText = 'Custom Text';
    render(<TestComponent text={customText} />);
    
    const element = screen.getByTestId('test-component');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(customText);
  });
});
