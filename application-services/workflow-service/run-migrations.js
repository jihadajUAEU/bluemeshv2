#!/usr/bin/env node

const { exec } = require('child_process');

// Command to run migrations with proper TypeScript support
const command = 'cross-env NODE_ENV=development ' +
  'ts-node -r tsconfig-paths/register ' +
  './node_modules/typeorm/cli.js ' +
  'migration:run ' +
  '-d ./typeorm.config.js';

console.log('Running migrations with command:', command);

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  
  if (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } else {
    console.log('Migration completed successfully');
    process.exit(0);
  }
});
