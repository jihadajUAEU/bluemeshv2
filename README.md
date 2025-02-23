# AI-Powered Workflow Automation Platform

A modular, scalable platform for enterprise workflow automation using AI agents. Built with the latest stable SDKs, libraries, and permissive licensing (MIT/Apache 2.0).

## Key Features

- No-code workflow builder
- Real-time AI response streaming
- Multi-LLM orchestration
- Enterprise-grade security & compliance
- Distributed application runtime with Dapr

## Architecture Overview

```mermaid
graph TD
    A[Frontend Layer] --> B[API Gateway Kong 3.9.0]
    B --> C[Backend Services]
    B --> K[Keycloak 26+]
    K --> C
    C --> D[AI Agent Layer]
    C --> E[Data Layer]
    C --> I[Integration Layer]
    D --> F[CrewAI Orchestration]
    E --> G[PostgreSQL 17.0 + pgvector]
    E --> H[Redis 7.4]
    J[Dapr Sidecar 1.14] --> A
    J --> C
    J --> D
    J --> E
    J --> I

    subgraph Security Layer
        K --> Auth[Authentication]
        K --> SSO[Single Sign-On]
        K --> RBAC[Role-Based Access]
        K --> Token[Token Management]
    end

    subgraph Integration Layer
        I --> I1[Data Ingestion]
        I --> I2[Data Export]
        I --> I3[Protocol Adapters]
        I1 --> I4[CRM Systems]
        I1 --> I5[External DBs]
        I1 --> I6[Third-party APIs]
        I2 --> I7[Transform]
        I2 --> I8[Validate]
        I3 --> I9[REST/GraphQL]
        I3 --> I10[JDBC/ODBC]
        I3 --> I11[Message Queues]
    end
```

## Data Architecture

```mermaid
graph TD
    A[Data Layer] --> B[PostgreSQL 17.0]
    A --> C[Redis 7.4]
    
    B --> D[Core Data]
    B --> E[Vector Storage]
    B --> F[Document Storage]
    
    D --> G[User Management]
    D --> H[Workflow Data]
    D --> I[Agent Data]
    
    E --> J[pgvector Extension]
    J --> K[Embeddings]
    J --> L[Similarity Search]
    
    F --> M[JSONB Storage]
    M --> N[Configurations]
    M --> O[State History]
    
    C --> P[State Management]
    C --> Q[Pub/Sub]
    C --> R[Caching]
```

### Components

1. **Frontend/UI Layer**
   - Web Interface: React 19.x-based chatbot interface (Port 3001)
   - Node.js 22.x runtime
   - No-Code Builder: Appsmith integration
   - API Gateway: Kong 3.9.0 with Konga admin UI
   - Realtime: Socket.IO 4.7.4 token streaming
   - Dapr JS SDK for state management and pub/sub

```mermaid
graph TD
    A[Frontend Layer] --> B[React 19.x Components]
    A --> C[State Management]
    A --> D[UI Services]
    
    B --> E[Workflow Builder]
    B --> F[Agent Interface]
    B --> G[Dashboard]
    B --> H[Settings]
    
    C --> I[Redux Store]
    C --> J[Dapr State]
    
    D --> K[Socket.IO 4.7.4]
    D --> L[REST Client]
    D --> M[WebSocket]
    
    E --> N[No-Code Editor]
    E --> O[Component Library]
    
    F --> P[Real-time Chat]
    F --> Q[Response Stream]
    
    K --> R[Real-time Updates]
    L --> S[API Requests]
    M --> T[Stream Handling]
```

2. **AI Agent Layer**
   - Framework: CrewAI 0.102.0
   - LLMs: GPT-4, OpenAI, or custom models
   - Python 3.12.2 with FastAPI 0.115.8 backend
   - Dynamic LLM switching with YAML configuration
   - Dapr 1.14 Python SDK for service communication

```mermaid
graph TD
    A[AI Agent Layer] --> B[CrewAI 0.102.0]
    A --> C[FastAPI Backend]
    A --> D[Agent Config]
    
    B --> E[Agent Types]
    B --> F[Orchestration]
    B --> G[Task Management]
    
    E --> H[Research Agent]
    E --> I[Analysis Agent]
    E --> J[Implementation Agent]
    E --> K[QA Agent]
    
    C --> L[REST Endpoints]
    C --> M[WebSocket Routes]
    C --> N[Middleware]
    
    D --> O[YAML Config]
    D --> P[Agent States]
    D --> Q[Workflow Rules]
    
    F --> R[Task Queue]
    F --> S[State Machine]
    
    N --> T[Authentication]
    N --> U[Rate Limiting]
    N --> V[Logging]
```

3. **Data Layer**
   - PostgreSQL 17.0 with pgvector extension
     - Core relational data
     - Vector embeddings storage
     - JSONB document storage
     - Full-text search capabilities
   - Redis 7.4 for
     - Dapr state store
     - Pub/sub messaging
     - Session management
     - Real-time features
     - Caching layer

4. **Integration Layer**
   - Data Ingestion and Export
     - CRM Systems (Salesforce, Dynamics 365, HubSpot)
     - Database Connectors (Oracle, MySQL, PostgreSQL, MongoDB)
     - Third-party APIs (RESTful, GraphQL)
     - File Systems (S3, SFTP, Local)
   - Protocol Adapters
     - REST/GraphQL Gateway
     - JDBC/ODBC Connections
     - Message Queue Integration (Kafka, RabbitMQ)
     - SOAP/XML Services
   - Data Processing
     - Schema Validation
     - Data Transformation
     - Format Conversion
     - Error Handling
   - Integration Features
     - Connection Pooling
     - Rate Limiting
     - Circuit Breaking
     - Retry Mechanisms
   - Security
     - API Key Management
     - OAuth Integration
     - Data Encryption
     - Audit Logging

```mermaid
graph TD
    A[Integration Layer] --> B[Data Ingestion]
    A --> C[Data Export]
    A --> D[Protocol Adapters]

    B --> E[CRM Systems]
    B --> F[External DBs]
    B --> G[Third-party APIs]
    B --> H[File Systems]

    C --> I[Data Transform]
    C --> J[Data Validation]
    C --> K[Data Export]
    C --> L[Error Handling]

    D --> M[REST/GraphQL]
    D --> N[JDBC/ODBC]
    D --> O[Message Queues]
    D --> P[SOAP/XML]

    subgraph Security
        S1[API Keys]
        S2[OAuth]
        S3[Encryption]
        S4[Audit Logs]
    end

    subgraph Features
        F1[Connection Pool]
        F2[Rate Limiting]
        F3[Circuit Breaker]
        F4[Retry Logic]
    end
```

5. **Dapr 1.14 Building Blocks**
   - State Management: Redis-backed state store
   - Pub/Sub Messaging: Redis pub/sub component
   - Service Invocation: Dapr-to-Dapr communication
   - Secrets Management: Local file-based secret store
   - Built-in observability and resilience
   - Distributed tracing and metrics

```mermaid
graph TD
    A[Dapr 1.14 Runtime] --> B[Building Blocks]
    A --> C[Components]
    A --> D[APIs]
    
    B --> E[State Management]
    B --> F[Pub/Sub]
    B --> G[Service Invocation]
    B --> H[Secrets]
    
    C --> I[Redis Store]
    C --> J[Redis Pub/Sub]
    C --> K[Local Secrets]
    
    D --> L[HTTP API]
    D --> M[gRPC API]
    
    E --> N[Actor State]
    E --> O[Workflow State]
    
    F --> P[Event Handling]
    F --> Q[Message Routing]
    
    G --> R[Service Discovery]
    G --> S[Load Balancing]
    
    H --> T[Key Management]
    H --> U[Secret Rotation]
```

## Application Flow

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant F as Frontend Layer
    participant K as Kong API Gateway
    participant KC as Keycloak 26+
    participant B as Backend Services
    participant I as Integration Layer
    participant A as AI Agent Layer
    participant D as Data Layer
    participant R as Redis Cache
    participant Dp as Dapr Sidecar

    U->>F: 1. User Interaction
    F->>K: 2. API Request
    
    rect rgba(0, 150, 255, 0.3)
        note over K,KC: Authentication Flow
        K->>KC: 3. Authenticate Request
        KC->>KC: 4. Validate Credentials
        KC-->>K: 5. Issue JWT Token
        K->>B: 6. Route with Token
        B->>KC: 7. Verify Token
    end
    
    rect rgba(255, 165, 0, 0.3)
        note over B,A: Workflow Processing
        B->>A: 6. Trigger Workflow
        A->>A: 7. Agent Orchestration
        A->>D: 8. Store Vector Data
        A->>R: 9. Update State
    end
    
    rect rgba(255, 105, 180, 0.3)
        note over A,F: Real-time Updates
        A-->>Dp: 10. Publish Events
        Dp-->>F: 11. Stream Updates
        F-->>U: 12. Live Updates
    end
    
    rect rgba(50, 205, 50, 0.3)
        note over D,F: Data Operations
        D->>R: 13. Cache Results
        R->>B: 14. Return Data
        I-->D: 15. External Data Sync
        I-->B: 16. Integration Events
        B->>K: 17. Format Response
        K->>F: 18. Send Response
        F->>U: 19. Update UI
    end

    rect rgba(128, 0, 128, 0.3)
        note over I,B: Integration Operations
        B->>I: 20. Integration Request
        I->>I: 21. Protocol Adaptation
        I->>I: 22. Data Transform
        I-->>B: 23. External System Response
    end
```

The application flow demonstrates the interaction between different layers:
1. **Authentication & Routing (Blue)**: Initial request handling and session validation
2. **Workflow Processing (Orange)**: AI agent orchestration and task processing
3. **Real-time Updates (Pink)**: Event streaming and live updates
4. **Data Operations (Green)**: Data storage, caching, and response handling

## Data Schema

```mermaid
graph TD
    A[PostgreSQL Schema] --> B[Users & Auth]
    A --> C[Workflows]
    A --> D[Agents]
    A --> E[Vector Data]
    
    B --> F[users]
    B --> G[roles]
    B --> H[permissions]
    
    C --> I[workflows]
    C --> J[workflow_versions]
    C --> K[execution_history]
    
    D --> L[agent_configurations]
    D --> M[agent_states]
    
    E --> N[embeddings]
    E --> O[vector_indexes]
```

## Getting Started

### Prerequisites

- Docker 25.0.2
- Docker Compose 2.33.0
- Python 3.12.2
- Node.js 22.x
- Dapr CLI 1.14 (for local development)
- Keycloak 26+ for authentication and authorization

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/workflow-platform.git
cd workflow-platform
```

2. Configure environment variables:
```bash
# Database settings
export POSTGRES_USER=dbuser
export POSTGRES_PASSWORD=dbpassword
export POSTGRES_DB=workflow_automation

# Redis settings
export REDIS_PASSWORD=redispassword
export REDIS_PORT=6379

# Keycloak settings
export KEYCLOAK_ADMIN=admin
export KEYCLOAK_ADMIN_PASSWORD=admin
export KEYCLOAK_URL=http://localhost:8080
export KEYCLOAK_REALM=workflow-platform
export KEYCLOAK_CLIENT_ID=workflow-client
export KEYCLOAK_CLIENT_SECRET=your-client-secret

# Copy and configure AI agents environment
cd platform/ai_agents
cp .env.example .env
# Edit .env with your OpenAI API key and other configurations
```

3. Configure Keycloak:
```bash
# Start Keycloak container
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=${KEYCLOAK_ADMIN} \
  -e KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD} \
  quay.io/keycloak/keycloak:26.0 \
  start-dev

# Configure Keycloak
- Access admin console at http://localhost:8080
- Create new realm: workflow-platform
- Create client: workflow-client
- Configure client settings:
  * Access Type: confidential
  * Valid Redirect URIs: http://localhost:3001/*
  * Web Origins: http://localhost:3001
- Create roles: admin, user, agent
- Configure user federation (optional)
```

3. Start the development environment:
```bash
cd ../
docker-compose up -d
```

4. Access the services:
   - Frontend UI: http://localhost:3001
   - AI Agents API: http://localhost:9000
   - Kong Admin API: http://localhost:8001
   - Konga Dashboard: http://localhost:1337
   - Keycloak Admin: http://localhost:8080
   - Grafana Dashboard: http://localhost:3000 (admin/admin)
   - Prometheus: http://localhost:9090
   - PostgreSQL: localhost:5433
   - Redis: localhost:6379

### Local Development with Dapr

1. Install the Dapr CLI:
```bash
# Windows (PowerShell Admin):
powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"

# Linux/macOS:
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
```

2. Initialize Dapr:
```bash
dapr init
```

3. Run services with Dapr locally:
```bash
# Run AI Agents service
cd platform/ai_agents
dapr run --app-id ai-agents --app-port 8000 --dapr-http-port 3500 python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Run Frontend service
cd ../frontend/workflow-ui
dapr run --app-id workflow-ui --app-port 3000 --dapr-http-port 3501 npm start
```

## Development

### AI Agents Layer

The AI agents layer is built with Python and uses the following key libraries:
- CrewAI 0.102.0 for agent orchestration and YAML-based configuration
- FastAPI 0.115.8 for API endpoints with Swagger UI documentation
- Pydantic 2.10.0 for data validation
- Dapr 1.14 Python SDK for distributed application features

#### API Documentation

The AI agents service includes comprehensive Swagger UI documentation:

1. Start the service:
```bash
cd platform/ai_agents
uvicorn main:app --reload
```

2. Access the documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Dapr Components

The platform uses several Dapr components:

1. **State Store (Redis)**
   - Persistent state management
   - Configuration: `platform/dapr/components/statestore.yaml`
   - Used for storing agent configurations and workflow state

2. **Pub/Sub (Redis)**
   - Event-driven communication
   - Configuration: `platform/dapr/components/pubsub.yaml`
   - Topics:
     - agent-events: Agent creation and updates
     - workflow-events: Workflow execution status

3. **Secrets Management**
   - Local file-based secret store
   - Configuration: `platform/dapr/components/secrets.yaml`
   - Manages sensitive configuration values

### Monitoring

The platform includes comprehensive monitoring with:
- Prometheus for metrics collection
- Grafana for visualization
- Custom dashboards for AI agent metrics
- Dapr observability integration

Access the monitoring stack:
- Grafana: http://localhost:3000 (default credentials: admin/admin)
- Prometheus: http://localhost:9090

## Testing

Run the test suite:

```bash
cd platform/ai_agents
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
