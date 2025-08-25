import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Target, Award, Brain, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceData {
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
  weeklyScores: Array<{ day: string; score: number; accuracy: number; speed: number }>;
  skillsRadar: Array<{ skill: string; current: number; target: number }>;
  recentTests: Array<{ name: string; score: number; accuracy: number; date: string; status: 'excellent' | 'good' | 'average' | 'poor' }>;
}

interface PerformanceOverviewProps {
  performanceData?: PerformanceData;
}

const defaultPerformanceData: PerformanceData = {
  accuracy: 87,
  speed: 92,
  consistency: 78,
  improvement: 15,
  weeklyScores: [
    { day: 'Mon', score: 85, accuracy: 82, speed: 88 },
    { day: 'Tue', score: 89, accuracy: 87, speed: 91 },
    { day: 'Wed', score: 83, accuracy: 80, speed: 86 },
    { day: 'Thu', score: 92, accuracy: 90, speed: 94 },
    { day: 'Fri', score: 88, accuracy: 85, speed: 91 },
    { day: 'Sat', score: 90, accuracy: 88, speed: 92 },
    { day: 'Sun', score: 87, accuracy: 84, speed: 90 }
  ],
  skillsRadar: [
    { skill: 'Problem Solving', current: 85, target: 90 },
    { skill: 'Code Quality', current: 78, target: 85 },
    { skill: 'Algorithm Design', current: 82, target: 88 },
    { skill: 'Time Management', current: 90, target: 95 },
    { skill: 'Debugging', current: 75, target: 80 },
    { skill: 'System Design', current: 70, target: 85 }
  ],
  recentTests: [
    { name: 'DSA Quiz #12', score: 92, accuracy: 90, date: '2024-08-24', status: 'excellent' },
    { name: 'DBMS Test #8', score: 85, accuracy: 82, date: '2024-08-23', status: 'good' },
    { name: 'CN Practice #5', score: 78, accuracy: 75, date: '2024-08-22', status: 'average' },
    { name: 'OS Mock Test', score: 88, accuracy: 86, date: '2024-08-21', status: 'good' },
    { name: 'DSA Challenge', score: 95, accuracy: 93, date: '2024-08-20', status: 'excellent' }
  ]
};

export default function PerformanceOverview({ performanceData = defaultPerformanceData }: PerformanceOverviewProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { accuracy, speed, consistency, improvement, weeklyScores, skillsRadar, recentTests } = performanceData;

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Award className="w-4 h-4 text-green-600" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'average': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'poor': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const averageScore = weeklyScores.reduce((sum, day) => sum + day.score, 0) / weeklyScores.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold">Performance Overview</h2>
        </div>
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          {improvement > 0 ? '+' : ''}{improvement}% this week
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <Badge className={getPerformanceBg(accuracy)}>
                  {accuracy >= 90 ? 'Excellent' : accuracy >= 80 ? 'Good' : accuracy >= 70 ? 'Average' : 'Needs Work'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(accuracy)}`}>{accuracy}%</p>
              <Progress value={accuracy} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <Badge className={getPerformanceBg(speed)}>
                  {speed >= 90 ? 'Fast' : speed >= 80 ? 'Good' : speed >= 70 ? 'Average' : 'Slow'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Speed</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(speed)}`}>{speed}%</p>
              <Progress value={speed} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <Badge className={getPerformanceBg(consistency)}>
                  {consistency >= 90 ? 'Stable' : consistency >= 80 ? 'Good' : consistency >= 70 ? 'Variable' : 'Unstable'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Consistency</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(consistency)}`}>{consistency}%</p>
              <Progress value={consistency} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <Badge className={`${improvement > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {improvement > 0 ? 'Improving' : 'Declining'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Weekly Avg</p>
              <p className="text-2xl font-bold text-orange-600">{averageScore.toFixed(1)}%</p>
              <p className={`text-sm mt-1 ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {improvement > 0 ? '+' : ''}{improvement}% change
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Weekly Trends</TabsTrigger>
          <TabsTrigger value="skills">Skills Radar</TabsTrigger>
          <TabsTrigger value="tests">Recent Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                      name="Overall Score"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#06B6D4" 
                      strokeWidth={2}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                      name="Accuracy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="speed" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      name="Speed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillsRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Current Level"
                        dataKey="current"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Target Level"
                        dataKey="target"
                        stroke="#06B6D4"
                        fill="#06B6D4"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {skillsRadar.map((skill, index) => (
                    <motion.div
                      key={skill.skill}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.skill}</span>
                        <span className="text-sm text-muted-foreground">
                          {skill.current}% / {skill.target}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={skill.current} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current</span>
                          <span className={skill.current >= skill.target ? 'text-green-600' : 'text-orange-600'}>
                            {skill.current >= skill.target ? 'Target Achieved!' : `${skill.target - skill.current}% to go`}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test, index) => (
                  <motion.div
                    key={test.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">{test.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getPerformanceColor(test.score)}`}>
                          {test.score}%
                        </span>
                        <Badge className={getPerformanceBg(test.score)}>
                          {test.accuracy}% accuracy
                        </Badge>
                      </div>
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
