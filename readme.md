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
