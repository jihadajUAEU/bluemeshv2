# Workflow Service

A microservice for managing AI workflow automation with CrewAI integration, built with Node.js, TypeScript, and Dapr.

## Features

- CRUD operations for workflows
- Workflow node and edge management
- HIPAA & GDPR compliance features
- Data classification and encryption
- Geographic data controls
- Audit logging
- Vector storage for AI embeddings

## Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0
- Docker and Docker Compose
- Dapr CLI
- PostgreSQL

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy `.env.development` for development environment
- Copy `.env.test` for testing environment
- Update the variables as needed

3. Initialize the database:
```bash
npm run migrate
```

## Development

Start the service in development mode with Dapr:
```bash
npm run dev
```

This will:
- Start the Dapr sidecar
- Run the service with hot-reload
- Connect to PostgreSQL
- Initialize all Dapr building blocks

To run only the service without Dapr:
```bash
npm run dev:service
```

To start only the Dapr sidecar:
```bash
npm run dapr:start
```

## Testing

Run all tests:
```bash
npm run test
```

Run specific test types:
```bash
# Unit tests with watch mode
npm run test:watch

# Test coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Database Management

```bash
# Run migrations
npm run migrate

# Revert last migration
npm run migrate:revert

# Create new migration
npm run migrate:create

# Generate migration from entity changes
npm run migrate:generate
```

## API Endpoints

### Workflows

- `POST /api/workflows` - Create a new workflow
- `GET /api/workflows` - List workflows (with pagination)
- `GET /api/workflows/:id` - Get workflow by ID
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow

### Health Check

- `GET /health` - Service health status

## Project Structure

```
workflow-service/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # API route controllers
│   ├── models/        # Database models
│   ├── services/      # Business logic
│   ├── tests/         # Test files
│   ├── types/         # TypeScript type definitions
│   └── server.ts      # Application entry point
├── scripts/           # Service management scripts
├── dapr/             # Dapr configuration
└── README.md         # This file
```

## Environment Variables

- `NODE_ENV` - Environment (development/production/test)
- `PORT` - Service port
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USER` - PostgreSQL user
- `DB_PASSWORD` - PostgreSQL password
- `DB_NAME` - PostgreSQL database name
- `DAPR_HOST` - Dapr sidecar host
- `DAPR_HTTP_PORT` - Dapr HTTP port
- `DAPR_GRPC_PORT` - Dapr gRPC port

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT
