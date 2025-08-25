import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BookOpen, 
  BarChart3,
  CheckCircle,
  XCircle,
  Lightbulb,
  Star,
  Calendar,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AITestDashboard({ testResults, userProfile }) {
  const [selectedTest, setSelectedTest] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (testResults && testResults.length > 0) {
      generateAnalytics();
    }
  }, [testResults]);

  const generateAnalytics = () => {
    const totalTests = testResults.length;
    const averageScore = testResults.reduce((sum, test) => sum + test.summary.overallScore, 0) / totalTests;
    
    const progressData = testResults.map((test, index) => ({
      test: index + 1,
      score: test.summary.overallScore,
      date: new Date(test.completedAt).toLocaleDateString()
    }));

    const topicPerformance = {};
    testResults.forEach(test => {
      test.testData.topics.forEach(topic => {
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { total: 0, correct: 0 };
        }
        topicPerformance[topic].total++;
        if (test.summary.overallScore >= 70) {
          topicPerformance[topic].correct++;
        }
      });
    });

    const topicData = Object.entries(topicPerformance).map(([topic, data]) => ({
      topic,
      accuracy: (data.correct / data.total) * 100
    }));

    const difficultyDistribution = testResults.reduce((acc, test) => {
      const difficulty = test.testData.difficulty || 'Medium';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    const difficultyData = Object.entries(difficultyDistribution).map(([difficulty, count]) => ({
      difficulty,
      count,
      color: difficulty === 'Easy' ? '#10B981' : difficulty === 'Medium' ? '#F59E0B' : '#EF4444'
    }));

    setAnalytics({
      totalTests,
      averageScore,
      progressData,
      topicData,
      difficultyData,
      lastTest: testResults[testResults.length - 1]
    });
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

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No test data available yet</p>
          <p className="text-sm text-gray-500">Complete some AI-powered tests to see your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tests Completed</p>
                <p className="text-2xl font-bold">{analytics.totalTests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{analytics.averageScore.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Latest Grade</p>
                <Badge className={getGradeColor(analytics.lastTest.summary.grade)}>
                  {analytics.lastTest.summary.grade}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Skill Level</p>
                <p className="text-lg font-semibold">{analytics.lastTest.summary.skillLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Study Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Score Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="test" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Topic Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Topic Mastery</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.slice(-5).reverse().map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        test.summary.overallScore >= 80 ? 'bg-green-100' : 
                        test.summary.overallScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {test.summary.overallScore >= 80 ? 
                          <CheckCircle className="w-6 h-6 text-green-600" /> :
                          <XCircle className="w-6 h-6 text-red-600" />
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold">{test.testData.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(test.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{test.summary.overallScore}%</div>
                      <Badge className={getGradeColor(test.summary.grade)}>
                        {test.summary.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Difficulty Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Test Difficulty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.difficultyData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ difficulty, count }) => `${difficulty}: ${count}`}
                    >
                      {analytics.difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy Rate</span>
                      <span>{analytics.averageScore.toFixed(1)}%</span>
                    </div>
                    <Progress value={analytics.averageScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Consistency</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Improvement Rate</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Strengths</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {analytics.lastTest.summary.strongAreas.map((area, index) => (
                      <li key={index}>• {area}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Areas for Improvement</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {analytics.lastTest.summary.weakAreas.map((area, index) => (
                      <li key={index}>• {area}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Learning Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">Learning Style: Visual</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Progress Trend: Improving</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Optimal Study Time: 2-3 hours/week</span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Motivational Message</h4>
                  <p className="text-sm text-green-700">
                    Great progress! Your consistent effort is showing results. Keep focusing on practice problems to strengthen your weak areas.
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
                  <Calendar className="w-5 h-5" />
                  <span>Personalized Study Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Immediate Actions</h4>
                    <ul className="text-sm space-y-1">
                      {analytics.lastTest.summary.studyPlan.immediate.map((action, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Short-term Goals</h4>
                    <ul className="text-sm space-y-1">
                      {analytics.lastTest.summary.studyPlan.shortTerm.map((goal, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Long-term Objectives</h4>
                    <ul className="text-sm space-y-1">
                      {analytics.lastTest.summary.studyPlan.longTerm.map((objective, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Recommended Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.lastTest.summary.recommendedCourses.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-semibold">{course}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Tailored to improve your weak areas and build on your strengths
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Course
                    </Button>
                  </div>
                ))}
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {analytics.lastTest.summary.nextSteps.map((step, index) => (
                      <li key={index}>• {step}</li>
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
