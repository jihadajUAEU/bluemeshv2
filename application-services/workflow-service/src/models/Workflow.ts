import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import type { WorkflowNode } from './WorkflowNode';
import type { WorkflowEdge } from './WorkflowEdge';
import type {
  WorkflowStatus,
  DataClassification,
  WorkflowMetadata,
  ConsentStatus,
  AccessHistoryEntry
} from '../types/models';

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ 
    type: 'varchar',
    length: 50,
    default: 'draft'
  })
  status!: WorkflowStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: WorkflowMetadata;

  @Column({ type: 'bytea', nullable: true })
  encrypted_data?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  encryption_iv?: Buffer;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'standard'
  })
  data_classification!: DataClassification;

  @Column({ type: 'jsonb', nullable: true })
  consent_status?: ConsentStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  data_retention_date?: Date;

  @Column({ type: 'uuid' })
  created_by!: string;

  @Column({ type: 'uuid', nullable: true })
  last_accessed_by?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  last_accessed_at?: Date;

  @Column({ type: 'jsonb', nullable: true })
  access_history?: AccessHistoryEntry[];

  @Column({ type: 'varchar', length: 50 })
  data_region!: string;

  @Column({ type: 'boolean', default: false })
  cross_border_allowed!: boolean;

  @OneToMany(() => WorkflowNode, (node: WorkflowNode) => node.workflow)
  nodes!: WorkflowNode[];

  @OneToMany(() => WorkflowEdge, (edge: WorkflowEdge) => edge.workflow)
  edges!: WorkflowEdge[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
