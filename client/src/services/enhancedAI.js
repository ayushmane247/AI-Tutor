class EnhancedAIService {
  constructor() {
    this.baseURL = '/api/ai';
  }

  /**
   * Evaluate a student's answer using enhanced AI
   */
  async evaluateAnswer(question, answer, type = 'multiple-choice', context = {}) {
    try {
      const response = await fetch(`${this.baseURL}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          type,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`AI evaluation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced AI evaluation error:', error);
      return this.getFallbackEvaluation();
    }
  }

  /**
   * Generate adaptive questions based on student performance
   */
  async generateAdaptiveQuestion(subject, difficulty = 'intermediate', topic = null, previousQuestions = []) {
    try {
      const response = await fetch(`${this.baseURL}/generate-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          difficulty,
          topic,
          previousQuestions
        })
      });

      if (!response.ok) {
        throw new Error(`Question generation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced AI question generation error:', error);
      return this.getFallbackQuestion(subject, difficulty);
    }
  }

  /**
   * Get detailed tutoring explanation for a question
   */
  async getTutoringExplanation(question, studentAnswer, correctAnswer = null) {
    try {
      const response = await fetch(`${this.baseURL}/tutoring-explanation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          studentAnswer,
          correctAnswer
        })
      });

      if (!response.ok) {
        throw new Error(`Tutoring explanation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced AI tutoring explanation error:', error);
      return this.getFallbackExplanation();
    }
  }

  /**
   * Conversational tutoring for interactive learning
   */
  async conversationalTutoring(studentMessage, conversationHistory = []) {
    try {
      const response = await fetch(`${this.baseURL}/conversational-tutoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentMessage,
          conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`Conversational tutoring failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced AI conversational tutoring error:', error);
      return this.getFallbackConversation();
    }
  }

  /**
   * Analyze learning path and provide personalized recommendations
   */
  async analyzeLearningPath(studentProgress, subjects) {
    try {
      const response = await fetch(`${this.baseURL}/learning-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentProgress,
          subjects
        })
      });

      if (!response.ok) {
        throw new Error(`Learning path analysis failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced AI learning path error:', error);
      return this.getFallbackLearningPath(subjects);
    }
  }

  /**
   * Analyze student errors and provide targeted remediation
   */
  async analyzeErrors(studentErrors, subject) {
    try {
      const response = await fetch(`${this.baseURL}/error-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentErrors,
          subject
        })
      });

      if (!response.ok) {
        throw new Error(`Error analysis failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced AI error analysis error:', error);
      return this.getFallbackErrorAnalysis();
    }
  }

  /**
   * Get AI provider status
   */
  async getProviderStatus() {
    try {
      const response = await fetch(`${this.baseURL}/provider-status`);
      
      if (!response.ok) {
        throw new Error(`Provider status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced AI provider status error:', error);
      return { error: 'Unable to check provider status' };
    }
  }

  /**
   * Batch evaluate multiple answers for efficiency
   */
  async batchEvaluate(evaluations) {
    const results = [];
    
    for (const evaluation of evaluations) {
      const result = await this.evaluateAnswer(
        evaluation.question,
        evaluation.answer,
        evaluation.type,
        evaluation.context
      );
      results.push({
        ...evaluation,
        result
      });
    }
    
    return results;
  }

  // Fallback methods
  getFallbackEvaluation() {
    return {
      correct: true,
      feedback: 'AI system is currently setting up. Your answer has been recorded.',
      score: 75,
      nextDifficulty: 'intermediate',
      suggestions: ['Keep practicing', 'Review the concepts'],
      provider: 'fallback'
    };
  }

  getFallbackQuestion(subject, difficulty) {
    const questions = {
      'Mathematics': {
        'beginner': {
          question: 'What is 2 + 3?',
          options: ['4', '5', '6', '7'],
          correctAnswer: 1
        },
        'intermediate': {
          question: 'What is the value of x in 2x + 5 = 11?',
          options: ['2', '3', '4', '5'],
          correctAnswer: 1
        },
        'advanced': {
          question: 'What is the derivative of x²?',
          options: ['x', '2x', 'x²', '2x²'],
          correctAnswer: 1
        }
      }
    };

    const subjectQuestions = questions[subject] || questions['Mathematics'];
    const questionData = subjectQuestions[difficulty] || subjectQuestions['beginner'];

    return {
      question: questionData.question,
      type: 'multiple-choice',
      subject,
      difficulty,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: 'This is a fallback question while the AI system is being set up.',
      provider: 'fallback'
    };
  }

  getFallbackExplanation() {
    return {
      explanation: 'Let me help you understand this concept better.',
      key_concepts: ['Core concept', 'Fundamental principle'],
      examples: ['Example 1', 'Example 2'],
      common_mistakes: ['Common error pattern'],
      practice_tips: ['Practice regularly', 'Review fundamentals'],
      next_steps: 'Continue practicing similar problems.',
      provider: 'fallback'
    };
  }

  getFallbackConversation() {
    return {
      response: 'I understand your question. The AI tutoring system is being set up to provide better assistance.',
      response_type: 'explanation',
      suggested_questions: ['Can you tell me more about what you\'re working on?'],
      resources: ['Review your study materials'],
      confidence_level: 'medium',
      next_topic_suggestion: 'Continue with current topic',
      provider: 'fallback'
    };
  }

  getFallbackLearningPath(subjects) {
    return {
      recommended_subjects: subjects.map(subject => ({
        subject,
        priority: 'medium',
        reason: 'Good foundation for learning'
      })),
      learning_sequence: [
        {
          topic: 'Basic concepts',
          difficulty: 'beginner',
          estimated_time: '1 hour',
          prerequisites: []
        }
      ],
      goals: ['Master fundamental concepts'],
      study_tips: ['Practice regularly', 'Review previous material'],
      progress_milestones: ['Complete basic concepts'],
      provider: 'fallback'
    };
  }

  getFallbackErrorAnalysis() {
    return {
      error_patterns: [
        {
          pattern: 'General errors',
          frequency: 'occasional',
          root_cause: 'Need more practice'
        }
      ],
      targeted_remediation: [
        {
          error_type: 'general',
          remediation_strategy: 'Practice more problems',
          practice_exercises: ['Basic exercises']
        }
      ],
      learning_gaps: ['Basic understanding'],
      recommended_focus: ['Fundamental concepts'],
      encouragement: 'Keep practicing, you\'re making progress!',
      provider: 'fallback'
    };
  }
}

export default new EnhancedAIService();
