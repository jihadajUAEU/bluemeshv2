import * as React from 'react';
import { useParams } from 'react-router-dom';

const WorkflowDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Workflow Details</h2>
      <p>Workflow ID: {id}</p>
      {/* Additional workflow details will be implemented later */}
    </div>
  );
};

export default WorkflowDetails;
