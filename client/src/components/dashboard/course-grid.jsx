import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const coursesData = [
  {
    id: 1,
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    price: '$49.99',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200'
  },
  {
    id: 2,
    title: 'Data Analytics Mastery',
    description: 'Master data analysis with Python and SQL',
    price: '$79.99',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200'
  },
  {
    id: 3,
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps with React Native',
    price: '$69.99',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200'
  }
];

export default function CourseGrid() {
  return (
    <Card data-testid="course-grid-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800" data-testid="text-browse-courses-title">Browse Courses</h3>
          <Button 
            variant="ghost" 
            className="text-purple-primary hover:text-purple-dark font-medium"
            data-testid="button-view-all-courses"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coursesData.map((course) => (
            <div 
              key={course.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              data-testid={`card-course-${course.id}`}
            >
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
                data-testid={`img-course-${course.id}`}
              />
              <h4 className="font-semibold text-gray-800 mb-2" data-testid={`text-course-title-${course.id}`}>
                {course.title}
              </h4>
              <p className="text-gray-600 text-sm mb-3" data-testid={`text-course-description-${course.id}`}>
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-primary font-semibold" data-testid={`text-course-price-${course.id}`}>
                  {course.price}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600" data-testid={`text-course-rating-${course.id}`}>
                    {course.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
