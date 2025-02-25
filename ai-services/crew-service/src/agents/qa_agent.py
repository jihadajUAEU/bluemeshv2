from typing import Dict, Any, List
from .base_agent import BaseAgent
from ..config.settings import settings
from crewai import Task

class QAAgent(BaseAgent):
    """Agent responsible for quality assurance and testing."""
    
    def __init__(self):
        super().__init__(
            name="QA Agent",
            role="Quality Assurance Engineer",
            goal="Ensure high-quality, secure, and reliable code through comprehensive testing",
            backstory=(
                "Expert QA engineer with extensive experience in automated testing, "
                "security testing, and quality assurance. Specializes in identifying "
                "edge cases and potential vulnerabilities."
            ),
            temperature=0.1,  # Lowest temperature for most precise testing
            model=settings.qa_model
        )
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process QA tasks and generate test results."""
        test_plan = await self._create_test_plan(data)
        test_results = []
        
        for task in test_plan['tasks']:
            result = await self.agent.execute(task)
            test_results.append({
                'task_id': task.task_id,
                'result': result,
                'category': task.category,
                'status': self._determine_test_status(result)
            })
        
        # Generate test report
        report = await self._generate_test_report(test_results)
        
        # Generate recommendations
        recommendations = await self._generate_recommendations(test_results)
        
        return {
            'test_results': test_results,
            'report': report,
            'recommendations': recommendations,
            'plan': test_plan
        }
    
    async def _create_test_plan(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a comprehensive test plan."""
        tasks = []
        
        # Unit Testing Task
        if 'implementations' in data:
            for impl in data['implementations']:
                tasks.append(Task(
                    task_id=f"unit_test_{impl['task_id']}",
                    description=(
                        f"Perform unit testing for implementation {impl['task_id']}. "
                        f"Focus on function-level testing and edge cases."
                    ),
                    category='unit_testing',
                    expected_output="Unit test results with coverage metrics",
                    context={
                        'implementation': impl,
                        'test_requirements': data.get('test_requirements', {})
                    },
                    agent=self.agent
                ))
        
        # Integration Testing Task
        tasks.append(Task(
            task_id="integration_test",
            description=(
                "Perform integration testing across all components. "
                "Verify component interactions and data flow."
            ),
            category='integration_testing',
            expected_output="Integration test results with interaction analysis",
            context={
                'implementations': data.get('implementations', []),
                'architecture': data.get('architecture', {})
            },
            agent=self.agent
        ))
        
        # Security Testing Task
        tasks.append(Task(
            task_id="security_test",
            description=(
                "Perform security testing including vulnerability scanning "
                "and penetration testing scenarios."
            ),
            category='security_testing',
            expected_output="Security test results with vulnerability assessment",
            context={
                'implementations': data.get('implementations', []),
                'security_requirements': settings.security_requirements
            },
            agent=self.agent
        ))
        
        # Performance Testing Task
        tasks.append(Task(
            task_id="performance_test",
            description=(
                "Perform performance testing including load testing "
                "and stress testing scenarios."
            ),
            category='performance_testing',
            expected_output="Performance test results with metrics analysis",
            context={
                'implementations': data.get('implementations', []),
                'performance_requirements': data.get('performance_requirements', {})
            },
            agent=self.agent
        ))
        
        return {
            'tasks': tasks,
            'coverage_requirements': data.get('coverage_requirements', {}),
            'test_environment': data.get('test_environment', 'development')
        }
    
    async def _generate_test_report(self, test_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a comprehensive test report."""
        report_task = Task(
            task_id="generate_report",
            description=(
                "Generate a comprehensive test report including test results, "
                "coverage analysis, and quality metrics."
            ),
            category='reporting',
            expected_output="Detailed test report in markdown format",
            context={'test_results': test_results},
            agent=self.agent
        )
        
        report = await self.agent.execute(report_task)
        
        metrics = await self._calculate_metrics(test_results)
        
        return {
            'summary': report,
            'metrics': metrics,
            'test_coverage': await self._calculate_coverage(test_results),
            'timestamp': settings.current_timestamp
        }
    
    async def _generate_recommendations(self, test_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate recommendations based on test results."""
        recommendation_task = Task(
            task_id="generate_recommendations",
            description=(
                "Generate specific recommendations for improvements based on "
                "test results and identified issues."
            ),
            category='recommendations',
            expected_output="List of prioritized recommendations",
            context={'test_results': test_results},
            agent=self.agent
        )
        
        recommendations = await self.agent.execute(recommendation_task)
        
        return self._structure_recommendations(recommendations)
    
    def _determine_test_status(self, result: Any) -> str:
        """Determine the status of a test result."""
        result_str = str(result).lower()
        
        if 'error' in result_str or 'fail' in result_str:
            return 'failed'
        elif 'warn' in result_str:
            return 'warning'
        else:
            return 'passed'
    
    async def _calculate_metrics(self, test_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate test metrics."""
        total_tests = len(test_results)
        passed_tests = sum(1 for r in test_results if r['status'] == 'passed')
        failed_tests = sum(1 for r in test_results if r['status'] == 'failed')
        warning_tests = sum(1 for r in test_results if r['status'] == 'warning')
        
        return {
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'warning_tests': warning_tests,
            'pass_rate': (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        }
    
    async def _calculate_coverage(self, test_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate test coverage metrics."""
        coverage_task = Task(
            task_id="calculate_coverage",
            description="Calculate test coverage metrics from test results",
            category='metrics',
            expected_output="Coverage metrics in JSON format",
            context={'test_results': test_results},
            agent=self.agent
        )
        
        coverage = await self.agent.execute(coverage_task)
        
        return coverage if isinstance(coverage, dict) else {
            'line_coverage': 0,
            'branch_coverage': 0,
            'function_coverage': 0
        }
    
    def _structure_recommendations(self, recommendations: Any) -> List[Dict[str, Any]]:
        """Structure recommendations into a standardized format."""
        if isinstance(recommendations, str):
            recommendations = recommendations.split('\n')
        
        structured_recommendations = []
        for idx, rec in enumerate(recommendations):
            structured_recommendations.append({
                'id': f"QA_REC_{idx}",
                'recommendation': rec,
                'category': self._determine_recommendation_category(rec),
                'priority': self._determine_recommendation_priority(rec)
            })
        
        return structured_recommendations
    
    def _determine_recommendation_category(self, recommendation: str) -> str:
        """Determine the category of a recommendation."""
        rec_lower = recommendation.lower()
        
        if any(term in rec_lower for term in ['security', 'vulnerability', 'risk']):
            return 'security'
        elif any(term in rec_lower for term in ['performance', 'speed', 'optimization']):
            return 'performance'
        elif any(term in rec_lower for term in ['test', 'coverage', 'assertion']):
            return 'testing'
        else:
            return 'general'
    
    def _determine_recommendation_priority(self, recommendation: str) -> str:
        """Determine the priority of a recommendation."""
        rec_lower = recommendation.lower()
        
        if any(term in rec_lower for term in ['critical', 'severe', 'urgent']):
            return 'high'
        elif any(term in rec_lower for term in ['important', 'significant']):
            return 'medium'
        else:
            return 'low'
