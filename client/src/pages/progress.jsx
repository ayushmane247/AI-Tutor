import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { TrendingUp, BookOpen, Clock, Target, Calendar, FileText, Award, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const progressData = {
  overallProgressBar: 68,
  coursesInProgressBar: 3,
  coursesCompleted: 5,
  totalStudyTime: 142,
  weeklyGoal: 20,
  currentWeekTime: 14
};

const courseProgressBar = [
  {
    id: 1,
    title: "React Fundamentals",
    progress: 85,
    timeSpent: 24,
    estimatedTime: 30,
    status: "In ProgressBar"
  },
  {
    id: 2,
    title: "JavaScript Advanced",
    progress: 100,
    timeSpent: 40,
    estimatedTime: 40,
    status: "Completed"
  },
  {
    id: 3,
    title: "Node.js Backend",
    progress: 45,
    timeSpent: 18,
    estimatedTime: 35,
    status: "In ProgressBar"
  },
  {
    id: 4,
    title: "Database Design",
    progress: 20,
    timeSpent: 8,
    estimatedTime: 25,
    status: "In ProgressBar"
  }
];

const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 2.8 },
  { day: 'Sat', hours: 1.6 },
  { day: 'Sun', hours: 0 }
];

export default function Progress() {
  const [testReports, setTestReports] = useState([]);
  const [learningPathData, setLearningPathData] = useState([]);

  useEffect(() => {
    // Load test reports from localStorage
    const savedReports = localStorage.getItem('testReports');
    if (savedReports) {
      setTestReports(JSON.parse(savedReports));
    }

    // Load learning path data
    const savedLearningPath = localStorage.getItem('learningPathData');
    if (savedLearningPath) {
      setLearningPathData(JSON.parse(savedLearningPath));
    }
  }, []);

  const calculateOverallProgress = () => {
    if (learningPathData.length === 0) return 0;
    const totalProgress = learningPathData.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(totalProgress / learningPathData.length);
  };

  const getCompletedCourses = () => {
    return learningPathData.filter(course => course.progress === 100).length;
  };

  const getTotalStudyTime = () => {
    return testReports.reduce((total, report) => total + (report.timeTaken || 0), 0);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h1>
          <p className="text-gray-600">Track your learning journey and stay motivated</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{calculateOverallProgress()}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Courses Completed</p>
                  <p className="text-2xl font-bold text-green-600">{getCompletedCourses()}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Taken</p>
                  <p className="text-2xl font-bold text-blue-600">{testReports.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-orange-600">{testReports.length > 0 ? Math.round(testReports.reduce((sum, report) => sum + report.score, 0) / testReports.length) : 0}%</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Course Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningPathData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No enrolled courses yet</p>
                  <p className="text-sm">Enroll in courses to track your progress</p>
                </div>
              ) : (
                learningPathData.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <Badge variant={course.progress === 100 ? 'default' : 'secondary'}>
                        {course.progress === 100 ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{course.progress}% complete</span>
                      <span>{course.duration}</span>
                    </div>
                    <ProgressBar value={course.progress} className="h-2" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Test Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Recent Test Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No test reports yet</p>
                  <p className="text-sm">Take tests to see detailed AI-generated reports</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {testReports.slice(-5).reverse().map((report, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{report.testTitle || 'Programming Test'}</h4>
                        <Badge variant={report.score >= 80 ? 'default' : report.score >= 60 ? 'secondary' : 'destructive'}>
                          {report.score}%
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span>Questions: {report.totalQuestions} | </span>
                        <span>Correct: {report.correctAnswers} | </span>
                        <span>Time: {Math.floor((report.timeTaken || 0) / 60)}m {(report.timeTaken || 0) % 60}s</span>
                      </div>
                      {report.analysis && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Strengths:</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-6">{report.analysis.strengths?.join(', ') || 'Good overall performance'}</p>
                          
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">Areas to Improve:</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-6">{report.analysis.weaknesses?.join(', ') || 'Keep practicing'}</p>
                          
                          {report.analysis.recommendations && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-purple-700">Recommendations:</p>
                              <p className="text-sm text-gray-600 ml-4">{report.analysis.recommendations}</p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(report.completedAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Learning Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Learning Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {learningPathData.length}
                </div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {testReports.filter(report => report.score >= 80).length}
                </div>
                <div className="text-sm text-gray-600">High Scores (80%+)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {Math.round(learningPathData.reduce((sum, course) => sum + course.progress, 0) / Math.max(learningPathData.length, 1))}%
                </div>
                <div className="text-sm text-gray-600">Average Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
