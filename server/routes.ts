import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatWithAI } from "./openai";
import { generateTestQuestions, generateFullTest, demoQuestions } from "./testGenerator";
import interviewRoutes from "./interview";
import { aiAgent } from "./aiAgent";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    // In a real app, verify the Firebase token here
    next();
  };

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      console.log('📨 Chat API called with body:', req.body);
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        console.log('❌ Invalid message format');
        return res.status(400).json({ error: "Message is required" });
      }

      if (message.trim().length === 0) {
        console.log('❌ Empty message');
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      console.log('🔄 Processing message:', message.substring(0, 50) + '...');
      const response = await chatWithAI(message.trim(), context);
      
      if (!response || response.trim().length === 0) {
        console.log('⚠️ Empty response from chatWithAI, using fallback');
        const fallbackMessage = "I'm your AI programming tutor! I can help you with:\n\n• **JavaScript** - Variables, functions, async/await, React\n• **Python** - Syntax, data structures, classes, libraries\n• **Web Development** - HTML, CSS, APIs, databases\n• **Algorithms** - Sorting, searching, data structures\n\nAsk me about any programming topic you'd like to learn!";
        return res.json({ response: fallbackMessage });
      }
      
      console.log('✅ Sending response:', response.substring(0, 50) + '...');
      res.json({ response: response.trim() });
    } catch (error) {
      console.error("❌ Chat route error:", error);
      const fallbackMessage = "I'm your AI programming tutor! I can help you with:\n\n• **JavaScript** - Variables, functions, async/await, React\n• **Python** - Syntax, data structures, classes, libraries\n• **Web Development** - HTML, CSS, APIs, databases\n• **Algorithms** - Sorting, searching, data structures\n\nAsk me about any programming topic you'd like to learn!";
      res.json({ response: fallbackMessage });
    }
  });

  // Courses endpoints
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // User progress endpoints
  app.get("/api/user/progress", requireAuth, async (req, res) => {
    try {
      // Get user ID from Firebase token (implement token verification)
      const userId = (req as any).user?.uid || 'demo-user';
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Get progress error:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/user/enroll", requireAuth, async (req, res) => {
    try {
      const { courseId } = req.body;
      const userId = (req as any).user?.uid || 'demo-user';
      
      if (!courseId) {
        return res.status(400).json({ error: "Course ID is required" });
      }

      await storage.enrollUserInCourse(userId, courseId);
      res.json({ success: true, message: "Successfully enrolled in course" });
    } catch (error) {
      console.error("Enroll error:", error);
      res.status(500).json({ error: "Failed to enroll in course" });
    }
  });

  // Community endpoints
  app.get("/api/community/discussions", async (req, res) => {
    try {
      const discussions = await storage.getDiscussions();
      res.json(discussions);
    } catch (error) {
      console.error("Get discussions error:", error);
      res.status(500).json({ error: "Failed to fetch discussions" });
    }
  });

  app.post("/api/community/discussions", requireAuth, async (req, res) => {
    try {
      const { title, content, category } = req.body;
      const userId = (req as any).user?.uid || 'demo-user';
      
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      const discussion = await storage.createDiscussion({
        title,
        content,
        category: category || 'general',
        authorId: userId,
        createdAt: new Date().toISOString()
      });
      
      res.status(201).json(discussion);
    } catch (error) {
      console.error("Create discussion error:", error);
      res.status(500).json({ error: "Failed to create discussion" });
    }
  });

  // Test generation endpoints
  app.get("/api/tests/demo/:topic", async (req, res) => {
    try {
      const { topic } = req.params;
      const { count = 20 } = req.query;
      
      console.log(`Generating test for topic: ${topic}, count: ${count}`);
      const questions = await generateTestQuestions(topic, 'Medium', parseInt(count as string));
      
      // Format questions to match frontend expectations
      const formattedQuestions = questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer, // Keep as index for TestTaking component
        difficulty: q.difficulty,
        topic: q.topic,
        explanation: q.explanation
      }));
      
      console.log(`Generated ${formattedQuestions.length} questions for ${topic}`);
      res.json({ questions: formattedQuestions });
    } catch (error) {
      console.error("Generate test error:", error);
      res.status(500).json({ error: "Failed to generate test questions" });
    }
  });

  app.post("/api/tests/generate", async (req, res) => {
    try {
      const { courseTitle, topics, difficulty = 'Medium' } = req.body;
      
      if (!courseTitle || !topics || !Array.isArray(topics)) {
        return res.status(400).json({ error: "Course title and topics array are required" });
      }

      const test = await generateFullTest(courseTitle, topics, difficulty);
      res.json(test);
    } catch (error) {
      console.error("Generate full test error:", error);
      res.status(500).json({ error: "Failed to generate test" });
    }
  });

  app.get("/api/tests/demo-questions", (req, res) => {
    res.json(demoQuestions);
  });

  // Test analysis endpoint
  app.post("/api/generate-test-analysis", async (req, res) => {
    try {
      const { testResults, questions, userAnswers } = req.body;
      
      if (!testResults || !questions || !userAnswers) {
        return res.status(400).json({ error: "Test results, questions, and user answers are required" });
      }

      // Generate AI analysis using the existing chatWithAI function
      const analysisPrompt = `
        Analyze this test performance and provide detailed feedback:
        
        Test Results:
        - Score: ${testResults.score}%
        - Correct Answers: ${testResults.correctAnswers}/${testResults.totalQuestions}
        - Time Taken: ${Math.floor(testResults.timeTaken / 60)}m ${testResults.timeTaken % 60}s
        
        Questions and Answers:
        ${questions.map((q: any, i: number) => {
          const userAnswer = userAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          return `
          Q${i + 1}: ${q.question}
          User Answer: ${q.options[userAnswer] || 'Not answered'}
          Correct Answer: ${q.options[q.correctAnswer]}
          Result: ${isCorrect ? 'Correct' : 'Incorrect'}
          Topic: ${q.concepts ? q.concepts.join(', ') : q.difficulty || 'General'}
          `;
        }).join('\n')}
        
        Please provide a JSON response with:
        {
          "overallAssessment": "Brief overall performance summary",
          "strengths": ["Array of topics/concepts the student performed well in"],
          "weaknesses": ["Array of topics/concepts that need improvement"],
          "recommendations": "Specific study recommendations",
          "nextSteps": "Suggested next actions for improvement"
        }
      `;

      const aiResponse = await chatWithAI(analysisPrompt);
      
      // Try to parse the AI response as JSON, fallback to structured response if it fails
      let analysis;
      try {
        analysis = JSON.parse(aiResponse);
      } catch (parseError) {
        // Fallback analysis if AI doesn't return valid JSON
        const score = testResults.score;
        const correctCount = testResults.correctAnswers;
        const totalQuestions = testResults.totalQuestions;
        
        // Extract topics from questions
        const allTopics = questions.flatMap((q: any) => q.concepts || [q.difficulty || 'General']);
        const correctTopics = questions
          .filter((q: any) => userAnswers[q.id] === q.correctAnswer)
          .flatMap((q: any) => q.concepts || [q.difficulty || 'General']);
        const incorrectTopics = questions
          .filter((q: any) => userAnswers[q.id] !== q.correctAnswer)
          .flatMap((q: any) => q.concepts || [q.difficulty || 'General']);
        
        analysis = {
          overallAssessment: score >= 80 ? 'Excellent performance! You have a strong grasp of the concepts.' : 
                           score >= 60 ? 'Good job! You understand most concepts but have room for improvement.' : 
                           'Keep studying! Focus on understanding the fundamental concepts.',
          strengths: Array.from(new Set(correctTopics)).slice(0, 5),
          weaknesses: Array.from(new Set(incorrectTopics)).slice(0, 5),
          recommendations: score >= 80 ? 'Continue with advanced topics and real-world applications.' : 
                          score >= 60 ? 'Review the concepts you missed and practice similar problems.' : 
                          'Focus on fundamentals and consider additional study resources.',
          nextSteps: score >= 70 ? 'Take more advanced tests and work on projects.' : 'Review study materials and retake this test.'
        };
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Generate test analysis error:", error);
      res.status(500).json({ error: "Failed to generate test analysis" });
    }
  });

  // Enhanced AI evaluation endpoints
  app.post("/api/ai/evaluate", async (req, res) => {
    try {
      const { question, answer, type = 'multiple-choice', context } = req.body;
      
      if (!question || !answer) {
        return res.status(400).json({ error: "Question and answer are required" });
      }

      console.log(`🤖 AI Evaluation: ${type} question`);
      const result = await aiAgent.evaluateAnswer(question, answer, type, context);
      
      res.json(result);
    } catch (error) {
      console.error("AI evaluation error:", error);
      res.status(500).json({ error: "Failed to evaluate answer" });
    }
  });

  app.post("/api/ai/generate-question", async (req, res) => {
    try {
      const { subject, difficulty = 'intermediate', topic, previousQuestions } = req.body;
      
      if (!subject) {
        return res.status(400).json({ error: "Subject is required" });
      }

      console.log(`🤖 Generating ${difficulty} question for ${subject}`);
      const result = await aiAgent.generateAdaptiveQuestion(subject, difficulty, topic, previousQuestions);
      
      res.json(result);
    } catch (error) {
      console.error("AI question generation error:", error);
      res.status(500).json({ error: "Failed to generate question" });
    }
  });

  app.post("/api/ai/tutoring-explanation", async (req, res) => {
    try {
      const { question, studentAnswer, correctAnswer } = req.body;
      
      if (!question || !studentAnswer) {
        return res.status(400).json({ error: "Question and student answer are required" });
      }

      console.log(`🤖 Providing tutoring explanation`);
      const result = await aiAgent.provideTutoringExplanation(question, studentAnswer, correctAnswer);
      
      res.json(result);
    } catch (error) {
      console.error("AI tutoring explanation error:", error);
      res.status(500).json({ error: "Failed to provide explanation" });
    }
  });

  app.post("/api/ai/conversational-tutoring", async (req, res) => {
    try {
      const { studentMessage, conversationHistory } = req.body;
      
      if (!studentMessage) {
        return res.status(400).json({ error: "Student message is required" });
      }

      console.log(`🤖 Conversational tutoring session`);
      const result = await aiAgent.conversationalTutoring(studentMessage, conversationHistory);
      
      res.json(result);
    } catch (error) {
      console.error("AI conversational tutoring error:", error);
      res.status(500).json({ error: "Failed to provide tutoring response" });
    }
  });

  app.post("/api/ai/learning-path", async (req, res) => {
    try {
      const { studentProgress, subjects } = req.body;
      
      if (!studentProgress || !subjects) {
        return res.status(400).json({ error: "Student progress and subjects are required" });
      }

      console.log(`🤖 Analyzing learning path`);
      const result = await aiAgent.analyzeLearningPath(studentProgress, subjects);
      
      res.json(result);
    } catch (error) {
      console.error("AI learning path error:", error);
      res.status(500).json({ error: "Failed to analyze learning path" });
    }
  });

  app.post("/api/ai/error-analysis", async (req, res) => {
    try {
      const { studentErrors, subject } = req.body;
      
      if (!studentErrors || !subject) {
        return res.status(400).json({ error: "Student errors and subject are required" });
      }

      console.log(`🤖 Analyzing student errors in ${subject}`);
      const result = await aiAgent.analyzeErrors(studentErrors, subject);
      
      res.json(result);
    } catch (error) {
      console.error("AI error analysis error:", error);
      res.status(500).json({ error: "Failed to analyze errors" });
    }
  });

  app.get("/api/ai/provider-status", async (req, res) => {
    try {
      console.log(`🤖 Checking AI provider status`);
      const result = await aiAgent.getProviderStatus();
      
      res.json(result);
    } catch (error) {
      console.error("AI provider status error:", error);
      res.status(500).json({ error: "Failed to get provider status" });
    }
  });

  // Interview routes
  app.use("/api/interview", interviewRoutes);

  // API Test endpoint
  app.get("/api/test-openrouter", async (req, res) => {
    try {
      console.log('🧪 Testing OpenRouter API...');
      const testResponse = await chatWithAI("Hello, can you say 'API is working'?");
      res.json({ 
        status: "success", 
        response: testResponse,
        apiKeyPresent: !!process.env.OPENROUTER_API_KEY,
        timestamp: new Date().toISOString() 
      });
    } catch (error: any) {
      console.error('Test endpoint error:', error);
      res.json({ 
        status: "error", 
        error: error?.message || 'Unknown error',
        apiKeyPresent: !!process.env.OPENROUTER_API_KEY,
        timestamp: new Date().toISOString() 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
