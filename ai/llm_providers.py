#!/usr/bin/env python3
"""
LLM Providers Implementation
Handles different LLM services with unified interface
"""

import json
import time
import logging
from typing import Dict, Any, Optional, List
import requests
from abc import ABC, abstractmethod

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMProvider(ABC):
    """Abstract base class for LLM providers"""
    
    @abstractmethod
    def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response from the LLM"""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if the provider is available"""
        pass

class OpenAIProvider(LLMProvider):
    """OpenAI GPT provider implementation"""
    
    def __init__(self, config):
        self.config = config
        self.api_key = config.api_key
        self.model = config.model
        self.base_url = "https://api.openai.com/v1"
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        })
    
    def is_available(self) -> bool:
        """Check if OpenAI is available"""
        try:
            response = self.session.get(f"{self.base_url}/models")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"OpenAI availability check failed: {e}")
            return False
    
    def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using OpenAI API"""
        try:
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": kwargs.get('max_tokens', self.config.max_tokens),
                "temperature": kwargs.get('temperature', self.config.temperature)
            }
            
            response = self.session.post(
                f"{self.base_url}/chat/completions",
                json=payload,
                timeout=self.config.timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'content': result['choices'][0]['message']['content'],
                    'usage': result.get('usage', {}),
                    'provider': 'openai'
                }
            else:
                logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"API error: {response.status_code}",
                    'provider': 'openai'
                }
                
        except Exception as e:
            logger.error(f"OpenAI request failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'provider': 'openai'
            }

class AnthropicProvider(LLMProvider):
    """Anthropic Claude provider implementation"""
    
    def __init__(self, config):
        self.config = config
        self.api_key = config.api_key
        self.model = config.model
        self.base_url = "https://api.anthropic.com/v1"
        self.session = requests.Session()
        self.session.headers.update({
            'x-api-key': self.api_key,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        })
    
    def is_available(self) -> bool:
        """Check if Anthropic is available"""
        try:
            response = self.session.get(f"{self.base_url}/models")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Anthropic availability check failed: {e}")
            return False
    
    def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using Anthropic API"""
        try:
            payload = {
                "model": self.model,
                "max_tokens": kwargs.get('max_tokens', self.config.max_tokens),
                "temperature": kwargs.get('temperature', self.config.temperature),
                "messages": [{"role": "user", "content": prompt}]
            }
            
            response = self.session.post(
                f"{self.base_url}/messages",
                json=payload,
                timeout=self.config.timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'content': result['content'][0]['text'],
                    'usage': result.get('usage', {}),
                    'provider': 'anthropic'
                }
            else:
                logger.error(f"Anthropic API error: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"API error: {response.status_code}",
                    'provider': 'anthropic'
                }
                
        except Exception as e:
            logger.error(f"Anthropic request failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'provider': 'anthropic'
            }

class OllamaProvider(LLMProvider):
    """Ollama local model provider implementation"""
    
    def __init__(self, config):
        self.config = config
        self.model = config.model
        self.base_url = config.base_url
        self.session = requests.Session()
    
    def is_available(self) -> bool:
        """Check if Ollama is available"""
        try:
            response = self.session.get(f"{self.base_url}/api/tags")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Ollama availability check failed: {e}")
            return False
    
    def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using Ollama API"""
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": kwargs.get('temperature', self.config.temperature),
                    "num_predict": kwargs.get('max_tokens', self.config.max_tokens)
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=self.config.timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'content': result['response'],
                    'usage': {'total_tokens': result.get('eval_count', 0)},
                    'provider': 'ollama'
                }
            else:
                logger.error(f"Ollama API error: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"API error: {response.status_code}",
                    'provider': 'ollama'
                }
                
        except Exception as e:
            logger.error(f"Ollama request failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'provider': 'ollama'
            }

class HuggingFaceProvider(LLMProvider):
    """Hugging Face provider implementation"""
    
    def __init__(self, config):
        self.config = config
        self.api_key = config.api_key
        self.model = config.model
        self.base_url = config.base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        })
    
    def is_available(self) -> bool:
        """Check if Hugging Face is available"""
        try:
            response = self.session.get(f"{self.base_url}/models/{self.model}")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Hugging Face availability check failed: {e}")
            return False
    
    def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using Hugging Face API"""
        try:
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": kwargs.get('max_tokens', self.config.max_tokens),
                    "temperature": kwargs.get('temperature', self.config.temperature),
                    "return_full_text": False
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/models/{self.model}",
                json=payload,
                timeout=self.config.timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                # Handle different response formats
                if isinstance(result, list) and len(result) > 0:
                    content = result[0].get('generated_text', '')
                else:
                    content = result.get('generated_text', '')
                
                return {
                    'success': True,
                    'content': content,
                    'usage': {},
                    'provider': 'huggingface'
                }
            else:
                logger.error(f"Hugging Face API error: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"API error: {response.status_code}",
                    'provider': 'huggingface'
                }
                
        except Exception as e:
            logger.error(f"Hugging Face request failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'provider': 'huggingface'
            }

class MockProvider(LLMProvider):
    """Mock provider for fallback and testing"""
    
    def __init__(self, config=None):
        self.config = config or type('Config', (), {
            'provider': 'mock',
            'model': 'mock-model',
            'api_key': '',
            'max_tokens': 100,
            'temperature': 0.7,
            'timeout': 5
        })()
    
    def is_available(self) -> bool:
        """Mock provider is always available"""
        return True
    
    def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate mock response"""
        # Simulate processing time
        time.sleep(0.1)
        
        # Generate contextual mock responses
        if "essay" in prompt.lower() or "writing" in prompt.lower():
            content = "This is a well-structured essay with good arguments. Consider adding more specific examples to strengthen your points."
        elif "math" in prompt.lower() or "calculation" in prompt.lower():
            content = "Your mathematical reasoning is sound. The approach you used is correct for this type of problem."
        else:
            content = "Good work! Your understanding of this topic is developing well. Keep practicing to improve further."
        
        return {
            'success': True,
            'content': content,
            'usage': {'total_tokens': len(prompt.split())},
            'provider': 'mock'
        }

class LLMProviderFactory:
    """Factory for creating LLM provider instances"""
    
    @staticmethod
    def create_provider(provider_name: str, config) -> LLMProvider:
        """Create a provider instance based on name"""
        providers = {
            'openai': OpenAIProvider,
            'anthropic': AnthropicProvider,
            'ollama': OllamaProvider,
            'huggingface': HuggingFaceProvider,
            'mock': MockProvider
        }
        
        provider_class = providers.get(provider_name, MockProvider)
        return provider_class(config)
