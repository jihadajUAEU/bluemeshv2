import type { WorkflowStatus, DataClassification, WorkflowMetadata, ConsentStatus, AccessHistoryEntry } from './models.js';

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  metadata?: WorkflowMetadata;
  data_classification?: DataClassification;
  consent_status?: ConsentStatus;
  data_region: string;
  cross_border_allowed?: boolean;
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  metadata?: WorkflowMetadata;
  data_classification?: DataClassification;
  consent_status?: ConsentStatus;
  data_region?: string;
  cross_border_allowed?: boolean;
}

export interface WorkflowResponse {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  metadata?: WorkflowMetadata;
  data_classification: DataClassification;
  consent_status?: ConsentStatus;
  data_region: string;
  cross_border_allowed: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  last_accessed_by?: string;
  last_accessed_at?: Date;
  access_history?: AccessHistoryEntry[];
}

export interface WorkflowListResponse {
  items: WorkflowResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface WorkflowQuery extends PaginationQuery {
  status?: WorkflowStatus;
  data_region?: string;
  search?: string;
  data_classification?: DataClassification;
  created_by?: string;
}
