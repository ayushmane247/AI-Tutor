import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Trophy, Award, Star, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const achievements = [
  {
    id: 1,
    title: "First Course Completed",
    description: "Complete your first course",
    icon: Trophy,
    earned: true,
    earnedDate: "2024-01-15",
    points: 100
  },
  {
    id: 2,
    title: "Learning Streak",
    description: "Study for 7 consecutive days",
    icon: Target,
    earned: true,
    earnedDate: "2024-02-01",
    points: 150
  },
  {
    id: 3,
    title: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    icon: Star,
    earned: false,
    progress: 60,
    points: 200
  },
  {
    id: 4,
    title: "Community Helper",
    description: "Help 10 fellow learners",
    icon: Award,
    earned: false,
    progress: 30,
    points: 250
  }
];

export default function Achievements() {
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);
  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Track your learning milestones and celebrate your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-purple-600">{totalPoints}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Achievements Earned</p>
                  <p className="text-2xl font-bold text-green-600">{earnedCount}/{achievements.length}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round((earnedCount / achievements.length) * 100)}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            
            return (
              <Card key={achievement.id} className={`${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${achievement.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`h-6 w-6 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.points} points
                    </Badge>
                    {achievement.earned && (
                      <span className="text-sm text-gray-500">
                        Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {!achievement.earned && achievement.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
          </div>
        </div>
      </main>
    </div>
  );
}
