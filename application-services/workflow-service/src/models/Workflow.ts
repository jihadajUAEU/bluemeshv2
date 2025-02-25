import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import { 
  WorkflowStatus,
  WorkflowExecutionStatus,
  DataClassification,
  ConsentStatus
} from '../types/api.js';
import { WorkflowNode } from './WorkflowNode.js';
import { WorkflowEdge } from './WorkflowEdge.js';

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'archived', 'deleted'],
    default: 'draft'
  })
  status: WorkflowStatus;

  @Column({
    type: 'enum',
    enum: ['not_started', 'running', 'completed', 'failed', 'cancelled'],
    default: 'not_started'
  })
  execution_status: WorkflowExecutionStatus;

  @Column({ nullable: true })
  current_phase?: string;

  @Column({ type: 'float', nullable: true })
  execution_progress?: number;

  @Column({ type: 'text', nullable: true })
  last_status_message?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: ['public', 'internal', 'confidential', 'restricted'],
    default: 'internal'
  })
  data_classification: DataClassification;

  @Column({
    type: 'enum',
    enum: ['not_required', 'pending', 'approved', 'denied'],
    nullable: true
  })
  consent_status?: ConsentStatus;

  @Column()
  data_region: string;

  @Column({ default: false })
  cross_border_allowed: boolean;

  @Column({ type: 'jsonb', nullable: true })
  access_history?: Array<{
    userId: string;
    action: string;
    timestamp: Date;
  }>;

  @OneToMany(() => WorkflowNode, node => node.workflow, {
    cascade: true
  })
  nodes: WorkflowNode[];

  @OneToMany(() => WorkflowEdge, edge => edge.workflow, {
    cascade: true
  })
  edges: WorkflowEdge[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  last_accessed_at?: Date;

  @Column({ nullable: true })
  last_executed_at?: Date;

  @Index()
  @Column()
  created_by: string;

  @Column({ nullable: true })
  last_accessed_by?: string;

  @Column({ nullable: true })
  last_executed_by?: string;
}
