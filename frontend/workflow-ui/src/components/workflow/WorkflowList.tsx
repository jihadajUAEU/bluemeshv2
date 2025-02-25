import * as React from 'react';
import { Link } from 'react-router-dom';

const WorkflowList: React.FC = () => {
  return (
    <div>
      <h2>Workflows</h2>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/workflows/new">Create New Workflow</Link>
      </div>
      {/* Workflow list implementation will go here */}
      <div>No workflows found. Create a new one to get started!</div>
    </div>
  );
};

export default WorkflowList;
