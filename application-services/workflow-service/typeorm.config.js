const path = require('path');
require('dotenv').config();

const entitiesPath = path.join(__dirname, 'src/models/**/*.ts');
const migrationsPath = path.join(__dirname, 'src/migrations/**/*.ts');

console.log('TypeORM Config:', {
  entitiesPath,
  migrationsPath,
  env: {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_DB: process.env.POSTGRES_DB
  }
});

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
  username: process.env.POSTGRES_USER || 'dbuser',
  password: process.env.POSTGRES_PASSWORD || 'dbpassword',
  database: process.env.POSTGRES_DB || 'workflow_automation',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  subscribers: [],
  synchronize: false,
  logging: true,
  cli: {
    migrationsDir: 'src/migrations'
  }
};
