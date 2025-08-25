import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  completedDays: number;
  streakType: 'learning' | 'testing' | 'practice';
}

interface StreakTrackerProps {
  streakData?: StreakData;
}

const defaultStreakData: StreakData = {
  currentStreak: 7,
  longestStreak: 15,
  weeklyGoal: 5,
  completedDays: 4,
  streakType: 'learning'
};

export default function StreakTracker({ streakData = defaultStreakData }: StreakTrackerProps) {
  const { currentStreak, longestStreak, weeklyGoal, completedDays, streakType } = streakData;
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const progress = (completedDays / weeklyGoal) * 100;

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-red-500';
    return 'text-gray-400';
  };

  const getStreakBadgeColor = (streak: number) => {
    if (streak >= 30) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (streak >= 14) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (streak >= 7) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${getStreakColor(currentStreak)}`} />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Current Streak */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl sm:text-3xl font-bold ${getStreakColor(currentStreak)}`}>
                {currentStreak}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">days</span>
              <Badge className={`${getStreakBadgeColor(currentStreak)} text-xs`}>
                {currentStreak >= 30 ? 'Master' : currentStreak >= 14 ? 'Expert' : currentStreak >= 7 ? 'Champion' : 'Beginner'}
              </Badge>
            </div>
          </div>
          <motion.div
            animate={{ rotate: currentStreak > 0 ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: currentStreak > 7 ? Infinity : 0, repeatDelay: 3 }}
          >
            <Flame className={`w-8 h-8 sm:w-12 sm:h-12 ${getStreakColor(currentStreak)}`} />
          </motion.div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Weekly Goal</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedDays}/{weeklyGoal} days
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => (
              <motion.div
                key={day}
                className={`text-center p-2 rounded-lg text-xs font-medium ${
                  index < completedDays
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : index === completedDays
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {day}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Best Streak</span>
            </div>
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {longestStreak} days
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
