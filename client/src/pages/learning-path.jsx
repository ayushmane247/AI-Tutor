import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Users, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const learningPathData = [
  {
    id: 1,
    title: 'Java Developer',
    description: 'Master Java programming from basics to advanced concepts including Spring framework and enterprise applications',
    instructor: 'Diana Maria',
    progress: 75,
    duration: '12 weeks',
    students: '2.5k',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    color: 'from-orange-400 to-orange-600'
  },
  {
    id: 2,
    title: 'Python Developer',
    description: 'Learn Python programming for web development, data science, and automation with hands-on projects',
    instructor: 'Diana Maria', 
    progress: 50,
    duration: '10 weeks',
    students: '3.2k',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 3,
    title: 'C++ Developer',
    description: 'Deep dive into C++ programming including object-oriented programming, data structures, and algorithms',
    instructor: 'Diana Maria',
    progress: 30,
    duration: '14 weeks', 
    students: '1.8k',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    color: 'from-green-400 to-green-600'
  },
  {
    id: 4,
    title: 'JavaScript Developer',
    description: 'Full-stack JavaScript development with React, Node.js, and modern web technologies',
    instructor: 'Diana Maria',
    progress: 85,
    duration: '8 weeks',
    students: '4.1k', 
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 5,
    title: 'Integration Developer',
    description: 'Full stack application developer with Java web frameworks and microservices architecture',
    instructor: 'Diana Maria',
    progress: 60,
    duration: '16 weeks',
    students: '1.5k',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200', 
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 6,
    title: 'React Developer',
    description: 'Modern React development with hooks, context, and advanced patterns for building scalable applications',
    instructor: 'Diana Maria',
    progress: 40,
    duration: '6 weeks',
    students: '5.2k',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    color: 'from-cyan-400 to-cyan-600'
  }
];

const popularCourses = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    rating: 4.9,
    students: '8.5k',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150'
  },
  {
    id: 2, 
    title: 'Machine Learning with Python',
    rating: 4.8,
    students: '6.2k',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150'
  },
  {
    id: 3,
    title: 'DevOps Fundamentals',
    rating: 4.7,
    students: '4.8k', 
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150'
  }
];

export default function LearningPath() {
  const [learningPathData, setLearningPathData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load enrolled courses from localStorage
    const savedLearningPath = localStorage.getItem('learningPathData');
    if (savedLearningPath) {
      setLearningPathData(JSON.parse(savedLearningPath));
    }
  }, []);

  const updateProgress = (courseId, newProgress) => {
    const updatedData = learningPathData.map(course => 
      course.id === courseId ? { ...course, progress: newProgress } : course
    );
    setLearningPathData(updatedData);
    localStorage.setItem('learningPathData', JSON.stringify(updatedData));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" data-testid="learning-path-container">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-8 mb-8 relative overflow-hidden" data-testid="learning-path-header">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-learning-path-title">
                  My Learning Path
                </h1>
                <p className="text-gray-600" data-testid="text-learning-path-description">
                  Track your progress across different programming languages and technologies
                </p>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                  alt="Learning illustration" 
                  className="w-32 h-32 object-cover rounded-full"
                  data-testid="img-learning-illustration"
                />
              </div>
            </div>
          </div>

          {/* Learning Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {learningPathData.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Clock className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Enrolled Courses</h3>
                    <p className="text-gray-500 mb-4">Start your learning journey by enrolling in courses!</p>
                    <Button 
                      onClick={() => navigate('/courses')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              learningPathData.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                data-testid={`card-course-${course.id}`}
              >
                <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      data-testid={`img-course-${course.id}`}
                    />
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800" data-testid={`text-progress-${course.id}`}>
                        {course.progress}%
                      </span>
                      <p className="text-sm text-gray-500">Completed</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid={`text-course-title-${course.id}`}>
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2" data-testid={`text-course-description-${course.id}`}>
                    {course.description}
                  </p>
                  
                  <div className="mb-4">
                    <Progress 
                      value={course.progress} 
                      className="h-2" 
                      data-testid={`progress-bar-${course.id}`}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span data-testid={`text-duration-${course.id}`}>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span data-testid={`text-students-${course.id}`}>{course.students}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span data-testid={`text-rating-${course.id}`}>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500" data-testid={`text-instructor-${course.id}`}>
                      by {course.instructor}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => navigate(`/tests/${course.id}`)}
                        data-testid={`button-continue-${course.id}`}
                      >
                        Continue
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateProgress(course.id, Math.min(100, course.progress + 10))}
                        className="text-xs"
                      >
                        +10%
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>

          {/* Most Popular Courses Section */}
          <Card data-testid="popular-courses-section">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800" data-testid="text-popular-courses-title">
                  Most Popular Courses
                </h3>
                <Button 
                  variant="ghost" 
                  className="text-purple-primary hover:text-purple-dark font-medium"
                  data-testid="button-view-all-popular"
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="group cursor-pointer hover:scale-105 transition-transform duration-200"
                    data-testid={`card-popular-course-${course.id}`}
                  >
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:opacity-90 transition-opacity"
                      data-testid={`img-popular-course-${course.id}`}
                    />
                    <h4 className="font-semibold text-gray-800 mb-2" data-testid={`text-popular-course-title-${course.id}`}>
                      {course.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span data-testid={`text-popular-course-rating-${course.id}`}>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span data-testid={`text-popular-course-students-${course.id}`}>{course.students}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}