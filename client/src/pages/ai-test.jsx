import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import AITestInterface from '@/components/test/AITestInterface';
import AITestResults from '@/components/test/AITestResults';
import AITestDashboard from '@/components/dashboard/AITestDashboard';

// Sample test data - replace with actual API calls
const sampleTests = {
  'java-fundamentals': {
    id: 'java-fundamentals',
    title: 'Java Fundamentals Quiz',
    description: 'Test your knowledge of basic Java syntax, variables, and data types.',
    duration: 30,
    totalPoints: 100,
    difficulty: 'Easy',
    topic: 'Java Programming',
    topics: ['Variables', 'Data Types', 'Operators', 'Control Structures'],
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Which of the following is the correct way to declare an integer variable in Java?',
        options: [
          'int x = 10;',
          'integer x = 10;',
          'Int x = 10;',
          'var x = 10;'
        ],
        correctAnswer: 'int x = 10;'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'What is the default value of a boolean variable in Java?',
        options: ['true', 'false', 'null', '0'],
        correctAnswer: 'false'
      },
      {
        id: 3,
        type: 'short-answer',
        question: 'What keyword is used to create a constant in Java?',
        correctAnswer: 'final'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'Which operator is used for string concatenation in Java?',
        options: ['+', '&', '||', '++'],
        correctAnswer: '+'
      },
      {
        id: 5,
        type: 'long-answer',
        question: 'Explain the difference between == and .equals() method in Java when comparing strings.',
        correctAnswer: '== compares object references while .equals() compares the actual content of strings. For string comparison, .equals() should be used to compare values.'
      }
    ]
  },
  'oop-concepts': {
    id: 'oop-concepts',
    title: 'Object-Oriented Programming Test',
    description: 'Comprehensive test on OOP concepts including inheritance, polymorphism, and encapsulation.',
    duration: 45,
    totalPoints: 150,
    difficulty: 'Medium',
    topic: 'Object-Oriented Programming',
    topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Which principle of OOP allows a class to inherit properties from another class?',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
        correctAnswer: 'Inheritance'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'What is method overriding?',
        options: [
          'Creating multiple methods with same name but different parameters',
          'Redefining a method in a subclass that already exists in the parent class',
          'Hiding a method from the parent class',
          'Creating a new method in a class'
        ],
        correctAnswer: 'Redefining a method in a subclass that already exists in the parent class'
      },
      {
        id: 3,
        type: 'long-answer',
        question: 'Explain the concept of encapsulation and provide an example.',
        correctAnswer: 'Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), and restricting access to internal implementation details. Example: A class with private variables and public getter/setter methods.'
      }
    ]
  }
};

export default function AITestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('test'); // 'test', 'results', 'dashboard'
  const [testResult, setTestResult] = useState(null);
  const [testHistory, setTestHistory] = useState([]);

  useEffect(() => {
    // Load test history from localStorage
    const savedHistory = localStorage.getItem('aiTestHistory');
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory));
    }
  }, []);

  const testData = sampleTests[testId];

  if (!testData) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Test Not Found</h1>
              <p className="text-gray-600 mb-4">The requested test could not be found.</p>
              <button
                onClick={() => navigate('/tests')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Back to Tests
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleTestComplete = (result) => {
    console.log('handleTestComplete called with:', result);
    
    if (!result) {
      console.error('No result provided to handleTestComplete');
      return;
    }
    
    setTestResult(result);
    
    // Save to test history
    const updatedHistory = [...testHistory, result];
    setTestHistory(updatedHistory);
    localStorage.setItem('aiTestHistory', JSON.stringify(updatedHistory));
    
    console.log('Switching to results view...');
    setCurrentView('results');
  };

  const handleRetakeTest = () => {
    setTestResult(null);
    setCurrentView('test');
  };

  const handleViewDashboard = () => {
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'test':
        return (
          <AITestInterface
            testData={testData}
            onTestComplete={handleTestComplete}
          />
        );
      case 'results':
        return (
          <AITestResults
            testResult={testResult}
            onRetakeTest={handleRetakeTest}
            onViewDashboard={handleViewDashboard}
          />
        );
      case 'dashboard':
        return (
          <AITestDashboard
            testResults={testHistory}
            userProfile={{ name: 'Student', level: 'Intermediate' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
