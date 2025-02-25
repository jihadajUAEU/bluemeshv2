import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime

from ..api.service import app, WorkflowCrew
from ..config.settings import settings

# Test client
client = TestClient(app)

# Mock data
TEST_WORKFLOW_ID = "test-workflow-123"
TEST_INPUT_DATA = {
    "topic": "Test Research Topic",
    "questions": ["What are the key aspects?", "What are the challenges?"],
    "context": {
        "domain": "software engineering",
        "complexity": "high"
    }
}

@pytest.fixture
def mock_workflow_crew():
    with patch('src.api.service.WorkflowCrew') as mock:
        # Mock the execute_workflow method
        mock.return_value.execute_workflow = AsyncMock(return_value={
            'status': 'completed',
            'execution_results': {
                'research': {
                    'summary': {
                        'key_findings': ['Finding 1', 'Finding 2']
                    }
                },
                'analysis': {
                    'insights': {
                        'key_insights': ['Insight 1', 'Insight 2']
                    }
                }
            },
            'final_report': {
                'summary': {
                    'implementation_status': 'successful'
                }
            }
        })
        yield mock

@pytest.fixture
def mock_publish_event():
    with patch('src.api.service.publish_event') as mock:
        mock.return_value = AsyncMock()
        yield mock

def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'

@pytest.mark.asyncio
async def test_execute_workflow(mock_workflow_crew, mock_publish_event):
    """Test workflow execution endpoint."""
    response = client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": TEST_WORKFLOW_ID,
            "input_data": TEST_INPUT_DATA
        }
    )
    
    assert response.status_code == 200
    assert response.json()['workflow_id'] == TEST_WORKFLOW_ID
    assert response.json()['status'] == 'initializing'

@pytest.mark.asyncio
async def test_get_workflow_status():
    """Test getting workflow status."""
    # First start a workflow
    client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": TEST_WORKFLOW_ID,
            "input_data": TEST_INPUT_DATA
        }
    )
    
    # Then get its status
    response = client.get(f"/api/v1/workflows/{TEST_WORKFLOW_ID}/status")
    assert response.status_code == 200
    assert response.json()['workflow_id'] == TEST_WORKFLOW_ID

def test_get_nonexistent_workflow_status():
    """Test getting status of non-existent workflow."""
    response = client.get("/api/v1/workflows/nonexistent-id/status")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_workflow_status_update():
    """Test workflow status update endpoint."""
    # First start a workflow
    client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": TEST_WORKFLOW_ID,
            "input_data": TEST_INPUT_DATA
        }
    )
    
    # Then update its status
    response = client.post(
        "/api/v1/workflows/status/update",
        json={
            "workflow_id": TEST_WORKFLOW_ID,
            "phase": "analysis",
            "progress": 50.0
        }
    )
    
    assert response.status_code == 200
    
    # Verify status was updated
    status_response = client.get(f"/api/v1/workflows/{TEST_WORKFLOW_ID}/status")
    assert status_response.json()['current_phase'] == 'analysis'
    assert status_response.json()['progress'] == 50.0

@pytest.mark.asyncio
async def test_metrics():
    """Test metrics endpoint."""
    # Start a few workflows with different statuses
    client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": "workflow-1",
            "input_data": TEST_INPUT_DATA
        }
    )
    client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": "workflow-2",
            "input_data": TEST_INPUT_DATA
        }
    )
    
    # Update statuses
    client.post(
        "/api/v1/workflows/status/update",
        json={
            "workflow_id": "workflow-1",
            "status": "completed"
        }
    )
    client.post(
        "/api/v1/workflows/status/update",
        json={
            "workflow_id": "workflow-2",
            "status": "failed"
        }
    )
    
    # Get metrics
    response = client.get("/metrics")
    assert response.status_code == 200
    metrics = response.json()
    
    assert metrics['total_workflows'] > 0
    assert 'completed_workflows' in metrics
    assert 'failed_workflows' in metrics
    assert 'success_rate' in metrics

@pytest.mark.asyncio
async def test_duplicate_workflow_execution():
    """Test starting duplicate workflow."""
    # Start first workflow
    client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": TEST_WORKFLOW_ID,
            "input_data": TEST_INPUT_DATA
        }
    )
    
    # Try to start another with same ID
    response = client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": TEST_WORKFLOW_ID,
            "input_data": TEST_INPUT_DATA
        }
    )
    
    assert response.status_code == 409

@pytest.mark.asyncio
async def test_workflow_execution_with_config():
    """Test workflow execution with custom configuration."""
    custom_config = {
        "max_retries": 5,
        "timeout": 300,
        "model_settings": {
            "temperature": 0.7
        }
    }
    
    response = client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": "workflow-with-config",
            "input_data": TEST_INPUT_DATA,
            "config": custom_config
        }
    )
    
    assert response.status_code == 200
    assert response.json()['workflow_id'] == "workflow-with-config"

@pytest.mark.asyncio
async def test_dapr_subscriptions():
    """Test Dapr subscription endpoint."""
    response = client.get("/dapr/subscribe")
    assert response.status_code == 200
    
    subscriptions = response.json()
    assert len(subscriptions) > 0
    assert subscriptions[0]['pubsubname'] == "pubsub"
    assert subscriptions[0]['topic'] == "workflow.status.update"
    assert subscriptions[0]['route'] == "/api/v1/workflows/status/update"

@pytest.mark.asyncio
async def test_workflow_error_handling(mock_workflow_crew):
    """Test error handling during workflow execution."""
    # Mock workflow execution to raise an error
    mock_workflow_crew.return_value.execute_workflow = AsyncMock(
        side_effect=Exception("Test error")
    )
    
    # Start workflow
    client.post(
        "/api/v1/workflows/execute",
        json={
            "workflow_id": "error-workflow",
            "input_data": TEST_INPUT_DATA
        }
    )
    
    # Wait for error state
    response = client.get("/api/v1/workflows/error-workflow/status")
    assert response.status_code == 200
    assert response.json()['status'] == 'failed'
    assert 'Test error' in response.json()['error']
