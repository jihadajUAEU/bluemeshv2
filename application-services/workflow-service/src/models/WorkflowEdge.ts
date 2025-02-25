import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import type { Workflow } from './Workflow.js';
import type { WorkflowNode } from './WorkflowNode.js';
import type { EdgeConfig } from '../types/models.js';

@Entity('workflow_edges')
export class WorkflowEdge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workflow_id!: string;

  @Column()
  source_id!: string;

  @Column()
  target_id!: string;

  @Column({ type: 'jsonb', nullable: true })
  config?: EdgeConfig;

  @ManyToOne('Workflow', (workflow: Workflow) => workflow.edges)
  @JoinColumn({ name: 'workflow_id' })
  workflow!: Workflow;

  @ManyToOne('WorkflowNode')
  @JoinColumn({ name: 'source_id' })
  source!: WorkflowNode;

  @ManyToOne('WorkflowNode')
  @JoinColumn({ name: 'target_id' })
  target!: WorkflowNode;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
