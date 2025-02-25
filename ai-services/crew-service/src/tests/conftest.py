import pytest
from unittest.mock import AsyncMock, MagicMock
from typing import Dict, Any
import time

# Base mock responses for different agent types
MOCK_RESEARCH_RESPONSE = {
    'summary': {
        'key_findings': ['Finding 1', 'Finding 2'],
        'sources': ['Source 1', 'Source 2']
    }
}

MOCK_ANALYSIS_RESPONSE = {
    'insights': {
        'key_insights': ['Insight 1', 'Insight 2'],
        'patterns': ['Pattern 1', 'Pattern 2']
    },
    'recommendations': [
        {'id': 'REC_1', 'priority': 'high', 'recommendation': 'Critical fix needed'},
        {'id': 'REC_2', 'priority': 'medium', 'recommendation': 'Improvement suggested'}
    ]
}

MOCK_IMPLEMENTATION_RESPONSE = {
    'implementations': [
        {
            'task_id': 'impl_1',
            'code': 'function test() {}',
            'language': 'typescript'
        }
    ],
    'documentation': {
        'api_documentation': 'API Documentation',
        'implementation_guide': 'Implementation Guide'
    }
}

MOCK_QA_RESPONSE = {
    'test_results': [
        {'task_id': 'test_1', 'status': 'passed'},
        {'task_id': 'test_2', 'status': 'failed'}
    ],
    'report': {
        'metrics': {
            'coverage': 80,
            'passed_tests': 1,
            'failed_tests': 1
        }
    }
}

@pytest.fixture
def mock_llm():
    """Mock LLM provider."""
    mock = MagicMock()
    mock.generate = AsyncMock(return_value="Mock LLM Response")
    return mock

@pytest.fixture
def mock_workflow_data():
    """Sample workflow data for testing."""
    return {
        'input': 'test input',
        'requirements': {
            'feature': 'test feature',
            'constraints': {'time': 'limited'}
        },
        'context': {
            'domain': 'testing',
            'priority': 'high'
        }
    }

@pytest.fixture
def mock_research_agent():
    """Mock research agent with predefined responses."""
    agent = MagicMock()
    agent.process = AsyncMock(return_value=MOCK_RESEARCH_RESPONSE)
    return agent

@pytest.fixture
def mock_analysis_agent():
    """Mock analysis agent with predefined responses."""
    agent = MagicMock()
    agent.process = AsyncMock(return_value=MOCK_ANALYSIS_RESPONSE)
    return agent

@pytest.fixture
def mock_implementation_agent():
    """Mock implementation agent with predefined responses."""
    agent = MagicMock()
    agent.process = AsyncMock(return_value=MOCK_IMPLEMENTATION_RESPONSE)
    return agent

@pytest.fixture
def mock_qa_agent():
    """Mock QA agent with predefined responses."""
    agent = MagicMock()
    agent.process = AsyncMock(return_value=MOCK_QA_RESPONSE)
    return agent

@pytest.fixture
def mock_crew():
    """Mock CrewAI crew."""
    crew = MagicMock()
    crew.kickoff = AsyncMock(return_value="Crew execution result")
    return crew

@pytest.fixture
def mock_progress_callback():
    """Mock progress callback for workflow execution."""
    return MagicMock()

@pytest.fixture
def mock_error_callback():
    """Mock error callback for workflow execution."""
    return MagicMock()

@pytest.fixture
def mock_task_result():
    """Mock task execution result."""
    return {
        'task_id': 'test_task',
        'status': 'completed',
        'result': 'Task completed successfully',
        'metadata': {
            'execution_time': 1.5,
            'resources_used': ['LLM', 'Memory']
        }
    }

@pytest.fixture
def mock_test_environment(monkeypatch):
    """Set up test environment variables."""
    monkeypatch.setenv('TEST_ENV', 'true')
    monkeypatch.setenv('MODEL_PROVIDER', 'mock')
    monkeypatch.setenv('LOG_LEVEL', 'ERROR')

@pytest.fixture
def mock_time(monkeypatch):
    """Mock time for consistent timestamps in tests."""
    fixed_time = time.time()
    monkeypatch.setattr(time, 'time', lambda: fixed_time)
    return fixed_time

class MockResponse:
    """Mock HTTP response for API testing."""
    def __init__(self, data: Dict[str, Any], status_code: int = 200):
        self.data = data
        self.status_code = status_code

    async def json(self):
        return self.data

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

@pytest.fixture
def mock_http_client():
    """Mock HTTP client for API calls."""
    client = MagicMock()
    client.get = AsyncMock(return_value=MockResponse({'status': 'success'}))
    client.post = AsyncMock(return_value=MockResponse({'status': 'created'}))
    client.put = AsyncMock(return_value=MockResponse({'status': 'updated'}))
    client.delete = AsyncMock(return_value=MockResponse({'status': 'deleted'}))
    return client

@pytest.fixture
def mock_dapr_client():
    """Mock Dapr client."""
    client = MagicMock()
    client.invoke_method = AsyncMock(return_value={'status': 'success'})
    client.save_state = AsyncMock()
    client.get_state = AsyncMock(return_value={'value': 'test_state'})
    client.publish_event = AsyncMock()
    return client

@pytest.fixture(autouse=True)
def cleanup_after_test():
    """Cleanup fixture that runs after each test."""
    yield
    # Add any cleanup code here if needed
