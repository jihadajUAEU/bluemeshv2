import { 
  Workflow,
  WorkflowListResponse,
  WorkflowExecutionEvent,
  WorkflowFilter,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowExecutionRequest,
  WorkflowExecutionResponse
} from '../types/workflow';

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  async getWorkflows(filter: WorkflowFilter): Promise<WorkflowListResponse> {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const response = await fetch(`${BASE_URL}/workflows?${params.toString()}`);
    return response.json();
  },

  async getWorkflow(id: string): Promise<Workflow> {
    const response = await fetch(`${BASE_URL}/workflows/${id}`);
    return response.json();
  },

  async createWorkflow(data: CreateWorkflowRequest): Promise<Workflow> {
    const response = await fetch(`${BASE_URL}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateWorkflow(id: string, data: UpdateWorkflowRequest): Promise<Workflow> {
    const response = await fetch(`${BASE_URL}/workflows/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteWorkflow(id: string): Promise<void> {
    await fetch(`${BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
    });
  },

  async executeWorkflow(request: WorkflowExecutionRequest): Promise<WorkflowExecutionResponse> {
    const response = await fetch(`${BASE_URL}/workflows/${request.workflow_id}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.config),
    });
    return response.json();
  },

  async getWorkflowStatusEvents(workflowId: string): Promise<EventSource> {
    return new EventSource(`${BASE_URL}/workflows/${workflowId}/status`);
  }
};
