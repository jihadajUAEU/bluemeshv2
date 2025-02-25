import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from ..agents.qa_agent import QAAgent
from crewai import Task
from ..config.settings import settings

class TestQAAgent:
    @pytest.fixture
    def mock_agent(self):
        mock = MagicMock()
        mock.execute = AsyncMock()
        return mock

    @pytest.fixture
    def qa_agent(self, mock_agent):
        agent = QAAgent()
        agent.agent = mock_agent
        return agent

    def test_initialization(self):
        """Test agent initialization with correct properties."""
        agent = QAAgent()
        
        assert agent.name == "QA Agent"
        assert agent.role == "Quality Assurance Engineer"
        assert agent.temperature == 0.1
        assert agent.model == settings.qa_model

    @pytest.mark.asyncio
    async def test_create_test_plan(self, qa_agent):
        """Test creation of comprehensive test plan."""
        data = {
            'implementations': [
                {'task_id': 'impl_1', 'code': 'test code'},
                {'task_id': 'impl_2', 'code': 'test code 2'}
            ],
            'architecture': {'components': []},
            'test_requirements': {'coverage': 80},
            'performance_requirements': {'latency': '100ms'}
        }
        
        plan = await qa_agent._create_test_plan(data)
        
        assert 'tasks' in plan
        # Should have 2 unit tests + integration + security + performance tests
        assert len(plan['tasks']) == 5
        assert all(isinstance(task, Task) for task in plan['tasks'])
        
        task_ids = [task.task_id for task in plan['tasks']]
        assert any('unit_test' in task_id for task_id in task_ids)
        assert 'integration_test' in task_ids
        assert 'security_test' in task_ids
        assert 'performance_test' in task_ids

    @pytest.mark.asyncio
    async def test_process_execution(self, qa_agent, mock_agent):
        """Test full process execution."""
        mock_agent.execute.side_effect = [
            "Unit Test Result 1",     # unit test 1
            "Unit Test Result 2",     # unit test 2
            "Integration Test Result", # integration test
            "Security Test Result",   # security test
            "Performance Test Result",# performance test
            "Test Report",           # report generation
            {'line_coverage': 80},   # coverage calculation
            "Recommendation 1\nRecommendation 2"  # recommendations
        ]
        
        data = {
            'implementations': [
                {'task_id': 'impl_1', 'code': 'test code'},
                {'task_id': 'impl_2', 'code': 'test code 2'}
            ]
        }
        
        result = await qa_agent.process(data)
        
        assert 'test_results' in result
        assert 'report' in result
        assert 'recommendations' in result
        assert 'plan' in result
        assert len(result['test_results']) == 5  # All test types
        assert isinstance(result['recommendations'], list)

    @pytest.mark.asyncio
    async def test_generate_test_report(self, qa_agent, mock_agent):
        """Test generation of test report with metrics."""
        mock_agent.execute.side_effect = [
            "Test Report Text",
            {'line_coverage': 85, 'branch_coverage': 75, 'function_coverage': 90}
        ]
        
        test_results = [
            {'task_id': 'test_1', 'status': 'passed'},
            {'task_id': 'test_2', 'status': 'failed'},
            {'task_id': 'test_3', 'status': 'warning'}
        ]
        
        report = await qa_agent._generate_test_report(test_results)
        
        assert 'summary' in report
        assert 'metrics' in report
        assert 'test_coverage' in report
        assert 'timestamp' in report

    @pytest.mark.asyncio
    async def test_calculate_metrics(self, qa_agent):
        """Test calculation of test metrics."""
        test_results = [
            {'status': 'passed'},
            {'status': 'passed'},
            {'status': 'failed'},
            {'status': 'warning'}
        ]
        
        metrics = await qa_agent._calculate_metrics(test_results)
        
        assert metrics['total_tests'] == 4
        assert metrics['passed_tests'] == 2
        assert metrics['failed_tests'] == 1
        assert metrics['warning_tests'] == 1
        assert metrics['pass_rate'] == 50.0

    def test_determine_test_status(self, qa_agent):
        """Test determination of test status from results."""
        assert qa_agent._determine_test_status("Test passed successfully") == 'passed'
        assert qa_agent._determine_test_status("Error: Test failed") == 'failed'
        assert qa_agent._determine_test_status("Warning: potential issue") == 'warning'

    @pytest.mark.asyncio
    async def test_calculate_coverage(self, qa_agent, mock_agent):
        """Test calculation of test coverage metrics."""
        mock_agent.execute.return_value = {
            'line_coverage': 85,
            'branch_coverage': 75,
            'function_coverage': 90
        }
        
        test_results = [{'task_id': 'test_1', 'status': 'passed'}]
        coverage = await qa_agent._calculate_coverage(test_results)
        
        assert 'line_coverage' in coverage
        assert 'branch_coverage' in coverage
        assert 'function_coverage' in coverage
        assert all(isinstance(v, (int, float)) for v in coverage.values())

    def test_structure_recommendations(self, qa_agent):
        """Test structuring of recommendations."""
        recommendations = [
            "Critical security vulnerability found",
            "Important: Improve test coverage",
            "Consider optimizing performance"
        ]
        
        structured = qa_agent._structure_recommendations(recommendations)
        
        assert len(structured) == 3
        assert all(key in structured[0] for key in ['id', 'recommendation', 'category', 'priority'])
        assert structured[0]['priority'] == 'high'  # Critical -> high priority
        assert structured[0]['category'] == 'security'

    def test_determine_recommendation_category(self, qa_agent):
        """Test categorization of recommendations."""
        assert qa_agent._determine_recommendation_category("Fix security vulnerability") == 'security'
        assert qa_agent._determine_recommendation_category("Improve performance") == 'performance'
        assert qa_agent._determine_recommendation_category("Add more test cases") == 'testing'
        assert qa_agent._determine_recommendation_category("Generic improvement") == 'general'

    def test_determine_recommendation_priority(self, qa_agent):
        """Test priority determination for recommendations."""
        assert qa_agent._determine_recommendation_priority("Critical issue found") == 'high'
        assert qa_agent._determine_recommendation_priority("Important improvement needed") == 'medium'
        assert qa_agent._determine_recommendation_priority("Minor enhancement") == 'low'

    @pytest.mark.asyncio
    async def test_error_handling(self, qa_agent, mock_agent):
        """Test error handling during QA process."""
        mock_agent.execute.side_effect = Exception("Test execution failed")
        
        data = {
            'implementations': [{'task_id': 'impl_1', 'code': 'test code'}]
        }
        
        with pytest.raises(Exception) as exc_info:
            await qa_agent.process(data)
            
        assert "Test execution failed" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_empty_implementations_handling(self, qa_agent):
        """Test handling of empty implementations list."""
        data = {'implementations': []}
        
        plan = await qa_agent._create_test_plan(data)
        assert len([t for t in plan['tasks'] if 'unit_test' in t.task_id]) == 0
        assert len(plan['tasks']) == 3  # Should still have integration, security, performance tests
