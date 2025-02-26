import React from 'react';
import { render, screen } from '../../test/test-utils';

describe('Test Component', () => {
  const TestComponent = () => <div>Test Component</div>;

  it('renders correctly', () => {
    render(<TestComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
