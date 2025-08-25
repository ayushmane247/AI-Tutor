#!/usr/bin/env python3
"""
LLM Configuration and Settings
Manages API keys, model configurations, and provider settings
"""

import os
from typing import Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class LLMConfig:
    """Configuration for different LLM providers"""
    provider: str
    model: str
    api_key: str
    base_url: Optional[str] = None
    max_tokens: int = 2000
    temperature: float = 0.7
    timeout: int = 30

class LLMManager:
    """Manages LLM configurations and provider selection"""
    
    def __init__(self):
        self.configs = self._load_configs()
        self.default_provider = os.getenv('DEFAULT_LLM_PROVIDER', 'openai')
    
    def _load_configs(self) -> Dict[str, LLMConfig]:
        """Load LLM configurations from environment variables"""
        configs = {}
        
        # OpenAI Configuration
        if os.getenv('OPENAI_API_KEY'):
            configs['openai'] = LLMConfig(
                provider='openai',
                model=os.getenv('OPENAI_MODEL', 'gpt-4'),
                api_key=os.getenv('OPENAI_API_KEY'),
                max_tokens=int(os.getenv('OPENAI_MAX_TOKENS', '2000')),
                temperature=float(os.getenv('OPENAI_TEMPERATURE', '0.7'))
            )
        
        # Anthropic (Claude) Configuration
        if os.getenv('ANTHROPIC_API_KEY'):
            configs['anthropic'] = LLMConfig(
                provider='anthropic',
                model=os.getenv('ANTHROPIC_MODEL', 'claude-3-sonnet-20240229'),
                api_key=os.getenv('ANTHROPIC_API_KEY'),
                max_tokens=int(os.getenv('ANTHROPIC_MAX_TOKENS', '2000')),
                temperature=float(os.getenv('ANTHROPIC_TEMPERATURE', '0.7'))
            )
        
        # Local Models Configuration (Ollama)
        if os.getenv('OLLAMA_BASE_URL'):
            configs['ollama'] = LLMConfig(
                provider='ollama',
                model=os.getenv('OLLAMA_MODEL', 'llama2'),
                api_key='',  # Ollama doesn't require API key
                base_url=os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434'),
                max_tokens=int(os.getenv('OLLAMA_MAX_TOKENS', '2000')),
                temperature=float(os.getenv('OLLAMA_TEMPERATURE', '0.7'))
            )
        
        # Hugging Face Configuration
        if os.getenv('HUGGINGFACE_API_KEY'):
            configs['huggingface'] = LLMConfig(
                provider='huggingface',
                model=os.getenv('HUGGINGFACE_MODEL', 'meta-llama/Llama-2-7b-chat-hf'),
                api_key=os.getenv('HUGGINGFACE_API_KEY'),
                base_url=os.getenv('HUGGINGFACE_BASE_URL', 'https://api-inference.huggingface.co'),
                max_tokens=int(os.getenv('HUGGINGFACE_MAX_TOKENS', '2000')),
                temperature=float(os.getenv('HUGGINGFACE_TEMPERATURE', '0.7'))
            )
        
        return configs
    
    def get_config(self, provider: Optional[str] = None) -> Optional[LLMConfig]:
        """Get configuration for specified provider or default"""
        provider = provider or self.default_provider
        return self.configs.get(provider)
    
    def get_available_providers(self) -> list:
        """Get list of available LLM providers"""
        return list(self.configs.keys())
    
    def is_provider_available(self, provider: str) -> bool:
        """Check if a provider is available"""
        return provider in self.configs
    
    def get_best_provider_for_task(self, task_type: str) -> str:
        """Select the best provider for a specific task"""
        available = self.get_available_providers()
        
        if not available:
            return 'mock'  # Fallback to mock responses
        
        # Task-specific provider selection
        if task_type == 'essay_evaluation':
            # Claude is excellent for essay evaluation
            if 'anthropic' in available:
                return 'anthropic'
            elif 'openai' in available:
                return 'openai'
        
        elif task_type == 'tutoring':
            # GPT-4 is great for tutoring
            if 'openai' in available:
                return 'openai'
            elif 'anthropic' in available:
                return 'anthropic'
        
        elif task_type == 'privacy_sensitive':
            # Use local models for privacy
            if 'ollama' in available:
                return 'ollama'
            elif 'huggingface' in available:
                return 'huggingface'
        
        # Default to first available provider
        return available[0]

# Global instance
llm_manager = LLMManager()
