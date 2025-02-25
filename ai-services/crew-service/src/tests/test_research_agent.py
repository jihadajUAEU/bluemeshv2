import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from ..agents.research_agent import ResearchAgent
from crewai import Task
from ..config.settings import settings

class TestResearchAgent:
    @pytest.fixture
    def mock_agent(self):
        mock = MagicMock()
        mock.execute = AsyncMock()
        return mock

    @pytest.fixture
    def research_agent(self, mock_agent):
        agent = ResearchAgent()
        agent.agent = mock_agent
        return agent

    def test_initialization(self):
        """Test agent initialization with correct properties."""
        agent = ResearchAgent()
        
        assert agent.name == "Research Agent"
        assert agent.role == "Research Specialist"
        assert agent.temperature == 0.7
        assert agent.model == settings.research_model

    def test_create_research_tasks_topics(self, research_agent):
        """Test creation of research tasks from topics."""
        data = {
            "topics": ["AI Ethics", "Machine Learning"],
            "categories": {
                "AI Ethics": "ethics",
                "Machine Learning": "technology"
            },
            "context": {"domain": "computer science"}
        }
        
        tasks = research_agent._create_research_tasks(data)
        
        assert len(tasks) == 2
        assert all(isinstance(task, Task) for task in tasks)
        assert tasks[0].task_id == "research_0"
        assert tasks[0].category == "ethics"
        assert tasks[1].category == "technology"
        assert all(task.context == {"domain": "computer science"} for task in tasks)

    def test_create_research_tasks_questions(self, research_agent):
        """Test creation of research tasks from questions."""
        data = {
            "questions": ["What is AI?", "How does ML work?"],
            "context": {"level": "beginner"}
        }
        
        tasks = research_agent._create_research_tasks(data)
        
        assert len(tasks) == 2
        assert all(isinstance(task, Task) for task in tasks)
        assert tasks[0].task_id == "question_0"
        assert all(task.category == "qa" for task in tasks)
        assert all(task.context == {"level": "beginner"} for task in tasks)

    @pytest.mark.asyncio
    async def test_process_execution(self, research_agent, mock_agent):
        """Test process method execution and result handling."""
        mock_agent.execute.side_effect = [
            "Research finding 1",
            "Research finding 2",
            "Summary text",
            ["Key finding 1", "Key finding 2"]
        ]
        
        data = {
            "topics": ["Topic 1", "Topic 2"],
            "context": {"domain": "test"}
        }
        
        result = await research_agent.process(data)
        
        assert "research_results" in result
        assert len(result["research_results"]) == 2
        assert "summary" in result
        assert "key_findings" in result["summary"]
        assert len(result["summary"]["key_findings"]) == 2
        assert len(result["summary"]["categories"]) > 0

    @pytest.mark.asyncio
    async def test_generate_summary(self, research_agent, mock_agent):
        """Test summary generation from results."""
        mock_agent.execute.side_effect = [
            "Generated summary text",
            ["Finding 1", "Finding 2"]
        ]
        
        results = [
            {"category": "tech", "result": "Result 1"},
            {"category": "science", "result": "Result 2"}
        ]
        
        summary = await research_agent._generate_summary(results)
        
        assert "summary_text" in summary
        assert "key_findings" in summary
        assert "categories" in summary
        assert len(summary["categories"]) == 2
        assert set(summary["categories"]) == {"tech", "science"}

    @pytest.mark.asyncio
    async def test_extract_key_findings_string(self, research_agent, mock_agent):
        """Test key findings extraction when result is a string."""
        mock_agent.execute.return_value = "Finding 1\nFinding 2\nFinding 3"
        
        findings = await research_agent._extract_key_findings("Summary text")
        
        assert len(findings) == 3
        assert isinstance(findings, list)
        assert all(isinstance(finding, str) for finding in findings)

    @pytest.mark.asyncio
    async def test_extract_key_findings_list(self, research_agent, mock_agent):
        """Test key findings extraction when result is a list."""
        mock_findings = ["Finding 1", "Finding 2", "Finding 3"]
        mock_agent.execute.return_value = mock_findings
        
        findings = await research_agent._extract_key_findings("Summary text")
        
        assert findings == mock_findings
        assert isinstance(findings, list)
        assert all(isinstance(finding, str) for finding in findings)

    @pytest.mark.asyncio
    async def test_error_handling(self, research_agent, mock_agent):
        """Test error handling during task execution."""
        mock_agent.execute.side_effect = Exception("Task execution failed")
        
        data = {
            "topics": ["Error Topic"],
            "context": {"domain": "test"}
        }
        
        with pytest.raises(Exception) as exc_info:
            await research_agent.process(data)
            
        assert "Task execution failed" in str(exc_info.value)

    def test_empty_input_handling(self, research_agent):
        """Test handling of empty input data."""
        empty_data = {}
        tasks = research_agent._create_research_tasks(empty_data)
        assert len(tasks) == 0

    def test_mixed_input_tasks(self, research_agent):
        """Test task creation with both topics and questions."""
        data = {
            "topics": ["Topic 1"],
            "questions": ["Question 1"],
            "context": {"domain": "mixed"}
        }
        
        tasks = research_agent._create_research_tasks(data)
        
        assert len(tasks) == 2
        assert any(task.task_id.startswith("research_") for task in tasks)
        assert any(task.task_id.startswith("question_") for task in tasks)
