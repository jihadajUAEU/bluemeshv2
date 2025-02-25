from typing import Dict, Any
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    """Application settings."""
    # OpenAI Configuration
    openai_api_key: str = Field(..., env='OPENAI_API_KEY')
    
    # Agent Configuration
    default_temperature: float = 0.7
    max_tokens: int = 2048
    
    # Model Configuration
    research_model: str = "gpt-4"
    analysis_model: str = "gpt-4"
    implementation_model: str = "gpt-4"
    qa_model: str = "gpt-3.5-turbo"
    
    # Retry Configuration
    max_retries: int = 3
    retry_delay: int = 1
    
    # Dapr Configuration
    dapr_host: str = Field(default="localhost", env='DAPR_HOST')
    dapr_http_port: int = Field(default=3500, env='DAPR_HTTP_PORT')
    dapr_grpc_port: int = Field(default=50001, env='DAPR_GRPC_PORT')
    
    # Service Configuration
    service_name: str = "crew-service"
    service_port: int = Field(default=5000, env='SERVICE_PORT')
    
    # Redis Configuration for real-time updates
    redis_host: str = Field(default="localhost", env='REDIS_HOST')
    redis_port: int = Field(default=6379, env='REDIS_PORT')
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
