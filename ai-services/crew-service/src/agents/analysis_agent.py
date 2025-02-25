from typing import Dict, Any, List
from .base_agent import BaseAgent
from ..config.settings import settings
from crewai import Task

class AnalysisAgent(BaseAgent):
    """Agent responsible for analyzing and processing research findings."""
    
    def __init__(self):
        super().__init__(
            name="Analysis Agent",
            role="Data Analyst",
            goal="Process and analyze research findings to extract actionable insights",
            backstory=(
                "Expert data analyst specializing in pattern recognition, "
                "trend analysis, and insight generation. Skilled at transforming "
                "complex research data into actionable recommendations."
            ),
            temperature=0.3,  # Lower temperature for more focused analysis
            model=settings.analysis_model
        )
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process and analyze research findings."""
        analysis_tasks = self._create_analysis_tasks(data)
        results = []
        
        for task in analysis_tasks:
            result = await self.agent.execute(task)
            results.append({
                'task_id': task.task_id,
                'result': result,
                'category': task.category
            })
        
        insights = await self._generate_insights(results)
        recommendations = await self._generate_recommendations(insights)
        
        return {
            'analysis_results': results,
            'insights': insights,
            'recommendations': recommendations
        }
    
    def _create_analysis_tasks(self, data: Dict[str, Any]) -> List[Task]:
        """Create analysis tasks based on research findings."""
        tasks = []
        
        # Pattern Analysis Task
        tasks.append(Task(
            task_id="pattern_analysis",
            description=(
                "Analyze the research findings to identify patterns, trends, "
                "and correlations. Consider both explicit and implicit patterns."
            ),
            category='pattern_analysis',
            expected_output="List of identified patterns with supporting evidence",
            context={'research_findings': data.get('research_results', [])},
            agent=self.agent
        ))
        
        # Impact Analysis Task
        tasks.append(Task(
            task_id="impact_analysis",
            description=(
                "Evaluate the potential impact and implications of the identified "
                "patterns. Consider short-term and long-term effects."
            ),
            category='impact_analysis',
            expected_output="Impact assessment with probability estimates",
            context={'patterns': data.get('patterns', [])},
            agent=self.agent
        ))
        
        # Risk Analysis Task
        tasks.append(Task(
            task_id="risk_analysis",
            description=(
                "Identify potential risks and challenges associated with the "
                "findings. Include mitigation strategies."
            ),
            category='risk_analysis',
            expected_output="Risk assessment with mitigation strategies",
            context={'findings': data.get('findings', [])},
            agent=self.agent
        ))
        
        return tasks
    
    async def _generate_insights(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate insights from analysis results."""
        insight_task = Task(
            task_id="generate_insights",
            description=(
                "Synthesize analysis results to generate key insights. "
                "Focus on actionable and significant findings."
            ),
            category='insights',
            expected_output="List of key insights with supporting analysis",
            context={'analysis_results': results},
            agent=self.agent
        )
        
        insights = await self.agent.execute(insight_task)
        return {
            'key_insights': insights.split('\n') if isinstance(insights, str) else insights,
            'source_analyses': [r['task_id'] for r in results]
        }
    
    async def _generate_recommendations(self, insights: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate recommendations based on insights."""
        recommendation_task = Task(
            task_id="generate_recommendations",
            description=(
                "Generate specific, actionable recommendations based on the "
                "insights. Include implementation considerations."
            ),
            category='recommendations',
            expected_output="List of recommendations with implementation details",
            context={'insights': insights},
            agent=self.agent
        )
        
        recommendations = await self.agent.execute(recommendation_task)
        
        # Process recommendations into structured format
        if isinstance(recommendations, str):
            recommendations = recommendations.split('\n')
        
        structured_recommendations = []
        for idx, rec in enumerate(recommendations):
            structured_recommendations.append({
                'id': f"REC_{idx}",
                'recommendation': rec,
                'priority': await self._assess_priority(rec),
                'implementation_complexity': await self._assess_complexity(rec),
                'source_insights': insights.get('source_analyses', [])
            })
        
        return structured_recommendations
    
    async def _assess_priority(self, recommendation: str) -> str:
        """Assess the priority of a recommendation."""
        priority_task = Task(
            task_id="assess_priority",
            description=f"Assess the priority of this recommendation: {recommendation}",
            category='priority_assessment',
            expected_output="Priority level (HIGH, MEDIUM, or LOW) with justification",
            context={'recommendation': recommendation},
            agent=self.agent
        )
        
        return await self.agent.execute(priority_task)
    
    async def _assess_complexity(self, recommendation: str) -> str:
        """Assess the implementation complexity of a recommendation."""
        complexity_task = Task(
            task_id="assess_complexity",
            description=f"Assess the implementation complexity of this recommendation: {recommendation}",
            category='complexity_assessment',
            expected_output="Complexity level (HIGH, MEDIUM, or LOW) with justification",
            context={'recommendation': recommendation},
            agent=self.agent
        )
        
        return await self.agent.execute(complexity_task)
