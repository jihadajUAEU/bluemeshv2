import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from ..agents.implementation_agent import ImplementationAgent
from crewai import Task
from ..config.settings import settings

class TestImplementationAgent:
    @pytest.fixture
    def mock_agent(self):
        mock = MagicMock()
        mock.execute = AsyncMock()
        return mock

    @pytest.fixture
    def implementation_agent(self, mock_agent):
        agent = ImplementationAgent()
        agent.agent = mock_agent
        return agent

    def test_initialization(self):
        """Test agent initialization with correct properties."""
        agent = ImplementationAgent()
        
        assert agent.name == "Implementation Agent"
        assert agent.role == "Software Engineer"
        assert agent.temperature == 0.2
        assert agent.model == settings.implementation_model
        assert set(agent.supported_languages) == {'python', 'typescript', 'javascript', 'sql'}

    @pytest.mark.asyncio
    async def test_create_implementation_plan(self, implementation_agent, mock_agent):
        """Test implementation plan creation."""
        mock_architecture = {
            'components': [
                {
                    'name': 'Frontend',
                    'description': 'UI Component',
                    'type': 'frontend',
                    'dependencies': ['api'],
                    'interfaces': ['REST']
                },
                {
                    'name': 'Backend',
                    'description': 'API Service',
                    'type': 'backend',
                    'dependencies': ['database'],
                    'interfaces': ['REST']
                }
            ]
        }
        mock_agent.execute.return_value = mock_architecture
        
        data = {
            'requirements': {'feature': 'test'},
            'constraints': {'time': 'limited'},
            'recommendations': ['use typescript']
        }
        
        plan = await implementation_agent._create_implementation_plan(data)
        
        assert 'architecture' in plan
        assert 'tasks' in plan
        assert len(plan['tasks']) == 2
        assert isinstance(plan['tasks'][0], Task)
        assert isinstance(plan['tasks'][1], Task)

    @pytest.mark.asyncio
    async def test_process_execution(self, implementation_agent, mock_agent):
        """Test full process execution."""
        # Mock all necessary agent.execute calls
        mock_agent.execute.side_effect = [
            {'components': [{'name': 'Test', 'type': 'frontend'}]},  # architecture
            'Generated Code 1',  # implementation
            'Test Code 1',      # tests
            'API Documentation',# api docs
            'Implementation Guide'  # implementation guide
        ]
        
        data = {
            'requirements': {'feature': 'test'},
            'constraints': {},
            'recommendations': []
        }
        
        result = await implementation_agent.process(data)
        
        assert 'implementations' in result
        assert 'tests' in result
        assert 'documentation' in result
        assert 'plan' in result
        assert len(result['implementations']) == 1
        assert len(result['tests']) == 1
        assert 'api_documentation' in result['documentation']
        assert 'implementation_guide' in result['documentation']

    @pytest.mark.asyncio
    async def test_generate_tests(self, implementation_agent, mock_agent):
        """Test test generation for implementations."""
        mock_agent.execute.return_value = 'Generated Test Code'
        
        implementations = [
            {
                'task_id': 'impl_1',
                'code': 'function test() {}',
                'language': 'typescript'
            }
        ]
        
        tests = await implementation_agent._generate_tests(implementations)
        
        assert len(tests) == 1
        assert tests[0]['implementation_id'] == 'impl_1'
        assert tests[0]['test_code'] == 'Generated Test Code'
        assert tests[0]['language'] == 'typescript'

    @pytest.mark.asyncio
    async def test_generate_documentation(self, implementation_agent, mock_agent):
        """Test documentation generation."""
        mock_agent.execute.side_effect = [
            'API Documentation',
            'Implementation Guide'
        ]
        
        implementations = [{'task_id': 'test', 'code': 'code'}]
        architecture = {'components': []}
        
        docs = await implementation_agent._generate_documentation(implementations, architecture)
        
        assert 'api_documentation' in docs
        assert 'implementation_guide' in docs
        assert 'architecture_overview' in docs

    def test_determine_language(self, implementation_agent):
        """Test language determination based on component type."""
        frontend_component = {'type': 'frontend', 'name': 'UI'}
        backend_component = {'type': 'backend', 'name': 'API'}
        database_component = {'type': 'database', 'name': 'DB'}
        unknown_component = {'type': 'unknown', 'name': 'Test'}
        
        assert implementation_agent._determine_language(frontend_component) == 'typescript'
        assert implementation_agent._determine_language(backend_component) == 'python'
        assert implementation_agent._determine_language(database_component) == 'sql'
        assert implementation_agent._determine_language(unknown_component) == 'typescript'

    @pytest.mark.asyncio
    async def test_validate_implementation(self, implementation_agent, mock_agent):
        """Test implementation validation."""
        mock_agent.execute.return_value = "No vulnerabilities found"
        
        implementation = {
            'task_id': 'test_impl',
            'code': 'function test() {}',
            'language': 'typescript'
        }
        
        validation = await implementation_agent.validate_implementation(implementation)
        
        assert validation['implementation_id'] == 'test_impl'
        assert validation['validation_result'] == "No vulnerabilities found"
        assert validation['passed'] is True

        # Test failed validation
        mock_agent.execute.return_value = "Found security vulnerabilities"
        validation = await implementation_agent.validate_implementation(implementation)
        assert validation['passed'] is False

    @pytest.mark.asyncio
    async def test_error_handling(self, implementation_agent, mock_agent):
        """Test error handling during implementation."""
        mock_agent.execute.side_effect = Exception("Implementation failed")
        
        data = {
            'requirements': {'feature': 'test'},
            'constraints': {},
            'recommendations': []
        }
        
        with pytest.raises(Exception) as exc_info:
            await implementation_agent.process(data)
            
        assert "Implementation failed" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_empty_component_handling(self, implementation_agent, mock_agent):
        """Test handling of empty component list."""
        mock_agent.execute.return_value = {'components': []}
        
        data = {
            'requirements': {},
            'constraints': {},
            'recommendations': []
        }
        
        plan = await implementation_agent._create_implementation_plan(data)
        assert len(plan['tasks']) == 0

    def test_unsupported_language_handling(self, implementation_agent):
        """Test handling of unsupported language components."""
        component = {'type': 'special', 'language': 'ruby'}
        
        # Should return typescript as default
        assert implementation_agent._determine_language(component) == 'typescript'
