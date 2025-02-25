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

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface WorkflowQuery {
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

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
  data_classification?: DataClassification;
  data_region?: string;
  cross_border_allowed?: boolean;
  nodes?: unknown[];
  edges?: unknown[];
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
  nodes?: unknown[];
  edges?: unknown[];
}

export interface WorkflowResponse {
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
  created_at: Date;
  updated_at: Date;
  last_executed_at?: Date;
  created_by: string;
  last_accessed_by?: string;
  last_executed_by?: string;
  last_accessed_at?: Date;
}

export interface WorkflowListResponse {
  items: WorkflowResponse[];
  total: number;
  page: number;
  limit: number;
}
