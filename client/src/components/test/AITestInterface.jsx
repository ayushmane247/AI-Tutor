import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Brain, TrendingUp, Target } from 'lucide-react';
import aiTestAnalysis from '../../services/aiTestAnalysis';

export default function AITestInterface({ testData, onTestComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(testData.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [analysisResults, setAnalysisResults] = useState([]);

  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
  }, [testStarted, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    
    try {
      const results = [];
      
      console.log('Starting test analysis...', { 
        totalQuestions: testData.questions.length, 
        answersProvided: Object.keys(answers).length 
      });
      
      // Analyze each question with progress feedback
      for (let i = 0; i < testData.questions.length; i++) {
        const question = testData.questions[i];
        const userAnswer = answers[i] || '';
        
        console.log(`Analyzing question ${i + 1}/${testData.questions.length}...`, {
          question: question.question.substring(0, 50) + '...',
          userAnswer: userAnswer.substring(0, 50) + '...',
          correctAnswer: question.correctAnswer
        });
        
        const analysis = await aiTestAnalysis.analyzeAnswer(
          question.question,
          userAnswer,
          question.correctAnswer,
          testData.topic
        );
        
        console.log(`Question ${i + 1} analysis complete:`, analysis);
        
        results.push({
          questionIndex: i,
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          analysis
        });
      }
      
      setAnalysisResults(results);
      console.log('All questions analyzed:', results);
      
      console.log('Generating comprehensive test summary...');
      const testSummary = await aiTestAnalysis.generateTestSummary(results);
      console.log('Test summary generated:', testSummary);
      
      const finalResult = {
        results,
        summary: testSummary,
        testData,
        completedAt: new Date().toISOString()
      };
      
      console.log('Calling onTestComplete with:', finalResult);
      onTestComplete(finalResult);
      
    } catch (error) {
      console.error('Test submission error:', error);
      alert('There was an error analyzing your test. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const progress = ((currentQuestion + 1) / testData.questions.length) * 100;
  const currentQ = testData.questions[currentQuestion];

  if (!testStarted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {testData.title}
          </CardTitle>
          <p className="text-gray-600 mt-2">{testData.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Clock className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-600">Duration</span>
              <span className="font-semibold">{testData.duration} minutes</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Target className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-600">Questions</span>
              <span className="font-semibold">{testData.questions.length}</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-gray-600">Points</span>
              <span className="font-semibold">{testData.totalPoints}</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Brain className="w-8 h-8 text-orange-500" />
              <span className="text-sm text-gray-600">AI Analysis</span>
              <span className="font-semibold">Enabled</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Topics Covered:</h3>
            <div className="flex flex-wrap gap-2">
              {testData.topics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">AI-Powered Features:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Intelligent answer analysis and scoring</li>
              <li>• Personalized feedback on each response</li>
              <li>• Detailed performance insights and recommendations</li>
              <li>• Adaptive learning suggestions based on your answers</li>
            </ul>
          </div>
          
          <Button 
            onClick={startTest} 
            className="w-full py-3 text-lg font-semibold"
            size="lg"
          >
            Start AI-Powered Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show loading overlay during submission
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Your Test</h3>
          <p className="text-gray-600 mb-4">
            Our AI is carefully reviewing each of your answers and generating personalized feedback...
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              This may take a few moments. Please don't close this window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Test Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{testData.title}</h2>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600">
                <Brain className="w-4 h-4 mr-1" />
                AI Analysis
              </Badge>
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {testData.questions.length}
          </p>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-800 text-lg leading-relaxed">
            {currentQ.question}
          </p>
          
          {currentQ.type === 'multiple-choice' ? (
            <div className="space-y-2">
              {currentQ.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : currentQ.type === 'short-answer' ? (
            <Input
              placeholder="Enter your answer..."
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="text-lg"
            />
          ) : (
            <Textarea
              placeholder="Enter your detailed answer..."
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={6}
              className="text-lg"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {testData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[index]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            {currentQuestion === testData.questions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Analyzing Answers...' : 'Submit Test'}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
