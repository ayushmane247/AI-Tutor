import express from 'express';
import OpenAI from 'openai';
import { z } from 'zod';

const router = express.Router();

// Initialize OpenAI client with fallback handling
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    console.warn('OPENAI_API_KEY not found. AI features will use fallback responses.');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Validation schemas
const InterviewSessionSchema = z.object({
  type: z.enum(['technical', 'behavioral', 'hr']),
  position: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

const InterviewResponseSchema = z.object({
  sessionId: z.string(),
  questionIndex: z.number(),
  question: z.string(),
  answer: z.string(),
  confidence: z.number(),
  eyeContact: z.number(),
  speechClarity: z.number(),
  timestamp: z.number(),
});

const FeedbackRequestSchema = z.object({
  sessionId: z.string(),
  responses: z.array(InterviewResponseSchema.omit({ sessionId: true })),
  overallMetrics: z.object({
    avgConfidence: z.number(),
    avgEyeContact: z.number(),
    avgSpeechClarity: z.number(),
    totalDuration: z.number(),
  }),
});

// In-memory storage (replace with database in production)
const interviewSessions = new Map();
const interviewResponses = new Map();

// Generate AI-powered interview questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { type, position, experience, skills } = InterviewSessionSchema.parse(req.body);
    
    const prompt = `Generate 5 ${type} interview questions for a ${position || 'software developer'} position. 
    Experience level: ${experience || 'mid-level'}
    Skills: ${skills?.join(', ') || 'general programming'}
    
    Requirements:
    - Questions should be appropriate for the experience level
    - Include a mix of difficulty levels
    - For technical: focus on problem-solving and technical knowledge
    - For behavioral: focus on past experiences and soft skills
    - For HR: focus on motivation, culture fit, and career goals
    
    Return as a JSON array of strings.`;

    let completion;
    if (openai) {
      completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert interviewer. Generate relevant, professional interview questions based on the requirements. Return only a valid JSON array of question strings."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
    } else {
      // Fallback when OpenAI is not available
      throw new Error('OpenAI client not initialized');
    }

    let questions;
    try {
      questions = JSON.parse(completion.choices[0].message.content || '[]');
    } catch (parseError) {
      // Fallback questions if AI response is malformed
      questions = getDefaultQuestions(type);
    }

    // Create session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    interviewSessions.set(sessionId, {
      id: sessionId,
      type,
      position,
      experience,
      skills,
      questions,
      createdAt: new Date(),
      status: 'active'
    });

    res.json({
      sessionId,
      questions,
      type,
      totalQuestions: questions.length
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      fallback: getDefaultQuestions(req.body.type || 'technical')
    });
  }
});

// Save interview response
router.post('/save-response', async (req, res) => {
  try {
    const response = InterviewResponseSchema.parse(req.body);
    
    if (!interviewResponses.has(response.sessionId)) {
      interviewResponses.set(response.sessionId, []);
    }
    
    interviewResponses.get(response.sessionId).push(response);
    
    res.json({ success: true, message: 'Response saved' });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(400).json({ error: 'Invalid response data' });
  }
});

// Generate AI feedback
router.post('/generate-feedback', async (req, res) => {
  try {
    const { sessionId, responses, overallMetrics } = FeedbackRequestSchema.parse(req.body);
    
    const session = interviewSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Prepare responses for AI analysis
    const responseText = responses.map((r, index) => 
      `Q${index + 1}: ${r.question}\nA${index + 1}: ${r.answer}\nConfidence: ${r.confidence}%, Eye Contact: ${r.eyeContact}%, Speech Clarity: ${r.speechClarity}%\n`
    ).join('\n');

    const prompt = `Analyze this ${session.type} interview performance and provide detailed feedback:

Interview Type: ${session.type}
Position: ${session.position || 'Software Developer'}
Duration: ${Math.floor(overallMetrics.totalDuration / 60)} minutes

RESPONSES:
${responseText}

OVERALL METRICS:
- Average Confidence: ${overallMetrics.avgConfidence}%
- Average Eye Contact: ${overallMetrics.avgEyeContact}%
- Average Speech Clarity: ${overallMetrics.avgSpeechClarity}%

Please provide:
1. Overall score (0-100)
2. Detailed analysis of strengths and weaknesses
3. Specific recommendations for improvement
4. Assessment of technical knowledge (if applicable)
5. Communication skills evaluation
6. Areas for development

Format as JSON with the following structure:
{
  "overallScore": number,
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [string],
  "technicalAssessment": string,
  "communicationScore": number,
  "areasForDevelopment": [string],
  "summary": string
}`;

    let completion;
    if (openai) {
      completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert interview coach and HR professional. Provide constructive, detailed feedback on interview performance. Be specific and actionable in your recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });
    } else {
      // Fallback when OpenAI is not available
      throw new Error('OpenAI client not initialized');
    }

    let feedback;
    try {
      feedback = JSON.parse(completion.choices[0].message.content || '{}');
    } catch (parseError) {
      feedback = generateFallbackFeedback(overallMetrics, responses);
    }

    // Update session status
    session.status = 'completed';
    session.completedAt = new Date();
    session.feedback = feedback;

    res.json({
      sessionId,
      feedback,
      metrics: overallMetrics,
      completedAt: session.completedAt
    });

  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ 
      error: 'Failed to generate feedback',
      fallback: generateFallbackFeedback(req.body.overallMetrics, req.body.responses)
    });
  }
});

// Get interview session
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = interviewSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const responses = interviewResponses.get(sessionId) || [];
  
  res.json({
    session,
    responses,
    totalResponses: responses.length
  });
});

// Get user's interview history
router.get('/history/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Filter sessions by user (in production, you'd have proper user association)
  const userSessions = Array.from(interviewSessions.values())
    .filter(session => session.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  res.json({
    sessions: userSessions,
    total: userSessions.length
  });
});

// Analyze speech patterns (placeholder for advanced analysis)
router.post('/analyze-speech', async (req, res) => {
  try {
    const { audioData, transcript } = req.body;
    
    // In a real implementation, you would:
    // 1. Process audio data for speech patterns
    // 2. Analyze pace, tone, filler words
    // 3. Use speech-to-text APIs for accuracy
    
    // Mock analysis for now
    const analysis = {
      wordsPerMinute: Math.floor(Math.random() * 50) + 120,
      fillerWords: Math.floor(Math.random() * 10),
      pauseFrequency: Math.random() * 100,
      toneConfidence: Math.random() * 100,
      clarity: Math.random() * 100,
      suggestions: [
        "Speak at a moderate pace",
        "Reduce filler words like 'um' and 'uh'",
        "Take strategic pauses for emphasis",
        "Maintain consistent volume"
      ]
    };
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing speech:', error);
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
});

// Helper functions
function getDefaultQuestions(type: string): string[] {
  const defaultQuestions = {
    technical: [
      "Tell me about yourself and your technical background.",
      "Explain the difference between var, let, and const in JavaScript.",
      "How would you optimize a slow-performing web application?",
      "Describe your experience with version control systems like Git.",
      "Walk me through how you would debug a production issue."
    ],
    behavioral: [
      "Tell me about yourself and your professional journey.",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "How do you handle working under pressure and tight deadlines?",
      "Give me an example of when you had to work with a difficult team member.",
      "Where do you see yourself in the next 5 years?"
    ],
    hr: [
      "Tell me about yourself.",
      "Why are you interested in this position?",
      "What are your greatest strengths and weaknesses?",
      "Why are you leaving your current job?",
      "What salary expectations do you have?"
    ]
  };
  
  return defaultQuestions[type as keyof typeof defaultQuestions] || defaultQuestions.technical;
}

function generateFallbackFeedback(metrics: any, responses: any[]): any {
  const avgScore = (metrics.avgConfidence + metrics.avgEyeContact + metrics.avgSpeechClarity) / 3;
  
  return {
    overallScore: Math.round(avgScore),
    strengths: [
      avgScore > 70 ? "Strong overall performance" : "Shows potential for improvement",
      metrics.avgConfidence > 60 ? "Good confidence level" : "Room to build confidence",
      metrics.avgEyeContact > 50 ? "Maintains good eye contact" : "Can improve eye contact"
    ],
    weaknesses: [
      avgScore < 60 ? "Overall performance needs improvement" : "Minor areas for refinement",
      metrics.avgSpeechClarity < 70 ? "Speech clarity could be improved" : "Good communication clarity"
    ],
    recommendations: [
      "Practice mock interviews regularly",
      "Work on maintaining eye contact with the camera",
      "Speak clearly and at a moderate pace",
      "Prepare specific examples for common questions"
    ],
    technicalAssessment: "Based on responses, shows understanding of core concepts",
    communicationScore: Math.round(metrics.avgSpeechClarity),
    areasForDevelopment: [
      "Interview confidence",
      "Technical communication",
      "Body language awareness"
    ],
    summary: `Overall performance shows ${avgScore > 70 ? 'strong' : 'developing'} interview skills with room for continued growth.`
  };
}

export default router;
