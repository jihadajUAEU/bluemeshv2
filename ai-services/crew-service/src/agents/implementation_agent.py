from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from ..config.settings import settings
from crewai import Task

class ImplementationAgent(BaseAgent):
    """Agent responsible for code generation and implementation tasks."""
    
    def __init__(self):
        super().__init__(
            name="Implementation Agent",
            role="Software Engineer",
            goal="Generate high-quality, secure, and maintainable code implementations",
            backstory=(
                "Expert software engineer with deep knowledge of software design patterns, "
                "best practices, and multiple programming languages. Specializes in "
                "translating requirements into efficient, secure, and maintainable code."
            ),
            temperature=0.2,  # Lower temperature for more precise code generation
            model=settings.implementation_model
        )
        
        self.supported_languages = ['python', 'typescript', 'javascript', 'sql']
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process implementation tasks and generate code."""
        implementation_plan = await self._create_implementation_plan(data)
        implementations = []
        
        for task in implementation_plan['tasks']:
            result = await self.agent.execute(task)
            implementations.append({
                'task_id': task.task_id,
                'code': result,
                'language': task.context.get('language'),
                'category': task.category
            })
        
        # Generate tests for implementations
        tests = await self._generate_tests(implementations)
        
        # Generate documentation
        documentation = await self._generate_documentation(
            implementations,
            implementation_plan.get('architecture')
        )
        
        return {
            'implementations': implementations,
            'tests': tests,
            'documentation': documentation,
            'plan': implementation_plan
        }
    
    async def _create_implementation_plan(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a detailed implementation plan."""
        # First, analyze requirements and create architecture
        architecture_task = Task(
            task_id="create_architecture",
            description=(
                "Design a detailed software architecture based on the requirements. "
                "Include component structure, interfaces, and data flow."
            ),
            category='architecture',
            expected_output="Detailed architecture specification in JSON format",
            context={
                'requirements': data.get('requirements', {}),
                'constraints': data.get('constraints', {}),
                'recommendations': data.get('recommendations', [])
            },
            agent=self.agent
        )
        
        architecture = await self.agent.execute(architecture_task)
        
        # Create implementation tasks based on architecture
        tasks = []
        components = architecture.get('components', []) if isinstance(architecture, dict) else []
        
        for idx, component in enumerate(components):
            language = self._determine_language(component)
            
            tasks.append(Task(
                task_id=f"implement_{idx}",
                description=f"Implement {component.get('name')}: {component.get('description')}",
                category='implementation',
                expected_output="Complete code implementation with error handling",
                context={
                    'component': component,
                    'language': language,
                    'dependencies': component.get('dependencies', []),
                    'interfaces': component.get('interfaces', [])
                },
                agent=self.agent
            ))
        
        return {
            'architecture': architecture,
            'tasks': tasks
        }
    
    async def _generate_tests(self, implementations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate tests for implementations."""
        tests = []
        
        for impl in implementations:
            test_task = Task(
                task_id=f"test_{impl['task_id']}",
                description=(
                    f"Generate comprehensive tests for the implementation. "
                    f"Include unit tests, integration tests, and edge cases."
                ),
                category='testing',
                expected_output="Complete test suite with test cases and assertions",
                context={
                    'implementation': impl['code'],
                    'language': impl['language']
                },
                agent=self.agent
            )
            
            test_code = await self.agent.execute(test_task)
            tests.append({
                'implementation_id': impl['task_id'],
                'test_code': test_code,
                'language': impl['language']
            })
        
        return tests
    
    async def _generate_documentation(
        self,
        implementations: List[Dict[str, Any]],
        architecture: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generate comprehensive documentation."""
        # Generate API documentation
        api_doc_task = Task(
            task_id="generate_api_docs",
            description=(
                "Generate comprehensive API documentation including endpoints, "
                "request/response formats, and examples."
            ),
            category='documentation',
            expected_output="Complete API documentation in markdown format",
            context={
                'implementations': implementations,
                'architecture': architecture
            },
            agent=self.agent
        )
        
        api_docs = await self.agent.execute(api_doc_task)
        
        # Generate implementation guide
        guide_task = Task(
            task_id="generate_guide",
            description=(
                "Generate a detailed implementation guide including setup, "
                "configuration, and deployment instructions."
            ),
            category='documentation',
            expected_output="Complete implementation guide in markdown format",
            context={
                'implementations': implementations,
                'architecture': architecture
            },
            agent=self.agent
        )
        
        implementation_guide = await self.agent.execute(guide_task)
        
        return {
            'api_documentation': api_docs,
            'implementation_guide': implementation_guide,
            'architecture_overview': architecture
        }
    
    def _determine_language(self, component: Dict[str, Any]) -> str:
        """Determine the appropriate programming language for a component."""
        component_type = component.get('type', '').lower()
        
        if 'frontend' in component_type or 'ui' in component_type:
            return 'typescript'
        elif 'database' in component_type or 'data' in component_type:
            return 'sql'
        elif 'api' in component_type or 'backend' in component_type:
            return 'python'
        else:
            return 'typescript'  # Default to TypeScript
    
    async def validate_implementation(self, implementation: Dict[str, Any]) -> Dict[str, Any]:
        """Validate an implementation against best practices and security standards."""
        validation_task = Task(
            task_id="validate_implementation",
            description=(
                "Validate the implementation against security best practices, "
                "coding standards, and potential vulnerabilities."
            ),
            category='validation',
            expected_output="Validation report with issues and recommendations",
            context={
                'implementation': implementation,
                'language': implementation.get('language'),
                'security_requirements': settings.security_requirements
            },
            agent=self.agent
        )
        
        validation_result = await self.agent.execute(validation_task)
        
        return {
            'implementation_id': implementation.get('task_id'),
            'validation_result': validation_result,
            'passed': 'vulnerabilities' not in str(validation_result).lower()
        }
