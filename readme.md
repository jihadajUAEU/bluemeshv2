# AI-Powered Workflow Automation Platform

A modular, scalable platform for enterprise workflow automation using AI agents. Built with the latest stable SDKs, libraries, and permissive licensing (MIT/Apache 2.0).

## Features

- No-code workflow builder with ReactFlow
- Real-time AI response streaming
- Multi-LLM orchestration with CrewAI
- Enterprise-grade security & compliance
- Distributed application runtime with Dapr

## Prerequisites

- Docker 25.0.2+
- Docker Compose 2.33.0+
- Node.js 22.x
- Python 3.12.2+
- Dapr CLI 1.14+
- OpenAI API key

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/workflow-platform.git
cd workflow-platform
```

2. Copy the environment file and configure it:
```bash
cp .env.development .env
# Edit .env and set your OpenAI API key and other configurations
```
# Database Configuration
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=dbpassword
POSTGRES_DB=workflow_automation
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redispassword

# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=workflow-platform
KEYCLOAK_CLIENT_ID=workflow-client
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Kong Configuration
KONG_ADMIN_URL=http://localhost:8001
KONG_PROXY_URL=http://localhost:8000

# Dapr Configuration
DAPR_HTTP_PORT=3500
DAPR_GRPC_PORT=50001

# Application Configuration
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug

# Security
JWT_SECRET=your-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key-here
AI_SERVICE_URL=http://localhost:9000

# Compliance
DATA_RETENTION_DAYS=30
DEFAULT_DATA_REGION=us-east
ENABLE_AUDIT_LOGGING=true
ENABLE_DATA_ENCRYPTION=true

# Feature Flags
ENABLE_REALTIME_UPDATES=true
ENABLE_AI_CAPABILITIES=true
ENABLE_ADVANCED_WORKFLOW=true

# Monitoring
ENABLE_METRICS=true
ENABLE_TRACING=true
ZIPKIN_ENDPOINT=http://localhost:9411

3. Run the setup script:
```bash
npm run setup
```

4. Start the development environment:
```bash
npm run dev
```

## Development

The project is structured into several layers:

### Frontend Layer
- React 19.x with ReactFlow
- Real-time workflow visualization
- Component-based architecture

### Backend Services
- Node.js 22.x/TypeScript 5.3
- Dapr building blocks integration
- Event-driven architecture

### AI Layer
- CrewAI 0.102.0 with Python 3.12.9
- Multi-agent orchestration
- Real-time streaming

### Data Layer
- PostgreSQL 17.0
- Redis 7.4 OSS
- Vector storage

## Scripts

- `npm run setup` - Initialize project and start infrastructure
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all services
- `npm run test` - Run all tests
- `npm run lint` - Run linting

## Documentation

- [Architecture Layers](architecture-layers.md)
- [Implementation Guide](implementation-guide.md)
- [Application Flow](application-flow.md)
- [Directory Structure](directory-structure.md)

## Service Access Points

| Service | URL | Default Credentials |
|---------|-----|-------------------|
| Frontend UI | http://localhost:3001 | - |
| AI Agents API | http://localhost:9000 | - |
| Kong Admin | http://localhost:8001 | - |
| Keycloak Admin | http://localhost:8080 | admin/admin |
| Zipkin UI | http://localhost:9411 | - |

## Security

This platform implements enterprise-grade security features:
- Keycloak CE 26+ for authentication/authorization
- JWT with PKCE for secure token handling
- HIPAA & GDPR compliance mechanisms
- Data encryption at rest and in transit

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow coding standards (see ESLint/Prettier configs)
4. Write/update tests
5. Submit a pull request

## Testing

```bash
# Run all tests
npm test

# Run specific service tests
npm run test:frontend
npm run test:workflow
npm run test:ai
```

## License

This project is dual-licensed under:
- MIT License
- Apache License 2.0

© 2024 netstratum. All rights reserved.
