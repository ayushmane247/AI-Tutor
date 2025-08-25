import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Brain, Clock, Target, Zap, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeData {
  currentSession: {
    duration: number;
    questionsAnswered: number;
    accuracy: number;
    focusScore: number;
    status: 'active' | 'break' | 'idle';
  };
  liveMetrics: {
    responseTime: number;
    streakCount: number;
    errorRate: number;
    learningVelocity: number;
  };
  recentActivity: Array<{
    timestamp: string;
    action: string;
    subject: string;
    score: number;
    type: 'question' | 'lesson' | 'test';
  }>;
  performanceTrends: Array<{
    time: string;
    accuracy: number;
    speed: number;
    focus: number;
  }>;
  subjectAnalysis: Array<{
    subject: string;
    strength: number;
    weakness: number;
    recommendation: string;
  }>;
}

interface RealTimeAnalysisProps {
  data?: RealTimeData;
  isLive?: boolean;
}

const defaultData: RealTimeData = {
  currentSession: {
    duration: 45,
    questionsAnswered: 23,
    accuracy: 87,
    focusScore: 92,
    status: 'active'
  },
  liveMetrics: {
    responseTime: 2.3,
    streakCount: 8,
    errorRate: 13,
    learningVelocity: 85
  },
  recentActivity: [
    { timestamp: '14:32', action: 'Completed DSA Quiz', subject: 'DSA', score: 92, type: 'test' },
    { timestamp: '14:28', action: 'Finished Binary Trees', subject: 'DSA', score: 88, type: 'lesson' },
    { timestamp: '14:15', action: 'Answered Question', subject: 'DBMS', score: 95, type: 'question' },
    { timestamp: '14:10', action: 'Started New Topic', subject: 'CN', score: 0, type: 'lesson' },
    { timestamp: '14:05', action: 'Completed Practice', subject: 'OS', score: 89, type: 'test' }
  ],
  performanceTrends: [
    { time: '14:00', accuracy: 85, speed: 88, focus: 90 },
    { time: '14:05', accuracy: 87, speed: 90, focus: 89 },
    { time: '14:10', accuracy: 83, speed: 85, focus: 87 },
    { time: '14:15', accuracy: 90, speed: 92, focus: 94 },
    { time: '14:20', accuracy: 88, speed: 89, focus: 91 },
    { time: '14:25', accuracy: 92, speed: 94, focus: 95 },
    { time: '14:30', accuracy: 87, speed: 91, focus: 92 }
  ],
  subjectAnalysis: [
    { subject: 'DSA', strength: 88, weakness: 72, recommendation: 'Focus on dynamic programming concepts' },
    { subject: 'DBMS', strength: 92, weakness: 78, recommendation: 'Practice normalization problems' },
    { subject: 'CN', strength: 75, weakness: 65, recommendation: 'Review OSI model layers' },
    { subject: 'OS', strength: 85, weakness: 70, recommendation: 'Study process synchronization' }
  ]
};

export default function RealTimeAnalysis({ data = defaultData, isLive = true }: RealTimeAnalysisProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isLive) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLive]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'break': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'idle': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getMetricColor = (value: number, type: 'accuracy' | 'speed' | 'error') => {
    if (type === 'error') {
      if (value <= 10) return 'text-green-600';
      if (value <= 20) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-blue-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-6 h-6 text-green-500" />
            {isLive && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <h2 className="text-2xl font-bold">Real-Time Analysis</h2>
          {isLive && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Last updated: {currentTime.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{data.currentSession.duration}m</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Questions</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{data.currentSession.questionsAnswered}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Accuracy</span>
              </div>
              <p className={`text-2xl font-bold ${getMetricColor(data.currentSession.accuracy, 'accuracy')}`}>
                {data.currentSession.accuracy}%
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Focus</span>
              </div>
              <p className={`text-2xl font-bold ${getMetricColor(data.currentSession.focusScore, 'accuracy')}`}>
                {data.currentSession.focusScore}%
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge className={getStatusColor(data.currentSession.status)}>
                {data.currentSession.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Response Time</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{data.liveMetrics.responseTime}s</p>
              <p className="text-xs text-muted-foreground">Average per question</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Streak</span>
                <Zap className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{data.liveMetrics.streakCount}</p>
              <p className="text-xs text-muted-foreground">Correct answers</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Error Rate</span>
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className={`text-2xl font-bold ${getMetricColor(data.liveMetrics.errorRate, 'error')}`}>
                {data.liveMetrics.errorRate}%
              </p>
              <p className="text-xs text-muted-foreground">This session</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Learning Velocity</span>
                <Brain className="w-4 h-4 text-purple-500" />
              </div>
              <p className={`text-2xl font-bold ${getMetricColor(data.liveMetrics.learningVelocity, 'accuracy')}`}>
                {data.liveMetrics.learningVelocity}%
              </p>
              <p className="text-xs text-muted-foreground">Concepts/hour</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analysis">Subject Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                      name="Accuracy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="speed" 
                      stroke="#06B6D4" 
                      strokeWidth={2}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                      name="Speed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="focus" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      name="Focus"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {data.recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'test' ? 'bg-purple-100 dark:bg-purple-900' :
                          activity.type === 'lesson' ? 'bg-blue-100 dark:bg-blue-900' :
                          'bg-green-100 dark:bg-green-900'
                        }`}>
                          {activity.type === 'test' ? <Target className="w-4 h-4" /> :
                           activity.type === 'lesson' ? <Brain className="w-4 h-4" /> :
                           <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.subject} • {activity.timestamp}
                          </p>
                        </div>
                      </div>
                      {activity.score > 0 && (
                        <Badge className={`${getMetricColor(activity.score, 'accuracy')} bg-transparent border`}>
                          {activity.score}%
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Subject Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.subjectAnalysis.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{subject.subject}</h4>
                      <Badge variant="outline">
                        {subject.strength >= 85 ? 'Strong' : subject.strength >= 70 ? 'Good' : 'Needs Work'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Strengths</span>
                          <span className="text-sm text-green-600">{subject.strength}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${subject.strength}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Areas to Improve</span>
                          <span className="text-sm text-red-600">{100 - subject.weakness}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${100 - subject.weakness}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        AI Recommendation:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {subject.recommendation}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
