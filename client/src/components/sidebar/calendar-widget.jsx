import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CalendarWidget() {
  const [currentMonth] = useState('February 2023');
  
  const calendarDays = [
    { day: 12, isOtherMonth: true },
    { day: 13, isOtherMonth: false },
    { day: 14, isOtherMonth: false },
    { day: 15, isOtherMonth: false, isActive: true },
    { day: 16, isOtherMonth: false },
    { day: 17, isOtherMonth: false },
    { day: 18, isOtherMonth: true },
  ];

  return (
    <Card data-testid="calendar-widget">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800" data-testid="text-calendar-title">Calendar</h3>
          <Button 
            variant="ghost" 
            className="text-purple-primary hover:text-purple-dark text-sm font-medium"
            data-testid="button-see-all-calendar"
          >
            See All
          </Button>
        </div>
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" className="p-1 hover:bg-gray-100" data-testid="button-previous-month">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </Button>
            <h4 className="font-semibold text-gray-800" data-testid="text-current-month">{currentMonth}</h4>
            <Button variant="ghost" size="icon" className="p-1 hover:bg-gray-100" data-testid="button-next-month">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500 py-2" data-testid={`text-day-header-${day.toLowerCase()}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <div 
                key={index}
                className={`text-sm py-2 cursor-pointer rounded ${
                  date.isActive 
                    ? 'text-white bg-purple-primary font-semibold' 
                    : date.isOtherMonth 
                      ? 'text-gray-400 hover:bg-gray-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
                data-testid={`calendar-day-${date.day}`}
              >
                {date.day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
