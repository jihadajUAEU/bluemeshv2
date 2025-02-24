import 'reflect-metadata';
import express, { json, urlencoded, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { DaprClient, DaprServer } from '@dapr/dapr';
import { EntityNotFoundError } from 'typeorm';
import { initializeDatabase } from './config/data-source.js';
import { workflowRouter } from './controllers/workflow.controller.js';
import type { ErrorResponse } from './types/api.js';

// Load environment variables
config({ path: '.env.development' });

const app = express();
const port = process.env.PORT || 3001;
const daprHost = process.env.DAPR_HOST || 'localhost';
const daprPort = process.env.DAPR_HTTP_PORT || '3500';
const daprGrpcPort = process.env.DAPR_GRPC_PORT || '50001';

// Initialize Dapr client and server
const daprClient = new DaprClient({ daprHost, daprPort: daprGrpcPort });
const daprServer = new DaprServer({ 
  serverHost: daprHost, 
  serverPort: port.toString(), 
  clientOptions: { daprHost, daprPort: daprGrpcPort }
});

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/workflows', workflowRouter);

// Health check endpoint
app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  console.error('Unhandled error:', err);

  if (err instanceof EntityNotFoundError) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found'
      }
    } satisfies ErrorResponse);
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  } satisfies ErrorResponse);
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start Dapr server
    await daprServer.start();
    console.log('Dapr server started');

    // Start Express server
    app.listen(port, () => {
      console.log(`Workflow service listening on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Dapr client configured with host: ${daprHost}, port: ${daprPort}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  try {
    await daprServer.stop();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer().catch(console.error);

// Export for testing purposes
export { app, daprClient, daprServer };
