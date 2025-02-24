import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Workflow } from '../models/Workflow.js';
import { WorkflowNode } from '../models/WorkflowNode.js';
import { WorkflowEdge } from '../models/WorkflowEdge.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bluemesh',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Workflow, WorkflowNode, WorkflowEdge],
  migrations: [],
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
