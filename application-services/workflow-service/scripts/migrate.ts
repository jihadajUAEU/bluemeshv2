import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Workflow } from '../src/models/Workflow.js';
import { WorkflowNode } from '../src/models/WorkflowNode.js';
import { WorkflowEdge } from '../src/models/WorkflowEdge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

console.log('Starting migration process...');
console.log('Current directory:', __dirname);
console.log('Environment Mode:', process.env.NODE_ENV);

console.log('Database Configuration:', {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  entities: [Workflow.name, WorkflowNode.name, WorkflowEdge.name],
  migrationsPath: join(__dirname, '../src/migrations/*.ts')
});

console.log('Initializing DataSource...');
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  username: process.env.POSTGRES_USER || 'dbuser',
  password: process.env.POSTGRES_PASSWORD || 'dbpassword',
  database: process.env.POSTGRES_DB || 'workflow_automation',
  synchronize: false,
  logging: true,
  entities: [Workflow, WorkflowNode, WorkflowEdge],
  migrations: [join(__dirname, '../src/migrations/*.ts')],
  subscribers: []
});

const runMigrations = async () => {
  try {
    console.log('Attempting to initialize database connection...');
    await dataSource.initialize();
    console.log('Database connection initialized successfully');

    console.log('Checking available migrations...');
    const pendingMigrations = await dataSource.showMigrations();
    console.log('Pending migrations:', pendingMigrations);

    console.log('Running migrations...');
    const migrations = await dataSource.runMigrations();
    console.log('Migrations completed:', migrations.map(m => m.name));

    await dataSource.destroy();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration process:', error);
    if (dataSource.isInitialized) {
      console.log('Closing database connection due to error...');
      await dataSource.destroy();
    }
    process.exit(1);
  }
};

console.log('Starting migration execution...');
runMigrations().catch(error => {
  console.error('Unhandled error during migration:', error);
  process.exit(1);
});
