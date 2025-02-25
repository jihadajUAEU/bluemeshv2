#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Workflow UI...${NC}"

# Create necessary project structure
echo -e "${BLUE}Creating project structure...${NC}"
mkdir -p src/{components,hooks,layouts,services,store,types,utils}
mkdir -p src/components/workflow/{nodes,edges}
mkdir -p src/test
mkdir -p .vscode

# Run installation script
echo -e "${BLUE}Running installation script...${NC}"
bash scripts/install.sh

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=workflow
VITE_KEYCLOAK_CLIENT_ID=workflow-ui
EOF
fi

if [ ! -f .env.development ]; then
    echo -e "${BLUE}Creating development environment file...${NC}"
    cat > .env.development << 'EOF'
VITE_API_URL=http://localhost:3000/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=workflow
VITE_KEYCLOAK_CLIENT_ID=workflow-ui
EOF
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo -e "${BLUE}Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build
/dist

# misc
.DS_Store
*.pem
.env.local
.env.development.local
.env.test.local
.env.production.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# typescript
*.tsbuildinfo

# Editor directories and files
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
!.vscode/launch.json
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF
fi

# Set up Git hooks
if command -v git &> /dev/null && [ -d .git ]; then
    echo -e "${BLUE}Setting up Git hooks...${NC}"
    
    # Create pre-commit hook
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run lint
npm run type-check
EOF
    chmod +x .git/hooks/pre-commit

    # Create pre-push hook
    cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
npm run test
npm run build
EOF
    chmod +x .git/hooks/pre-push
fi

# Run initial checks
echo -e "${BLUE}Running initial checks...${NC}"
npm run type-check
npm run lint

echo -e "${GREEN}Setup complete! 🎉${NC}"
echo -e "You can now start the development server with: ${BLUE}npm run dev${NC}"
echo -e "The application will be available at: ${BLUE}http://localhost:5173${NC}"

# Print manual steps if any are needed
echo -e "\n${BLUE}Additional setup steps you may need:${NC}"
echo "1. Configure your IDE with the provided settings"
echo "2. Set up your Keycloak instance and update the environment variables"
echo "3. Make sure the backend services are running"
echo -e "4. Check the README.md for more detailed instructions\n"
