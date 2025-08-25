import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const todayTasks = [
  {
    id: 1,
    title: 'Graphic designing for beginners',
    colorClass: 'bg-green-50 border-green-500'
  },
  {
    id: 2,
    title: 'React Js dependencies',
    colorClass: 'bg-blue-50 border-blue-500'
  },
  {
    id: 3,
    title: 'Html5 & CSS build',
    colorClass: 'bg-purple-50 border-purple-500'
  }
];

export default function TasksWidget() {
  return (
    <Card data-testid="tasks-widget">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800" data-testid="text-tasks-title">Today Tasks</h3>
          <Button 
            variant="ghost" 
            className="text-purple-primary hover:text-purple-dark text-sm font-medium"
            data-testid="button-more-tasks"
          >
            More Tasks
          </Button>
        </div>
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <div 
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${task.colorClass}`}
              data-testid={`task-item-${task.id}`}
            >
              <span className="text-sm font-medium text-gray-800" data-testid={`text-task-title-${task.id}`}>
                {task.title}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
