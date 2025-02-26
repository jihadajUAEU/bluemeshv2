#!/bin/bash

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." &>/dev/null && pwd)"

DOCKER_DIR="$PROJECT_ROOT/docker"
WORKFLOW_SERVICE_DIR="$PROJECT_ROOT/application-services/workflow-service"
CREW_SERVICE_DIR="$PROJECT_ROOT/ai-services/crew-service"
FRONTEND_DIR="$PROJECT_ROOT/frontend/workflow-ui"
LOG_FILE="$PROJECT_ROOT/startup.log"
DAPR_DIR="$PROJECT_ROOT/dapr"

# Initialize logging
exec > >(tee -a "$LOG_FILE") 2>&1

check_dependency() {
  if ! command -v $1 &> /dev/null; then
    echo "Error: $1 is required but not installed"
    exit 1
  fi
}

install_dependencies() {
  echo "Installing dependencies for all services..."
  
  echo "Installing Workflow Service dependencies..."
  (cd $WORKFLOW_SERVICE_DIR && npm install) || {
    echo "Error: Failed to install Workflow Service dependencies"
    exit 1
  }
  
  echo "Installing Frontend dependencies and running setup..."
  (cd $FRONTEND_DIR && {
    echo "Running setup script..."
    bash scripts/setup.sh
  }) || {
    echo "Error: Failed to run frontend setup"
    exit 1
  }
  
  echo "Setting up Python virtual environment..."
  (cd $CREW_SERVICE_DIR && {
    python -m venv venv &&
    . venv/Scripts/activate &&
    pip install -r requirements.txt
  }) || {
    echo "Error: Failed to set up Python environment"
    exit 1
  }
}

start_infrastructure() {
  echo "Starting infrastructure services..."
  cd "$DOCKER_DIR" && docker-compose up -d
  
  echo "Waiting for PostgreSQL to be ready..."
  until docker exec workflow-postgres pg_isready -U dbuser -d workflow_automation; do
    echo "PostgreSQL is not ready - sleeping 2 seconds"
    sleep 2
  done
  
  echo "Waiting for Redis to be ready..."
  until docker exec workflow-redis redis-cli -a redispassword ping; do
    echo "Redis is not ready - sleeping 2 seconds"
    sleep 2
  done
  
  echo "Waiting for Keycloak to be ready..."
  until curl -s -f http://localhost:8080/health; do
    echo "Keycloak is not ready - sleeping 5 seconds"
    sleep 5
  done
}

run_migrations() {
  echo "Running database migrations..."
  (cd $WORKFLOW_SERVICE_DIR && npm run db:migrate) || {
    echo "Error: Failed to run database migrations"
    exit 1
  }
}

wait_for_service() {
  local service_url=$1
  local service_name=$2
  echo "Waiting for $service_name to be ready..."
  until curl -s "$service_url"; do
    echo "$service_name is not ready - sleeping 2 seconds"
    sleep 2
  done
}

start_frontend() {
  echo "Starting Frontend Development Server..."
  (cd $FRONTEND_DIR && npm run dev) &
  
  # Wait for frontend to be ready
  until curl -s http://localhost:5173; do
    echo "Frontend is not ready - sleeping 2 seconds"
    sleep 2
  done
}

run_tests() {
  echo "Running system tests..."
  
  echo "Running Workflow Service tests..."
  docker exec workflow-service npm test
  
  echo "Running Crew Service tests..."
  docker exec crew-service pytest src/tests/
}

cleanup() {
  echo "Cleaning up processes..."
  cd "$DOCKER_DIR" && docker-compose down
}

# Set up cleanup trap
trap cleanup EXIT

# Main execution
check_dependency docker
check_dependency node
check_dependency npm

echo "Starting services..."
install_dependencies
cd "$DOCKER_DIR" && docker-compose up -d

# Wait for services to be ready
wait_for_service "http://localhost:3001/health" "Workflow Service"
wait_for_service "http://localhost:8000/health" "Crew Service"
start_frontend
run_tests

echo "All services started successfully!"
echo "Access endpoints:"
echo "- Frontend: http://localhost:5173"
echo "- Kong API Gateway: http://localhost:9000"
echo "- Keycloak Admin: http://localhost:8080"
echo "- Workflow Service: http://localhost:3001"
echo "- Crew Service: http://localhost:8000"
echo "- Zipkin Tracing: http://localhost:9411"
