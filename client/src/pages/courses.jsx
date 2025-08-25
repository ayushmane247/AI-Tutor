import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, BookOpen, TrendingUp, Filter, FileText, ClipboardCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const coursesData = [
  {
    id: 1,
    title: 'Java Programming Fundamentals',
    description: 'Learn Java from basics to advanced concepts including OOP, collections, and enterprise development',
    instructor: 'Dr. Sarah Johnson',
    duration: '12 weeks',
    students: '15.2k',
    rating: 4.8,
    level: 'Beginner',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Variables & Data Types', 'OOP Concepts', 'Collections Framework', 'Exception Handling', 'Multithreading'],
    enrolled: false
  },
  {
    id: 2,
    title: 'C++ Programming Mastery',
    description: 'Master C++ programming with focus on memory management, STL, and advanced features',
    instructor: 'Prof. Michael Chen',
    duration: '14 weeks',
    students: '8.7k',
    rating: 4.9,
    level: 'Intermediate',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Pointers & Memory', 'STL Containers', 'Templates', 'Object-Oriented Design', 'Algorithm Design'],
    enrolled: false
  },
  {
    id: 3,
    title: 'Python for Everyone',
    description: 'Complete Python course covering web development, data science, and automation',
    instructor: 'Dr. Emily Rodriguez',
    duration: '10 weeks',
    students: '23.5k',
    rating: 4.7,
    level: 'Beginner',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Python Basics', 'Data Structures', 'Web Development', 'Data Analysis', 'Machine Learning Intro'],
    enrolled: false
  },
  {
    id: 4,
    title: 'C Programming Essentials',
    description: 'Learn the foundation of programming with C language and system programming concepts',
    instructor: 'Prof. Robert Kim',
    duration: '8 weeks',
    students: '12.3k',
    rating: 4.6,
    level: 'Beginner',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Basic Syntax', 'Pointers & Arrays', 'Functions', 'File I/O', 'Memory Management'],
    enrolled: false
  },
  {
    id: 5,
    title: 'JavaScript Complete Course',
    description: 'Full-stack JavaScript development from basics to advanced frameworks',
    instructor: 'Alex Thompson',
    duration: '16 weeks',
    students: '19.8k',
    rating: 4.8,
    level: 'Beginner',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['ES6+ Features', 'DOM Manipulation', 'React.js', 'Node.js', 'Full-Stack Projects'],
    enrolled: false
  },
  {
    id: 6,
    title: 'Go Programming Language',
    description: 'Learn Go (Golang) for building scalable and efficient backend systems',
    instructor: 'Maria Garcia',
    duration: '6 weeks',
    students: '5.2k',
    rating: 4.7,
    level: 'Intermediate',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Go Syntax', 'Goroutines', 'Channels', 'Web APIs', 'Microservices'],
    enrolled: false
  },
  {
    id: 7,
    title: 'Rust Systems Programming',
    description: 'Master Rust for safe systems programming and high-performance applications',
    instructor: 'Dr. James Wilson',
    duration: '12 weeks',
    students: '3.8k',
    rating: 4.9,
    level: 'Advanced',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Ownership System', 'Memory Safety', 'Concurrency', 'WebAssembly', 'Performance Optimization'],
    enrolled: false
  },
  {
    id: 8,
    title: 'Swift iOS Development',
    description: 'Build iOS apps with Swift programming language and iOS SDK',
    instructor: 'Lisa Anderson',
    duration: '14 weeks',
    students: '7.1k',
    rating: 4.6,
    level: 'Intermediate',
    category: 'Mobile Development',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Swift Language', 'UIKit', 'SwiftUI', 'Core Data', 'App Store Publishing'],
    enrolled: false
  },
  {
    id: 9,
    title: 'Kotlin Android Development',
    description: 'Modern Android development with Kotlin programming language',
    instructor: 'David Park',
    duration: '12 weeks',
    students: '9.3k',
    rating: 4.7,
    level: 'Intermediate',
    category: 'Mobile Development',
    image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    topics: ['Kotlin Syntax', 'Android SDK', 'Jetpack Compose', 'MVVM Architecture', 'Google Play Store'],
    enrolled: false
  }
];

const categories = ['All', 'Programming', 'Web Development', 'Mobile Development'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load enrolled courses from localStorage on component mount
  useEffect(() => {
    const savedEnrollments = localStorage.getItem('enrolledCourses');
    if (savedEnrollments) {
      setEnrolledCourses(JSON.parse(savedEnrollments));
    }
  }, []);

  // Save enrolled courses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesCategory && matchesLevel;
  }).sort((a, b) => {
    if (sortBy === 'popular') return parseFloat(b.students) - parseFloat(a.students);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
    return 0;
  });

  const handleEnroll = (courseId) => {
    const course = coursesData.find(c => c.id === courseId);
    const isCurrentlyEnrolled = enrolledCourses[courseId];
    
    setEnrolledCourses(prevEnrolledCourses => ({ 
      ...prevEnrolledCourses, 
      [courseId]: !prevEnrolledCourses[courseId] 
    }));

    // Add to learning path data
    if (!isCurrentlyEnrolled && course) {
      const learningPathData = JSON.parse(localStorage.getItem('learningPathData') || '[]');
      const newLearningItem = {
        id: courseId,
        title: course.title.replace(' Fundamentals', ' Developer').replace(' Complete Course', ' Developer'),
        description: course.description,
        instructor: course.instructor,
        progress: 0,
        duration: course.duration,
        students: course.students,
        rating: course.rating,
        image: course.image,
        color: getRandomColor(),
        enrolledDate: new Date().toISOString()
      };
      
      const updatedLearningPath = [...learningPathData, newLearningItem];
      localStorage.setItem('learningPathData', JSON.stringify(updatedLearningPath));
      
      toast({
        title: "Successfully Enrolled!",
        description: `You've been enrolled in ${course.title}. Check your Learning Path to start learning.`,
        duration: 3000,
      });
    } else if (isCurrentlyEnrolled) {
      // Remove from learning path
      const learningPathData = JSON.parse(localStorage.getItem('learningPathData') || '[]');
      const updatedLearningPath = learningPathData.filter(item => item.id !== courseId);
      localStorage.setItem('learningPathData', JSON.stringify(updatedLearningPath));
      
      toast({
        title: "Unenrolled",
        description: `You've been unenrolled from ${course.title}.`,
        duration: 3000,
      });
    }
  };

  const getRandomColor = () => {
    const colors = [
      'from-orange-400 to-orange-600',
      'from-blue-400 to-blue-600', 
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-purple-400 to-purple-600',
      'from-cyan-400 to-cyan-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" data-testid="courses-container">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-8 mb-8 relative overflow-hidden" data-testid="courses-header">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-courses-title">
                  Programming Courses
                </h1>
                <p className="text-gray-600" data-testid="text-courses-description">
                  Learn programming languages from industry experts with hands-on projects
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white p-4 rounded-full">
                  <BookOpen className="w-12 h-12 text-purple-primary" data-testid="courses-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="mb-8" data-testid="filters-card">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Category:</span>
                  <div className="flex space-x-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? "bg-purple-primary text-white" : ""}
                        data-testid={`filter-category-${category.toLowerCase()}`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Level:</span>
                  <div className="flex space-x-2">
                    {levels.map((level) => (
                      <Button
                        key={level}
                        variant={selectedLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLevel(level)}
                        className={selectedLevel === level ? "bg-purple-primary text-white" : ""}
                        data-testid={`filter-level-${level.toLowerCase()}`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    data-testid="select-sort"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                data-testid={`card-course-${course.id}`}
              >
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-40 object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${course.level === 'Beginner' ? 'bg-green-600' : course.level === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'} text-white`}
                    data-testid={`badge-level-${course.id}`}
                  >
                    {course.level}
                  </Badge>
                </div>

                <CardContent className="flex-1 flex flex-col p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 flex-1">{course.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{course.students} students</span>
                    </div>
                  </div>

                  {/* Assignment and Test Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                      onClick={() => navigate(`/assignments/${course.id}`)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Assignment
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => navigate(`/tests/${course.id}`)}
                    >
                      <ClipboardCheck className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                  </div>

                  <Button 
                    className={`w-full ${enrolledCourses[course.id] ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    onClick={() => handleEnroll(course.id)}
                  >
                    {enrolledCourses[course.id] ? 'Enrolled' : 'Enroll Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card data-testid="stat-courses">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-purple-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">{coursesData.length}+</h3>
                <p className="text-gray-600">Programming Courses</p>
              </CardContent>
            </Card>
            <Card data-testid="stat-students">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">100k+</h3>
                <p className="text-gray-600">Active Students</p>
              </CardContent>
            </Card>
            <Card data-testid="stat-instructors">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">50+</h3>
                <p className="text-gray-600">Expert Instructors</p>
              </CardContent>
            </Card>
            <Card data-testid="stat-rating">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2 fill-current" />
                <h3 className="text-2xl font-bold text-gray-800">4.8</h3>
                <p className="text-gray-600">Average Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}