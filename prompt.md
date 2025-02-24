# AI-Powered Workflow Automation Platform - Code Generation Prompt

Generate source code for an AI-Powered Workflow Automation Platform with the following specifications:

1. Architecture:
   Technology Stack (All Open Source):
   - Frontend Layer: React 19.x with ReactFlow (MIT License)
   - API Gateway: Kong Community Edition 3.9.0 (Apache 2.0)
   - Backend Services: Node.js 22.x/TypeScript 5.3 (MIT License)
   - AI Layer: CrewAI 0.102.0 with Python 3.12.9 (MIT License)
   - Data Layer: PostgreSQL 17.0 (PostgreSQL License) + Redis 7.4 OSS
   - Integration Layer: Dapr 1.14 (Apache 2.0)

   Additional optimizations:
   - Unified security through Keycloak 26+ Community Edition (Apache 2.0)
   - Distributed Redis OSS Cluster with Sentinel
   - Independent AI layer scaling with Kubernetes HPA (Apache 2.0)
   - Advanced circuit breaker patterns using Dapr resiliency

2. Key Requirements:
   - Distributed application runtime using Dapr 1.14:
     * Service invocation using latest Dapr SDK
     * Dapr sidecar with advanced configuration
     * Service discovery with DNS and mDNS
     * Secrets management with HashiCorp Vault (OSS)
     * OpenTelemetry observability integration
     * Pluggable component model for extensibility
     * Multi-container debugging support
   - Multi-LLM orchestration
   - Real-time response streaming
   - Enterprise-grade security
   - HIPAA & GDPR compliance
   
   Additional requirements:
   - Centralized authentication/authorization through Keycloak CE
   - Distributed caching with write-through/write-behind strategy
   - Resilient integration layer with circuit breakers
   - Optimized compliance checking

3. Essential Features:
   - Advanced workflow builder with ReactFlow
   - AI agent orchestration with CrewAI latest features:
     * Advanced agent communication patterns
     * Dynamic task allocation
     * Parallel task execution
     * Agent memory management
     * Custom tool integration
   - Dapr Runtime Features (v1.14):
     * Pub/sub with Redis Streams, Apache Kafka, RabbitMQ
     * State management with Redis OSS
     * Bindings for cloud services
     * Actor model for stateful services
     * Pluggable middleware chain
     * Custom component development
   - Secure data handling with encryption
   - Audit logging and compliance tracking
   
   Additional features:
   - Asynchronous compliance validation
   - Cached GDPR consent management
   - Intelligent cache invalidation
   - Resilient error handling with retries

4. Security Requirements:
   Modern approach:
   - Keycloak CE 26+ integration:
     * OpenID Connect with PKCE
     * OAuth 2.1 implementations
     * Advanced token management
     * Fine-grained permissions
     * User federation with LDAP/AD
   - Dapr security features:
     * mTLS with automatic certificate rotation
     * Integration with Keycloak JWT validation
     * HashiCorp Vault OSS integration
     * Zero-trust security model
     * Custom authorization middleware
   - Cached permission checks
   - Periodic compliance validation
   - Batched audit logging

5. Integration Points:
   Modern approach:
   - Kong Gateway CE Integration:
     * Basic rate limiting with Redis
     * JWT authentication and validation
     * GraphQL support
     * Service mesh integration
     * Custom plugin development
   - Dapr Integration Features:
     * Standardized service invocation
     * Multi-protocol support (gRPC/HTTP)
     * Built-in service discovery
     * Distributed tracing with OpenTelemetry
     * Cross-cutting concerns middleware
   - External Systems:
     * Cloud provider native bindings
     * Legacy system adapters
     * Event-driven integrations
     * Data transformation pipelines

6. Testing Strategy:
   Modern Testing Approach:
   - Automated Testing Pipelines:
     * Unit tests with Python 3.12.9 pytest (MIT License)
     * Integration tests with TestContainers (MIT License)
     * End-to-end tests with Cypress (MIT License)
     * Load testing with k6 (AGPL-3.0)
     * Chaos testing with Chaos Mesh (Apache 2.0)
   - Security Testing:
     * SAST with SonarQube Community Edition (LGPL-3.0)
     * DAST with OWASP ZAP (Apache 2.0)
     * Container scanning with Trivy (Apache 2.0)
     * Dependency scanning with OWASP Dependency-Check (Apache 2.0)
   - Compliance Testing:
     * HIPAA compliance validation
     * GDPR requirements testing
     * PCI DSS security testing
     * SOC2 controls verification

7. Performance Optimizations:
   - Redis OSS Features:
     * Redis Cluster sharding
     * Redis Sentinel for HA
     * RediSearch module
     * RedisTimeSeries module
     * Redis Bloom filters
   - Caching Strategies:
     * Multi-level caching (L1/L2)
     * Cache coherence protocols
     * Intelligent cache warming
     * Cache-aside pattern
     * Cache invalidation queues
   - Async Operations:
     * Event sourcing with Apache Kafka
     * Background job processing with Bull
     * Batch processing optimization
     * Scheduled task management
     * Dead letter queue handling

8. Resilience Patterns:
   - Dapr Resiliency Features:
     * Circuit breakers with custom policies
     * Retry with jitter and backoff
     * Rate limiting and bulkheading
     * Timeout management
     * Fallback strategies
   - Kong Gateway CE Resilience:
     * Health checks and circuit breaking
     * Automatic failover
     * Load balancing algorithms
     * Traffic splitting
     * Canary deployments
   - Database Resilience:
     * Connection pooling with PgBouncer
     * PostgreSQL streaming replication
     * Automated failover with Patroni
     * WAL-G for backups (Apache 2.0)
     * Point-in-time recovery
   - Application Resilience:
     * Graceful degradation
     * Feature toggles with Unleash CE
     * Bulkhead isolation
     * Throttling
     * Cache fallbacks
