import * as React from 'react';
import { useParams } from 'react-router-dom';

const ExecutionView: React.FC = () => {
  const { id, executionId } = useParams();

  return (
    <div>
      <h2>Workflow Execution</h2>
      <p>Workflow ID: {id}</p>
      <p>Execution ID: {executionId}</p>
      {/* Additional execution details will be implemented later */}
    </div>
  );
};

export default ExecutionView;
