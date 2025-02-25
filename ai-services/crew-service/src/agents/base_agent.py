from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from crewai import Agent
from langchain.chat_models import ChatOpenAI
from ..config.settings import settings

class BaseAgent(ABC):
    """Base class for all AI agents in the system."""
    
    def __init__(
        self,
        name: str,
        role: str,
        goal: str,
        backstory: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        model: Optional[str] = None
    ):
        self.name = name
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self.temperature = temperature or settings.default_temperature
        self.max_tokens = max_tokens or settings.max_tokens
        self.model = model or settings.research_model
        
        self._agent = self._create_agent()
    
    def _create_agent(self) -> Agent:
        """Create a CrewAI agent with the specified configuration."""
        llm = ChatOpenAI(
            temperature=self.temperature,
            model=self.model,
            max_tokens=self.max_tokens
        )
        
        return Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            llm=llm,
            verbose=True,
            allow_delegation=True
        )
    
    @abstractmethod
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the input data and return results."""
        pass
    
    @property
    def agent(self) -> Agent:
        """Get the underlying CrewAI agent."""
        return self._agent
    
    def update_config(
        self,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        model: Optional[str] = None
    ) -> None:
        """Update the agent's configuration."""
        if temperature is not None:
            self.temperature = temperature
        if max_tokens is not None:
            self.max_tokens = max_tokens
        if model is not None:
            self.model = model
        
        # Recreate the agent with new configuration
        self._agent = self._create_agent()
