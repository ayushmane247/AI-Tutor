import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Play, 
  BarChart3,
  Award,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const aiTests = [
  {
    id: 'java-fundamentals',
    title: 'Java Fundamentals Quiz',
    description: 'Test your knowledge of basic Java syntax, variables, and data types.',
    duration: 30,
    questions: 20,
    points: 100,
    difficulty: 'Easy',
    topics: ['Variables', 'Data Types', 'Operators', 'Control Structures'],
    status: 'available',
    attempts: 0,
    bestScore: null
  },
  {
    id: 'oop-concepts',
    title: 'Object-Oriented Programming Test',
    description: 'Comprehensive test on OOP concepts including inheritance, polymorphism, and encapsulation.',
    duration: 45,
    questions: 25,
    points: 150,
    difficulty: 'Medium',
    topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
    status: 'completed',
    attempts: 2,
    bestScore: 85
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    description: 'Advanced test covering arrays, linked lists, trees, and sorting algorithms.',
    duration: 60,
    questions: 30,
    points: 200,
    difficulty: 'Hard',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Sorting', 'Searching'],
    status: 'locked',
    attempts: 0,
    bestScore: null
  }
];

export default function TestSection() {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/ai-test/${testId}`);
  };

  const handleViewDashboard = () => {
    navigate('/ai-test/dashboard');
  };

  return (
    <Card data-testid="test-section-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800" data-testid="text-ai-tests-title">
              AI-Powered Tests
            </h3>
          </div>
          <Button 
            variant="ghost" 
            className="text-purple-primary hover:text-purple-dark font-medium"
            onClick={handleViewDashboard}
            data-testid="button-view-analytics"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {aiTests.map((test) => (
            <div 
              key={test.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              data-testid={`card-test-${test.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1" data-testid={`text-test-title-${test.id}`}>
                    {test.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3" data-testid={`text-test-description-${test.id}`}>
                    {test.description}
                  </p>
                </div>
                <Badge 
                  className={getDifficultyColor(test.difficulty)}
                  data-testid={`badge-difficulty-${test.id}`}
                >
                  {test.difficulty}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="w-4 h-4 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-600">{test.duration} min</span>
                </div>
                <div className="flex flex-col items-center">
                  <Target className="w-4 h-4 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-600">{test.questions} questions</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-4 h-4 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-600">{test.points} pts</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {test.topics.slice(0, 3).map((topic, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-purple-100 text-purple-800"
                    >
                      {topic}
                    </Badge>
                  ))}
                  {test.topics.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      +{test.topics.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {test.status === 'completed' && test.bestScore && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-medium">{test.bestScore}%</span>
                  </div>
                  <Progress value={test.bestScore} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={getStatusColor(test.status)}
                    data-testid={`badge-status-${test.id}`}
                  >
                    {test.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </Badge>
                  {test.attempts > 0 && (
                    <span className="text-xs text-gray-500">
                      {test.attempts} attempt{test.attempts > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={() => handleStartTest(test.id)}
                  disabled={test.status === 'locked'}
                  className={test.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                  data-testid={`button-start-test-${test.id}`}
                >
                  <Play className="w-3 h-3 mr-1" />
                  {test.status === 'completed' ? 'Retake' : test.status === 'locked' ? 'Locked' : 'Start'}
                </Button>
              </div>

              {/* AI Features Badge */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-xs text-purple-600">
                  <Brain className="w-3 h-3" />
                  <span>AI Analysis & Personalized Feedback</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Features Info */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Brain className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">AI-Powered Testing Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-700">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Intelligent answer analysis and scoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Personalized feedback on each response</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Detailed performance insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Adaptive learning recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
