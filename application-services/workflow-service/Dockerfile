FROM node:20-slim

# Create directory structure to match project layout
WORKDIR /workspace
RUN mkdir -p application-services/workflow-service

# Copy base TypeScript config to root level
COPY tsconfig.base.json ./tsconfig.base.json

# Set working directory to service folder
WORKDIR /workspace/application-services/workflow-service

# Copy package files
COPY application-services/workflow-service/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY application-services/workflow-service/. .

# Build TypeScript
RUN npm run build

# Expose the service port
EXPOSE 3001

# Start the service with Dapr
CMD ["npm", "run", "dev:service"]
