from typing import Dict, Any, List, Callable, Optional
from crewai import Crew, Process
from ..agents.research_agent import ResearchAgent
from ..agents.analysis_agent import AnalysisAgent
from ..agents.implementation_agent import ImplementationAgent
from ..agents.qa_agent import QAAgent
from ..config.settings import settings
import asyncio
import json
import time

ProgressCallback = Callable[[str, float, str], None]

class WorkflowCrew:
    """Orchestrates the AI agents in the workflow execution."""
    
    def __init__(self):
        self.research_agent = ResearchAgent()
        self.analysis_agent = AnalysisAgent()
        self.implementation_agent = ImplementationAgent()
        self.qa_agent = QAAgent()
        
        self.crew = Crew(
            agents=[
                self.research_agent.agent,
                self.analysis_agent.agent,
                self.implementation_agent.agent,
                self.qa_agent.agent
            ],
            process=Process.sequential,
            verbose=True
        )
        
        self.execution_results = {}
        self._progress_callback: Optional[ProgressCallback] = None
        self._start_time = 0
    
    def register_progress_callback(self, callback: ProgressCallback):
        """Register a callback for progress updates."""
        self._progress_callback = callback

    def _update_progress(self, phase: str, progress: float, message: str):
        """Update execution progress."""
        if self._progress_callback:
            self._progress_callback(phase, progress, message)

    async def execute_workflow(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the complete workflow with all agents."""
        self._start_time = time.time()
        try:
            # Step 1: Research Phase (25% of total)
            self._update_progress("research", 0.0, "Starting research phase")
            research_results = await self.research_agent.process(workflow_data)
            self.execution_results['research'] = research_results
            self._update_progress("research", 0.25, "Research phase completed")
            
            # Step 2: Analysis Phase (25% - 50%)
            self._update_progress("analysis", 0.25, "Starting analysis phase")
            analysis_data = {
                **workflow_data,
                'research_results': research_results
            }
            analysis_results = await self.analysis_agent.process(analysis_data)
            self.execution_results['analysis'] = analysis_results
            self._update_progress("analysis", 0.50, "Analysis phase completed")
            
            # Step 3: Implementation Phase (50% - 75%)
            self._update_progress("implementation", 0.50, "Starting implementation phase")
            implementation_data = {
                **workflow_data,
                'research_results': research_results,
                'analysis_results': analysis_results,
                'requirements': analysis_results.get('recommendations', [])
            }
            implementation_results = await self.implementation_agent.process(implementation_data)
            self.execution_results['implementation'] = implementation_results
            self._update_progress("implementation", 0.75, "Implementation phase completed")
            
            # Step 4: QA Phase (75% - 95%)
            self._update_progress("qa", 0.75, "Starting QA phase")
            qa_data = {
                **workflow_data,
                'implementations': implementation_results.get('implementations', []),
                'architecture': implementation_results.get('plan', {}).get('architecture', {}),
                'test_requirements': workflow_data.get('test_requirements', {})
            }
            qa_results = await self.qa_agent.process(qa_data)
            self.execution_results['qa'] = qa_results
            self._update_progress("qa", 0.95, "QA phase completed")
            
            # Generate final report (95% - 100%)
            self._update_progress("reporting", 0.95, "Generating final report")
            final_report = await self._generate_final_report()
            self._update_progress("complete", 1.0, "Workflow execution completed")
            
            return {
                'status': 'completed',
                'execution_time': time.time() - self._start_time,
                'execution_results': self.execution_results,
                'final_report': final_report,
                'metrics': await self._calculate_workflow_metrics()
            }
            
        except Exception as e:
            self._update_progress("error", 1.0, f"Error: {str(e)}")
            error_report = await self._generate_error_report(e)
            return {
                'status': 'failed',
                'error': str(e),
                'error_report': error_report,
                'partial_results': self.execution_results,
                'execution_time': time.time() - self._start_time
            }
    
    async def _generate_final_report(self) -> Dict[str, Any]:
        """Generate a comprehensive final report of the workflow execution."""
        research_insights = self.execution_results.get('research', {}).get('summary', {})
        analysis_insights = self.execution_results.get('analysis', {}).get('insights', {})
        implementation_docs = self.execution_results.get('implementation', {}).get('documentation', {})
        qa_report = self.execution_results.get('qa', {}).get('report', {})
        
        return {
            'summary': {
                'research_findings': research_insights.get('key_findings', []),
                'analysis_insights': analysis_insights.get('key_insights', []),
                'implementation_status': self._get_implementation_status(),
                'quality_metrics': qa_report.get('metrics', {}),
                'total_execution_time': time.time() - self._start_time
            },
            'detailed_results': {
                'research': research_insights,
                'analysis': analysis_insights,
                'implementation': {
                    'architecture': implementation_docs.get('architecture_overview', {}),
                    'api_documentation': implementation_docs.get('api_documentation', ''),
                    'guide': implementation_docs.get('implementation_guide', '')
                },
                'quality_assurance': qa_report
            },
            'recommendations': await self._compile_recommendations(),
            'next_steps': await self._generate_next_steps()
        }
    
    def _get_implementation_status(self) -> str:
        """Determine the overall implementation status."""
        qa_results = self.execution_results.get('qa', {}).get('test_results', [])
        if not qa_results:
            return 'unknown'
        
        failed_tests = sum(1 for r in qa_results if r.get('status') == 'failed')
        total_tests = len(qa_results)
        
        if failed_tests == 0:
            return 'successful'
        elif failed_tests < total_tests / 3:  # Less than 33% failed
            return 'partial'
        else:
            return 'needs_improvement'
    
    async def _compile_recommendations(self) -> List[Dict[str, Any]]:
        """Compile and prioritize recommendations from all phases."""
        all_recommendations = []
        
        # Collect recommendations from each phase
        if 'analysis' in self.execution_results:
            all_recommendations.extend(
                self._format_recommendations(
                    self.execution_results['analysis'].get('recommendations', []),
                    'analysis'
                )
            )
        
        if 'qa' in self.execution_results:
            all_recommendations.extend(
                self._format_recommendations(
                    self.execution_results['qa'].get('recommendations', []),
                    'qa'
                )
            )
        
        # Sort by priority
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        return sorted(
            all_recommendations,
            key=lambda x: priority_order.get(x.get('priority', 'low'), 3)
        )
    
    def _format_recommendations(
        self,
        recommendations: List[Dict[str, Any]],
        phase: str
    ) -> List[Dict[str, Any]]:
        """Format recommendations with phase information."""
        return [{**rec, 'phase': phase} for rec in recommendations]
    
    async def _generate_next_steps(self) -> List[str]:
        """Generate next steps based on the workflow results."""
        implementation_status = self._get_implementation_status()
        qa_results = self.execution_results.get('qa', {})
        next_steps = []
        
        if implementation_status == 'needs_improvement':
            next_steps.append("Address failed test cases and critical issues")
        elif implementation_status == 'partial':
            next_steps.append("Resolve remaining test failures and warnings")
        
        # Add steps based on test coverage
        coverage = qa_results.get('report', {}).get('test_coverage', {})
        if coverage.get('line_coverage', 0) < 80:
            next_steps.append("Improve test coverage to meet minimum requirements")
        
        # Add steps based on security findings
        security_issues = [
            r for r in qa_results.get('recommendations', [])
            if r.get('category') == 'security' and r.get('priority') == 'high'
        ]
        if security_issues:
            next_steps.append("Address high-priority security issues")
        
        return next_steps
    
    async def _calculate_workflow_metrics(self) -> Dict[str, Any]:
        """Calculate overall workflow metrics."""
        return {
            'execution_time': {
                'research': self._calculate_phase_time('research'),
                'analysis': self._calculate_phase_time('analysis'),
                'implementation': self._calculate_phase_time('implementation'),
                'qa': self._calculate_phase_time('qa')
            },
            'quality_metrics': self.execution_results.get('qa', {})
                .get('report', {})
                .get('metrics', {}),
            'completion_status': self._get_implementation_status()
        }
    
    def _calculate_phase_time(self, phase: str) -> float:
        """Calculate execution time for a specific phase."""
        phase_results = self.execution_results.get(phase, {})
        start_time = phase_results.get('start_time', 0)
        end_time = phase_results.get('end_time', 0)
        return end_time - start_time if start_time and end_time else 0
    
    async def _generate_error_report(self, error: Exception) -> Dict[str, Any]:
        """Generate a detailed error report."""
        return {
            'error_type': type(error).__name__,
            'error_message': str(error),
            'phase': self._determine_error_phase(),
            'completed_steps': list(self.execution_results.keys()),
            'recommendations': await self._generate_error_recommendations(error),
            'execution_time': time.time() - self._start_time
        }
    
    def _determine_error_phase(self) -> str:
        """Determine in which phase the error occurred."""
        completed_phases = set(self.execution_results.keys())
        all_phases = {'research', 'analysis', 'implementation', 'qa'}
        
        for phase in ['research', 'analysis', 'implementation', 'qa']:
            if phase not in completed_phases:
                return phase
        
        return 'unknown'
    
    async def _generate_error_recommendations(self, error: Exception) -> List[str]:
        """Generate recommendations for handling the error."""
        error_type = type(error).__name__
        error_message = str(error)
        
        recommendations = [
            f"Investigate root cause of {error_type}: {error_message}"
        ]
        
        if 'timeout' in error_message.lower():
            recommendations.append("Consider increasing timeout limits")
        elif 'memory' in error_message.lower():
            recommendations.append("Review memory allocation and resource usage")
        elif 'permission' in error_message.lower():
            recommendations.append("Verify service account permissions")
        
        return recommendations
