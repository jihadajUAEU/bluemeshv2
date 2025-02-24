#!/bin/bash

# Function to check if PostgreSQL is running
check_postgres() {
    pg_isready -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} > /dev/null 2>&1
    return $?
}

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    while ! check_postgres; do
        sleep 1
    done
    echo "PostgreSQL is ready!"
}

# Start the service with Dapr
start_service() {
    wait_for_postgres
    
    if [ "$NODE_ENV" = "development" ]; then
        dapr run \
            --app-id workflow-service \
            --app-port ${PORT:-3001} \
            --dapr-http-port ${DAPR_HTTP_PORT:-3500} \
            --dapr-grpc-port ${DAPR_GRPC_PORT:-50001} \
            --config ./dapr/config/config.yaml \
            --components-path ./dapr/components \
            npm run dev
    else
        dapr run \
            --app-id workflow-service \
            --app-port ${PORT:-3001} \
            --dapr-http-port ${DAPR_HTTP_PORT:-3500} \
            --dapr-grpc-port ${DAPR_GRPC_PORT:-50001} \
            --config ./dapr/config/config.yaml \
            --components-path ./dapr/components \
            npm start
    fi
}

# Run tests with Dapr
test_service() {
    NODE_ENV=test npm run test
}

# Handle different commands
case "$1" in
    "start")
        start_service
        ;;
    "test")
        test_service
        ;;
    *)
        echo "Usage: $0 {start|test}"
        exit 1
        ;;
esac
