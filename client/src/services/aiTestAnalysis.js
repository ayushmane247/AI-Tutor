class AITestAnalysisService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.enhancedAIURL = '/api/ai'; // Local enhanced AI endpoints
  }

  async analyzeAnswer(question, userAnswer, correctAnswer, topic) {
    try {
      // Try enhanced AI first
      const enhancedResult = await this.analyzeAnswerEnhanced(question, userAnswer, correctAnswer, topic);
      if (enhancedResult && !enhancedResult.error) {
        return this.formatEnhancedAnalysis(enhancedResult);
      }
    } catch (error) {
      console.warn('Enhanced AI unavailable, falling back to OpenRouter:', error);
    }

    // Fallback to OpenRouter
    try {
      const prompt = `
        Analyze this programming test answer:
        
        Topic: ${topic}
        Question: ${question}
        Correct Answer: ${correctAnswer}
        User Answer: ${userAnswer}
        
        Provide a detailed analysis in JSON format:
        {
          "score": number (0-100),
          "isCorrect": boolean,
          "feedback": "detailed explanation",
          "strengths": ["strength1", "strength2"],
          "weaknesses": ["weakness1", "weakness2"],
          "suggestions": ["suggestion1", "suggestion2"],
          "conceptsUnderstood": ["concept1", "concept2"],
          "conceptsMissed": ["concept1", "concept2"],
          "difficulty": "Easy|Medium|Hard",
          "timeToImprove": "estimated time in hours"
        }
      `;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Education Platform'
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.getFallbackAnalysis(userAnswer, correctAnswer);
    }
  }

  async analyzeAnswerEnhanced(question, userAnswer, correctAnswer, topic) {
    const response = await fetch(`${this.enhancedAIURL}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        answer: userAnswer,
        type: 'multiple-choice',
        context: {
          correctAnswer,
          topic,
          options: [userAnswer, correctAnswer] // Simple context
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Enhanced AI request failed: ${response.status}`);
    }

    return await response.json();
  }

  formatEnhancedAnalysis(enhancedResult) {
    return {
      score: enhancedResult.score || 0,
      isCorrect: enhancedResult.correct || false,
      feedback: enhancedResult.feedback || enhancedResult.explanation || 'No feedback available',
      strengths: enhancedResult.suggestions?.filter(s => s.includes('good') || s.includes('correct')) || [],
      weaknesses: enhancedResult.suggestions?.filter(s => s.includes('improve') || s.includes('review')) || [],
      suggestions: enhancedResult.suggestions || [],
      conceptsUnderstood: enhancedResult.correct ? ['Core concept mastery'] : [],
      conceptsMissed: !enhancedResult.correct ? ['Fundamental understanding'] : [],
      difficulty: enhancedResult.nextDifficulty || 'Medium',
      timeToImprove: enhancedResult.correct ? 'Continue current pace' : '2-4 hours',
      provider: enhancedResult.provider || 'enhanced-ai'
    };
  }

  async generateTestSummary(testResults) {
    try {
      const prompt = `
        Analyze this complete test performance:
        
        Test Results: ${JSON.stringify(testResults)}
        
        Generate a comprehensive summary in JSON format:
        {
          "overallScore": number,
          "grade": "A+|A|B+|B|C+|C|D|F",
          "performance": "Excellent|Good|Average|Below Average|Poor",
          "strongAreas": ["area1", "area2"],
          "weakAreas": ["area1", "area2"],
          "studyPlan": {
            "immediate": ["action1", "action2"],
            "shortTerm": ["goal1", "goal2"],
            "longTerm": ["goal1", "goal2"]
          },
          "nextSteps": ["step1", "step2"],
          "estimatedStudyTime": "X hours per week",
          "recommendedCourses": ["course1", "course2"],
          "skillLevel": "Beginner|Intermediate|Advanced"
        }
      `;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Education Platform'
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Test Summary Error:', error);
      return this.getFallbackSummary(testResults);
    }
  }

  async generatePersonalizedFeedback(userProfile, testHistory) {
    try {
      const prompt = `
        Generate personalized learning feedback:
        
        User Profile: ${JSON.stringify(userProfile)}
        Test History: ${JSON.stringify(testHistory)}
        
        Provide personalized insights in JSON format:
        {
          "learningStyle": "Visual|Auditory|Kinesthetic|Mixed",
          "progressTrend": "Improving|Stable|Declining",
          "motivationalMessage": "encouraging message",
          "personalizedTips": ["tip1", "tip2", "tip3"],
          "challengeAreas": ["area1", "area2"],
          "achievements": ["achievement1", "achievement2"],
          "goalSuggestions": ["goal1", "goal2"],
          "confidenceLevel": number (0-100)
        }
      `;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Education Platform'
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 1200
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Personalized Feedback Error:', error);
      return this.getFallbackPersonalizedFeedback();
    }
  }

  getFallbackAnalysis(userAnswer, correctAnswer) {
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    const partialMatch = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) || 
                        correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());
    
    let score = 0;
    if (isCorrect) score = 100;
    else if (partialMatch && userAnswer.trim().length > 0) score = 60;
    else if (userAnswer.trim().length > 0) score = 30;
    
    return {
      score,
      isCorrect,
      feedback: isCorrect 
        ? "Excellent! Your answer is completely correct." 
        : partialMatch 
        ? "Your answer shows some understanding but needs refinement. Review the correct answer for complete accuracy."
        : userAnswer.trim().length > 0
        ? "Your answer shows effort but doesn't match the expected response. Please review the concept and try again."
        : "No answer provided. Make sure to attempt all questions for better learning outcomes.",
      strengths: isCorrect 
        ? ["Correct understanding", "Good knowledge retention"] 
        : partialMatch 
        ? ["Shows basic understanding", "Attempted the question"] 
        : userAnswer.trim().length > 0 
        ? ["Attempted the question"] 
        : [],
      weaknesses: isCorrect 
        ? [] 
        : partialMatch 
        ? ["Needs more precision", "Review key details"] 
        : ["Concept understanding needed", "Review fundamental principles"],
      suggestions: isCorrect 
        ? ["Continue practicing similar problems", "Try more advanced questions"] 
        : partialMatch 
        ? ["Review the correct answer carefully", "Practice similar questions", "Focus on key terminology"] 
        : ["Study the topic thoroughly", "Practice basic concepts", "Seek additional resources"],
      conceptsUnderstood: isCorrect 
        ? ["Core concept mastery", "Practical application"] 
        : partialMatch 
        ? ["Basic concept recognition"] 
        : [],
      conceptsMissed: isCorrect 
        ? [] 
        : partialMatch 
        ? ["Detailed understanding", "Precise terminology"] 
        : ["Fundamental concept", "Core principles", "Basic terminology"],
      difficulty: partialMatch ? "Medium" : "Hard",
      timeToImprove: isCorrect ? "Continue current pace" : partialMatch ? "2-4 hours" : "4-6 hours"
    };
  }

  getFallbackSummary(testResults) {
    const totalQuestions = testResults.length;
    const correctAnswers = testResults.filter(r => r.analysis.isCorrect).length;
    const averageScore = testResults.reduce((sum, r) => sum + r.analysis.score, 0) / totalQuestions;

    const getGrade = (score) => {
      if (score >= 95) return "A+";
      if (score >= 90) return "A";
      if (score >= 85) return "B+";
      if (score >= 80) return "B";
      if (score >= 75) return "C+";
      if (score >= 70) return "C";
      if (score >= 60) return "D";
      return "F";
    };

    const getPerformance = (score) => {
      if (score >= 90) return "Excellent";
      if (score >= 80) return "Good";
      if (score >= 70) return "Average";
      if (score >= 60) return "Below Average";
      return "Poor";
    };

    const getSkillLevel = (score) => {
      if (score >= 85) return "Advanced";
      if (score >= 70) return "Intermediate";
      return "Beginner";
    };

    // Analyze strong and weak areas based on results
    const allConcepts = testResults.flatMap(r => [...r.analysis.conceptsUnderstood, ...r.analysis.conceptsMissed]);
    const strongAreas = testResults.flatMap(r => r.analysis.conceptsUnderstood).filter((concept, index, self) => self.indexOf(concept) === index);
    const weakAreas = testResults.flatMap(r => r.analysis.conceptsMissed).filter((concept, index, self) => self.indexOf(concept) === index);

    return {
      overallScore: Math.round(averageScore),
      grade: getGrade(averageScore),
      performance: getPerformance(averageScore),
      strongAreas: strongAreas.length > 0 ? strongAreas : ["Basic understanding demonstrated"],
      weakAreas: weakAreas.length > 0 ? weakAreas : ["Continue practicing for improvement"],
      studyPlan: {
        immediate: [
          "Review all incorrect answers carefully",
          "Focus on missed concepts identified in analysis",
          "Practice similar questions in weak areas"
        ],
        shortTerm: [
          "Complete additional practice tests",
          "Study recommended topics systematically",
          "Seek help for challenging concepts"
        ],
        longTerm: [
          "Build comprehensive understanding of the subject",
          "Apply knowledge through practical projects",
          "Prepare for advanced level assessments"
        ]
      },
      nextSteps: [
        "Review detailed feedback for each question",
        "Create a focused study schedule",
        "Practice regularly with similar questions",
        "Track your progress over time"
      ],
      estimatedStudyTime: averageScore >= 80 ? "3-5 hours per week" : averageScore >= 60 ? "5-8 hours per week" : "8-12 hours per week",
      recommendedCourses: [
        "Fundamentals Review Course",
        "Advanced Practice Sessions",
        "Concept Mastery Workshop"
      ],
      skillLevel: getSkillLevel(averageScore)
    };
  }

  getFallbackPersonalizedFeedback() {
    return {
      learningStyle: "Mixed",
      progressTrend: "Stable",
      motivationalMessage: "Keep up the good work!",
      personalizedTips: ["Practice regularly", "Review concepts"],
      challengeAreas: ["Complex topics"],
      achievements: ["Completed test"],
      goalSuggestions: ["Improve accuracy"],
      confidenceLevel: 70
    };
  }
}

export default new AITestAnalysisService();
