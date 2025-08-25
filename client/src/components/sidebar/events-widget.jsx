import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const upcomingEvents = [
  {
    id: 1,
    date: 13,
    day: 'Mon',
    title: 'Online Web Development',
    time: '2:00 Pm - 4:00 Pm'
  },
  {
    id: 2,
    date: 22,
    day: 'Wed',
    title: 'Live Stream Coding',
    time: '2:00 Pm - 6:00 Pm'
  }
];

export default function EventsWidget() {
  return (
    <Card data-testid="events-widget">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800" data-testid="text-events-title">Upcoming Events</h3>
          <Button 
            variant="ghost" 
            className="text-purple-primary hover:text-purple-dark text-sm font-medium"
            data-testid="button-see-all-events"
          >
            See All
          </Button>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-4" data-testid={`event-item-${event.id}`}>
              <div className="bg-gray-100 rounded-lg p-3 text-center min-w-[60px]">
                <div className="text-lg font-bold text-gray-800" data-testid={`text-event-date-${event.id}`}>
                  {event.date}
                </div>
                <div className="text-xs text-gray-500" data-testid={`text-event-day-${event.id}`}>
                  {event.day}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm" data-testid={`text-event-title-${event.id}`}>
                  {event.title}
                </h4>
                <p className="text-gray-500 text-xs" data-testid={`text-event-time-${event.id}`}>
                  {event.time}
                </p>
                <Button 
                  variant="ghost" 
                  className="text-purple-primary text-xs hover:text-purple-dark p-0 h-auto font-normal"
                  data-testid={`button-book-event-${event.id}`}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
