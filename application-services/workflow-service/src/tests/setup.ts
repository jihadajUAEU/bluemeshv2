import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
config({
  path: path.join(__dirname, '../../.env.test')
});

// Set test environment variables if not already set
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3001';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
process.env.DB_NAME = process.env.DB_NAME || 'bluemesh_test';

// Mock Dapr client and server
jest.mock('@dapr/dapr', () => ({
  DaprClient: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn()
  })),
  DaprServer: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn()
  }))
}));

// Global test setup
beforeAll(() => {
  // Add any global test setup here
});

// Global test cleanup
afterAll(() => {
  // Add any global test cleanup here
});
