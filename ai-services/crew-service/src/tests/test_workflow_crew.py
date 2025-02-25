import pytest
from unittest.mock import AsyncMock, patch, MagicMock, call
from ..crew.workflow_crew import WorkflowCrew
from crewai import Crew

class TestWorkflowCrew:
    @pytest.fixture
    def mock_agents(self):
        return {
            'research': MagicMock(process=AsyncMock()),
            'analysis': MagicMock(process=AsyncMock()),
            'implementation': MagicMock(process=AsyncMock()),
            'qa': MagicMock(process=AsyncMock())
        }

    @pytest.fixture
    def workflow_crew(self, mock_agents):
        with patch('crewai.Crew'):
            crew = WorkflowCrew()
            crew.research_agent.process = mock_agents['research'].process
            crew.analysis_agent.process = mock_agents['analysis'].process
            crew.implementation_agent.process = mock_agents['implementation'].process
            crew.qa_agent.process = mock_agents['qa'].process
            return crew

    def test_initialization(self):
        """Test crew initialization and agent setup."""
        with patch('crewai.Crew') as mock_crew:
            crew = WorkflowCrew()
            
            assert hasattr(crew, 'research_agent')
            assert hasattr(crew, 'analysis_agent')
            assert hasattr(crew, 'implementation_agent')
            assert hasattr(crew, 'qa_agent')
            assert hasattr(crew, 'crew')
            
            mock_crew.assert_called_once()

    @pytest.mark.asyncio
    async def test_complete_workflow_execution(self, workflow_crew, mock_agents):
        """Test successful workflow execution through all phases."""
        # Mock agent responses
        mock_agents['research'].process.return_value = {'summary': {'key_findings': ['Finding 1']}}
        mock_agents['analysis'].process.return_value = {
            'insights': {'key_insights': ['Insight 1']},
            'recommendations': [{'id': 'REC_1', 'priority': 'high'}]
        }
        mock_agents['implementation'].process.return_value = {
            'implementations': [{'id': 'IMPL_1'}],
            'documentation': {'api_documentation': 'API docs'}
        }
        mock_agents['qa'].process.return_value = {
            'test_results': [{'status': 'passed'}],
            'report': {'metrics': {'coverage': 80}}
        }
        
        workflow_data = {'input': 'test data'}
        result = await workflow_crew.execute_workflow(workflow_data)
        
        assert result['status'] == 'completed'
        assert 'execution_time' in result
        assert 'execution_results' in result
        assert 'final_report' in result
        assert 'metrics' in result
        
        # Verify each phase was executed in order
        mock_agents['research'].process.assert_called_once()
        mock_agents['analysis'].process.assert_called_once()
        mock_agents['implementation'].process.assert_called_once()
        mock_agents['qa'].process.assert_called_once()

    @pytest.mark.asyncio
    async def test_progress_tracking(self, workflow_crew, mock_agents):
        """Test progress callback functionality."""
        progress_updates = []
        def progress_callback(phase, progress, message):
            progress_updates.append((phase, progress, message))
        
        workflow_crew.register_progress_callback(progress_callback)
        
        # Set up minimal successful responses
        for agent in mock_agents.values():
            agent.process.return_value = {}
        
        await workflow_crew.execute_workflow({'input': 'test'})
        
        # Verify progress updates
        assert len(progress_updates) > 0
        assert progress_updates[0][0] == 'research'
        assert progress_updates[0][1] == 0.0
        assert progress_updates[-1][0] == 'complete'
        assert progress_updates[-1][1] == 1.0

    @pytest.mark.asyncio
    async def test_error_handling(self, workflow_crew, mock_agents):
        """Test error handling during workflow execution."""
        mock_agents['research'].process.side_effect = Exception("Research failed")
        
        result = await workflow_crew.execute_workflow({'input': 'test'})
        
        assert result['status'] == 'failed'
        assert 'error' in result
        assert 'error_report' in result
        assert result['error_report']['phase'] == 'research'
        assert len(result['error_report']['recommendations']) > 0

    def test_implementation_status_determination(self, workflow_crew):
        """Test implementation status calculation."""
        # Test successful implementation
        workflow_crew.execution_results['qa'] = {
            'test_results': [
                {'status': 'passed'},
                {'status': 'passed'}
            ]
        }
        assert workflow_crew._get_implementation_status() == 'successful'
        
        # Test partial success
        workflow_crew.execution_results['qa'] = {
            'test_results': [
                {'status': 'passed'},
                {'status': 'passed'},
                {'status': 'failed'}
            ]
        }
        assert workflow_crew._get_implementation_status() == 'partial'
        
        # Test needs improvement
        workflow_crew.execution_results['qa'] = {
            'test_results': [
                {'status': 'failed'},
                {'status': 'failed'},
                {'status': 'passed'}
            ]
        }
        assert workflow_crew._get_implementation_status() == 'needs_improvement'

    @pytest.mark.asyncio
    async def test_recommendations_compilation(self, workflow_crew):
        """Test compilation and prioritization of recommendations."""
        workflow_crew.execution_results = {
            'analysis': {
                'recommendations': [
                    {'id': 'REC_1', 'priority': 'high', 'recommendation': 'Critical fix'},
                    {'id': 'REC_2', 'priority': 'low', 'recommendation': 'Minor improvement'}
                ]
            },
            'qa': {
                'recommendations': [
                    {'id': 'QA_1', 'priority': 'medium', 'recommendation': 'Add tests'}
                ]
            }
        }
        
        recommendations = await workflow_crew._compile_recommendations()
        
        assert len(recommendations) == 3
        assert recommendations[0]['priority'] == 'high'
        assert 'phase' in recommendations[0]

    @pytest.mark.asyncio
    async def test_next_steps_generation(self, workflow_crew):
        """Test next steps generation based on results."""
        workflow_crew.execution_results = {
            'qa': {
                'report': {
                    'test_coverage': {'line_coverage': 70},
                },
                'recommendations': [
                    {'category': 'security', 'priority': 'high', 'recommendation': 'Fix vulnerability'}
                ]
            }
        }
        
        next_steps = await workflow_crew._generate_next_steps()
        
        assert len(next_steps) > 0
        assert any('coverage' in step.lower() for step in next_steps)
        assert any('security' in step.lower() for step in next_steps)

    @pytest.mark.asyncio
    async def test_error_report_generation(self, workflow_crew):
        """Test error report generation with different error types."""
        # Test timeout error
        timeout_error = TimeoutError("Operation timed out")
        timeout_report = await workflow_crew._generate_error_report(timeout_error)
        assert any('timeout' in rec.lower() for rec in timeout_report['recommendations'])
        
        # Test memory error
        memory_error = MemoryError("Out of memory")
        memory_report = await workflow_crew._generate_error_report(memory_error)
        assert any('memory' in rec.lower() for rec in memory_report['recommendations'])
        
        # Test permission error
        permission_error = PermissionError("Access denied")
        permission_report = await workflow_crew._generate_error_report(permission_error)
        assert any('permission' in rec.lower() for rec in permission_report['recommendations'])

    @pytest.mark.asyncio
    async def test_metrics_calculation(self, workflow_crew):
        """Test workflow metrics calculation."""
        workflow_crew.execution_results = {
            'research': {'start_time': 100, 'end_time': 200},
            'analysis': {'start_time': 200, 'end_time': 300},
            'qa': {
                'report': {
                    'metrics': {'coverage': 80}
                }
            }
        }
        
        metrics = await workflow_crew._calculate_workflow_metrics()
        
        assert 'execution_time' in metrics
        assert metrics['execution_time']['research'] == 100
        assert metrics['execution_time']['analysis'] == 100
        assert 'quality_metrics' in metrics
        assert 'completion_status' in metrics
