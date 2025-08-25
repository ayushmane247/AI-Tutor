import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle, Download, Upload, Calendar } from 'lucide-react';
import { coursesData } from './courses';

const assignmentsData = {
  1: [ // Java Programming
    {
      id: 1,
      title: "Basic Java Syntax and Variables",
      description: "Create a Java program that demonstrates variable declarations, data types, and basic operations.",
      dueDate: "2024-09-15",
      status: "pending",
      points: 25,
      difficulty: "Easy",
      estimatedTime: "2 hours",
      requirements: [
        "Create variables of different data types",
        "Perform arithmetic operations",
        "Display results using System.out.println()",
        "Include proper comments"
      ]
    },
    {
      id: 2,
      title: "Object-Oriented Programming Concepts",
      description: "Design and implement a class hierarchy demonstrating inheritance and polymorphism.",
      dueDate: "2024-09-22",
      status: "in_progress",
      points: 50,
      difficulty: "Medium",
      estimatedTime: "4 hours",
      requirements: [
        "Create a base class and derived classes",
        "Implement method overriding",
        "Demonstrate polymorphism",
        "Include constructors and destructors"
      ]
    },
    {
      id: 3,
      title: "Collections Framework Implementation",
      description: "Build a student management system using Java Collections Framework.",
      dueDate: "2024-09-29",
      status: "completed",
      points: 75,
      difficulty: "Hard",
      estimatedTime: "6 hours",
      requirements: [
        "Use ArrayList, HashMap, and TreeSet",
        "Implement CRUD operations",
        "Handle exceptions properly",
        "Create a user-friendly interface"
      ]
    }
  ],
  2: [ // C++ Programming
    {
      id: 1,
      title: "Pointer Arithmetic and Memory Management",
      description: "Implement dynamic memory allocation and pointer operations in C++.",
      dueDate: "2024-09-18",
      status: "pending",
      points: 40,
      difficulty: "Medium",
      estimatedTime: "3 hours",
      requirements: [
        "Dynamic memory allocation with new/delete",
        "Pointer arithmetic operations",
        "Memory leak prevention",
        "Smart pointers usage"
      ]
    },
    {
      id: 2,
      title: "STL Containers and Algorithms",
      description: "Create a data processing application using STL containers and algorithms.",
      dueDate: "2024-09-25",
      status: "pending",
      points: 60,
      difficulty: "Hard",
      estimatedTime: "5 hours",
      requirements: [
        "Use vector, map, and set containers",
        "Implement sorting and searching algorithms",
        "Custom comparators and predicates",
        "Performance optimization"
      ]
    }
  ],
  3: [ // Python for Everyone
    {
      id: 1,
      title: "Data Analysis with Pandas",
      description: "Analyze a dataset using Python pandas library and create visualizations.",
      dueDate: "2024-09-20",
      status: "in_progress",
      points: 45,
      difficulty: "Medium",
      estimatedTime: "4 hours",
      requirements: [
        "Load and clean dataset",
        "Perform statistical analysis",
        "Create meaningful visualizations",
        "Generate insights report"
      ]
    },
    {
      id: 2,
      title: "Web Scraping Project",
      description: "Build a web scraper to collect and analyze data from websites.",
      dueDate: "2024-09-27",
      status: "pending",
      points: 55,
      difficulty: "Hard",
      estimatedTime: "5 hours",
      requirements: [
        "Use BeautifulSoup and requests",
        "Handle different HTML structures",
        "Implement rate limiting",
        "Store data in structured format"
      ]
    }
  ]
};

export default function Assignments() {
  const { courseId } = useParams();
  const course = courseId ? coursesData.find(c => c.id === parseInt(courseId)) : null;
  const assignments = courseId ? (assignmentsData[courseId] || []) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // If courseId is provided but course not found
  if (courseId && !course) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Course not found</h1>
          </div>
        </main>
      </div>
    );
  }

  // If no courseId provided, show overview of all assignments
  if (!courseId) {
    const allAssignments = Object.entries(assignmentsData).flatMap(([cId, assignments]) => 
      assignments.map(assignment => ({
        ...assignment,
        courseId: cId,
        courseName: coursesData.find(c => c.id === parseInt(cId))?.title || 'Unknown Course'
      }))
    );

    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <div className="p-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">All Assignments</h1>
                  <p className="text-gray-600">View and manage assignments across all your courses</p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white p-4 rounded-full">
                    <FileText className="w-12 h-12 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">{allAssignments.length}</h3>
                  <p className="text-gray-600">Total Assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {allAssignments.filter(a => a.status === 'completed').length}
                  </h3>
                  <p className="text-gray-600">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {allAssignments.filter(a => a.status === 'in_progress').length}
                  </h3>
                  <p className="text-gray-600">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {allAssignments.filter(a => a.status === 'pending').length}
                  </h3>
                  <p className="text-gray-600">Pending</p>
                </CardContent>
              </Card>
            </div>

            {/* Assignments List */}
            <div className="space-y-6">
              {allAssignments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Assignments Available</h3>
                    <p className="text-gray-500">Start enrolling in courses to see assignments here.</p>
                  </CardContent>
                </Card>
              ) : (
                allAssignments.map((assignment) => (
                  <Card key={`${assignment.courseId}-${assignment.id}`} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {assignment.courseName}
                            </Badge>
                          </div>
                          <CardTitle className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(assignment.status)}
                            <span>{assignment.title}</span>
                          </CardTitle>
                          <p className="text-gray-600">{assignment.description}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getDifficultyColor(assignment.difficulty)}>
                            {assignment.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Due: {assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{assignment.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-purple-600">{assignment.points} points</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {assignment.status === 'completed' ? (
                          <>
                            <Button variant="outline" className="flex items-center space-x-2">
                              <Download className="w-4 h-4" />
                              <span>Download Submission</span>
                            </Button>
                            <Button variant="outline" className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>View Feedback</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2">
                              <Upload className="w-4 h-4" />
                              <span>Submit Assignment</span>
                            </Button>
                            <Button variant="outline" className="flex items-center space-x-2">
                              <Download className="w-4 h-4" />
                              <span>Download Resources</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {course.title} - Assignments
                </h1>
                <p className="text-gray-600">
                  Complete assignments to reinforce your learning and track your progress
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white p-4 rounded-full">
                  <FileText className="w-12 h-12 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Course Info Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-gray-600">{course.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Assignments</p>
                  <p className="text-2xl font-bold text-purple-600">{assignments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments List */}
          <div className="space-y-6">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Assignments Yet</h3>
                  <p className="text-gray-500">Assignments for this course will be available soon.</p>
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(assignment.status)}
                          <span>{assignment.title}</span>
                        </CardTitle>
                        <p className="text-gray-600">{assignment.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getDifficultyColor(assignment.difficulty)}>
                          {assignment.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{assignment.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-purple-600">{assignment.points} points</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {assignment.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {assignment.status === 'completed' ? (
                        <>
                          <Button variant="outline" className="flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Download Submission</span>
                          </Button>
                          <Button variant="outline" className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>View Feedback</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>Submit Assignment</span>
                          </Button>
                          <Button variant="outline" className="flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Download Resources</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
