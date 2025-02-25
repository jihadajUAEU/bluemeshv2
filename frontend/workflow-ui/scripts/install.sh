#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Installing dependencies for Workflow UI...${NC}"

# Check for Node.js and npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: Node.js and npm are required but not installed.${NC}"
    exit 1
fi

# Verify Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
required_node="18.0.0"
if ! [ "$(printf '%s\n' "$required_node" "$NODE_VERSION" | sort -V | head -n1)" = "$required_node" ]; then
    echo -e "${RED}Error: Node.js version 18.0.0 or higher is required.${NC}"
    echo "Current version: $NODE_VERSION"
    exit 1
fi

# Clean install
echo -e "${BLUE}Cleaning previous installations...${NC}"
rm -rf node_modules package-lock.json

# First install TypeScript and types
echo -e "${BLUE}Installing TypeScript and core type definitions...${NC}"
npm install --save-dev --save-exact \
    typescript@5.3.3 \
    @types/node@20.11.0 \
    @types/react@18.2.48 \
    @types/react-dom@18.2.18

# Install testing related packages
echo -e "${BLUE}Installing testing packages...${NC}"
npm install --save-dev --save-exact \
    vitest@1.2.2 \
    @vitest/coverage-v8@1.2.2 \
    @vitest/ui@1.2.2 \
    jsdom@24.0.0 \
    @testing-library/react@14.2.1 \
    @testing-library/jest-dom@6.4.2 \
    @testing-library/user-event@14.5.2 \
    @testing-library/dom@9.3.4 \
    @types/testing-library__jest-dom@5.14.9

# Install remaining dependencies
echo -e "${BLUE}Installing remaining dependencies...${NC}"
npm install

# Create .npmrc if it doesn't exist
echo -e "${BLUE}Creating .npmrc...${NC}"
echo "save-exact=true" > .npmrc

# Run type check
echo -e "${BLUE}Running type check...${NC}"
npm run type-check

# Run lint
echo -e "${BLUE}Running lint...${NC}"
npm run lint

echo -e "${GREEN}Installation complete! 🎉${NC}"
echo -e "You can now run ${BLUE}npm run dev${NC} to start the development server."
