import { beforeAll, afterAll } from '@jest/globals';

// Increase timeout for infrastructure tests
jest.setTimeout(30000);

// Setup before all tests
beforeAll(async () => {
  // Wait for a few seconds to ensure services are fully initialized
  await new Promise((resolve) => setTimeout(resolve, 5000));
});

// Cleanup after all tests
afterAll(async () => {
  // Add any cleanup logic here if needed
});

// Global error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
