import { Trophy, Award, Star, BookOpen, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Complete 5 lessons in a single day',
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      progress: 60,
      completed: false,
      xp: 100
    },
    {
      id: 2,
      title: 'Perfect Score',
      description: 'Score 100% on a quiz',
      icon: <Award className="h-6 w-6 text-blue-500" />,
      progress: 30,
      completed: false,
      xp: 50
    },
    {
      id: 3,
      title: 'Course Master',
      description: 'Complete your first course',
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      progress: 100,
      completed: true,
      xp: 200
    },
    {
      id: 4,
      title: 'Streak Builder',
      description: 'Learn for 7 days in a row',
      icon: <Star className="h-6 w-6 text-orange-500" />,
      progress: 85,
      completed: false,
      xp: 150
    }
  ];

  const completedCount = achievements.filter(a => a.completed).length;
  const totalXp = achievements.filter(a => a.completed).reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
        <div className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
          {completedCount} of {achievements.length} completed
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Your Learning Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Courses Completed</span>
                  <span>1/10</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Total XP Earned</span>
                  <span>{totalXp} XP</span>
                </div>
                <Progress value={(totalXp / 500) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Current Streak</span>
                  <span>3 days</span>
                </div>
                <Progress value={42.8} className="h-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border ${achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${achievement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {achievement.icon}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      {!achievement.completed && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                    {achievement.completed && (
                      <div className="flex-shrink-0 ml-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
