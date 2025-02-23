AI-Powered Workflow Automation Platform
A modular, scalable platform for enterprise workflow automation using AI agents. Built with the latest stable SDKs, libraries, and permissive licensing (MIT/Apache 2.0).

Key Features
No-code workflow builder with ReactFlow

Real-time AI response streaming

Multi-LLM orchestration

Enterprise-grade security & compliance

Distributed application runtime with Dapr

Architecture Overview
mermaid
Copy
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
Data Architecture
mermaid
Copy
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
Components
1. Frontend/UI Layer
Web Interface: React 19.x-based chatbot interface (Port 3001)

Node.js 22.x runtime

No-Code Builder: ReactFlow 12.4.3 integration

API Gateway: Kong 3.9.0 with Konga admin UI

Realtime: Socket.IO 4.7.4 token streaming

Dapr JS SDK for state management and pub/sub

mermaid
Copy
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
2. AI Agent Layer
Framework: CrewAI 0.102.0

LLMs: GPT-4, OpenAI, or custom models

Python 3.12.2 with FastAPI 0.115.8 backend

Dynamic LLM switching with YAML configuration

Dapr 1.14 Python SDK for service communication

mermaid
Copy
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
3. Data Layer
PostgreSQL 17.0 with pgvector extension

Core relational data

Vector embeddings storage

JSONB document storage

Full-text search capabilities

Redis 7.4 for:

Dapr state store

Pub/sub messaging

Session management

Real-time features

Caching layer

4. Integration Layer
Data Ingestion and Export

CRM Systems (Salesforce, Dynamics 365, HubSpot)

Database Connectors (Oracle, MySQL, PostgreSQL, MongoDB)

Third-party APIs (RESTful, GraphQL)

File Systems (S3, SFTP, Local)

Protocol Adapters

REST/GraphQL Gateway

JDBC/ODBC Connections

Message Queue Integration (Kafka, RabbitMQ)

SOAP/XML Services

Data Processing

Schema Validation

Data Transformation

Format Conversion

Error Handling

Security

API Key Management

OAuth Integration

Data Encryption

Audit Logging

5. Dapr 1.14 Building Blocks
State Management: Redis-backed state store

Pub/Sub Messaging: Redis pub/sub component

Service Invocation: Dapr-to-Dapr communication

Secrets Management: Local file-based secret store

Built-in observability and resilience

Distributed tracing and metrics

Application Flow
mermaid
Copy
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
Getting Started
Prerequisites
Docker 25.0.2

Docker Compose 2.33.0

Python 3.12.2

Node.js 22.x

Dapr CLI 1.14 (for local development)

Keycloak 26+ for authentication and authorization

Environment Setup
Clone the repository:

bash
Copy
git clone https://github.com/your-org/workflow-platform.git
cd workflow-platform
Configure environment variables:

bash
Copy
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
Start the development environment:

bash
Copy
cd ../
docker-compose up -d
Access the services:

Frontend UI: http://localhost:3001

AI Agents API: http://localhost:9000

Kong Admin API: http://localhost:8001

Konga Dashboard: http://localhost:1337

Keycloak Admin: http://localhost:8080

Grafana Dashboard: http://localhost:3000 (admin/admin)

Prometheus: http://localhost:9090

PostgreSQL: localhost:5433

Redis: localhost:6379

Monitoring & Observability
mermaid
Copy
graph TD
    A[OpenTelemetry] --> B[Metrics]
    A --> C[Tracing]
    A --> D[Logging]
    
    B --> E[Prometheus]
    B --> F[Custom AI Metrics]
    
    C --> G[Distributed Tracing]
    C --> H[Dapr Integration]
    
    D --> I[Log Correlation]
    D --> J[Error Tracking]
    
    F --> K[LLM Latency]
    F --> L[Token Usage]
    F --> M[Error Rates]
    F --> N[Cost Analysis]
Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.

This version removes redundant sections, consolidates similar content, and ensures the document is concise and easy to navigate.