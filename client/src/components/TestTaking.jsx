import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export default function TestTaking({ test, onComplete, onExit }) {
  // Add error handling and debugging
  console.log('TestTaking component received test:', test);
  
  if (!test) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error: No Test Data</h2>
            <p className="text-gray-600 mb-4">The test data could not be loaded.</p>
            <Button onClick={onExit}>Back to Tests</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!test.questions || !Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error: No Questions Available</h2>
            <p className="text-gray-600 mb-4">This test does not contain any questions.</p>
            <Button onClick={onExit}>Back to Tests</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(test.duration ? parseInt(test.duration) * 60 : 1800); // Default 30 minutes
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleTestComplete = async () => {
    const score = calculateScore();
    const results = {
      score,
      answers,
      totalQuestions: test.questions.length,
      correctAnswers: Object.entries(answers).filter(([qId, answer]) => {
        const question = test.questions.find(q => q.id === parseInt(qId));
        return question && question.correctAnswer === answer;
      }).length,
      timeTaken: (test.duration ? parseInt(test.duration) * 60 : 1800) - timeLeft,
      testTitle: test.title || 'Programming Test',
      completedAt: new Date().toISOString()
    };

    // Generate AI analysis
    try {
      const response = await fetch('/api/generate-test-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testResults: results,
          questions: test.questions,
          userAnswers: answers
        }),
      });

      if (response.ok) {
        const analysis = await response.json();
        results.analysis = analysis;
      }
    } catch (error) {
      console.error('Failed to generate AI analysis:', error);
      // Provide fallback analysis
      results.analysis = {
        overallAssessment: score >= 80 ? 'Excellent performance!' : score >= 60 ? 'Good job, keep practicing!' : 'Keep studying and try again!',
        strengths: getStrengths(),
        weaknesses: getWeakTopics(),
        recommendations: score >= 80 ? 'Continue with advanced topics' : 'Review the concepts you missed and practice more',
        nextSteps: 'Take more practice tests to improve your skills'
      };
    }

    // Save test report to localStorage
    const existingReports = JSON.parse(localStorage.getItem('testReports') || '[]');
    const updatedReports = [...existingReports, results];
    localStorage.setItem('testReports', JSON.stringify(updatedReports));

    setTestResults(results);
    setShowResults(true);
    onComplete(results);
  };

  const calculateScore = () => {
    const correctAnswers = Object.entries(answers).filter(([qId, answer]) => {
      const question = test.questions.find(q => q.id === parseInt(qId));
      return question && question.correctAnswer === answer;
    }).length;
    
    return Math.round((correctAnswers / test.questions.length) * 100);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getWeakTopics = () => {
    const weakTopics = [];
    Object.entries(answers).forEach(([qId, answer]) => {
      const question = test.questions.find(q => q.id === parseInt(qId));
      if (question && question.correctAnswer !== answer) {
        if (question.concepts) {
          weakTopics.push(...question.concepts);
        } else {
          weakTopics.push(question.difficulty || 'General');
        }
      }
    });
    return [...new Set(weakTopics)]; // Remove duplicates
  };

  const getStrengths = () => {
    const strengths = [];
    Object.entries(answers).forEach(([qId, answer]) => {
      const question = test.questions.find(q => q.id === parseInt(qId));
      if (question && question.correctAnswer === answer) {
        if (question.concepts) {
          strengths.push(...question.concepts);
        } else {
          strengths.push(question.difficulty || 'General');
        }
      }
    });
    return [...new Set(strengths)]; // Remove duplicates
  };

  const generateDetailedAnalysis = (score, correctCount) => {
    const totalQuestions = test.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    let performance = 'Needs Improvement';
    let recommendations = [];
    
    if (percentage >= 90) {
      performance = 'Excellent';
      recommendations = ['Continue with advanced topics', 'Consider helping others', 'Explore real-world projects'];
    } else if (percentage >= 80) {
      performance = 'Very Good';
      recommendations = ['Review missed questions', 'Practice advanced problems', 'Focus on weak areas'];
    } else if (percentage >= 70) {
      performance = 'Good';
      recommendations = ['Study fundamental concepts', 'Practice more problems', 'Review course materials'];
    } else if (percentage >= 60) {
      performance = 'Fair';
      recommendations = ['Focus on basics', 'Get additional help', 'Practice regularly', 'Review explanations carefully'];
    } else {
      performance = 'Needs Significant Improvement';
      recommendations = ['Start with fundamentals', 'Seek tutoring help', 'Practice basic concepts', 'Review course from beginning'];
    }
    
    return {
      performance,
      recommendations,
      timeEfficiency: timeLeft > 300 ? 'Good' : timeLeft > 60 ? 'Average' : 'Rushed',
      nextSteps: percentage >= 70 ? ['Move to next module', 'Take practice tests'] : ['Retake this test', 'Study weak areas']
    };
  };

  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const question = test.questions[currentQuestion];

  // Add safety check for current question
  if (!question) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error: Question Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load question {currentQuestion + 1}.</p>
            <Button onClick={onExit}>Back to Tests</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure question has required fields
  if (!question.question || !question.options || !Array.isArray(question.options)) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error: Invalid Question Data</h2>
            <p className="text-gray-600 mb-4">Question {currentQuestion + 1} has invalid data structure.</p>
            <div className="mt-4 space-x-4">
              <Button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>
                Previous Question
              </Button>
              <Button onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))} disabled={currentQuestion === test.questions.length - 1}>
                Next Question
              </Button>
              <Button onClick={onExit} variant="outline">Back to Tests</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctCount = Object.entries(answers).filter(([qId, answer]) => {
      const q = test.questions.find(q => q.id === parseInt(qId));
      return q && q.correctAnswer === answer;
    }).length;

    const analysis = generateDetailedAnalysis(score, correctCount);
    const weakTopics = getWeakTopics();
    const strengths = getStrengths();
    
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Overall Results Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Test Results</CardTitle>
            <div className="flex justify-center mb-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ${
                score >= 80 ? 'bg-green-100 text-green-600' :
                score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {score}%
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              You answered {correctCount} out of {test.questions.length} questions correctly
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-semibold text-blue-800">Performance</div>
                <div className="text-blue-600">{analysis.performance}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="font-semibold text-purple-800">Time Efficiency</div>
                <div className="text-purple-600">{analysis.timeEfficiency}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-semibold text-green-800">Time Taken</div>
                <div className="text-green-600">{Math.floor(((test.duration ? parseInt(test.duration) * 60 : 1800) - timeLeft) / 60)}m {((test.duration ? parseInt(test.duration) * 60 : 1800) - timeLeft) % 60}s</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          {strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {strengths.map((strength, index) => (
                    <div key={index} className="bg-green-50 p-2 rounded text-green-800 text-sm">
                      ✓ {strength}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Areas for Improvement */}
          {weakTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-orange-600 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weakTopics.map((topic, index) => (
                    <div key={index} className="bg-orange-50 p-2 rounded text-orange-800 text-sm">
                      📚 {topic}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">Study Recommendations:</h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">Next Steps:</h4>
                <ul className="space-y-2">
                  {analysis.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">→</span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {test.questions.map((q, index) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                
                return (
                  <div key={q.id} className={`border rounded-lg p-4 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Question {index + 1}</h4>
                        {q.difficulty && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            q.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                            q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {q.concepts && (
                          <div className="text-xs text-gray-500">
                            {q.concepts.join(', ')}
                          </div>
                        )}
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-800 mb-3">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === q.correctAnswer ? 'bg-green-100 text-green-800 border border-green-300' :
                            optionIndex === userAnswer && userAnswer !== q.correctAnswer ? 'bg-red-100 text-red-800 border border-red-300' :
                            'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <div className="flex space-x-2">
                              {optionIndex === q.correctAnswer && <span className="text-xs font-medium text-green-600">✓ Correct</span>}
                              {optionIndex === userAnswer && userAnswer !== q.correctAnswer && <span className="text-xs font-medium text-red-600">✗ Your answer</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-800 border border-blue-200">
                        <strong>💡 Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={onExit} className="bg-blue-600 hover:bg-blue-700">
                Back to Tests
              </Button>
              <Button 
                onClick={() => window.print()} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Print Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{test.title}</h1>
              <p className="text-gray-600">{test.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-lg font-semibold">
                <Clock className="w-5 h-5" />
                <span className={timeLeft < 300 ? 'text-red-600' : 'text-gray-800'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-sm text-gray-500">Time remaining</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {currentQuestion + 1} of {test.questions.length}</span>
              <span>Answered: {getAnsweredCount()}/{test.questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question {currentQuestion + 1}</CardTitle>
            <Badge variant="outline">{question.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[question.id] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[question.id] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[question.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onExit}>
                Exit Test
              </Button>
              {currentQuestion === test.questions.length - 1 ? (
                <Button 
                  onClick={handleTestComplete}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={getAnsweredCount() === 0}
                >
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === test.questions.length - 1}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
