import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from ..agents.analysis_agent import AnalysisAgent
from crewai import Task
from ..config.settings import settings

class TestAnalysisAgent:
    @pytest.fixture
    def mock_agent(self):
        mock = MagicMock()
        mock.execute = AsyncMock()
        return mock

    @pytest.fixture
    def analysis_agent(self, mock_agent):
        agent = AnalysisAgent()
        agent.agent = mock_agent
        return agent

    def test_initialization(self):
        """Test agent initialization with correct properties."""
        agent = AnalysisAgent()
        
        assert agent.name == "Analysis Agent"
        assert agent.role == "Data Analyst"
        assert agent.temperature == 0.3
        assert agent.model == settings.analysis_model

    def test_create_analysis_tasks(self, analysis_agent):
        """Test creation of analysis tasks."""
        data = {
            "research_results": ["Finding 1", "Finding 2"],
            "patterns": ["Pattern A", "Pattern B"],
            "findings": ["Finding X", "Finding Y"]
        }
        
        tasks = analysis_agent._create_analysis_tasks(data)
        
        assert len(tasks) == 3  # Pattern, Impact, and Risk analysis tasks
        assert all(isinstance(task, Task) for task in tasks)
        assert set(task.task_id for task in tasks) == {
            "pattern_analysis",
            "impact_analysis",
            "risk_analysis"
        }

    @pytest.mark.asyncio
    async def test_process_execution(self, analysis_agent, mock_agent):
        """Test full process execution."""
        # Mock all necessary agent.execute calls
        mock_agent.execute.side_effect = [
            "Pattern Analysis Result",  # pattern_analysis task
            "Impact Analysis Result",   # impact_analysis task
            "Risk Analysis Result",     # risk_analysis task
            "Generated Insights",       # generate_insights task
            "Recommendation 1\nRecommendation 2",  # generate_recommendations task
            "HIGH",  # priority assessment for rec 1
            "MEDIUM",  # complexity assessment for rec 1
            "MEDIUM",  # priority assessment for rec 2
            "LOW",   # complexity assessment for rec 2
        ]
        
        data = {
            "research_results": ["Finding 1", "Finding 2"],
            "patterns": ["Pattern A", "Pattern B"],
            "findings": ["Finding X", "Finding Y"]
        }
        
        result = await analysis_agent.process(data)
        
        assert "analysis_results" in result
        assert "insights" in result
        assert "recommendations" in result
        assert len(result["analysis_results"]) == 3
        assert isinstance(result["recommendations"], list)
        assert all("priority" in rec for rec in result["recommendations"])
        assert all("implementation_complexity" in rec for rec in result["recommendations"])

    @pytest.mark.asyncio
    async def test_generate_insights(self, analysis_agent, mock_agent):
        """Test insight generation."""
        mock_agent.execute.return_value = "Insight 1\nInsight 2\nInsight 3"
        
        results = [
            {"task_id": "pattern_analysis", "result": "Pattern Result"},
            {"task_id": "impact_analysis", "result": "Impact Result"}
        ]
        
        insights = await analysis_agent._generate_insights(results)
        
        assert "key_insights" in insights
        assert "source_analyses" in insights
        assert len(insights["key_insights"]) == 3
        assert len(insights["source_analyses"]) == 2
        assert "pattern_analysis" in insights["source_analyses"]

    @pytest.mark.asyncio
    async def test_generate_recommendations(self, analysis_agent, mock_agent):
        """Test recommendation generation and processing."""
        mock_agent.execute.side_effect = [
            "Recommendation 1\nRecommendation 2",  # recommendations
            "HIGH",  # priority for rec 1
            "MEDIUM",  # complexity for rec 1
            "MEDIUM",  # priority for rec 2
            "LOW",    # complexity for rec 2
        ]
        
        insights = {
            "key_insights": ["Insight 1", "Insight 2"],
            "source_analyses": ["analysis_1", "analysis_2"]
        }
        
        recommendations = await analysis_agent._generate_recommendations(insights)
        
        assert len(recommendations) == 2
        assert all(isinstance(rec, dict) for rec in recommendations)
        assert all(key in recommendations[0] for key in [
            "id", "recommendation", "priority", "implementation_complexity", "source_insights"
        ])

    @pytest.mark.asyncio
    async def test_priority_assessment(self, analysis_agent, mock_agent):
        """Test priority assessment for recommendations."""
        mock_agent.execute.return_value = "HIGH"
        
        priority = await analysis_agent._assess_priority("Test recommendation")
        assert priority == "HIGH"
        
        # Verify task creation
        task_args = mock_agent.execute.call_args[0][0]
        assert task_args.task_id == "assess_priority"
        assert "Test recommendation" in task_args.description

    @pytest.mark.asyncio
    async def test_complexity_assessment(self, analysis_agent, mock_agent):
        """Test complexity assessment for recommendations."""
        mock_agent.execute.return_value = "MEDIUM"
        
        complexity = await analysis_agent._assess_complexity("Test recommendation")
        assert complexity == "MEDIUM"
        
        # Verify task creation
        task_args = mock_agent.execute.call_args[0][0]
        assert task_args.task_id == "assess_complexity"
        assert "Test recommendation" in task_args.description

    @pytest.mark.asyncio
    async def test_error_handling(self, analysis_agent, mock_agent):
        """Test error handling during analysis."""
        mock_agent.execute.side_effect = Exception("Analysis failed")
        
        data = {
            "research_results": ["Finding 1"],
            "patterns": ["Pattern A"],
            "findings": ["Finding X"]
        }
        
        with pytest.raises(Exception) as exc_info:
            await analysis_agent.process(data)
            
        assert "Analysis failed" in str(exc_info.value)

    def test_empty_input_handling(self, analysis_agent):
        """Test handling of empty input data."""
        empty_data = {}
        tasks = analysis_agent._create_analysis_tasks(empty_data)
        
        assert len(tasks) == 3  # Should still create all tasks, but with empty contexts
        assert all(task.context == {'research_findings': []} for task in tasks[:1])
        assert all(task.context == {'patterns': []} for task in tasks[1:2])
        assert all(task.context == {'findings': []} for task in tasks[2:])
