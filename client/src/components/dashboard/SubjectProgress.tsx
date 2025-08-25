import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Database, Network, Cpu, Trophy, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubjectData {
  id: string;
  name: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  timeSpent: number;
  lastActivity: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'completed' | 'paused';
  nextMilestone: string;
  accuracy: number;
}

interface SubjectProgressProps {
  subjects?: SubjectData[];
}

const defaultSubjects: SubjectData[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    progress: 78,
    totalLessons: 45,
    completedLessons: 35,
    timeSpent: 24.5,
    lastActivity: '2 hours ago',
    difficulty: 'Advanced',
    status: 'active',
    nextMilestone: 'Trees & Graphs',
    accuracy: 87
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    progress: 65,
    totalLessons: 30,
    completedLessons: 19,
    timeSpent: 18.2,
    lastActivity: '1 day ago',
    difficulty: 'Intermediate',
    status: 'active',
    nextMilestone: 'Normalization',
    accuracy: 82
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    progress: 45,
    totalLessons: 25,
    completedLessons: 11,
    timeSpent: 12.8,
    lastActivity: '3 days ago',
    difficulty: 'Intermediate',
    status: 'paused',
    nextMilestone: 'TCP/IP Protocol',
    accuracy: 75
  },
  {
    id: 'os',
    name: 'Operating Systems',
    progress: 92,
    totalLessons: 20,
    completedLessons: 18,
    timeSpent: 16.5,
    lastActivity: '5 hours ago',
    difficulty: 'Advanced',
    status: 'active',
    nextMilestone: 'Final Assessment',
    accuracy: 94
  }
];

const subjectIcons = {
  'dsa': Code,
  'dbms': Database,
  'cn': Network,
  'os': Cpu
};

const subjectColors = {
  'dsa': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-600', progress: '#8B5CF6' },
  'dbms': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-600', progress: '#06B6D4' },
  'cn': { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-600', progress: '#F59E0B' },
  'os': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-600', progress: '#10B981' }
};

export default function SubjectProgress({ subjects = defaultSubjects }: SubjectProgressProps) {
  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'completed' || progress >= 100) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
    }
    if (status === 'paused') {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Paused</Badge>;
    }
    if (progress >= 80) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Almost Done</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">In Progress</Badge>;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600';
      case 'Intermediate': return 'text-yellow-600';
      case 'Advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const totalProgress = subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length;
  const totalTimeSpent = subjects.reduce((sum, subject) => sum + subject.timeSpent, 0);
  const activeSubjects = subjects.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Subject Progress</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-lg font-bold text-blue-600">{totalProgress.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Active Subjects</p>
            <p className="text-lg font-bold text-green-600">{activeSubjects}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Progress</p>
                <p className="text-xl font-bold">{totalProgress.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Invested</p>
                <p className="text-xl font-bold">{totalTimeSpent.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-xl font-bold">
                  {(subjects.reduce((sum, s) => sum + s.accuracy, 0) / subjects.length).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject, index) => {
          const Icon = subjectIcons[subject.id as keyof typeof subjectIcons] || BookOpen;
          const colors = subjectColors[subject.id as keyof typeof subjectColors] || subjectColors.dsa;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 ${colors.bg} rounded-lg`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getDifficultyColor(subject.difficulty)}>
                            {subject.difficulty}
                          </Badge>
                          {getStatusBadge(subject.status, subject.progress)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.completedLessons}/{subject.totalLessons} lessons
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={subject.progress} 
                        className="h-3"
                        style={{ 
                          '--progress-background': colors.progress 
                        } as React.CSSProperties}
                      />
                      <span className="absolute right-2 top-0 text-xs font-medium text-white">
                        {subject.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Time Spent</p>
                      <p className="font-semibold">{subject.timeSpent}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="font-semibold">{subject.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Activity</p>
                      <p className="font-semibold text-xs">{subject.lastActivity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Next Milestone</p>
                      <p className="font-semibold text-xs">{subject.nextMilestone}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {subject.status === 'paused' ? (
                      <button className="flex-1 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Resume Learning
                      </button>
                    ) : subject.progress >= 100 ? (
                      <button className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        View Certificate
                      </button>
                    ) : (
                      <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Continue Learning
                      </button>
                    )}
                    <button className="px-3 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Journey Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {subjects.reduce((sum, s) => sum + s.completedLessons, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {subjects.reduce((sum, s) => sum + s.totalLessons, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {totalTimeSpent.toFixed(0)}h
                </p>
                <p className="text-sm text-muted-foreground">Hours Invested</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {subjects.filter(s => s.progress >= 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Subjects Mastered</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
