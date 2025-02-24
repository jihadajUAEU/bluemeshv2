#!/bin/bash

# Print colored output
print_info() {
    echo -e "\e[34m[INFO]\e[0m $1"
}

print_success() {
    echo -e "\e[32m[SUCCESS]\e[0m $1"
}

print_error() {
    echo -e "\e[31m[ERROR]\e[0m $1"
}

# Check for required tools
check_requirements() {
    print_info "Checking required tools..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    if ! command -v dapr &> /dev/null; then
        print_error "Dapr CLI is not installed. Please install Dapr first."
        exit 1
    fi

    print_success "All required tools are installed."
}

# Setup environment files
setup_env() {
    print_info "Setting up environment files..."

    if [ ! -f .env.development ]; then
        print_error ".env.development file not found!"
        exit 1
    fi

    # Create .env file from .env.development
    cp .env.development .env
    
    print_success "Environment files setup complete."
}

# Initialize Dapr
init_dapr() {
    print_info "Initializing Dapr..."
    
    dapr init
    
    print_success "Dapr initialization complete."
}

# Start infrastructure services
start_infrastructure() {
    print_info "Starting infrastructure services..."
    
    # Create required directories if they don't exist
    mkdir -p data-layer/database/migrations
    mkdir -p docker/kong
    mkdir -p security/keycloak
    mkdir -p dapr/config
    mkdir -p dapr/components/state
    mkdir -p dapr/components/pubsub

    # Start services with docker-compose
    docker-compose -f docker/docker-compose.yml up -d

    print_success "Infrastructure services started."
}

# Wait for services to be ready
wait_for_services() {
    print_info "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    until docker-compose -f docker/docker-compose.yml exec -T postgres pg_isready -U dbuser -d workflow_automation; do
        print_info "Waiting for PostgreSQL..."
        sleep 5
    done

    # Wait for Redis
    until docker-compose -f docker/docker-compose.yml exec -T redis redis-cli ping; do
        print_info "Waiting for Redis..."
        sleep 5
    done

    # Wait for Kong
    until curl -s http://localhost:8001/status > /dev/null; do
        print_info "Waiting for Kong..."
        sleep 5
    done

    # Wait for Keycloak
    until curl -s http://localhost:8080/health > /dev/null; do
        print_info "Waiting for Keycloak..."
        sleep 5
    done

    print_success "All services are ready!"
}

# Main setup process
main() {
    print_info "Starting setup process..."

    check_requirements
    setup_env
    init_dapr
    start_infrastructure
    wait_for_services

    print_success "Setup completed successfully!"
    print_info "You can now access:"
    print_info "- Kong Admin API: http://localhost:8001"
    print_info "- Keycloak Admin Console: http://localhost:8080"
    print_info "- Zipkin UI: http://localhost:9411"
}

# Run main function
main
