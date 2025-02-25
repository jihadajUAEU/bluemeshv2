# Workflow UI

The frontend application for the AI Workflow Management System built with React, TypeScript, and Vite.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

## Quick Start

```bash
# Run the setup script
./scripts/setup.sh

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
workflow-ui/
├── src/
│   ├── components/     # React components
│   │   └── workflow/  # Workflow-specific components
│   │       ├── nodes/ # Custom workflow nodes
│   │       └── edges/ # Custom workflow edges
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components
│   ├── services/      # API and service integrations
│   ├── store/         # Redux store configuration
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── test/          # Test setup and utilities
├── scripts/           # Build and setup scripts
└── .vscode/          # VSCode configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=workflow
VITE_KEYCLOAK_CLIENT_ID=workflow-ui
```

## Development

### Code Style

The project uses ESLint and Prettier for code formatting. Configuration files are included in the repository. VSCode will automatically format code on save if you have the recommended extensions installed.

### Type Checking

TypeScript is configured with strict mode enabled. Run type checking with:

```bash
npm run type-check
```

### Testing

Tests are written using Vitest and React Testing Library. Run tests with:

```bash
npm run test
```

View test coverage with:

```bash
npm run test:coverage
```

### Git Hooks

The project uses Git hooks to ensure code quality:

- Pre-commit: Runs linting and type checking
- Pre-push: Runs tests and builds the project

### VSCode Extensions

Required extensions are listed in `.vscode/extensions.json`. Install them by opening VSCode command palette and running:

```
Extensions: Show Recommended Extensions
```

## Debugging

Launch configurations for VSCode are provided in `.vscode/launch.json`. You can:

1. Debug the Vite dev server
2. Debug the application in Chrome
3. Debug tests

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and type checking
4. Create a pull request

## Troubleshooting

### Common Issues

1. **Type errors after installing new dependencies**
   - Run `npm run type-check` to verify types
   - Check if additional `@types/*` packages are needed

2. **Environment variables not working**
   - Ensure variables are prefixed with `VITE_`
   - Restart the development server

3. **Tests failing after changes**
   - Check test setup in `src/test/setup.ts`
   - Verify test environment in `vitest.config.ts`

### Support

For additional help:
1. Check the documentation in `docs/`
2. Open an issue on the repository
3. Contact the development team
