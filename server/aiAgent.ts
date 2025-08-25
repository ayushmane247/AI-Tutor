import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AIEvaluationRequest {
  action: string;
  question?: string;
  answer?: string;
  type?: string;
  context?: any;
  subject?: string;
  difficulty?: string;
  topic?: string;
  previousQuestions?: string[];
  studentMessage?: string;
  conversationHistory?: any[];
  studentProgress?: any;
  subjects?: string[];
  studentErrors?: string[];
}

export interface AIEvaluationResponse {
  correct?: boolean;
  feedback?: string;
  score?: number;
  nextDifficulty?: string;
  suggestions?: string[];
  explanation?: string;
  provider?: string;
  usage?: any;
  error?: string;
  [key: string]: any;
}

class AIAgent {
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    // Path to the Python AI agent script
    this.scriptPath = path.join(__dirname, '..', 'ai', 'enhanced_ai_agent.py');
    this.pythonPath = 'python3'; // or 'python' depending on system
  }

  /**
   * Call the Python AI agent with the given request
   */
  async callAI(request: AIEvaluationRequest): Promise<AIEvaluationResponse> {
    return new Promise((resolve, reject) => {
      const requestJson = JSON.stringify(request);
      
      console.log(`🤖 Calling AI agent with action: ${request.action}`);
      
      // Spawn Python process
      const pythonProcess = spawn(this.pythonPath, [this.scriptPath, requestJson], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.join(__dirname, '..', 'ai')
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ Python process exited with code ${code}`);
          console.error(`stderr: ${stderr}`);
          
          // Return fallback response instead of rejecting
          resolve(this.getFallbackResponse(request.action));
          return;
        }

        try {
          const response = JSON.parse(stdout.trim());
          console.log(`✅ AI agent responded successfully`);
          resolve(response);
        } catch (parseError) {
          console.error(`❌ Failed to parse AI response: ${parseError}`);
          console.error(`stdout: ${stdout}`);
          
          // Return fallback response
          resolve(this.getFallbackResponse(request.action));
        }
      });

      pythonProcess.on('error', (error) => {
        console.error(`❌ Failed to start Python process: ${error}`);
        resolve(this.getFallbackResponse(request.action));
      });

      // Set timeout to prevent hanging
      setTimeout(() => {
        pythonProcess.kill();
        console.error('❌ AI agent timeout');
        resolve(this.getFallbackResponse(request.action));
      }, 30000); // 30 second timeout
    });
  }

  /**
   * Evaluate a student's answer
   */
  async evaluateAnswer(
    question: string, 
    answer: string, 
    type: string = 'multiple-choice', 
    context?: any
  ): Promise<AIEvaluationResponse> {
    return this.callAI({
      action: 'evaluate_answer',
      question,
      answer,
      type,
      context
    });
  }

  /**
   * Generate an adaptive question
   */
  async generateAdaptiveQuestion(
    subject: string,
    difficulty: string,
    topic?: string,
    previousQuestions?: string[]
  ): Promise<AIEvaluationResponse> {
    return this.callAI({
      action: 'generate_adaptive_question',
      subject,
      difficulty,
      topic,
      previousQuestions
    });
  }

  /**
   * Provide tutoring explanation
   */
  async provideTutoringExplanation(
    question: string,
    studentAnswer: string,
    correctAnswer?: string
  ): Promise<AIEvaluationResponse> {
    return this.callAI({
      action: 'provide_tutoring_explanation',
      question,
      answer: studentAnswer,
      context: { correctAnswer }
    });
  }

  /**
   * Conversational tutoring
   */
  async conversationalTutoring(
    studentMessage: string,
    conversationHistory?: any[]
  ): Promise<AIEvaluationResponse> {
    return this.callAI({
      action: 'conversational_tutoring',
      studentMessage,
      conversationHistory
    });
  }

  /**
   * Analyze learning path
   */
  async analyzeLearningPath(
    studentProgress: any,
    subjects: string[]
  ): Promise<AIEvaluationResponse> {
    return this.callAI({
      action: 'analyze_learning_path',
      studentProgress,
      subjects
    });
  }

  /**
   * Analyze student errors
   */
  async analyzeErrors(
    studentErrors: string[],
    subject: string
  ): Promise<AIEvaluationResponse> {
    return this.callAI({
      action: 'analyze_errors',
      studentErrors,
      subject
    });
  }

  /**
   * Get provider status
   */
  async getProviderStatus(): Promise<AIEvaluationResponse> {
    return this.callAI({
      action: 'get_provider_status'
    });
  }

  /**
   * Generate fallback response when AI system fails
   */
  private getFallbackResponse(action: string): AIEvaluationResponse {
    switch (action) {
      case 'evaluate_answer':
        return {
          correct: true,
          feedback: 'Good work! Your understanding is developing well.',
          score: 75,
          nextDifficulty: 'intermediate',
          suggestions: ['Keep practicing similar problems', 'Review the concepts'],
          explanation: 'This is a fallback response. The AI system is currently unavailable.',
          provider: 'fallback'
        };
      
      case 'generate_adaptive_question':
        return {
          question: 'What is 2 + 2?',
          type: 'multiple-choice',
          options: ['3', '4', '5', '6'],
          correctAnswer: 1,
          explanation: 'This is a basic arithmetic question.',
          provider: 'fallback'
        };
      
      case 'conversational_tutoring':
        return {
          response: 'I understand your question. Let me help you with that. The AI system is currently being set up.',
          response_type: 'explanation',
          suggested_questions: ['Can you tell me more about what you\'re working on?'],
          resources: ['Review your study materials'],
          confidence_level: 'medium',
          provider: 'fallback'
        };
      
      default:
        return {
          error: 'AI system is currently unavailable. Please try again later.',
          provider: 'fallback'
        };
    }
  }
}

// Export singleton instance
export const aiAgent = new AIAgent();
