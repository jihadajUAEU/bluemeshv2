import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Workflow } from './Workflow';
import type { NodeConfig, Position } from '../types/models';

@Entity('workflow_nodes')
export class WorkflowNode {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workflow_id!: string;

  @Column()
  type!: string;

  @Column()
  name!: string;

  @Column({ type: 'jsonb', nullable: true })
  config?: NodeConfig;

  @Column({ type: 'jsonb', nullable: true })
  position?: Position;

  @ManyToOne(() => Workflow, (workflow: Workflow) => workflow.nodes)
  @JoinColumn({ name: 'workflow_id' })
  workflow!: Workflow;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
