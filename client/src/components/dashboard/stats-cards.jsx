import { Award, PlayCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const statisticsData = [
  {
    icon: Award,
    title: 'Certificates Earned',
    value: '18',
    bgColor: 'bg-accent',
    iconColor: 'text-accent-foreground'
  },
  {
    icon: PlayCircle,
    title: 'On Going Courses',
    value: '5',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    icon: CheckCircle,
    title: 'Completed Courses',
    value: '21',
    bgColor: 'bg-accent',
    iconColor: 'text-accent-foreground'
  }
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="stats-cards">
      {statisticsData.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow duration-200"
            data-testid={`card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <IconComponent className={`${stat.iconColor} w-6 h-6`} />
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1" data-testid={`text-${stat.title.toLowerCase().replace(/\s+/g, '-')}-title`}>
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-foreground" data-testid={`text-${stat.title.toLowerCase().replace(/\s+/g, '-')}-value`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
