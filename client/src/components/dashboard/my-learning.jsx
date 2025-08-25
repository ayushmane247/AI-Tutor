import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyLearning({ enrolledCourses, allCourses = [], onEnroll }) {
  const navigate = useNavigate();
  
  // Ensure allCourses is an array and filter enrolled courses
  const enrolled = Array.isArray(allCourses) 
    ? allCourses.filter(course => enrolledCourses[course.id])
    : [];

  if (enrolled.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No courses enrolled yet</h3>
        <p className="mt-1 text-sm text-gray-500">Browse courses and start learning today!</p>
        <Button 
          className="mt-4"
          onClick={() => navigate('/courses')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Learning Path</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {enrolled.length} {enrolled.length === 1 ? 'Course' : 'Courses'} Enrolled
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolled.map((course) => (
          <Card key={course.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg">{course.title}</h3>
                <p className="text-gray-200 text-sm">{course.instructor}</p>
              </div>
            </div>
            
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{course.duration} • {course.level}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>Last accessed: 2 days ago</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 mt-auto"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
