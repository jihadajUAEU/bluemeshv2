const cp = require('child_process');

// Load environment variables
require('dotenv').config();

// Print current environment
console.log('Environment:', {
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_DB: process.env.POSTGRES_DB
});

try {
  // Run TypeORM CLI with ts-node
  cp.execSync(
    'typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts',
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
