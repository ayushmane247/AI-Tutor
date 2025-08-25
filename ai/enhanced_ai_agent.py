#!/usr/bin/env python3
"""
Enhanced AI Agent for Educational Content Evaluation
Integrates multiple LLM providers with advanced educational features
"""

import json
import sys
import logging
import time
from typing import Dict, Any, List, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

# Import our modules
from llm_config import llm_manager
from llm_providers import LLMProviderFactory
from prompt_templates import PromptTemplates

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedAITutor:
    """Enhanced AI Tutor with multi-provider LLM integration"""
    
    def __init__(self):
        self.difficulty_levels = ['beginner', 'intermediate', 'advanced']
        self.llm_manager = llm_manager
        self.providers = {}
        self._initialize_providers()
        
    def _initialize_providers(self):
        """Initialize available LLM providers"""
        available_providers = self.llm_manager.get_available_providers()
        
        for provider_name in available_providers:
            config = self.llm_manager.get_config(provider_name)
            if config:
                provider = LLMProviderFactory.create_provider(provider_name, config)
                if provider.is_available():
                    self.providers[provider_name] = provider
                    logger.info(f"✅ Initialized {provider_name} provider")
                else:
                    logger.warning(f"⚠️ {provider_name} provider not available")
        
        # Always add mock provider as fallback
        if 'mock' not in self.providers:
            self.providers['mock'] = LLMProviderFactory.create_provider('mock', None)
            logger.info("✅ Added mock provider as fallback")
    
    def _get_best_provider(self, task_type: str, force_provider: str = None) -> str:
        """Get the best provider for a specific task"""
        if force_provider and force_provider in self.providers:
            return force_provider
        
        best_provider = self.llm_manager.get_best_provider_for_task(task_type)
        
        if best_provider in self.providers:
            return best_provider
        
        # Fallback to first available provider
        available = list(self.providers.keys())
        return available[0] if available else 'mock'
    
    def _call_llm_with_fallback(self, prompt: str, task_type: str, force_provider: str = None) -> Dict[str, Any]:
        """Call LLM with automatic fallback to other providers"""
        primary_provider = self._get_best_provider(task_type, force_provider)
        providers_to_try = [primary_provider] + [p for p in self.providers.keys() if p != primary_provider and p != 'mock']
        
        for provider_name in providers_to_try:
            try:
                provider = self.providers[provider_name]
                logger.info(f"🔄 Trying {provider_name} for {task_type}")
                
                result = provider.generate_response(prompt)
                
                if result['success']:
                    logger.info(f"✅ Success with {provider_name}")
                    return result
                else:
                    logger.warning(f"❌ {provider_name} failed: {result.get('error', 'Unknown error')}")
                    
            except Exception as e:
                logger.error(f"❌ {provider_name} exception: {e}")
                continue
        
        # Final fallback to mock provider
        logger.warning("🔄 Falling back to mock provider")
        return self.providers['mock'].generate_response(prompt)
    
    def _parse_json_response(self, content: str) -> Dict[str, Any]:
        """Parse JSON response from LLM, with error handling"""
        try:
            # Try to extract JSON from the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                return json.loads(json_str)
            else:
                logger.warning("No JSON found in response")
                return {'error': 'Invalid response format'}
                
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            return {'error': f'JSON parsing failed: {str(e)}'}
    
    def evaluate_answer(self, question: str, answer: str, question_type: str = 'multiple-choice', 
                       context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Evaluate student answer using advanced LLM integration
        """
        try:
            if question_type == 'essay':
                return self.evaluate_essay(answer, context)
            else:
                return self.evaluate_multiple_choice(question, answer, context)
        except Exception as e:
            logger.error(f"Evaluation error: {e}")
            return self._generate_fallback_response(question_type)
    
    def evaluate_multiple_choice(self, question: str, answer: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Evaluate multiple choice answer using LLM"""
        # Extract context information
        options = context.get('options', []) if context else []
        correct_answer = context.get('correct_answer', 0) if context else 0
        
        # Create prompt using template
        prompt = PromptTemplates.multiple_choice_evaluation(
            question=question,
            student_answer=answer,
            correct_answer=correct_answer,
            options=options
        )
        
        # Call LLM
        result = self._call_llm_with_fallback(prompt, 'tutoring')
        
        if result['success']:
            parsed_response = self._parse_json_response(result['content'])
            
            if 'error' not in parsed_response:
                return {
                    'correct': parsed_response.get('correct', False),
                    'feedback': parsed_response.get('feedback', ''),
                    'nextDifficulty': parsed_response.get('nextDifficulty', 'intermediate'),
                    'score': parsed_response.get('score', 70),
                    'suggestions': parsed_response.get('suggestions', []),
                    'explanation': parsed_response.get('explanation', ''),
                    'provider': result['provider'],
                    'usage': result.get('usage', {})
                }
        
        # Fallback response
        return self._generate_fallback_response('multiple-choice')
    
    def evaluate_essay(self, content: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Evaluate essay using advanced LLM analysis"""
        topic = context.get('topic', 'general') if context else 'general'
        word_count = len(content.split())
        
        # Create prompt using template
        prompt = PromptTemplates.essay_evaluation(
            essay_content=content,
            topic=topic,
            word_count=word_count
        )
        
        # Call LLM (prefer Claude for essay evaluation)
        result = self._call_llm_with_fallback(prompt, 'essay_evaluation', 'anthropic')
        
        if result['success']:
            parsed_response = self._parse_json_response(result['content'])
            
            if 'error' not in parsed_response:
                return {
                    'correct': parsed_response.get('score', 70) >= 70,
                    'feedback': parsed_response.get('feedback', ''),
                    'score': parsed_response.get('score', 70),
                    'nextDifficulty': parsed_response.get('nextDifficulty', 'intermediate'),
                    'suggestions': parsed_response.get('suggestions', []),
                    'strengths': parsed_response.get('strengths', []),
                    'areas_for_improvement': parsed_response.get('areas_for_improvement', []),
                    'detailed_analysis': parsed_response.get('detailed_analysis', {}),
                    'provider': result['provider'],
                    'usage': result.get('usage', {})
                }
        
        # Fallback response
        return self._generate_fallback_response('essay')
    
    def generate_adaptive_question(self, subject: str, difficulty: str, topic: str = None, 
                                 previous_questions: List[str] = None) -> Dict[str, Any]:
        """Generate adaptive question using LLM"""
        prompt = PromptTemplates.adaptive_question_generation(
            subject=subject,
            difficulty=difficulty,
            topic=topic,
            previous_questions=previous_questions
        )
        
        result = self._call_llm_with_fallback(prompt, 'tutoring')
        
        if result['success']:
            parsed_response = self._parse_json_response(result['content'])
            
            if 'error' not in parsed_response:
                return {
                    'question': parsed_response.get('question', ''),
                    'type': parsed_response.get('type', 'multiple-choice'),
                    'subject': parsed_response.get('subject', subject),
                    'difficulty': parsed_response.get('difficulty', difficulty),
                    'topic': parsed_response.get('topic', topic),
                    'options': parsed_response.get('options', []),
                    'correctAnswer': parsed_response.get('correctAnswer', 0),
                    'explanation': parsed_response.get('explanation', ''),
                    'learning_objectives': parsed_response.get('learning_objectives', []),
                    'prerequisites': parsed_response.get('prerequisites', []),
                    'provider': result['provider']
                }
        
        # Fallback question
        return self._generate_fallback_question(subject, difficulty)
    
    def provide_tutoring_explanation(self, question: str, student_answer: str, 
                                   correct_answer: str = None) -> Dict[str, Any]:
        """Provide detailed tutoring explanation"""
        prompt = PromptTemplates.tutoring_explanation(
            question=question,
            student_answer=student_answer,
            correct_answer=correct_answer
        )
        
        result = self._call_llm_with_fallback(prompt, 'tutoring')
        
        if result['success']:
            parsed_response = self._parse_json_response(result['content'])
            
            if 'error' not in parsed_response:
                return {
                    'explanation': parsed_response.get('explanation', ''),
                    'key_concepts': parsed_response.get('key_concepts', []),
                    'examples': parsed_response.get('examples', []),
                    'common_mistakes': parsed_response.get('common_mistakes', []),
                    'practice_tips': parsed_response.get('practice_tips', []),
                    'next_steps': parsed_response.get('next_steps', ''),
                    'provider': result['provider']
                }
        
        # Fallback explanation
        return {
            'explanation': 'Let me help you understand this concept better.',
            'key_concepts': ['Key concept 1', 'Key concept 2'],
            'examples': ['Example 1', 'Example 2'],
            'common_mistakes': ['Common mistake 1'],
            'practice_tips': ['Practice tip 1'],
            'next_steps': 'Continue practicing similar problems.',
            'provider': 'mock'
        }
    
    def conversational_tutoring(self, student_message: str, 
                              conversation_history: List[Dict] = None) -> Dict[str, Any]:
        """Provide conversational tutoring response"""
        prompt = PromptTemplates.conversation_tutoring(
            student_message=student_message,
            conversation_history=conversation_history
        )
        
        result = self._call_llm_with_fallback(prompt, 'tutoring')
        
        if result['success']:
            parsed_response = self._parse_json_response(result['content'])
            
            if 'error' not in parsed_response:
                return {
                    'response': parsed_response.get('response', ''),
                    'response_type': parsed_response.get('response_type', 'explanation'),
                    'suggested_questions': parsed_response.get('suggested_questions', []),
                    'resources': parsed_response.get('resources', []),
                    'confidence_level': parsed_response.get('confidence_level', 'medium'),
                    'next_topic_suggestion': parsed_response.get('next_topic_suggestion', ''),
                    'provider': result['provider']
                }
        
        # Fallback response
        return {
            'response': 'I understand your question. Let me help you with that.',
            'response_type': 'explanation',
            'suggested_questions': ['Can you tell me more about what you\'re working on?'],
            'resources': ['Textbook chapter on this topic'],
            'confidence_level': 'medium',
            'next_topic_suggestion': 'Continue with current topic',
            'provider': 'mock'
        }
    
    def analyze_learning_path(self, student_progress: Dict[str, Any], 
                            subjects: List[str]) -> Dict[str, Any]:
        """Generate personalized learning path"""
        prompt = PromptTemplates.learning_path_recommendation(
            student_progress=student_progress,
            subjects=subjects
        )
        
        result = self._call_llm_with_fallback(prompt, 'tutoring')
        
        if result['success']:
            parsed_response = self._parse_json_response(result['content'])
            
            if 'error' not in parsed_response:
                return {
                    'recommended_subjects': parsed_response.get('recommended_subjects', []),
                    'learning_sequence': parsed_response.get('learning_sequence', []),
                    'goals': parsed_response.get('goals', []),
                    'study_tips': parsed_response.get('study_tips', []),
                    'progress_milestones': parsed_response.get('progress_milestones', []),
                    'provider': result['provider']
                }
        
        # Fallback learning path
        return {
            'recommended_subjects': [{'subject': subjects[0], 'priority': 'high', 'reason': 'Good starting point'}],
            'learning_sequence': [{'topic': 'Basic concepts', 'difficulty': 'beginner', 'estimated_time': '1 hour'}],
            'goals': ['Master basic concepts'],
            'study_tips': ['Practice regularly', 'Review previous material'],
            'progress_milestones': ['Complete basic concepts'],
            'provider': 'mock'
        }
    
    def analyze_errors(self, student_errors: List[str], subject: str) -> Dict[str, Any]:
        """Analyze student errors and provide targeted help"""
        prompt = PromptTemplates.error_analysis(
            student_errors=student_errors,
            subject=subject
        )
        
        result = self._call_llm_with_fallback(prompt, 'tutoring')
        
        if result['success']:
            parsed_response = self._parse_json_response(result['content'])
            
            if 'error' not in parsed_response:
                return {
                    'error_patterns': parsed_response.get('error_patterns', []),
                    'targeted_remediation': parsed_response.get('targeted_remediation', []),
                    'learning_gaps': parsed_response.get('learning_gaps', []),
                    'recommended_focus': parsed_response.get('recommended_focus', []),
                    'encouragement': parsed_response.get('encouragement', ''),
                    'provider': result['provider']
                }
        
        # Fallback error analysis
        return {
            'error_patterns': [{'pattern': 'General errors', 'frequency': 'occasional', 'root_cause': 'Need more practice'}],
            'targeted_remediation': [{'error_type': 'general', 'remediation_strategy': 'Practice more', 'practice_exercises': ['Basic exercises']}],
            'learning_gaps': ['Basic understanding'],
            'recommended_focus': ['Fundamental concepts'],
            'encouragement': 'Keep practicing, you\'re making progress!',
            'provider': 'mock'
        }
    
    def _generate_fallback_response(self, question_type: str) -> Dict[str, Any]:
        """Generate fallback response when LLM fails"""
        if question_type == 'essay':
            return {
                'correct': True,
                'feedback': 'Good work on your essay! Keep developing your ideas.',
                'score': 75,
                'nextDifficulty': 'intermediate',
                'suggestions': ['Add more specific examples', 'Strengthen your arguments'],
                'provider': 'mock'
            }
        else:
            return {
                'correct': True,
                'feedback': 'Good work! Your understanding is developing well.',
                'nextDifficulty': 'intermediate',
                'score': 80,
                'suggestions': ['Keep practicing similar problems', 'Review the concepts'],
                'provider': 'mock'
            }
    
    def _generate_fallback_question(self, subject: str, difficulty: str) -> Dict[str, Any]:
        """Generate fallback question when LLM fails"""
        fallback_questions = {
            'Mathematics': {
                'beginner': {
                    'question': 'What is 2 + 3?',
                    'options': ['4', '5', '6', '7'],
                    'correctAnswer': 1
                },
                'intermediate': {
                    'question': 'What is the value of x in 2x + 5 = 11?',
                    'options': ['2', '3', '4', '5'],
                    'correctAnswer': 1
                },
                'advanced': {
                    'question': 'What is the derivative of x²?',
                    'options': ['x', '2x', 'x²', '2x²'],
                    'correctAnswer': 1
                }
            }
        }
        
        subject_questions = fallback_questions.get(subject, fallback_questions['Mathematics'])
        question_data = subject_questions.get(difficulty, subject_questions['beginner'])
        
        return {
            'question': question_data['question'],
            'type': 'multiple-choice',
            'subject': subject,
            'difficulty': difficulty,
            'topic': 'general',
            'options': question_data['options'],
            'correctAnswer': question_data['correctAnswer'],
            'explanation': 'This is a fallback question.',
            'provider': 'mock'
        }
    
    def get_provider_status(self) -> Dict[str, Any]:
        """Get status of all providers"""
        status = {}
        for name, provider in self.providers.items():
            status[name] = {
                'available': provider.is_available(),
                'type': type(provider).__name__
            }
        return status

def main():
    """Main function to handle command line input"""
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Invalid arguments'}))
        sys.exit(1)
    
    try:
        input_data = json.loads(sys.argv[1])
        action = input_data.get('action', 'evaluate_answer')
        
        tutor = EnhancedAITutor()
        
        if action == 'evaluate_answer':
            question = input_data.get('question', '')
            answer = input_data.get('answer', '')
            question_type = input_data.get('type', 'multiple-choice')
            context = input_data.get('context', {})
            result = tutor.evaluate_answer(question, answer, question_type, context)
            
        elif action == 'generate_adaptive_question':
            subject = input_data.get('subject', 'Mathematics')
            difficulty = input_data.get('difficulty', 'intermediate')
            topic = input_data.get('topic')
            previous_questions = input_data.get('previousQuestions', [])
            result = tutor.generate_adaptive_question(subject, difficulty, topic, previous_questions)
            
        elif action == 'provide_tutoring_explanation':
            question = input_data.get('question', '')
            student_answer = input_data.get('studentAnswer', '')
            correct_answer = input_data.get('correctAnswer')
            result = tutor.provide_tutoring_explanation(question, student_answer, correct_answer)
            
        elif action == 'conversational_tutoring':
            student_message = input_data.get('studentMessage', '')
            conversation_history = input_data.get('conversationHistory', [])
            result = tutor.conversational_tutoring(student_message, conversation_history)
            
        elif action == 'analyze_learning_path':
            student_progress = input_data.get('studentProgress', {})
            subjects = input_data.get('subjects', [])
            result = tutor.analyze_learning_path(student_progress, subjects)
            
        elif action == 'analyze_errors':
            student_errors = input_data.get('studentErrors', [])
            subject = input_data.get('subject', 'general')
            result = tutor.analyze_errors(student_errors, subject)
            
        elif action == 'get_provider_status':
            result = tutor.get_provider_status()
            
        else:
            result = {'error': f'Unknown action: {action}'}
        
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({'error': 'Invalid JSON input'}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({'error': f'Processing error: {str(e)}'}))
        sys.exit(1)

if __name__ == '__main__':
    main()
