@echo off
setlocal EnableDelayedExpansion

:: Configuration
set "DOCKER_DIR=docker"
set "WORKFLOW_SERVICE_DIR=application-services\workflow-service"
set "CREW_SERVICE_DIR=ai-services\crew-service"
set "FRONTEND_DIR=frontend\workflow-ui"
set "LOG_FILE=startup.log"

:: Create log file
echo Starting services... > %LOG_FILE%

:: Check dependencies
where docker >nul 2>&1 || (
    echo Error: docker is required but not installed
    exit /b 1
)
where node >nul 2>&1 || (
    echo Error: node is required but not installed
    exit /b 1
)
where npm >nul 2>&1 || (
    echo Error: npm is required but not installed
    exit /b 1
)

echo Installing dependencies for all services...

echo Installing Workflow Service dependencies...
cd %WORKFLOW_SERVICE_DIR%
call npm install
if errorlevel 1 (
    echo Error: Failed to install Workflow Service dependencies
    exit /b 1
)
cd ..\..

echo Installing Frontend dependencies...
cd %FRONTEND_DIR%
call npm install
if errorlevel 1 (
    echo Error: Failed to install Frontend dependencies
    exit /b 1
)
call npm run setup
if errorlevel 1 (
    echo Error: Failed to run frontend setup
    exit /b 1
)
cd ..\..

echo Installing Crew Service dependencies...
cd %CREW_SERVICE_DIR%
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install Crew Service dependencies
    exit /b 1
)
cd ..\..

echo Starting infrastructure services...
docker-compose -f %DOCKER_DIR%\docker-compose.yml up -d

echo Waiting for PostgreSQL to be ready...
:postgres_wait
docker exec workflow-postgres pg_isready -U dbuser -d workflow_automation >nul 2>&1
if errorlevel 1 (
    echo PostgreSQL is not ready - sleeping 2 seconds
    timeout /t 2 /nobreak >nul
    goto postgres_wait
)

echo Waiting for Redis to be ready...
:redis_wait
docker exec workflow-redis redis-cli -a redispassword ping >nul 2>&1
if errorlevel 1 (
    echo Redis is not ready - sleeping 2 seconds
    timeout /t 2 /nobreak >nul
    goto redis_wait
)

echo Waiting for Keycloak to be ready...
:keycloak_wait
curl -s -f http://localhost:8080/health >nul 2>&1
if errorlevel 1 (
    echo Keycloak is not ready - sleeping 5 seconds
    timeout /t 5 /nobreak >nul
    goto keycloak_wait
)

echo Running database migrations...
cd %WORKFLOW_SERVICE_DIR%
call npm run db:migrate
if errorlevel 1 (
    echo Error: Failed to run database migrations
    exit /b 1
)
cd ..\..

echo Waiting for Workflow Service to be ready...
:workflow_wait
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo Workflow service is not ready - sleeping 2 seconds
    timeout /t 2 /nobreak >nul
    goto workflow_wait
)

echo Waiting for Crew Service to be ready...
:crew_wait
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo Crew service is not ready - sleeping 2 seconds
    timeout /t 2 /nobreak >nul
    goto crew_wait
)

echo Starting Frontend Development Server...
start cmd /c "cd %FRONTEND_DIR% && npm run dev"

:frontend_wait
curl -s http://localhost:5173 >nul 2>&1
if errorlevel 1 (
    echo Frontend is not ready - sleeping 2 seconds
    timeout /t 2 /nobreak >nul
    goto frontend_wait
)

echo Running system tests...
echo Running Workflow Service tests...
docker exec workflow-service npm test

echo Running Crew Service tests...
docker exec crew-service pytest src/tests/

echo All services started successfully!
echo Access endpoints:
echo - Frontend: http://localhost:5173
echo - Kong API Gateway: http://localhost:9000
echo - Keycloak Admin: http://localhost:8080
echo - Workflow Service: http://localhost:3001
echo - Crew Service: http://localhost:8000
echo - Zipkin Tracing: http://localhost:9411

:: Keep the script running
pause
