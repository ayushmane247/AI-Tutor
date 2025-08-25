import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BookOpen,
  Clock,
  Star,
  Award,
  ArrowRight,
  Download
} from 'lucide-react';

// Helper function to get specific improvement suggestions
const getImprovementSuggestions = (area, summary) => {
  const suggestions = {
    'Easy': [
      'Review fundamental concepts and definitions',
      'Practice basic problems daily for 15-20 minutes',
      'Use flashcards for key terminology',
      'Watch introductory tutorial videos'
    ],
    'Medium': [
      'Work through intermediate practice problems',
      'Join study groups or discussion forums',
      'Create concept maps to connect ideas',
      'Practice explaining concepts to others'
    ],
    'Hard': [
      'Tackle advanced problem sets',
      'Seek mentorship or tutoring',
      'Break complex problems into smaller steps',
      'Review and analyze your mistakes thoroughly'
    ],
    'Basic understanding': [
      'Start with foundational materials',
      'Take prerequisite courses if needed',
      'Use multiple learning resources',
      'Practice regularly with simple examples'
    ],
    'Core concept mastery': [
      'Focus on understanding underlying principles',
      'Practice applying concepts in different contexts',
      'Teach the concept to someone else',
      'Create your own examples and problems'
    ],
    'Practical application': [
      'Work on real-world projects',
      'Practice with case studies',
      'Apply concepts to solve actual problems',
      'Build a portfolio of applied work'
    ],
    'Problem-solving': [
      'Practice systematic problem-solving approaches',
      'Learn different solution strategies',
      'Time yourself solving similar problems',
      'Analyze solution patterns'
    ]
  };

  // Get suggestions based on area name
  let areaSuggestions = suggestions[area] || [];
  
  // Add general suggestions based on performance level
  if (summary.overallScore < 60) {
    areaSuggestions = areaSuggestions.concat([
      'Schedule regular study sessions',
      'Focus on one topic at a time',
      'Ask for help when stuck'
    ]);
  } else if (summary.overallScore < 80) {
    areaSuggestions = areaSuggestions.concat([
      'Challenge yourself with harder problems',
      'Review mistakes to avoid repetition',
      'Set specific improvement goals'
    ]);
  }

  return areaSuggestions.slice(0, 3); // Limit to 3 suggestions per area
};

// Helper function to extract topic from question text
const extractTopicFromQuestion = (question) => {
  const topicKeywords = {
    'variable': 'Variable Declaration',
    'declare': 'Variable Declaration', 
    'int': 'Data Types',
    'boolean': 'Data Types',
    'string': 'String Operations',
    'operator': 'Operators',
    'concatenation': 'String Operations',
    'constant': 'Constants & Keywords',
    'keyword': 'Constants & Keywords',
    'final': 'Constants & Keywords',
    'equals': 'Object Comparison',
    'method': 'Methods',
    'class': 'Object-Oriented Programming',
    'inheritance': 'Object-Oriented Programming',
    'polymorphism': 'Object-Oriented Programming',
    'encapsulation': 'Object-Oriented Programming'
  };
  
  const lowerQuestion = question.toLowerCase();
  for (const [keyword, topic] of Object.entries(topicKeywords)) {
    if (lowerQuestion.includes(keyword)) {
      return topic;
    }
  }
  
  // Fallback: use first meaningful word
  const words = question.split(' ').filter(word => word.length > 3);
  return words[0] || 'General Programming';
};

// Helper function to analyze strengths from test results
const getStrengthsAnalysis = (results, summary) => {
  const strengths = [];
  
  // If no results, return fallback based on summary
  if (!results || results.length === 0) {
    if (summary?.strongAreas && summary.strongAreas.length > 0) {
      return summary.strongAreas.map(area => ({
        area: area,
        score: 75,
        analysis: 'Good performance in this area. Keep up the good work!',
        questionsCount: 1
      }));
    }
    return [];
  }
  
  // Group questions by topics and calculate accuracy
  const topicPerformance = {};
  
  results.forEach(result => {
    // Extract topic from question content
    const topic = extractTopicFromQuestion(result.question);
    const isCorrect = result.analysis?.isCorrect || 
                     (result.userAnswer === result.correctAnswer) ||
                     (result.analysis?.score && result.analysis.score >= 70);
    const score = result.analysis?.score || (isCorrect ? 100 : 0);
    
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { correct: 0, total: 0, scores: [] };
    }
    topicPerformance[topic].total++;
    topicPerformance[topic].scores.push(score);
    if (isCorrect) topicPerformance[topic].correct++;
  });
  
  console.log('Topic Performance for Strengths:', topicPerformance);
  
  // Identify strengths (topics with >=50% accuracy, lowered threshold)
  Object.entries(topicPerformance).forEach(([topic, performance]) => {
    const accuracy = (performance.correct / performance.total) * 100;
    
    if (accuracy >= 50) {
      let analysis = '';
      if (accuracy >= 90) {
        analysis = `Excellent mastery! You consistently demonstrate strong understanding in this area.`;
      } else if (accuracy >= 80) {
        analysis = `Good performance with solid understanding. Minor review may help perfect this skill.`;
      } else if (accuracy >= 70) {
        analysis = `Decent grasp of concepts. Continue practicing to strengthen this area further.`;
      } else {
        analysis = `Some understanding shown. With more practice, this can become a strength.`;
      }
      
      strengths.push({
        area: topic,
        score: Math.round(accuracy),
        analysis: analysis,
        questionsCount: performance.total
      });
    }
  });
  
  // If no strengths found, create some based on correct answers
  if (strengths.length === 0 && results.length > 0) {
    const correctResults = results.filter(r => 
      r.analysis?.isCorrect || r.userAnswer === r.correctAnswer
    );
    
    if (correctResults.length > 0) {
      correctResults.forEach(result => {
        const topic = extractTopicFromQuestion(result.question);
        strengths.push({
          area: topic,
          score: 100,
          analysis: 'You got this question correct! This shows understanding of the concept.',
          questionsCount: 1
        });
      });
    }
  }
  
  // Sort by accuracy and limit to top 3
  return strengths.sort((a, b) => b.score - a.score).slice(0, 3);
};

// Helper function to analyze weaknesses from test results
const getWeaknessAnalysis = (results, summary) => {
  const weaknesses = [];
  
  // If no results, return fallback based on summary
  if (!results || results.length === 0) {
    if (summary?.weakAreas && summary.weakAreas.length > 0) {
      return summary.weakAreas.map(area => ({
        area: area,
        score: 25,
        analysis: 'This area needs improvement. Focus on understanding core concepts.',
        questionsCount: 1
      }));
    }
    return [];
  }
  
  // Group questions by topics and calculate accuracy
  const topicPerformance = {};
  
  results.forEach(result => {
    // Extract topic from question content
    const topic = extractTopicFromQuestion(result.question);
    const isCorrect = result.analysis?.isCorrect || 
                     (result.userAnswer === result.correctAnswer) ||
                     (result.analysis?.score && result.analysis.score >= 70);
    const score = result.analysis?.score || (isCorrect ? 100 : 0);
    
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { correct: 0, total: 0, scores: [] };
    }
    topicPerformance[topic].total++;
    topicPerformance[topic].scores.push(score);
    if (isCorrect) topicPerformance[topic].correct++;
  });
  
  console.log('Topic Performance for Weaknesses:', topicPerformance);
  
  // Identify weaknesses (topics with <50% accuracy, lowered threshold)
  Object.entries(topicPerformance).forEach(([topic, performance]) => {
    const accuracy = (performance.correct / performance.total) * 100;
    
    if (accuracy < 50) {
      let analysis = '';
      if (accuracy < 30) {
        analysis = `This area needs significant attention. Consider reviewing fundamentals and seeking additional help.`;
      } else if (accuracy < 50) {
        analysis = `Below average performance. Focus on understanding core concepts and practice regularly.`;
      } else {
        analysis = `Room for improvement. With targeted practice, you can strengthen this area.`;
      }
      
      weaknesses.push({
        area: topic,
        score: Math.round(accuracy),
        analysis: analysis,
        questionsCount: performance.total
      });
    }
  });
  
  // If no weaknesses found, create some based on incorrect answers
  if (weaknesses.length === 0 && results.length > 0) {
    const incorrectResults = results.filter(r => 
      !(r.analysis?.isCorrect || r.userAnswer === r.correctAnswer)
    );
    
    if (incorrectResults.length > 0) {
      incorrectResults.forEach(result => {
        const topic = extractTopicFromQuestion(result.question);
        weaknesses.push({
          area: topic,
          score: 0,
          analysis: 'This question was answered incorrectly. Review the concept and practice similar problems.',
          questionsCount: 1
        });
      });
    }
  }
  
  // Sort by lowest accuracy first and limit to top 3
  return weaknesses.sort((a, b) => a.score - b.score).slice(0, 3);
};

export default function AITestResults({ testResult, onRetakeTest, onViewDashboard }) {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  
  // Debug logging
  console.log('AITestResults received testResult:', testResult);
  console.log('Results array:', testResult?.results);
  console.log('Summary:', testResult?.summary);
  
  // Add error handling for missing testResult
  if (!testResult) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Results...</h2>
        <p className="text-gray-600">Please wait while we process your test results.</p>
      </div>
    );
  }

  const { results, summary, testData } = testResult;
  
  // Add validation for required data
  if (!results || !summary || !testData) {
    console.error('Missing test result data:', { results: !!results, summary: !!summary, testData: !!testData });
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Results</h2>
        <p className="text-gray-600 mb-4">There was an issue loading your test results.</p>
        <Button onClick={onRetakeTest} className="mr-4">Retake Test</Button>
        <Button onClick={() => window.location.reload()} variant="outline">Refresh Page</Button>
      </div>
    );
  }
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'C+': 'text-yellow-600 bg-yellow-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'D': 'text-orange-600 bg-orange-100',
      'F': 'text-red-600 bg-red-100'
    };
    return colors[grade] || 'text-gray-600 bg-gray-100';
  };

  const correctAnswers = results.filter(r => r.analysis.isCorrect).length;
  const totalQuestions = results.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Results */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreColor(summary.overallScore)}`}>
                <span className="text-3xl font-bold">{summary.overallScore}%</span>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Complete!</h1>
              <p className="text-gray-600">{testData.title}</p>
            </div>
            
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <Badge className={getGradeColor(summary.grade)} variant="secondary">
                  Grade: {summary.grade}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Questions Correct</p>
                <p className="text-2xl font-bold">{correctAnswers}/{totalQuestions}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Performance</p>
                <p className="text-lg font-semibold text-purple-600">{summary.performance}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button onClick={onRetakeTest} variant="outline">
          Retake Test
        </Button>
        <Button onClick={onViewDashboard} className="bg-purple-600 hover:bg-purple-700">
          <Brain className="w-4 h-4 mr-2" />
          View AI Dashboard
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Question Review</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Study Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Performance Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Score</span>
                      <span>{summary.overallScore}%</span>
                    </div>
                    <Progress value={summary.overallScore} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Correct</p>
                      <p className="text-xl font-bold text-green-600">{correctAnswers}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Incorrect</p>
                      <p className="text-xl font-bold text-red-600">{totalQuestions - correctAnswers}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Skill Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {summary.skillLevel}
                  </div>
                  <p className="text-gray-600">Current Skill Level</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Study Time</span>
                    <span className="font-medium">{summary.estimatedStudyTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confidence Level</span>
                    <span className="font-medium">75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strong & Weak Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Your Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    // Force topic-based analysis by processing results directly
                    if (!results || results.length === 0) {
                      return (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">No test data available for analysis.</p>
                        </div>
                      );
                    }

                    // Direct topic analysis without fallbacks
                    const topicPerformance = {};
                    
                    results.forEach(result => {
                      const topic = extractTopicFromQuestion(result.question);
                      const isCorrect = result.userAnswer === result.correctAnswer;
                      
                      if (!topicPerformance[topic]) {
                        topicPerformance[topic] = { correct: 0, total: 0 };
                      }
                      topicPerformance[topic].total++;
                      if (isCorrect) topicPerformance[topic].correct++;
                    });

                    const strengths = [];
                    Object.entries(topicPerformance).forEach(([topic, performance]) => {
                      const accuracy = (performance.correct / performance.total) * 100;
                      if (accuracy > 0) { // Show any topic with at least one correct answer
                        let analysis = '';
                        if (accuracy >= 90) {
                          analysis = `Excellent mastery! You consistently demonstrate strong understanding in this area.`;
                        } else if (accuracy >= 70) {
                          analysis = `Good performance with solid understanding. Minor review may help perfect this skill.`;
                        } else if (accuracy >= 50) {
                          analysis = `Decent grasp of concepts. Continue practicing to strengthen this area further.`;
                        } else {
                          analysis = `Some understanding shown. With more practice, this can become a strength.`;
                        }
                        
                        strengths.push({
                          area: topic,
                          score: Math.round(accuracy),
                          analysis: analysis
                        });
                      }
                    });

                    if (strengths.length === 0) {
                      return (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">Keep practicing to identify your strengths!</p>
                        </div>
                      );
                    }

                    return strengths.sort((a, b) => b.score - a.score).slice(0, 3).map((strength, index) => (
                      <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">{strength.area}</span>
                          <Badge className="text-xs bg-green-100 text-green-700">
                            {strength.score}% accuracy
                          </Badge>
                        </div>
                        <p className="text-xs text-green-700 ml-6">{strength.analysis}</p>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    // Force topic-based analysis by processing results directly
                    if (!results || results.length === 0) {
                      return (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">No test data available for analysis.</p>
                        </div>
                      );
                    }

                    // Direct topic analysis without fallbacks
                    const topicPerformance = {};
                    
                    results.forEach(result => {
                      const topic = extractTopicFromQuestion(result.question);
                      const isCorrect = result.userAnswer === result.correctAnswer;
                      
                      if (!topicPerformance[topic]) {
                        topicPerformance[topic] = { correct: 0, total: 0 };
                      }
                      topicPerformance[topic].total++;
                      if (isCorrect) topicPerformance[topic].correct++;
                    });

                    const weaknesses = [];
                    Object.entries(topicPerformance).forEach(([topic, performance]) => {
                      const accuracy = (performance.correct / performance.total) * 100;
                      if (accuracy < 100) { // Show any topic with at least one incorrect answer
                        let analysis = '';
                        if (accuracy === 0) {
                          analysis = `This area needs significant attention. Consider reviewing fundamentals and seeking additional help.`;
                        } else if (accuracy < 50) {
                          analysis = `Below average performance. Focus on understanding core concepts and practice regularly.`;
                        } else if (accuracy < 80) {
                          analysis = `Room for improvement. With targeted practice, you can strengthen this area.`;
                        } else {
                          analysis = `Minor gaps identified. A quick review should help perfect this skill.`;
                        }
                        
                        weaknesses.push({
                          area: topic,
                          score: Math.round(accuracy),
                          analysis: analysis
                        });
                      }
                    });

                    if (weaknesses.length === 0) {
                      return (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">Great job! No major weaknesses identified.</p>
                        </div>
                      );
                    }

                    return weaknesses.sort((a, b) => a.score - b.score).slice(0, 3).map((weakness, index) => {
                      const areaSuggestions = getImprovementSuggestions(weakness.area, summary);
                      
                      return (
                        <div key={index} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">{weakness.area}</span>
                            <Badge className="text-xs bg-orange-100 text-orange-700">
                              {weakness.score}% accuracy
                            </Badge>
                          </div>
                          <p className="text-xs text-orange-700 ml-6 mb-2">{weakness.analysis}</p>
                          
                          {areaSuggestions.length > 0 && (
                            <div className="ml-6 space-y-1">
                              <p className="text-xs text-orange-700 font-medium mb-1">Suggestions:</p>
                              {areaSuggestions.map((suggestion, suggestionIndex) => (
                                <div key={suggestionIndex} className="flex items-start space-x-2">
                                  <Lightbulb className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-orange-700">{suggestion}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question List */}
            <Card>
              <CardHeader>
                <CardTitle>Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedQuestion(index)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedQuestion === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Question {index + 1}</span>
                        {result.analysis.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Score: {result.analysis.score}%
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Detail */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Question {selectedQuestion + 1} Analysis</span>
                    <Badge className={getScoreColor(results[selectedQuestion].analysis.score)}>
                      {results[selectedQuestion].analysis.score}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Question:</h4>
                    <p className="text-gray-700">{results[selectedQuestion].question}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Correct Answer:</h4>
                      <p className="text-sm bg-green-50 p-3 rounded-lg">
                        {results[selectedQuestion].correctAnswer}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-600">Your Answer:</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded-lg">
                        {results[selectedQuestion].userAnswer || 'No answer provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Feedback:
                    </h4>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {results[selectedQuestion].analysis.feedback}
                    </p>
                  </div>
                  
                  {results[selectedQuestion].analysis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Suggestions:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {results[selectedQuestion].analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <ArrowRight className="w-3 h-3 mt-1 text-purple-600" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Concepts Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Concept Mastery</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Concepts Understood</h4>
                  <div className="space-y-1">
                    {results.flatMap(r => r.analysis.conceptsUnderstood).filter((concept, index, self) => self.indexOf(concept) === index).map((concept, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{concept}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2">Concepts to Review</h4>
                  <div className="space-y-1">
                    {results.flatMap(r => r.analysis.conceptsMissed).filter((concept, index, self) => self.indexOf(concept) === index).map((concept, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">{concept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Learning Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Performance Trend</h4>
                  <p className="text-sm text-blue-700">
                    Your performance shows consistent improvement in core concepts. 
                    Focus on advanced topics to reach the next level.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Learning Style</h4>
                  <p className="text-sm text-purple-700">
                    Based on your answers, you learn best through practical examples 
                    and hands-on exercises.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Motivation</h4>
                  <p className="text-sm text-green-700">
                    Excellent effort! Your dedication to learning is evident. 
                    Keep practicing to master the challenging concepts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Personalized Study Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Immediate Actions (This Week)</h4>
                  <ul className="space-y-1">
                    {summary.studyPlan.immediate.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-600 mb-2">Short-term Goals (Next Month)</h4>
                  <ul className="space-y-1">
                    {summary.studyPlan.shortTerm.map((goal, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Long-term Objectives</h4>
                  <ul className="space-y-1">
                    {summary.studyPlan.longTerm.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Recommended Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Suggested Courses</h4>
                  {summary.recommendedCourses.map((course, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                      <h5 className="font-medium">{course}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Designed to strengthen your weak areas and build expertise
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Enroll Now
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Next Steps</h4>
                  <ul className="space-y-1">
                    {summary.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-purple-700">
                        <ArrowRight className="w-3 h-3 mt-1" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
