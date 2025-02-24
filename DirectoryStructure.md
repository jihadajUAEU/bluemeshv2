# Directory Structure

This document outlines the complete directory structure of the project, organized by architectural layers. The structure follows a clear separation of concerns and includes configurations for Docker, Dapr, and service-specific implementations.

## Complete Directory Tree

```
root/
├── docker/                              # Docker configurations
│   ├── docker-compose.yml               # Main compose file
│   ├── docker-compose.dev.yml           # Development environment
│   ├── docker-compose.prod.yml          # Production environment
│   └── services/                        # Service-specific Dockerfiles
│       ├── frontend/
│       │   └── Dockerfile
│       ├── workflow-service/
│       │   └── Dockerfile
│       ├── ai-service/
│       │   └── Dockerfile
│       ├── kong/
│       │   └── Dockerfile
│       └── keycloak/
│           └── Dockerfile
│
├── dapr/                                # Dapr configurations
│   ├── config/
│   │   ├── config.yaml                  # Main Dapr configuration
│   │   └── tracing.yaml                 # Distributed tracing config
│   └── components/
│       ├── pubsub/                      # Pub/Sub configurations
│       │   ├── redis-pubsub.yaml
│       │   └── kafka-pubsub.yaml
│       ├── state/                       # State store configurations
│       │   ├── redis-state.yaml
│       │   └── postgresql-state.yaml
│       ├── bindings/                    # Input/Output bindings
│       │   ├── kafka-binding.yaml
│       │   └── http-binding.yaml
│       └── secrets/                     # Secret store configurations
│           └── vault-secretstore.yaml
│
├── presentation/                        # Presentation Layer
│   └── src/
│       ├── components/
│       │   ├── workflow/
│       │   │   ├── Builder.tsx
│       │   │   ├── Canvas.tsx
│       │   │   └── NodeTypes.tsx
│       │   ├── agents/
│       │   │   ├── AgentCard.tsx
│       │   │   └── AgentConfig.tsx
│       │   └── common/
│       ├── services/
│       │   ├── api.ts
│       │   ├── websocket.ts
│       │   └── state.ts
│       └── utils/
│
├── api-gateway/                         # API Gateway Layer
│   └── kong/
│       ├── routes/
│       │   ├── workflow-api.yml
│       │   └── ai-api.yml
│       └── plugins/
│           ├── auth.yml
│           └── rate-limit.yml
│
├── application-services/                # Application Services Layer
│   ├── workflow-service/
│   │   ├── controllers/
│   │   │   └── workflow.controller.ts
│   │   ├── models/
│   │   │   └── workflow.model.ts
│   │   ├── services/
│   │   │   └── workflow.service.ts
│   │   └── dapr/
│   │       ├── subscriptions/
│   │       │   └── workflow-events.yaml
│   │       └── state/
│   │           └── workflow-state.yaml
│   └── analytics-service/
│       ├── controllers/
│       │   └── analytics.controller.ts
│       ├── services/
│       │   └── metrics.service.ts
│       └── dapr/
│           ├── bindings/
│           │   └── analytics-input.yaml
│           └── state/
│               └── analytics-state.yaml
│
├── ai-layer/                           # AI/ML Layer
│   ├── model-registry/
│   │   ├── models/
│   │   │   ├── research-agent/
│   │   │   │   ├── model.onnx
│   │   │   │   ├── config.json
│   │   │   │   └── tokenizer.json
│   │   │   ├── analysis-agent/
│   │   │   │   ├── model.onnx
│   │   │   │   ├── config.json
│   │   │   │   └── tokenizer.json
│   │   │   └── qa-agent/
│   │   │       ├── model.onnx
│   │   │       ├── config.json
│   │   │       └── tokenizer.json
│   │   ├── models.yml
│   │   └── versioning.ts
│   ├── training/
│   │   ├── pipeline.py
│   │   └── datasets/
│   │       ├── research-data/
│   │       ├── analysis-data/
│   │       └── qa-data/
│   └── agents/
│       ├── research.agent.ts
│       ├── analysis.agent.ts
│       └── qa.agent.ts
│
├── data-layer/                         # Data Layer
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── workflow.sql
│   │   │   └── audit.sql
│   │   └── models/
│   │       └── entities.ts
│   └── cache/
│       └── redis/
│           ├── config.yml
│           └── sentinel.conf
│
├── integration/                        # Integration Layer
│   ├── adapters/
│   │   ├── rest.adapter.ts
│   │   └── graphql.adapter.ts
│   ├── transforms/
│   │   └── data.transformer.ts
│   └── dapr/
│       └── bindings/
│           ├── crm-binding.yaml
│           └── external-apis.yaml
│
├── security/                           # Security Layer
│   ├── keycloak/
│   │   ├── realm-config.json
│   │   └── policies.json
│   ├── encryption/
│   │   └── service.ts
│   ├── audit/
│   │   └── logger.ts
│   └── dapr/
│       └── secrets/
│           └── security-secrets.yaml
│
└── cross-cutting/                      # Cross-cutting Concerns
    ├── monitoring/
    │   ├── rules.yml
    │   └── metrics.ts
    ├── logging/
    │   └── config.yml
    └── deployment/
        ├── kubernetes/
        │   ├── staging/
        │   │   └── kustomization.yml
        │   └── production/
        │       └── kustomization.yml
        ├── staging.yml
        └── production.yml
```

## Layer Descriptions

### Infrastructure (Docker & Dapr)
- `docker/`: Contains all Docker-related configurations and service Dockerfiles
- `dapr/`: Houses Dapr configurations, components, and middleware settings

### Core Layers
- `presentation/`: Frontend implementation with React components and services
- `api-gateway/`: API Gateway configurations using Kong
- `application-services/`: Backend microservices with their respective controllers and services
- `ai-layer/`: AI/ML components including model registry, training pipelines, and agents
- `data-layer/`: Database schemas, migrations, and caching configurations
- `integration/`: External system adapters and data transformation services
- `security/`: Security configurations including Keycloak, encryption, and audit services

### Cross-cutting
- `cross-cutting/`: Shared concerns like monitoring, logging, and deployment configurations

Each layer is organized to maintain clear separation of concerns while enabling effective communication between components through well-defined interfaces and Dapr building blocks.
