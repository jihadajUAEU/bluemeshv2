from typing import Dict, Any, List
from .base_agent import BaseAgent
from ..config.settings import settings
from crewai import Task

class ResearchAgent(BaseAgent):
    """Agent responsible for research and information gathering."""
    
    def __init__(self):
        super().__init__(
            name="Research Agent",
            role="Research Specialist",
            goal="Gather and analyze information comprehensively",
            backstory=(
                "Expert at gathering, analyzing, and synthesizing information "
                "from various sources. Skilled at identifying key insights and "
                "patterns in complex data."
            ),
            temperature=0.7,
            model=settings.research_model
        )
        
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process research tasks and return findings."""
        research_tasks = self._create_research_tasks(data)
        results = []
        
        for task in research_tasks:
            result = await self.agent.execute(task)
            results.append({
                'task_id': task.task_id,
                'result': result,
                'category': task.category
            })
            
        return {
            'research_results': results,
            'summary': await self._generate_summary(results)
        }
    
    def _create_research_tasks(self, data: Dict[str, Any]) -> List[Task]:
        """Create research tasks based on input data."""
        tasks = []
        
        if 'topics' in data:
            for idx, topic in enumerate(data['topics']):
                task = Task(
                    task_id=f"research_{idx}",
                    description=f"Research and analyze: {topic}",
                    category=data.get('categories', {}).get(topic, 'general'),
                    expected_output="Detailed analysis with key findings and supporting evidence",
                    context=data.get('context', {}),
                    agent=self.agent
                )
                tasks.append(task)
        
        if 'questions' in data:
            for idx, question in enumerate(data['questions']):
                task = Task(
                    task_id=f"question_{idx}",
                    description=f"Answer the following question: {question}",
                    category='qa',
                    expected_output="Comprehensive answer with supporting evidence",
                    context=data.get('context', {}),
                    agent=self.agent
                )
                tasks.append(task)
        
        return tasks
    
    async def _generate_summary(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a summary of research findings."""
        summary_task = Task(
            task_id="summary",
            description="Generate a comprehensive summary of all research findings",
            category='summary',
            expected_output="Executive summary with key insights and recommendations",
            context={'results': results},
            agent=self.agent
        )
        
        summary = await self.agent.execute(summary_task)
        
        return {
            'summary_text': summary,
            'key_findings': await self._extract_key_findings(summary),
            'categories': list(set(r['category'] for r in results))
        }
    
    async def _extract_key_findings(self, summary: str) -> List[str]:
        """Extract key findings from the summary."""
        extraction_task = Task(
            task_id="extract_findings",
            description="Extract key findings from the summary",
            category='analysis',
            expected_output="List of key findings",
            context={'summary': summary},
            agent=self.agent
        )
        
        findings = await self.agent.execute(extraction_task)
        return findings.split('\n') if isinstance(findings, str) else findings
