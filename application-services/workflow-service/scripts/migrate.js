#!/usr/bin/env node
require('dotenv').config();

const { DataSource } = require('typeorm');
const path = require('path');

console.log('Database Configuration:', {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  username: process.env.POSTGRES_USER || 'dbuser',
  password: process.env.POSTGRES_PASSWORD || 'dbpassword',
  database: process.env.POSTGRES_DB || 'workflow_automation',
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, '../src/models/**/*.ts')],
  migrations: [path.join(__dirname, '../src/migrations/**/*.ts')],
  subscribers: []
});

dataSource.initialize()
  .then(async () => {
    console.log('Running migrations...');
    await dataSource.runMigrations();
    console.log('Migrations completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during migration:', error);
    process.exit(1);
  });
