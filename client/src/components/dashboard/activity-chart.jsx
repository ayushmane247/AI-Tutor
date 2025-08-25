import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const activityData = [
  { day: '08', uiUx: 3, uiTheory: 2 },
  { day: '09', uiUx: 2.5, uiTheory: 3 },
  { day: '10', uiUx: 3.5, uiTheory: 2.5 },
  { day: '11', uiUx: 4.5, uiTheory: 4 },
  { day: '12', uiUx: 5, uiTheory: 5.5 },
  { day: '13', uiUx: 4, uiTheory: 3.8 },
  { day: '14', uiUx: 3.5, uiTheory: 2.8 },
];

export default function ActivityChart() {
  const [period, setPeriod] = useState('Weekly');

  return (
    <Card data-testid="activity-chart-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800" data-testid="text-activity-title">Hours Activity</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600" data-testid="text-weekly-comparison">+2 More than last week</span>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32" data-testid="select-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="h-64" data-testid="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} barCategoryGap="20%">
              <XAxis dataKey="day" />
              <YAxis 
                domain={[0, 6]} 
                tickFormatter={(value) => `${value}h`}
              />
              <Legend />
              <Bar 
                dataKey="uiUx" 
                fill="#6366F1" 
                name="UI/UX Fundamentals"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar 
                dataKey="uiTheory" 
                fill="#F59E0B" 
                name="UI College Theories"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Hours Spent</p>
            <p className="text-2xl font-bold text-gray-800" data-testid="text-hours-spent">12</p>
            <p className="text-green-500 text-sm" data-testid="text-hours-change">▲ 10%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Average Score</p>
            <p className="text-2xl font-bold text-gray-800" data-testid="text-average-score">86</p>
            <p className="text-red-500 text-sm" data-testid="text-score-change">▼ 5%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Assignments</p>
            <p className="text-2xl font-bold text-gray-800" data-testid="text-assignments">2</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
