// run-migration.js
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set environment variables to match what's expected in data-source.ts
process.env.DB_HOST = process.env.POSTGRES_HOST || 'localhost';
process.env.DB_PORT = process.env.POSTGRES_PORT || '5433';
process.env.DB_USER = process.env.POSTGRES_USER || 'dbuser';
process.env.DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'dbpassword';
process.env.DB_NAME = process.env.POSTGRES_DB || 'workflow_automation';

// Run the migration with the correct data source path
const dataSourcePath = path.resolve(__dirname, 'src/config/data-source.ts');
const command = `npx cross-env ts-node ./node_modules/typeorm/cli.js migration:run -d ${dataSourcePath}`;

console.log(`Running migration with command: ${command}`);
try {
  execSync(command, { stdio: 'inherit' });
  console.log('Migration completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
