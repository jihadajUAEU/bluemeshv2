export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'error';
export type DataClassification = 'standard' | 'pii' | 'phi' | 'confidential';

export interface NodeConfig {
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

export interface Position {
  x: number;
  y: number;
}

export interface EdgeConfig {
  condition?: string;
  transformation?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface WorkflowMetadata {
  version?: string;
  tags?: string[];
  category?: string;
  priority?: number;
  [key: string]: unknown;
}

export interface ConsentStatus {
  hasConsent: boolean;
  consentDate?: Date;
  expiryDate?: Date;
  purposes?: string[];
  [key: string]: unknown;
}

export interface AccessHistoryEntry {
  userId: string;
  action: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}
