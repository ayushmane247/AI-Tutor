#!/usr/bin/env python3
"""
AI Agent for Educational Content Evaluation
Provides adaptive tutoring with personalized feedback
"""

import json
import sys
import re
import random
from typing import Dict, Any, List

class AITutor:
    def __init__(self):
        self.difficulty_levels = ['beginner', 'intermediate', 'advanced']
        
    def evaluate_answer(self, question: str, answer: str, question_type: str = 'multiple-choice') -> Dict[str, Any]:
        """
        Evaluate student answer and provide feedback
        """
        if question_type == 'essay':
            return self.evaluate_essay(answer)
        else:
            return self.evaluate_multiple_choice(question, answer)
    
    def evaluate_multiple_choice(self, question: str, answer: str) -> Dict[str, Any]:
        """
        Evaluate multiple choice answer with rule-based + mock LLM logic
        """
        # Mock evaluation logic (in production, use actual LLM)
        is_correct = random.random() > 0.3  # 70% chance correct for demo
        
        if is_correct:
            feedback = self.generate_positive_feedback()
            next_difficulty = self.adjust_difficulty_up()
            score = random.randint(80, 100)
            suggestions = [
                "Excellent work! Try more challenging problems.",
                "Consider exploring advanced topics in this subject.",
                "Your understanding is solid - keep building on it."
            ]
        else:
            feedback = self.generate_corrective_feedback(question)
            next_difficulty = self.adjust_difficulty_down()
            score = random.randint(40, 70)
            suggestions = [
                "Review the fundamental concepts before moving forward.",
                "Practice similar problems to strengthen understanding.",
                "Break complex problems into smaller steps.",
                "Don't hesitate to ask for help when needed."
            ]
        
        return {
            'correct': is_correct,
            'feedback': feedback,
            'nextDifficulty': next_difficulty,
            'score': score,
            'suggestions': suggestions[:3]  # Limit to 3 suggestions
        }
    
    def evaluate_essay(self, content: str) -> Dict[str, Any]:
        """
        Evaluate essay content using NLP-inspired analysis
        """
        word_count = len(content.split())
        sentence_count = len([s for s in content.split('.') if s.strip()])
        
        # Basic content analysis
        score = self.calculate_essay_score(content, word_count, sentence_count)
        is_correct = score >= 70
        
        feedback = self.generate_essay_feedback(content, word_count, score)
        suggestions = self.generate_essay_suggestions(content, word_count, score)
        
        next_difficulty = 'advanced' if score >= 85 else 'intermediate' if score >= 70 else 'beginner'
        
        return {
            'correct': is_correct,
            'feedback': feedback,
            'score': int(score),
            'nextDifficulty': next_difficulty,
            'suggestions': suggestions
        }
    
    def calculate_essay_score(self, content: str, word_count: int, sentence_count: int) -> float:
        """
        Calculate essay score based on various factors
        """
        base_score = 50
        
        # Word count factor
        if word_count >= 200:
            base_score += 20
        elif word_count >= 150:
            base_score += 15
        elif word_count >= 100:
            base_score += 10
        
        # Structure factor (sentences)
        if sentence_count >= 8:
            base_score += 15
        elif sentence_count >= 5:
            base_score += 10
        
        # Vocabulary diversity (simple check)
        unique_words = len(set(content.lower().split()))
        diversity_ratio = unique_words / word_count if word_count > 0 else 0
        if diversity_ratio > 0.7:
            base_score += 10
        elif diversity_ratio > 0.5:
            base_score += 5
        
        # Add some randomness for demo
        base_score += random.randint(-5, 10)
        
        return min(100, max(30, base_score))
    
    def generate_essay_feedback(self, content: str, word_count: int, score: float) -> str:
        """
        Generate personalized essay feedback
        """
        if score >= 85:
            return f"Outstanding essay! Your writing demonstrates excellent understanding and clear communication. With {word_count} words, you've provided comprehensive coverage of the topic with strong arguments and good structure."
        elif score >= 75:
            return f"Good work! Your essay shows solid understanding of the topic. The {word_count} words you've written cover the main points well, though there's room for deeper analysis in some areas."
        elif score >= 65:
            return f"Your essay shows developing understanding. While you've written {word_count} words and covered basic points, consider expanding your arguments with more specific examples and stronger connections between ideas."
        else:
            return f"Your essay needs more development. With {word_count} words, you've made a start, but the ideas need more elaboration and support. Focus on expanding your main points with examples and clearer explanations."
    
    def generate_essay_suggestions(self, content: str, word_count: int, score: float) -> List[str]:
        """
        Generate specific suggestions for essay improvement
        """
        suggestions = []
        
        if word_count < 150:
            suggestions.append("Expand your ideas with more detailed explanations and examples")
        
        if score < 75:
            suggestions.append("Strengthen your arguments with specific evidence and examples")
            suggestions.append("Work on creating clearer topic sentences for each paragraph")
        
        suggestions.extend([
            "Consider multiple perspectives on the topic to show deeper thinking",
            "Improve transitions between paragraphs for better flow",
            "Conclude with a strong summary that reinforces your main points",
            "Use more varied sentence structures to enhance readability"
        ])
        
        return suggestions[:4]  # Return top 4 suggestions
    
    def generate_positive_feedback(self) -> str:
        """
        Generate encouraging feedback for correct answers
        """
        positive_responses = [
            "Excellent work! Your understanding of this concept is spot on.",
            "Perfect! You've mastered this topic beautifully.",
            "Outstanding! Your analytical thinking is really showing.",
            "Brilliant! You've demonstrated clear comprehension.",
            "Superb! Your problem-solving approach is excellent.",
            "Great job! You're really getting the hang of this."
        ]
        return random.choice(positive_responses)
    
    def generate_corrective_feedback(self, question: str) -> str:
        """
        Generate helpful feedback for incorrect answers
        """
        corrective_responses = [
            "Not quite right, but you're on the right track! Let me help you understand the correct approach.",
            "Close, but there's a key concept we need to review. Here's how to think about it...",
            "I can see your reasoning, but there's a more accurate way to approach this problem.",
            "Good attempt! The correct answer requires considering this additional factor...",
            "You're thinking in the right direction, but let's clarify this important detail.",
            "Almost there! The key insight you're missing is..."
        ]
        return random.choice(corrective_responses)
    
    def adjust_difficulty_up(self) -> str:
        """
        Increase difficulty level for next question
        """
        return random.choice(['intermediate', 'advanced'])
    
    def adjust_difficulty_down(self) -> str:
        """
        Decrease difficulty level for next question
        """
        return random.choice(['beginner', 'intermediate'])

def main():
    """
    Main function to handle command line input
    """
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Invalid arguments'}))
        sys.exit(1)
    
    try:
        input_data = json.loads(sys.argv[1])
        question = input_data.get('question', '')
        answer = input_data.get('answer', '')
        question_type = input_data.get('type', 'multiple-choice')
        
        tutor = AITutor()
        result = tutor.evaluate_answer(question, answer, question_type)
        
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({'error': 'Invalid JSON input'}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({'error': f'Processing error: {str(e)}'}))
        sys.exit(1)

if __name__ == '__main__':
    main()