import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Workflow } from './src/models/Workflow.js';
import { WorkflowNode } from './src/models/WorkflowNode.js';
import { WorkflowEdge } from './src/models/WorkflowEdge.js';

// Register ts-node
import { register } from 'ts-node';
register({
  transpileOnly: true,
  compilerOptions: {
    module: 'NodeNext',
    moduleResolution: 'NodeNext'
  }
});

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  username: process.env.POSTGRES_USER || 'dbuser',
  password: process.env.POSTGRES_PASSWORD || 'dbpassword',
  database: process.env.POSTGRES_DB || 'workflow_automation',
  synchronize: false,
  logging: true,
  entities: [Workflow, WorkflowNode, WorkflowEdge],
  migrations: [join(__dirname, 'src/migrations/*.ts')],
  subscribers: []
});

console.log('Running migrations...');
console.log('Database config:', {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB
});

AppDataSource.initialize()
  .then(async () => {
    try {
      console.log('Running pending migrations...');
      await AppDataSource.runMigrations();
      console.log('Migrations completed successfully');
      await AppDataSource.destroy();
      process.exit(0);
    } catch (error) {
      console.error('Error during migration:', error);
      await AppDataSource.destroy();
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error initializing database:', error);
    process.exit(1);
  });
