#!/usr/bin/env python3
"""
Prompt Templates for Educational AI Tasks
Provides structured prompts for consistent AI responses
"""

from typing import Dict, Any, List

class PromptTemplates:
    """Collection of prompt templates for different educational tasks"""
    
    @staticmethod
    def _validate_input(text: str, max_length: int = 10000) -> str:
        """Validate and sanitize input text"""
        if not text or not isinstance(text, str):
            return ""
        
        # Truncate if too long to prevent token limit issues
        if len(text) > max_length:
            text = text[:max_length] + "..."
        
        # Basic sanitization - remove any potential injection characters
        text = text.replace('"""', '"').replace("'''", "'")
        
        return text.strip()
    
    @staticmethod
    def _format_conversation_history(history: List[Dict]) -> str:
        """Format conversation history safely"""
        if not history:
            return ""
        
        formatted = []
        for msg in history[-5:]:  # Last 5 exchanges
            student_msg = msg.get('student', '')[:500]  # Limit length
            tutor_msg = msg.get('tutor', '')[:500]      # Limit length
            if student_msg or tutor_msg:
                formatted.append(f"Student: {student_msg}\nTutor: {tutor_msg}")
        
        return "\n".join(formatted)
    
    @staticmethod
    def multiple_choice_evaluation(question: str, student_answer: str, correct_answer: int, options: List[str]) -> str:
        """Template for evaluating multiple choice answers"""
        # Validate inputs
        question = PromptTemplates._validate_input(question, 2000)
        student_answer = PromptTemplates._validate_input(student_answer, 1000)
        
        # Validate correct_answer index
        if not isinstance(correct_answer, int) or correct_answer < 0 or correct_answer >= len(options):
            correct_answer = 0
        
        options_text = "\n".join([f"{chr(65 + i)}. {PromptTemplates._validate_input(option, 500)}" for i, option in enumerate(options)])
        
        return f"""You are an expert educational tutor evaluating a student's multiple choice answer.

Question: {question}

Options:
{options_text}

Student's Answer: {student_answer}
Correct Answer: {chr(65 + correct_answer)}. {options[correct_answer]}

Please provide a comprehensive evaluation in the following JSON format:
{{
    "correct": true/false,
    "feedback": "Detailed explanation of why the answer is correct or incorrect",
    "score": 0-100,
    "nextDifficulty": "beginner/intermediate/advanced",
    "suggestions": [
        "Specific suggestion for improvement",
        "Another helpful tip",
        "Practice recommendation"
    ],
    "explanation": "Step-by-step explanation of the correct answer"
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

Focus on being encouraging and educational. If the answer is incorrect, explain the concept clearly and provide helpful guidance."""

    @staticmethod
    def essay_evaluation(essay_content: str, topic: str = "general", word_count: int = None) -> str:
        """Template for evaluating essays"""
        # Validate inputs
        essay_content = PromptTemplates._validate_input(essay_content, 8000)
        topic = PromptTemplates._validate_input(topic, 200)
        
        # Calculate word count if not provided
        if word_count is None:
            word_count = len(essay_content.split())
        
        return f"""You are an expert writing instructor evaluating a student's essay.

Topic: {topic}
Word Count: {word_count}

Essay Content:
{essay_content}

Please provide a comprehensive evaluation in the following JSON format:
{{
    "score": 0-100,
    "feedback": "Overall assessment of the essay",
    "strengths": [
        "Specific strength of the writing",
        "Another positive aspect"
    ],
    "areas_for_improvement": [
        "Specific area that needs work",
        "Another improvement suggestion"
    ],
    "suggestions": [
        "Actionable suggestion for improvement",
        "Another helpful tip",
        "Practice recommendation"
    ],
    "nextDifficulty": "beginner/intermediate/advanced",
    "detailed_analysis": {{
        "content": "Analysis of ideas and arguments",
        "organization": "Analysis of structure and flow",
        "language": "Analysis of vocabulary and style",
        "mechanics": "Analysis of grammar and punctuation"
    }}
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

Be constructive and encouraging. Focus on both strengths and areas for improvement. Provide specific, actionable feedback."""

    @staticmethod
    def tutoring_explanation(question: str, student_answer: str, correct_answer: str = None) -> str:
        """Template for providing tutoring explanations"""
        return f"""You are a patient and knowledgeable tutor helping a student understand a concept.

Question: {question}
Student's Answer: {student_answer}
{f"Correct Answer: {correct_answer}" if correct_answer else ""}

Please provide a helpful explanation in the following JSON format:
{{
    "explanation": "Clear, step-by-step explanation of the concept",
    "key_concepts": [
        "Important concept to understand",
        "Another key point"
    ],
    "examples": [
        "Relevant example to illustrate the concept",
        "Another helpful example"
    ],
    "common_mistakes": [
        "Common mistake students make",
        "Another typical error"
    ],
    "practice_tips": [
        "Tip for practicing this concept",
        "Another practice suggestion"
    ],
    "next_steps": "What the student should focus on next"
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

Make the explanation accessible and engaging. Use analogies and examples when helpful. Encourage the student's learning journey."""

    @staticmethod
    def adaptive_question_generation(subject: str, difficulty: str, topic: str = None, previous_questions: List[str] = None) -> str:
        """Template for generating adaptive questions"""
        context = ""
        if previous_questions:
            context = f"\nPrevious questions asked:\n" + "\n".join([f"- {q}" for q in previous_questions[-3:]])
        
        return f"""You are an expert educational content creator generating adaptive questions.

Subject: {subject}
Difficulty Level: {difficulty}
Topic: {topic or "general"}{context}

Please generate a question in the following JSON format:
{{
    "question": "The question text",
    "type": "multiple-choice/essay",
    "subject": "{subject}",
    "difficulty": "{difficulty}",
    "topic": "{topic or 'general'}",
    "options": [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
    ],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of the correct answer",
    "learning_objectives": [
        "Specific learning objective",
        "Another objective"
    ],
    "prerequisites": [
        "Knowledge needed to answer this question",
        "Another prerequisite"
    ]
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

The question should be appropriate for the specified difficulty level and build upon previous learning. Make it engaging and educational."""

    @staticmethod
    def conversation_tutoring(student_message: str, conversation_history: List[Dict] = None) -> str:
        """Template for conversational tutoring"""
        # Validate inputs
        student_message = PromptTemplates._validate_input(student_message, 2000)
        history = PromptTemplates._format_conversation_history(conversation_history or [])
        
        history_text = f"\nConversation History:\n{history}" if history else ""
        
        return f"""You are a friendly, knowledgeable tutor having a conversation with a student.

{history_text}

Current Student Message: {student_message}

Please respond in the following JSON format:
{{
    "response": "Your helpful, encouraging response",
    "response_type": "explanation/question/encouragement/guidance",
    "suggested_questions": [
        "Follow-up question to deepen understanding",
        "Another helpful question"
    ],
    "resources": [
        "Suggested resource or reference",
        "Another helpful resource"
    ],
    "confidence_level": "high/medium/low",
    "next_topic_suggestion": "What topic to explore next"
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

Be conversational, encouraging, and educational. Ask follow-up questions to ensure understanding. Keep responses concise but helpful."""

    @staticmethod
    def image_analysis_question(image_description: str, question: str, student_answer: str) -> str:
        """Template for analyzing image-based questions"""
        return f"""You are an expert tutor evaluating a student's answer to an image-based question.

Image Description: {image_description}
Question: {question}
Student's Answer: {student_answer}

Please provide an evaluation in the following JSON format:
{{
    "correct": true/false,
    "feedback": "Detailed feedback on the answer",
    "score": 0-100,
    "visual_analysis": "Analysis of how well the student interpreted the image",
    "suggestions": [
        "Suggestion for improving visual analysis",
        "Another helpful tip"
    ],
    "key_visual_elements": [
        "Important visual element the student should notice",
        "Another key element"
    ]
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

Focus on both the accuracy of the answer and the student's ability to analyze visual information."""

    @staticmethod
    def learning_path_recommendation(student_progress: Dict[str, Any], subjects: List[str]) -> str:
        """Template for generating personalized learning paths"""
        return f"""You are an expert educational advisor creating personalized learning paths.

Student Progress: {student_progress}
Available Subjects: {subjects}

Please provide a learning path recommendation in the following JSON format:
{{
    "recommended_subjects": [
        {{
            "subject": "subject_name",
            "priority": "high/medium/low",
            "reason": "Why this subject is recommended"
        }}
    ],
    "learning_sequence": [
        {{
            "topic": "specific_topic",
            "difficulty": "beginner/intermediate/advanced",
            "estimated_time": "time_estimate",
            "prerequisites": ["required_knowledge"]
        }}
    ],
    "goals": [
        "Specific learning goal",
        "Another goal"
    ],
    "study_tips": [
        "Personalized study tip",
        "Another helpful tip"
    ],
    "progress_milestones": [
        "Milestone to track progress",
        "Another milestone"
    ]
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

Base recommendations on the student's current progress and learning patterns. Be encouraging and realistic."""

    @staticmethod
    def error_analysis(student_errors: List[str], subject: str) -> str:
        """Template for analyzing student errors and providing targeted help"""
        return f"""You are an expert educational diagnostician analyzing student errors.

Subject: {subject}
Student Errors:
{chr(10).join([f"- {error}" for error in student_errors])}

Please provide an error analysis in the following JSON format:
{{
    "error_patterns": [
        {{
            "pattern": "Type of error pattern",
            "frequency": "how often it occurs",
            "root_cause": "underlying cause of the error"
        }}
    ],
    "targeted_remediation": [
        {{
            "error_type": "specific error",
            "remediation_strategy": "how to address it",
            "practice_exercises": ["specific exercises to practice"]
        }}
    ],
    "learning_gaps": [
        "Identified knowledge gap",
        "Another gap"
    ],
    "recommended_focus": [
        "Area to focus on first",
        "Another priority area"
    ],
    "encouragement": "Motivational message about learning from mistakes"
}}

IMPORTANT: Respond ONLY with valid JSON. Do not include any additional text before or after the JSON response.

Focus on identifying patterns and providing specific, actionable strategies for improvement."""
