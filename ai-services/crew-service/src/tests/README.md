# Testing Strategy

This directory contains all tests for the AI Crew Service. The testing suite is designed to ensure comprehensive coverage of all service components while maintaining clear organization and structure.

## Test Organization

```
tests/
├── __init__.py
├── test_service.py           # API endpoint tests
├── test_workflow_crew.py     # Workflow orchestration tests
├── test_base_agent.py        # Base agent functionality tests
├── test_research_agent.py    # Research agent specific tests
├── test_analysis_agent.py    # Analysis agent specific tests
├── test_implementation_agent.py  # Implementation agent specific tests
└── test_qa_agent.py         # QA agent specific tests
```

## Test Categories

- **Unit Tests**: Individual component testing (`@pytest.mark.unit`)
- **Integration Tests**: Component interaction testing (`@pytest.mark.integration`)
- **Workflow Tests**: End-to-end workflow testing (`@pytest.mark.workflow`)
- **Async Tests**: Tests for asynchronous operations (`@pytest.mark.asyncio`)

## Setup and Configuration

### Prerequisites
- Python 3.9+
- pytest and plugins (see requirements.txt)
- Running test dependencies (Redis, if needed)

### Configuration
- Test settings are managed in `pytest.ini`
- Environment variables for testing are set in `pytest.ini`
- Mock LLM provider is used in test environment

### Running Tests

```bash
# Run all tests
pytest

# Run specific test categories
pytest -m unit
pytest -m integration
pytest -m workflow

# Run with coverage report
pytest --cov=src

# Run tests in parallel
pytest -n auto

# Run specific test file
pytest test_workflow_crew.py
```

## Testing Conventions

### Test Structure
1. **Arrange**: Set up test data and dependencies
2. **Act**: Execute the functionality being tested
3. **Assert**: Verify the results

### Mocking
- Use `pytest-mock` for function/method mocking
- Use `AsyncMock` for async function mocking
- Mock external services and LLM calls

### Fixtures
- Common fixtures are in `conftest.py`
- Agent-specific fixtures in respective test files
- Use `@pytest.fixture` for reusable test setup

### Assertions
- Use descriptive assertion messages
- Test both positive and negative cases
- Verify state changes and side effects

## Coverage Requirements

- Minimum overall coverage: 80%
- Critical components (workflow, agents): 90%
- Coverage reports generated in HTML and terminal

## Best Practices

1. **Test Independence**
   - Each test should be independent and self-contained
   - Clean up resources after tests
   - Don't rely on test execution order

2. **Mock External Dependencies**
   - Always mock LLM calls
   - Mock external services and APIs
   - Use appropriate scoping for mocks

3. **Naming Conventions**
   - Test files: `test_*.py`
   - Test classes: `Test*`
   - Test functions: `test_*`
   - Clear, descriptive test names

4. **Asynchronous Testing**
   - Use `@pytest.mark.asyncio` for async tests
   - Properly handle async fixtures
   - Mock async dependencies appropriately

5. **Error Handling**
   - Test error cases and edge conditions
   - Verify error messages and types
   - Test recovery scenarios

## Adding New Tests

1. Create test file in appropriate location
2. Import required fixtures and dependencies
3. Add appropriate markers
4. Follow existing patterns for similar components
5. Update coverage if needed
6. Document any special setup requirements

## CI/CD Integration

Tests are run:
- On every pull request
- Before deployment to staging
- As part of release validation

## Troubleshooting

Common issues and solutions:
- **Async Test Failures**: Ensure proper async/await usage and timeout settings
- **Coverage Issues**: Check excluded paths and branch coverage
- **Mock Issues**: Verify mock setup and replacement
- **Resource Cleanup**: Ensure proper fixture cleanup
