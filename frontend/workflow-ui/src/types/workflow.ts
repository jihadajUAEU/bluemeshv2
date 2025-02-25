export type WorkflowStatus = 'draft' | 'active' | 'archived' | 'deleted';

export type WorkflowExecutionStatus = 
  | 'not_started'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type DataClassification = 
  | 'public'
  | 'internal'
  | 'confidential'
  | 'restricted';

export type ConsentStatus = 
  | 'not_required'
  | 'pending'
  | 'approved'
  | 'denied';

export interface BaseWorkflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  execution_status: WorkflowExecutionStatus;
  current_phase?: string;
  execution_progress?: number;
  last_status_message?: string;
  metadata?: Record<string, unknown>;
  data_classification: DataClassification;
  consent_status?: ConsentStatus;
  data_region: string;
  cross_border_allowed: boolean;
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  created_by: string;
  last_accessed_by?: string;
  last_executed_by?: string;
  last_accessed_at?: string;
}

export interface WorkflowNode {
  id: string;
  workflow_id: string;
  type: string;
  data: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
}

export interface WorkflowEdge {
  id: string;
  workflow_id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, unknown>;
}

export interface Workflow extends BaseWorkflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metrics?: WorkflowMetrics;
}

export interface WorkflowListItem extends BaseWorkflow {
  metrics?: WorkflowMetrics;
}

export interface WorkflowPhase {
  name: string;
  progress: number;
  message: string;
  startTime: string;
  endTime?: string;
}

export interface WorkflowMetrics {
  nodesCount: number;
  edgesCount: number;
  executionTime?: number;
  lastExecutionDuration?: number;
  averageExecutionTime?: number;
  successRate?: number;
}

export interface WorkflowExecutionEvent {
  workflow_id: string;
  status: WorkflowExecutionStatus;
  phase?: string;
  progress?: number;
  message?: string;
  timestamp: string;
}

export interface WorkflowFilter {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  status?: WorkflowStatus;
  data_region?: string;
  data_classification?: DataClassification;
  created_by?: string;
  search?: string;
}

export interface WorkflowListResponse {
  items: WorkflowListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
  data_classification?: DataClassification;
  data_region?: string;
  cross_border_allowed?: boolean;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  metadata?: Record<string, unknown>;
  data_classification?: DataClassification;
  consent_status?: ConsentStatus;
  data_region?: string;
  cross_border_allowed?: boolean;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export interface WorkflowExecutionConfig {
  timeout?: number;
  retries?: number;
  notify_on_completion?: boolean;
  execution_mode?: 'sync' | 'async';
}

export interface WorkflowExecutionRequest {
  workflow_id: string;
  config?: WorkflowExecutionConfig;
}

export interface WorkflowExecutionResponse {
  execution_id: string;
  status: WorkflowExecutionStatus;
  message?: string;
  events_url?: string;
}
