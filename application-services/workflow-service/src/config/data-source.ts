import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Workflow } from '../models/Workflow.js';
import { WorkflowNode } from '../models/WorkflowNode.js';
import { WorkflowEdge } from '../models/WorkflowEdge.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  username: process.env.POSTGRES_USER || 'dbuser',
  password: process.env.POSTGRES_PASSWORD || 'dbpassword',
  database: process.env.POSTGRES_DB || 'workflow_automation',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Workflow, WorkflowNode, WorkflowEdge],
  migrations: ['src/migrations/*.ts'],
  subscribers: []
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }
};
