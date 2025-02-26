import React from 'react';

export interface TestComponentProps {
  text?: string;
}

export const TestComponent: React.FC<TestComponentProps> = ({ text = 'Test Component' }) => (
  <div data-testid="test-component">{text}</div>
);

export default TestComponent;
