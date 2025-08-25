import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import TestTaking from '@/components/TestTaking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Clock, CheckCircle, AlertCircle, Play, Trophy, Target, BookOpen, Sparkles } from 'lucide-react';
import { coursesData } from './courses';
import { apiRequest } from '@/lib/queryClient';

const testsData = {
  1: [ // Java Programming
    {
      id: 1,
      title: "Java Fundamentals Quiz",
      description: "Test your knowledge of basic Java syntax, variables, and data types.",
      duration: "30 minutes",
      questions: 20,
      status: "available",
      difficulty: "Easy",
      points: 100,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Variables", "Data Types", "Operators", "Control Structures"]
    },
    {
      id: 2,
      title: "Object-Oriented Programming Test",
      description: "Comprehensive test on OOP concepts including inheritance, polymorphism, and encapsulation.",
      duration: "45 minutes",
      questions: 25,
      status: "completed",
      difficulty: "Medium",
      points: 150,
      attempts: 2,
      maxAttempts: 3,
      bestScore: 85,
      topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation", "Abstraction"]
    },
    {
      id: 3,
      title: "Collections Framework Assessment",
      description: "Advanced test covering Java Collections Framework and data structures.",
      duration: "60 minutes",
      questions: 30,
      status: "locked",
      difficulty: "Hard",
      points: 200,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["ArrayList", "HashMap", "TreeSet", "LinkedList", "Iterator Pattern"],
      prerequisite: "Complete OOP Test with 70% or higher"
    },
    {
      id: 4,
      title: "Java Multithreading & Concurrency",
      description: "Test your understanding of threads, synchronization, and concurrent programming in Java.",
      duration: "55 minutes",
      questions: 28,
      status: "available",
      difficulty: "Hard",
      points: 190,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["Threads", "Synchronization", "Executor Framework", "Concurrent Collections", "Locks"]
    },
    {
      id: 5,
      title: "Java Spring Framework Basics",
      description: "Introduction to Spring Framework concepts and dependency injection.",
      duration: "40 minutes",
      questions: 22,
      status: "available",
      difficulty: "Medium",
      points: 130,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Dependency Injection", "Spring Boot", "Annotations", "MVC Pattern", "REST APIs"]
    }
  ],
  2: [ // C++ Programming
    {
      id: 1,
      title: "C++ Basics and Syntax",
      description: "Test your understanding of C++ fundamentals and basic programming concepts.",
      duration: "35 minutes",
      questions: 22,
      status: "available",
      difficulty: "Easy",
      points: 110,
      attempts: 1,
      maxAttempts: 3,
      bestScore: 78,
      topics: ["Syntax", "Variables", "Functions", "Arrays", "Pointers"]
    },
    {
      id: 2,
      title: "Memory Management & STL",
      description: "Advanced test on dynamic memory allocation and Standard Template Library.",
      duration: "50 minutes",
      questions: 28,
      status: "available",
      difficulty: "Hard",
      points: 180,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["Dynamic Memory", "Smart Pointers", "STL Containers", "Algorithms", "Templates"]
    },
    {
      id: 3,
      title: "Object-Oriented Programming in C++",
      description: "Comprehensive test on C++ OOP concepts including classes, inheritance, and polymorphism.",
      duration: "45 minutes",
      questions: 25,
      status: "available",
      difficulty: "Medium",
      points: 150,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Classes", "Inheritance", "Virtual Functions", "Operator Overloading", "Abstract Classes"]
    },
    {
      id: 4,
      title: "Advanced C++ Features",
      description: "Test on modern C++ features including move semantics, lambda expressions, and more.",
      duration: "60 minutes",
      questions: 30,
      status: "locked",
      difficulty: "Hard",
      points: 200,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["Move Semantics", "Lambda Expressions", "Auto Keyword", "Range-based Loops", "RAII"],
      prerequisite: "Complete OOP in C++ with 75% or higher"
    }
  ],
  3: [ // Python for Everyone
    {
      id: 1,
      title: "Python Fundamentals Quiz",
      description: "Basic Python concepts including data structures and control flow.",
      duration: "25 minutes",
      questions: 18,
      status: "completed",
      difficulty: "Easy",
      points: 90,
      attempts: 1,
      maxAttempts: 3,
      bestScore: 92,
      topics: ["Variables", "Lists", "Dictionaries", "Functions", "Loops"]
    },
    {
      id: 2,
      title: "Data Analysis with Python",
      description: "Test your skills in data manipulation and analysis using Python libraries.",
      duration: "40 minutes",
      questions: 24,
      status: "in_progress",
      difficulty: "Medium",
      points: 140,
      attempts: 1,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Pandas", "NumPy", "Matplotlib", "Data Cleaning", "Statistical Analysis"]
    },
    {
      id: 3,
      title: "Python Object-Oriented Programming",
      description: "Test your understanding of OOP concepts in Python including classes and inheritance.",
      duration: "35 minutes",
      questions: 20,
      status: "available",
      difficulty: "Medium",
      points: 120,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Classes", "Inheritance", "Polymorphism", "Encapsulation", "Magic Methods"]
    },
    {
      id: 4,
      title: "Web Development with Python",
      description: "Test on Flask/Django frameworks and web development concepts in Python.",
      duration: "50 minutes",
      questions: 26,
      status: "available",
      difficulty: "Hard",
      points: 170,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["Flask", "Django", "REST APIs", "Database Integration", "Authentication"]
    },
    {
      id: 5,
      title: "Machine Learning with Python",
      description: "Advanced test on machine learning concepts using scikit-learn and TensorFlow.",
      duration: "65 minutes",
      questions: 32,
      status: "locked",
      difficulty: "Hard",
      points: 220,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["Scikit-learn", "TensorFlow", "Neural Networks", "Model Evaluation", "Feature Engineering"],
      prerequisite: "Complete Data Analysis with Python with 80% or higher"
    }
  ],
  4: [ // JavaScript Mastery
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of basic JavaScript syntax, variables, and functions.",
      duration: "30 minutes",
      questions: 20,
      status: "available",
      difficulty: "Easy",
      points: 100,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Variables", "Functions", "Arrays", "Objects", "DOM Manipulation"]
    },
    {
      id: 2,
      title: "ES6+ Features and Modern JavaScript",
      description: "Comprehensive test on modern JavaScript features and ES6+ syntax.",
      duration: "45 minutes",
      questions: 25,
      status: "available",
      difficulty: "Medium",
      points: 150,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Arrow Functions", "Destructuring", "Promises", "Async/Await", "Modules"]
    },
    {
      id: 3,
      title: "React.js Fundamentals",
      description: "Test your understanding of React components, state, and props.",
      duration: "40 minutes",
      questions: 22,
      status: "available",
      difficulty: "Medium",
      points: 130,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Components", "JSX", "State", "Props", "Event Handling"]
    },
    {
      id: 4,
      title: "Node.js and Backend Development",
      description: "Test on Node.js, Express.js, and backend development concepts.",
      duration: "55 minutes",
      questions: 28,
      status: "available",
      difficulty: "Hard",
      points: 180,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["Node.js", "Express.js", "REST APIs", "Middleware", "Database Integration"]
    }
  ],
  5: [ // Data Science Fundamentals
    {
      id: 1,
      title: "Statistics and Probability Basics",
      description: "Test your understanding of fundamental statistical concepts and probability theory.",
      duration: "40 minutes",
      questions: 24,
      status: "available",
      difficulty: "Easy",
      points: 120,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Descriptive Statistics", "Probability", "Distributions", "Hypothesis Testing", "Correlation"]
    },
    {
      id: 2,
      title: "Data Visualization and Analysis",
      description: "Test on data visualization techniques and exploratory data analysis.",
      duration: "45 minutes",
      questions: 26,
      status: "available",
      difficulty: "Medium",
      points: 140,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["Matplotlib", "Seaborn", "Plotly", "Data Cleaning", "EDA Techniques"]
    },
    {
      id: 3,
      title: "Machine Learning Algorithms",
      description: "Comprehensive test on supervised and unsupervised learning algorithms.",
      duration: "60 minutes",
      questions: 30,
      status: "available",
      difficulty: "Hard",
      points: 200,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["Linear Regression", "Classification", "Clustering", "Decision Trees", "Model Evaluation"]
    }
  ],
  6: [ // Web Development Bootcamp
    {
      id: 1,
      title: "HTML & CSS Fundamentals",
      description: "Test your knowledge of HTML structure and CSS styling basics.",
      duration: "35 minutes",
      questions: 22,
      status: "available",
      difficulty: "Easy",
      points: 110,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["HTML Elements", "CSS Selectors", "Flexbox", "Grid Layout", "Responsive Design"]
    },
    {
      id: 2,
      title: "JavaScript for Web Development",
      description: "Test on JavaScript DOM manipulation and web development concepts.",
      duration: "40 minutes",
      questions: 24,
      status: "available",
      difficulty: "Medium",
      points: 130,
      attempts: 0,
      maxAttempts: 3,
      bestScore: null,
      topics: ["DOM Manipulation", "Event Listeners", "AJAX", "Local Storage", "Form Validation"]
    },
    {
      id: 3,
      title: "Full-Stack Development",
      description: "Comprehensive test on full-stack web development including frontend and backend.",
      duration: "70 minutes",
      questions: 35,
      status: "locked",
      difficulty: "Hard",
      points: 250,
      attempts: 0,
      maxAttempts: 2,
      bestScore: null,
      topics: ["React/Vue", "Node.js", "Databases", "Authentication", "Deployment"],
      prerequisite: "Complete JavaScript for Web Development with 75% or higher"
    }
  ]
};

export default function Tests() {
  const { courseId } = useParams();
  const [selectedTest, setSelectedTest] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [generatedTest, setGeneratedTest] = useState(null);
  const course = courseId ? coursesData.find(c => c.id === parseInt(courseId)) : null;
  const tests = courseId ? (testsData[courseId] || []) : [];

  const generateTestMutation = useMutation({
    mutationFn: async (topic) => {
      return apiRequest(`/api/tests/demo/${topic}?count=20`, {
        method: 'GET'
      });
    },
    onSuccess: (data, topic) => {
      if (data && data.questions && data.questions.length > 0) {
        const test = {
          id: `ai-${Date.now()}`,
          title: `AI Generated ${topic.charAt(0).toUpperCase() + topic.slice(1)} Test`,
          description: `Test your knowledge with AI-generated ${topic} questions`,
          questions: data.questions.map((q, index) => ({
            id: index + 1,
            type: 'multiple-choice',
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty || 'Medium',
            topic: q.topic || topic,
            explanation: q.explanation
          })),
          duration: '30 minutes',
          difficulty: 'Medium',
          totalPoints: data.questions.length * 5,
          isAIGenerated: true
        };
        console.log('Generated AI test:', test);
        setGeneratedTest(test);
        setActiveTest(test);
      } else {
        console.error('Invalid test data received:', data);
        alert('Failed to generate test. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Error generating test:', error);
      alert('Failed to generate test. Please check your connection and try again.');
    }
  });

  const handleStartTest = async (test) => {
    console.log('Starting test:', test);
    
    // Check if this is a regular test that needs questions generated
    if (!test.questions || typeof test.questions === 'number') {
      console.log('Test needs questions generated, using demo questions...');
      
      // Generate demo questions for regular tests
      try {
        const response = await apiRequest(`/api/tests/demo-questions`, {
          method: 'GET'
        });
        
        if (response && response.javascript) {
          // Use demo questions and format them properly
          const demoQuestions = response.javascript.slice(0, test.questions || 20);
          const formattedTest = {
            ...test,
            questions: demoQuestions.map((q, index) => ({
              id: index + 1,
              type: 'multiple-choice',
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              difficulty: q.difficulty,
              topic: q.topic,
              explanation: q.explanation
            }))
          };
          console.log('Generated test with demo questions:', formattedTest);
          setActiveTest(formattedTest);
        } else {
          throw new Error('No demo questions available');
        }
      } catch (error) {
        console.error('Failed to generate questions for test:', error);
        alert('Failed to load test questions. Please try again.');
        return;
      }
    } else {
      // Test already has questions (AI generated test)
      setActiveTest(test);
    }
  };

  const handleTestComplete = (results) => {
    console.log('Test completed with results:', results);
    // Here you would typically save the results to the backend
  };

  const handleExitTest = () => {
    setActiveTest(null);
    setGeneratedTest(null);
  };

  const handleGenerateTest = (topic) => {
    console.log('Generating test for topic:', topic);
    generateTestMutation.mutate(topic.toLowerCase());
  };

  if (activeTest) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <TestTaking 
            test={activeTest} 
            onComplete={handleTestComplete}
            onExit={handleExitTest}
          />
        </main>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'available': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'locked': return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'available': return <Play className="w-4 h-4" />;
      case 'locked': return <AlertCircle className="w-4 h-4" />;
      default: return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
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

  // If no courseId provided, show overview of all tests
  if (!courseId) {
    const allTests = Object.entries(testsData).flatMap(([cId, tests]) => 
      tests.map(test => ({
        ...test,
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
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">All Tests & Quizzes</h1>
                  <p className="text-gray-600">Track your progress and test your knowledge across all courses</p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white p-4 rounded-full">
                    <ClipboardCheck className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <ClipboardCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">{allTests.length}</h3>
                  <p className="text-gray-600">Total Tests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {allTests.filter(t => t.status === 'completed').length}
                  </h3>
                  <p className="text-gray-600">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Play className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {allTests.filter(t => t.status === 'available').length}
                  </h3>
                  <p className="text-gray-600">Available</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {allTests.filter(t => t.bestScore && t.bestScore >= 80).length}
                  </h3>
                  <p className="text-gray-600">High Scores</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Generated Tests Section */}
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <span>AI Generated Tests</span>
                </CardTitle>
                <p className="text-gray-600">Generate custom tests with AI for any programming topic</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['JavaScript', 'Python', 'React', 'Java'].map((topic) => (
                    <Button
                      key={topic}
                      onClick={() => handleGenerateTest(topic)}
                      disabled={generateTestMutation.isPending}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {generateTestMutation.isPending ? 'Generating...' : `${topic} Test`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tests List */}
            <div className="space-y-6">
              {allTests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tests Available</h3>
                    <p className="text-gray-500">Start enrolling in courses to see tests here.</p>
                  </CardContent>
                </Card>
              ) : (
                allTests.map((test) => (
                  <Card key={`${test.courseId}-${test.id}`} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {test.courseName}
                            </Badge>
                          </div>
                          <CardTitle className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(test.status)}
                            <span>{test.title}</span>
                          </CardTitle>
                          <p className="text-gray-600">{test.description}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(test.status)}>
                            {test.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getDifficultyColor(test.difficulty)}>
                            {test.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{test.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{test.questions} questions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{test.points} points</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {test.attempts}/{test.maxAttempts} attempts
                          </span>
                        </div>
                      </div>

                      {test.bestScore && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Best Score:</span>
                            <span className={`font-bold ${getScoreColor(test.bestScore)}`}>
                              {test.bestScore}%
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Topics Covered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {test.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {test.status === 'locked' ? (
                          <Button disabled className="bg-gray-400 cursor-not-allowed">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        ) : test.status === 'completed' ? (
                          <>
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={test.attempts >= test.maxAttempts}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {test.attempts >= test.maxAttempts ? 'No Attempts Left' : 'Retake Test'}
                            </Button>
                            <Button variant="outline">
                              <Trophy className="w-4 h-4 mr-2" />
                              View Results
                            </Button>
                          </>
                        ) : test.status === 'in_progress' ? (
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Test
                          </Button>
                        ) : (
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleStartTest(test)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Test
                          </Button>
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
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {course.title} - Tests & Quizzes
                </h1>
                <p className="text-gray-600">
                  Assess your knowledge and track your learning progress with interactive tests
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white p-4 rounded-full">
                  <ClipboardCheck className="w-12 h-12 text-blue-600" />
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
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Tests</p>
                    <p className="text-2xl font-bold text-blue-600">{tests.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {tests.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {tests.filter(t => t.bestScore).length > 0 
                        ? Math.round(tests.filter(t => t.bestScore).reduce((acc, t) => acc + t.bestScore, 0) / tests.filter(t => t.bestScore).length)
                        : '--'}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tests List */}
          <div className="space-y-6">
            {tests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tests Available</h3>
                  <p className="text-gray-500">Tests for this course will be available soon.</p>
                </CardContent>
              </Card>
            ) : (
              tests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(test.status)}
                          <span>{test.title}</span>
                        </CardTitle>
                        <p className="text-gray-600">{test.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(test.status)}>
                          {test.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getDifficultyColor(test.difficulty)}>
                          {test.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{test.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{test.questions} questions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{test.points} points</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {test.attempts}/{test.maxAttempts} attempts
                        </span>
                      </div>
                    </div>

                    {test.bestScore && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Best Score:</span>
                          <span className={`font-bold ${getScoreColor(test.bestScore)}`}>
                            {test.bestScore}%
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {test.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {test.prerequisite && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Prerequisite:</strong> {test.prerequisite}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {test.status === 'locked' ? (
                        <Button disabled className="bg-gray-400 cursor-not-allowed">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      ) : test.status === 'completed' ? (
                        <>
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={test.attempts >= test.maxAttempts}
                            onClick={() => handleStartTest(test)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {test.attempts >= test.maxAttempts ? 'No Attempts Left' : 'Retake Test'}
                          </Button>
                          <Button variant="outline">
                            <Trophy className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                        </>
                      ) : test.status === 'in_progress' ? (
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStartTest(test)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continue Test
                        </Button>
                      ) : (
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStartTest(test)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Test
                        </Button>
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
