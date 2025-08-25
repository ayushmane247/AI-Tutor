import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, TrendingUp, BookOpen, Brain, Code, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeData {
  day: string;
  totalHours: number;
  focusHours: number;
  breakHours: number;
  subjects: {
    [key: string]: number;
  };
}

interface TimeSpentAnalyticsProps {
  timeData?: TimeData[];
  period?: string;
}

const defaultTimeData: TimeData[] = [
  { 
    day: 'Mon', 
    totalHours: 6.5, 
    focusHours: 5.2, 
    breakHours: 1.3,
    subjects: { 'DSA': 2.5, 'DBMS': 2.0, 'CN': 1.5, 'OS': 0.5 }
  },
  { 
    day: 'Tue', 
    totalHours: 7.2, 
    focusHours: 6.0, 
    breakHours: 1.2,
    subjects: { 'DSA': 3.0, 'DBMS': 2.2, 'CN': 1.0, 'OS': 1.0 }
  },
  { 
    day: 'Wed', 
    totalHours: 5.8, 
    focusHours: 4.5, 
    breakHours: 1.3,
    subjects: { 'DSA': 2.0, 'DBMS': 1.8, 'CN': 1.5, 'OS': 0.5 }
  },
  { 
    day: 'Thu', 
    totalHours: 8.1, 
    focusHours: 6.8, 
    breakHours: 1.3,
    subjects: { 'DSA': 3.5, 'DBMS': 2.5, 'CN': 1.3, 'OS': 0.8 }
  },
  { 
    day: 'Fri', 
    totalHours: 6.9, 
    focusHours: 5.5, 
    breakHours: 1.4,
    subjects: { 'DSA': 2.8, 'DBMS': 2.0, 'CN': 1.6, 'OS': 0.5 }
  },
  { 
    day: 'Sat', 
    totalHours: 4.2, 
    focusHours: 3.0, 
    breakHours: 1.2,
    subjects: { 'DSA': 1.5, 'DBMS': 1.0, 'CN': 1.2, 'OS': 0.5 }
  },
  { 
    day: 'Sun', 
    totalHours: 3.5, 
    focusHours: 2.8, 
    breakHours: 0.7,
    subjects: { 'DSA': 1.2, 'DBMS': 0.8, 'CN': 1.0, 'OS': 0.5 }
  }
];

const subjectColors = {
  'DSA': '#8B5CF6',
  'DBMS': '#06B6D4',
  'CN': '#F59E0B',
  'OS': '#EF4444'
};

const subjectIcons = {
  'DSA': Code,
  'DBMS': BookOpen,
  'CN': Brain,
  'OS': Calculator
};

export default function TimeSpentAnalytics({ timeData = defaultTimeData, period = 'Weekly' }: TimeSpentAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  const totalWeeklyHours = timeData.reduce((sum, day) => sum + day.totalHours, 0);
  const avgDailyHours = totalWeeklyHours / timeData.length;
  const totalFocusHours = timeData.reduce((sum, day) => sum + day.focusHours, 0);
  const focusEfficiency = (totalFocusHours / totalWeeklyHours) * 100;

  // Calculate subject distribution
  const subjectTotals = timeData.reduce((acc, day) => {
    Object.entries(day.subjects).forEach(([subject, hours]) => {
      acc[subject] = (acc[subject] || 0) + hours;
    });
    return acc;
  }, {} as { [key: string]: number });

  const pieData = Object.entries(subjectTotals).map(([subject, hours]) => ({
    name: subject,
    value: hours,
    color: subjectColors[subject as keyof typeof subjectColors] || '#94A3B8'
  }));

  const getTimeStatus = (hours: number) => {
    if (hours >= 7) return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900', label: 'Excellent' };
    if (hours >= 5) return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900', label: 'Good' };
    if (hours >= 3) return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900', label: 'Average' };
    return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900', label: 'Low' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Time Analytics</h2>
        </div>
        <div className="flex items-center gap-3">
          <Select value={chartType} onValueChange={(value: 'line' | 'area') => setChartType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{totalWeeklyHours.toFixed(1)}h</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge className={getTimeStatus(totalWeeklyHours).bg}>
                  {getTimeStatus(totalWeeklyHours).label}
                </Badge>
              </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Average</p>
                  <p className="text-2xl font-bold">{avgDailyHours.toFixed(1)}h</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">+12% from last week</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Focus Hours</p>
                  <p className="text-2xl font-bold">{totalFocusHours.toFixed(1)}h</p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-purple-600 mt-2">{focusEfficiency.toFixed(0)}% efficiency</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Day</p>
                  <p className="text-2xl font-bold">Thu</p>
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-orange-600 mt-2">8.1 hours</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}h`, '']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalHours" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="focusHours" 
                      stroke="#06B6D4" 
                      fill="#06B6D4" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}h`, '']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalHours" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="focusHours" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}h`, 'Hours']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {Object.entries(subjectTotals).map(([subject, hours]) => {
                const Icon = subjectIcons[subject as keyof typeof subjectIcons] || BookOpen;
                const color = subjectColors[subject as keyof typeof subjectColors] || '#94A3B8';
                return (
                  <div key={subject} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="text-sm font-medium">{subject}</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {hours.toFixed(1)}h
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
