import * as React from 'react';
import { useParams } from 'react-router-dom';

const WorkflowBuilder: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <div>
      <h2>{isEditing ? 'Edit Workflow' : 'Create New Workflow'}</h2>
      {isEditing && <p>Workflow ID: {id}</p>}
      {/* Workflow builder implementation will go here */}
    </div>
  );
};

export default WorkflowBuilder;
