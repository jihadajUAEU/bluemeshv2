import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from ..agents.base_agent import BaseAgent
from ..config.settings import settings

class TestBaseAgent:
    @pytest.fixture
    def mock_llm(self):
        return MagicMock()

    @pytest.fixture
    def base_agent(self, mock_llm):
        return BaseAgent(
            agent_id="test-agent",
            agent_type="base",
            llm=mock_llm
        )

    def test_initialization(self, base_agent):
        """Test agent initialization with basic properties."""
        assert base_agent.agent_id == "test-agent"
        assert base_agent.agent_type == "base"
        assert base_agent.status == "idle"
        assert base_agent.progress == 0

    @pytest.mark.asyncio
    async def test_initialize(self, base_agent):
        """Test agent initialization method."""
        context = {"key": "value"}
        await base_agent.initialize(context)
        assert base_agent.context == context
        assert base_agent.status == "initialized"

    @pytest.mark.asyncio
    async def test_process(self, base_agent):
        """Test abstract process method raises NotImplementedError."""
        with pytest.raises(NotImplementedError):
            await base_agent.process()

    def test_update_status(self, base_agent):
        """Test status update functionality."""
        base_agent.update_status("running", 50)
        assert base_agent.status == "running"
        assert base_agent.progress == 50

    def test_get_state(self, base_agent):
        """Test getting agent state."""
        base_agent.update_status("running", 75)
        state = base_agent.get_state()
        
        assert state["agent_id"] == "test-agent"
        assert state["agent_type"] == "base"
        assert state["status"] == "running"
        assert state["progress"] == 75

    @pytest.mark.asyncio
    async def test_error_handling(self, base_agent):
        """Test error handling during execution."""
        error_msg = "Test error"
        
        class TestError(Exception):
            pass
            
        @base_agent.handle_errors
        async def failing_function():
            raise TestError(error_msg)
            
        await failing_function()
        
        assert base_agent.status == "failed"
        assert base_agent.error == f"Error in base: {error_msg}"

    @pytest.mark.asyncio
    async def test_validate_input(self, base_agent):
        """Test input validation."""
        # Valid input
        valid_input = {"test_field": "value"}
        try:
            base_agent.validate_input(valid_input, required_fields=["test_field"])
        except ValueError:
            pytest.fail("Validation failed for valid input")

        # Invalid input (missing required field)
        invalid_input = {"wrong_field": "value"}
        with pytest.raises(ValueError):
            base_agent.validate_input(invalid_input, required_fields=["test_field"])

    @pytest.mark.asyncio
    async def test_log_progress(self, base_agent):
        """Test progress logging."""
        with patch('logging.Logger.info') as mock_logger:
            base_agent.log_progress("Test message", 50)
            
            assert base_agent.progress == 50
            mock_logger.assert_called_once()
            assert "Test message" in mock_logger.call_args[0][0]

    @pytest.mark.asyncio
    async def test_cleanup(self, base_agent):
        """Test cleanup method."""
        # Set some state
        base_agent.context = {"temp": "data"}
        base_agent.status = "running"
        base_agent.progress = 50
        
        await base_agent.cleanup()
        
        # Verify cleanup
        assert base_agent.context == {}
        assert base_agent.status == "idle"
        assert base_agent.progress == 0
        assert base_agent.error is None

    def test_validate_config(self, base_agent):
        """Test configuration validation."""
        # Valid config
        valid_config = {
            "max_retries": 3,
            "timeout": 300
        }
        try:
            base_agent.validate_config(valid_config)
        except ValueError:
            pytest.fail("Validation failed for valid config")

        # Invalid config (negative values)
        invalid_config = {
            "max_retries": -1,
            "timeout": 300
        }
        with pytest.raises(ValueError):
            base_agent.validate_config(invalid_config)

    @pytest.mark.asyncio
    async def test_retry_mechanism(self, base_agent):
        """Test retry mechanism for failed operations."""
        retry_count = 0
        max_retries = 3

        @base_agent.retry(max_retries=max_retries)
        async def failing_operation():
            nonlocal retry_count
            retry_count += 1
            raise Exception("Temporary failure")

        with pytest.raises(Exception):
            await failing_operation()

        assert retry_count == max_retries + 1  # Initial try + retries
