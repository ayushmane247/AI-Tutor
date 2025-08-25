import OpenAI from "openai";

let openai: OpenAI | undefined;
function getOpenAI() {
  if (!openai) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('🔧 Initializing OpenRouter with API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    if (!apiKey) {
      console.warn('❌ OPENROUTER_API_KEY not found in environment variables');
      return null;
    }
    
    try {
      openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        defaultHeaders: {
          'HTTP-Referer': 'http://localhost:3002',
          'X-Title': 'Education Platform',
        },
        timeout: 30000, // 30 second timeout for requests
      });
      console.log('✅ OpenRouter client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize OpenRouter client:', error);
      return null;
    }
  }
  return openai;
}

// Comprehensive programming knowledge base for educational responses
const programmingKnowledge = {
  javascript: {
    keywords: ['javascript', 'js', 'var', 'let', 'const', 'function', 'arrow', 'async', 'await', 'promise', 'react', 'node', 'closure', 'prototype', 'this'],
    responses: [
      `**JavaScript Variables & Scope:**

\`\`\`javascript
// Variable declarations
let name = "John";        // Block scoped, can be reassigned
const age = 25;          // Block scoped, cannot be reassigned
var city = "NYC";        // Function scoped (avoid using)

// Examples
if (true) {
  let blockScoped = "only inside this block";
  const PI = 3.14159;
}
\`\`\`

**Key differences:**
• \`let\` - Block scoped, can be reassigned
• \`const\` - Block scoped, cannot be reassigned  
• \`var\` - Function scoped, hoisted (use sparingly)

Would you like to see examples of functions or other JS concepts?`,

      `**JavaScript Functions:**

\`\`\`javascript
// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Arrow function (ES6+)
const greetArrow = (name) => {
  return \`Hello, \${name}!\`;
};

// Shorter arrow function
const add = (a, b) => a + b;

// Function with default parameters
function createUser(name, age = 18) {
  return { name, age };
}

// Higher-order function
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2); // [2, 4, 6, 8]
\`\`\`

**Function Types:**
• **Regular functions** - Can be hoisted, have \`this\` context
• **Arrow functions** - Lexical \`this\`, more concise syntax
• **Higher-order functions** - Functions that take/return other functions`,

      `**JavaScript Async Programming:**

\`\`\`javascript
// Promises
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data received!");
    }, 1000);
  });
}

// Async/Await (modern approach)
async function getData() {
  try {
    const result = await fetchData();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Promise chaining (older approach)
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

**Benefits of async/await:**
• Cleaner, more readable code
• Better error handling with try/catch
• Easier debugging than promise chains`,

      `**JavaScript Objects & Arrays:**

\`\`\`javascript
// Object creation and manipulation
const person = {
  name: "Alice",
  age: 30,
  skills: ["JavaScript", "Python", "React"]
};

// Destructuring
const { name, age } = person;
const [firstSkill, ...otherSkills] = person.skills;

// Array methods
const numbers = [1, 2, 3, 4, 5];
const filtered = numbers.filter(n => n > 2);     // [3, 4, 5]
const mapped = numbers.map(n => n * 2);          // [2, 4, 6, 8, 10]
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// Modern object features
const userAge = 25;
const user = {
  name: "Bob",
  age: userAge,
  greet() { return \`Hi, I'm \${this.name}\`; }
};
\`\`\`

Want to learn about specific array methods or object patterns?`
    ]
  },

  python: {
    keywords: ['python', 'py', 'print', 'def', 'class', 'import', 'pandas', 'numpy', 'django', 'flask', 'list', 'dict', 'loop', 'comprehension'],
    responses: [
      `**Python Basics & Syntax:**

\`\`\`python
# Variables (no declaration needed)
name = "Alice"
age = 25
height = 5.6
is_student = True

# Lists (ordered, mutable)
fruits = ["apple", "banana", "orange"]
fruits.append("grape")
print(fruits[0])  # "apple"

# Dictionaries (key-value pairs)
person = {
    "name": "Bob",
    "age": 30,
    "city": "New York"
}
print(person["name"])  # "Bob"

# List comprehension (Pythonic way)
squares = [x**2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]
even_squares = [x**2 for x in range(1, 6) if x % 2 == 0]  # [4, 16]
\`\`\`

**Python Features:**
• **Indentation matters** - No braces needed
• **Dynamic typing** - Variables can change types
• **Rich built-in types** - Lists, dicts, sets, tuples`,

      `**Python Functions & Classes:**

\`\`\`python
# Function definition
def greet(name, greeting="Hello"):
    """Greet a person with a custom message"""
    return f"{greeting}, {name}!"

# Class definition
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.courses = []
    
    def enroll(self, course):
        self.courses.append(course)
        return f"{self.name} enrolled in {course}"
    
    def __str__(self):
        return f"Student: {self.name}, Age: {self.age}"

# Using the class
student = Student("Alice", 20)
print(student.enroll("Python Programming"))
print(student)

# Lambda functions (anonymous functions)
add = lambda x, y: x + y
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
\`\`\`

**Object-Oriented Features:**
• **Inheritance** - Classes can inherit from other classes
• **Encapsulation** - Private attributes with underscore
• **Polymorphism** - Same method, different behaviors`,

      `**Python Data Structures & Algorithms:**

\`\`\`python
# Working with different data structures
from collections import defaultdict, Counter

# Lists vs Tuples vs Sets
my_list = [1, 2, 3, 2]      # Mutable, allows duplicates
my_tuple = (1, 2, 3)        # Immutable, allows duplicates  
my_set = {1, 2, 3}          # Mutable, no duplicates

# Dictionary operations
grades = {"math": 95, "science": 87, "english": 92}
for subject, grade in grades.items():
    print(f"{subject}: {grade}")

# File handling
with open("data.txt", "r") as file:
    content = file.read()
    lines = content.split("\\n")

# Exception handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    print("This always runs")
\`\`\`

**Common Algorithms:**
• **Sorting** - \`sorted()\`, \`list.sort()\`
• **Searching** - \`in\` operator, binary search
• **Iteration** - for loops, while loops, enumerate()`,

      `**Python Libraries & Frameworks:**

\`\`\`python
# Data Science with Pandas
import pandas as pd
import numpy as np

# Create DataFrame
data = {
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "salary": [50000, 60000, 70000]
}
df = pd.DataFrame(data)
print(df.head())

# NumPy for numerical computing
arr = np.array([1, 2, 3, 4, 5])
mean_value = np.mean(arr)
std_dev = np.std(arr)

# Web development with Flask
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/users", methods=["GET"])
def get_users():
    users = [{"id": 1, "name": "Alice"}]
    return jsonify(users)

if __name__ == "__main__":
    app.run(debug=True)
\`\`\`

**Popular Libraries:**
• **Data Science**: pandas, numpy, matplotlib, seaborn
• **Web Development**: django, flask, fastapi
• **Machine Learning**: scikit-learn, tensorflow, pytorch`
    ]
  },

  react: {
    keywords: ['react', 'jsx', 'component', 'props', 'state', 'hook', 'usestate', 'useeffect', 'redux', 'context'],
    responses: [
      `**React Components & JSX:**

\`\`\`jsx
// Functional Component
function Welcome({ name, age }) {
  return (
    <div className="welcome">
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Component with Props
function UserCard({ user }) {
  const { name, email, avatar } = user;
  
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// Using components
function App() {
  const user = {
    name: "Alice",
    email: "alice@example.com",
    avatar: "/avatar.jpg"
  };
  
  return (
    <div>
      <Welcome name="Bob" age={25} />
      <UserCard user={user} />
    </div>
  );
}
\`\`\`

**JSX Rules:**
• Use \`className\` instead of \`class\`
• Self-closing tags need forward slash: \`<img />\`
• JavaScript expressions in curly braces: \`{variable}\``,

      `**React Hooks:**

\`\`\`jsx
import { useState, useEffect } from 'react';

// useState Hook
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(prev => prev - 1);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// useEffect Hook
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data when component mounts or userId changes
    fetch(\`/api/users/\${userId}\`)
      .then(response => response.json())
      .then(userData => {
        setUser(userData);
        setLoading(false);
      });
  }, [userId]); // Dependency array
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

**Hook Rules:**
• Only call hooks at the top level
• Only call hooks from React functions
• Dependencies in useEffect determine when it runs`,

      `**React State Management:**

\`\`\`jsx
// Context API for global state
import { createContext, useContext, useReducer } from 'react';

// Create context
const AppContext = createContext();

// Reducer for complex state
function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    case 'UPDATE_THEME':
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

// Provider component
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    isLoggedIn: false,
    theme: 'light'
  });
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use context
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Using in component
function Header() {
  const { state, dispatch } = useApp();
  
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  return (
    <header>
      {state.isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button>Login</button>
      )}
    </header>
  );
}
\`\`\`

**State Management Options:**
• **useState** - Local component state
• **useReducer** - Complex state logic
• **Context API** - Global state sharing
• **Redux** - Predictable state container`
    ]
  },

  webdev: {
    keywords: ['html', 'css', 'api', 'rest', 'json', 'frontend', 'backend', 'database', 'sql'],
    responses: [
      `**HTML & CSS Fundamentals:**

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Web Page</title>
    <style>
        /* CSS Grid Layout */
        .container {
            display: grid;
            grid-template-columns: 1fr 3fr;
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        /* Flexbox for navigation */
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: #333;
            color: white;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <h1>My Website</h1>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
        </ul>
    </nav>
    
    <div class="container">
        <aside>Sidebar content</aside>
        <main>Main content</main>
    </div>
</body>
</html>
\`\`\`

**Key Concepts:**
• **Semantic HTML** - Use meaningful tags
• **CSS Grid & Flexbox** - Modern layout methods
• **Responsive Design** - Works on all devices`,

      `**REST APIs & HTTP:**

\`\`\`javascript
// Fetch API (modern way to make HTTP requests)
async function fetchUsers() {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

// POST request to create new user
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  
  return response.json();
}

// Express.js backend example
const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies

// GET endpoint
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  res.json(users);
});

// POST endpoint
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);
});
\`\`\`

**HTTP Methods:**
• **GET** - Retrieve data
• **POST** - Create new resource
• **PUT** - Update entire resource
• **DELETE** - Remove resource`
    ]
  },

  algorithms: {
    keywords: ['algorithm', 'sorting', 'searching', 'recursion', 'complexity', 'big-o', 'data structure', 'tree', 'graph'],
    responses: [
      `**Sorting Algorithms:**

\`\`\`python
# Bubble Sort - O(n²)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Quick Sort - O(n log n) average
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Merge Sort - O(n log n) always
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

**Time Complexities:**
• **Bubble Sort** - O(n²) - Simple but slow
• **Quick Sort** - O(n log n) average - Fast and popular
• **Merge Sort** - O(n log n) always - Stable and predictable`,

      `**Data Structures:**

\`\`\`python
# Stack (LIFO - Last In, First Out)
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0

# Queue (FIFO - First In, First Out)
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
        return None
    
    def is_empty(self):
        return len(self.items) == 0

# Binary Tree
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Tree traversal
def inorder_traversal(root):
    result = []
    if root:
        result.extend(inorder_traversal(root.left))
        result.append(root.val)
        result.extend(inorder_traversal(root.right))
    return result
\`\`\`

**When to Use:**
• **Stack** - Function calls, undo operations, parsing
• **Queue** - BFS, task scheduling, buffering
• **Trees** - Hierarchical data, searching, sorting`
    ]
  },

  general: {
    keywords: ['programming', 'coding', 'oop', 'git', 'version control', 'testing', 'debug', 'best practices'],
    responses: [
      `**Object-Oriented Programming (OOP):**

\`\`\`python
# Encapsulation - Bundling data and methods
class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number
        self._balance = initial_balance  # Protected attribute
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False
    
    def get_balance(self):
        return self._balance

# Inheritance - Creating specialized classes
class SavingsAccount(BankAccount):
    def __init__(self, account_number, initial_balance=0, interest_rate=0.02):
        super().__init__(account_number, initial_balance)
        self.interest_rate = interest_rate
    
    def add_interest(self):
        interest = self._balance * self.interest_rate
        self._balance += interest
        return interest

# Polymorphism - Same interface, different behavior
class CheckingAccount(BankAccount):
    def __init__(self, account_number, initial_balance=0, overdraft_limit=100):
        super().__init__(account_number, initial_balance)
        self.overdraft_limit = overdraft_limit
    
    def withdraw(self, amount):
        if 0 < amount <= (self._balance + self.overdraft_limit):
            self._balance -= amount
            return True
        return False
\`\`\`

**OOP Principles:**
• **Encapsulation** - Hide internal details
• **Inheritance** - Reuse code from parent classes
• **Polymorphism** - Same interface, different implementations
• **Abstraction** - Focus on essential features`,

      `**Git Version Control:**

\`\`\`bash
# Basic Git workflow
git init                    # Initialize repository
git add .                   # Stage all changes
git commit -m "Initial commit"  # Commit changes
git status                  # Check repository status

# Branching
git branch feature-login    # Create new branch
git checkout feature-login  # Switch to branch
git checkout -b feature-signup  # Create and switch to new branch

# Merging
git checkout main          # Switch to main branch
git merge feature-login    # Merge feature branch

# Remote repositories
git remote add origin https://github.com/user/repo.git
git push -u origin main    # Push to remote repository
git pull origin main       # Pull changes from remote

# Useful commands
git log --oneline          # View commit history
git diff                   # See changes
git reset --hard HEAD~1    # Undo last commit (dangerous!)
git stash                  # Temporarily save changes
git stash pop              # Restore stashed changes
\`\`\`

**Git Best Practices:**
• **Commit often** - Small, focused commits
• **Write clear messages** - Explain what and why
• **Use branches** - Keep features separate
• **Pull before push** - Stay up to date`,

      `**Programming Best Practices:**

\`\`\`python
# 1. Write Clean, Readable Code
def calculate_monthly_payment(principal, annual_rate, years):
    """
    Calculate monthly mortgage payment.
    
    Args:
        principal (float): Loan amount
        annual_rate (float): Annual interest rate (as decimal)
        years (int): Loan term in years
    
    Returns:
        float: Monthly payment amount
    """
    monthly_rate = annual_rate / 12
    num_payments = years * 12
    
    if monthly_rate == 0:
        return principal / num_payments
    
    payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / \\
              ((1 + monthly_rate) ** num_payments - 1)
    
    return round(payment, 2)

# 2. Error Handling
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return None
    except TypeError:
        print("Error: Both arguments must be numbers")
        return None

# 3. Unit Testing
import unittest

class TestCalculations(unittest.TestCase):
    def test_safe_divide_normal(self):
        self.assertEqual(safe_divide(10, 2), 5.0)
    
    def test_safe_divide_by_zero(self):
        self.assertIsNone(safe_divide(10, 0))
    
    def test_monthly_payment(self):
        payment = calculate_monthly_payment(100000, 0.05, 30)
        self.assertAlmostEqual(payment, 536.82, places=2)

if __name__ == '__main__':
    unittest.main()
\`\`\`

**Development Principles:**
• **DRY** - Don't Repeat Yourself
• **KISS** - Keep It Simple, Stupid
• **YAGNI** - You Aren't Gonna Need It
• **Single Responsibility** - One function, one purpose`
    ]
  }
};

function findBestResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check each category for keyword matches
  for (const [category, data] of Object.entries(programmingKnowledge)) {
    const hasKeyword = data.keywords.some(keyword => lowerMessage.includes(keyword));
    if (hasKeyword) {
      // Return a random response from this category
      const randomIndex = Math.floor(Math.random() * data.responses.length);
      return data.responses[randomIndex];
    }
  }
  
  // Default educational response
  return "Hi there! I'm here to help with whatever you'd like to talk about - programming, general questions, advice, or just having a conversation. What's on your mind?";
}

// Enhanced test analysis function
export async function generateTestAnalysis(testResults: any): Promise<any> {
  const openai = getOpenAI();
  
  if (openai) {
    try {
      const prompt = `Analyze this test performance and provide detailed feedback:

Test Results:
- Score: ${testResults.score}%
- Correct Answers: ${testResults.correctAnswers}/${testResults.totalQuestions}
- Time Taken: ${Math.floor(testResults.timeTaken / 60)} minutes
- Subject: ${testResults.subject || 'Programming'}

Provide a comprehensive analysis including:
1. Overall performance assessment
2. Key strengths identified
3. Areas for improvement (weaknesses)
4. Specific study recommendations
5. Next steps for learning

Format as JSON with these fields: overallAssessment, strengths, weaknesses, recommendations, nextSteps`;

      const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          return JSON.parse(response);
        } catch {
          // Fallback structured response
          return {
            overallAssessment: response.substring(0, 200),
            strengths: ['Good effort on the test'],
            weaknesses: ['Review areas where you scored lower'],
            recommendations: ['Practice more problems', 'Review course materials'],
            nextSteps: ['Continue with next module', 'Take practice tests']
          };
        }
      }
    } catch (error) {
      console.error('Test analysis error:', error);
    }
  }
  
  // Fallback analysis
  const score = testResults.score;
  return {
    overallAssessment: score >= 80 ? 'Excellent performance! You have a strong understanding of the concepts.' : 
                      score >= 60 ? 'Good work! You understand most concepts but there\'s room for improvement.' :
                      'Keep practicing! Focus on understanding the fundamentals better.',
    strengths: score >= 70 ? ['Strong grasp of core concepts', 'Good problem-solving approach'] : ['Attempted all questions', 'Shows learning progress'],
    weaknesses: score < 80 ? ['Review incorrect answers', 'Practice more examples', 'Strengthen fundamental concepts'] : ['Minor gaps in advanced topics'],
    recommendations: [
      'Review the topics you missed',
      'Practice similar problems',
      'Study the explanations provided',
      'Ask for help on difficult concepts'
    ],
    nextSteps: [
      score >= 70 ? 'Move to advanced topics' : 'Reinforce current material',
      'Take another practice test',
      'Join study groups or discussions'
    ]
  };
}

export async function chatWithAI(message: string, context?: string): Promise<string> {
  console.log('🔍 ChatWithAI called with message:', message.substring(0, 50) + '...');
  console.log('🔑 API Key available:', !!process.env.OPENROUTER_API_KEY);
  
  const openai = getOpenAI();
  
  // Always try OpenRouter API first if available
  if (openai) {
    try {
      console.log('🚀 Attempting OpenRouter API call...');
      
      const systemPrompt = `You are a friendly AI tutor and educational assistant. Your goal is to help students learn programming and other subjects in a simple, clear way.

Guidelines:
- Use simple, everyday language that anyone can understand
- Break down complex concepts into easy steps
- Give practical examples with code when relevant
- Be encouraging and supportive
- Ask follow-up questions to help students think
- Provide comprehensive answers that cover the topic thoroughly
- Use analogies and real-world examples to explain difficult concepts
- Always end with asking if they need clarification or want to learn more

Remember: You're not just answering questions, you're helping students truly understand and learn.`;

      const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.4,
      }, {
        timeout: 20000, // 20 second timeout
      });

      console.log('✅ OpenRouter API response received');
      const response = completion.choices[0]?.message?.content;
      
      if (response && response.trim()) {
        console.log('📝 Response length:', response.length);
        return response.trim();
      }
    } catch (error: any) {
      console.error('❌ OpenRouter API Error:', error.message);
      
      // Only fall back to local knowledge for specific errors
      if (error.status === 429 || error.message?.includes('rate limit')) {
        console.log('🔄 Rate limit hit, using fallback');
      } else if (error.status === 401 || error.message?.includes('unauthorized')) {
        console.log('🔄 API key issue, using fallback');
      } else {
        console.log('🔄 API error, using fallback');
      }
    }
  }
  
  // Fallback to local knowledge base
  console.log('⚠️ Using local knowledge base');
  return getSimpleResponse(message);
}

function getSimpleResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Programming-specific responses with more comprehensive explanations
  if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
    if (lowerMessage.includes('variable') || lowerMessage.includes('let') || lowerMessage.includes('const')) {
      return "**JavaScript Variables Explained Simply:**\n\nThink of variables like labeled boxes where you store information:\n\n• **`let`** - A box you can change the contents of\n• **`const`** - A box that's sealed once you put something in\n• **`var`** - Old-style box (avoid using this)\n\n```javascript\nlet playerName = 'Alice';  // Can change later\nconst maxScore = 100;      // Never changes\nplayerName = 'Bob';        // This works!\n// maxScore = 200;         // This would cause an error\n```\n\n**When to use which:**\n- Use `const` for values that won't change (like settings)\n- Use `let` for values that will change (like counters)\n\nNeed help with anything else about JavaScript variables?";
    }
    if (lowerMessage.includes('function')) {
      return "**JavaScript Functions - Think of Them as Recipes!**\n\nA function is like a recipe that does something when you 'call' it:\n\n```javascript\n// Basic function (like a recipe)\nfunction makeGreeting(name) {\n  return 'Hello, ' + name + '! Welcome!';\n}\n\n// Using the function\nlet message = makeGreeting('Sarah');\nconsole.log(message); // Shows: Hello, Sarah! Welcome!\n\n// Modern way (arrow function)\nconst makeGreeting = (name) => {\n  return `Hello, ${name}! Welcome!`;\n};\n\n// Even shorter for simple functions\nconst add = (a, b) => a + b;\n```\n\n**Why use functions?**\n- Avoid repeating code\n- Make code easier to understand\n- Fix bugs in one place\n\nWhat specific part of functions would you like to explore more?";
    }
    return "**JavaScript - The Language of the Web!**\n\nJavaScript makes websites come alive! Here's what it can do:\n\n🌐 **In the browser:** Make buttons work, create animations, handle forms\n🖥️ **On servers:** Build APIs and web applications (Node.js)\n📱 **Mobile apps:** Create mobile apps (React Native)\n\n**Start with these basics:**\n1. Variables (storing information)\n2. Functions (doing tasks)\n3. Events (responding to clicks, etc.)\n4. DOM manipulation (changing web pages)\n\nWhat aspect of JavaScript interests you most? I can explain any concept step by step!";
  }
  
  if (lowerMessage.includes('python') || lowerMessage.includes('py')) {
    if (lowerMessage.includes('list') || lowerMessage.includes('array')) {
      return "**Python Lists - Your Digital Shopping List!**\n\nLists in Python are like containers that hold multiple items in order:\n\n```python\n# Creating a list\nfruits = ['apple', 'banana', 'orange']\ngrades = [85, 92, 78, 96]\nmixed = ['Alice', 25, True, 3.14]  # Can mix types!\n\n# Common operations\nfruits.append('grape')        # Add to end\nfruits.insert(0, 'mango')    # Add at position 0\nfirst_fruit = fruits[0]      # Get first item\nlast_fruit = fruits[-1]      # Get last item\nfruits.remove('banana')      # Remove specific item\n\n# Useful tricks\nprint(len(fruits))           # How many items?\nprint('apple' in fruits)     # Is 'apple' in the list?\n```\n\n**Think of it like:**\n- A playlist where you can add/remove songs\n- A to-do list where you check off items\n- A line of people where position matters\n\nWhat would you like to learn about lists next?";
    }
    if (lowerMessage.includes('dict') || lowerMessage.includes('dictionary')) {
      return "**Python Dictionaries - Like a Real Dictionary!**\n\nDictionaries store information with labels (keys) and values:\n\n```python\n# Creating a dictionary\nstudent = {\n    'name': 'Alice',\n    'age': 20,\n    'grade': 'A',\n    'subjects': ['Math', 'Science']\n}\n\n# Getting information\nprint(student['name'])        # Shows: Alice\nprint(student.get('age'))     # Shows: 20\n\n# Adding/changing information\nstudent['email'] = 'alice@school.com'  # Add new\nstudent['age'] = 21                     # Update existing\n\n# Useful operations\nprint(student.keys())         # All labels\nprint(student.values())       # All values\nprint('name' in student)      # Check if key exists\n```\n\n**Real-world examples:**\n- Phone book: name → phone number\n- Inventory: product → quantity\n- Settings: option → value\n\n**Why use dictionaries?**\n- Fast lookups by name/key\n- Organize related information\n- More readable than lists for complex data\n\nWhat dictionary concept would you like me to explain further?";
    }
    return "**Python - The Beginner-Friendly Powerhouse!**\n\nPython is perfect for beginners because it reads like English:\n\n```python\n# This is actual Python code!\nif temperature > 30:\n    print('It\\'s hot today!')\nelse:\n    print('Nice weather!')\n```\n\n**What makes Python special:**\n🐍 **Easy to read** - Code looks like plain English\n🔧 **Versatile** - Web apps, data science, AI, automation\n📚 **Great libraries** - Tools for almost everything\n👥 **Helpful community** - Lots of learning resources\n\n**Popular uses:**\n- **Web development** (Django, Flask)\n- **Data science** (pandas, numpy)\n- **AI/Machine learning** (TensorFlow, scikit-learn)\n- **Automation** (scripts, web scraping)\n\nWhat area of Python interests you most? I can guide you through any topic!";
  }
  
  if (lowerMessage.includes('react')) {
    if (lowerMessage.includes('component')) {
      return "**React Components - Building Blocks of Modern Web Apps!**\n\nThink of components like LEGO blocks - each piece does one thing well, and you combine them to build something amazing:\n\n```jsx\n// A simple component (like a LEGO block)\nfunction WelcomeCard({ name, role }) {\n  return (\n    <div className='welcome-card'>\n      <h2>Hello, {name}!</h2>\n      <p>You are a {role}</p>\n      <button>Get Started</button>\n    </div>\n  );\n}\n\n// Using the component (like using LEGO blocks)\nfunction App() {\n  return (\n    <div>\n      <WelcomeCard name='Alice' role='Student' />\n      <WelcomeCard name='Bob' role='Teacher' />\n    </div>\n  );\n}\n```\n\n**Why components are awesome:**\n♻️ **Reusable** - Write once, use everywhere\n🔧 **Maintainable** - Fix bugs in one place\n🧩 **Modular** - Each piece has one job\n👥 **Shareable** - Team members can work on different parts\n\n**Real-world analogy:**\nLike car parts - you don't rebuild the engine for each car, you reuse the same engine design!\n\nWhat aspect of React components would you like to explore next?";
    }
    if (lowerMessage.includes('hook') || lowerMessage.includes('usestate')) {
      return "**React useState - Giving Your Components Memory!**\n\nThink of useState like giving your component a notebook to remember things:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  // Create a 'memory slot' for counting\n  const [count, setCount] = useState(0);\n  //     ↑        ↑           ↑\n  //  current  function   starting\n  //   value   to change   value\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me!\n      </button>\n      <button onClick={() => setCount(0)}>\n        Reset\n      </button>\n    </div>\n  );\n}\n```\n\n**How it works:**\n1. **useState(0)** - Start with 0 in memory\n2. **count** - Current value in memory\n3. **setCount** - Function to update the memory\n4. When memory changes, component re-renders (updates the screen)\n\n**Real-world examples:**\n- Shopping cart item count\n- Form input values\n- Show/hide menu states\n- Loading indicators\n\n**Key rule:** Always use the setter function (setCount), never change the value directly!\n\nWhat useState concept would you like me to clarify?";
    }
    return "**React - Building Modern Web Apps Made Easy!**\n\nReact helps you create interactive websites by breaking them into reusable pieces:\n\n**Core concepts:**\n🧩 **Components** - Reusable UI pieces (like buttons, cards)\n📝 **JSX** - HTML-like syntax in JavaScript\n🧠 **State** - Component memory (useState)\n⚡ **Props** - Passing data between components\n🎣 **Hooks** - Special functions for component features\n\n**Why developers love React:**\n- **Fast development** - Reuse components\n- **Easy debugging** - Each piece is separate\n- **Great ecosystem** - Tons of libraries\n- **Job opportunities** - High demand skill\n\n**Learning path:**\n1. Start with basic components\n2. Learn JSX syntax\n3. Understand props and state\n4. Practice with small projects\n5. Explore hooks and advanced patterns\n\nWhat React topic would you like to dive into first? I'll explain it step by step!";
  }
  
  if (lowerMessage.includes('loop') || lowerMessage.includes('for')) {
    return "**Loops - Making Computers Do Repetitive Tasks!**\n\nLoops are like telling someone 'do this 10 times' or 'keep doing this until I say stop':\n\n**JavaScript Examples:**\n```javascript\n// Count from 1 to 5\nfor (let i = 1; i <= 5; i++) {\n  console.log('Count: ' + i);\n}\n\n// Loop through a list\nconst fruits = ['apple', 'banana', 'orange'];\nfor (const fruit of fruits) {\n  console.log('I like ' + fruit);\n}\n\n// Keep going while condition is true\nlet lives = 3;\nwhile (lives > 0) {\n  console.log('Lives remaining: ' + lives);\n  lives--;\n}\n```\n\n**Python Examples:**\n```python\n# Count from 1 to 5\nfor i in range(1, 6):\n    print(f'Count: {i}')\n\n# Loop through a list\nfruits = ['apple', 'banana', 'orange']\nfor fruit in fruits:\n    print(f'I like {fruit}')\n\n# Keep going while condition is true\nlives = 3\nwhile lives > 0:\n    print(f'Lives remaining: {lives}')\n    lives -= 1\n```\n\n**When to use loops:**\n- Processing lists of data\n- Repeating actions (like game turns)\n- Searching through information\n- Creating patterns or sequences\n\nWhich type of loop would you like to understand better?";
  }
  
  // Enhanced general responses
  if (lowerMessage.includes('weather')) {
    return "I can't check live weather data, but here are some great resources:\n\n🌤️ **Weather websites:** Weather.com, AccuWeather\n📱 **Apps:** Your phone's built-in weather app\n🗺️ **Maps:** Google Maps shows current weather\n\nFor programming projects, you could use weather APIs like OpenWeatherMap to build your own weather app! Would you like to learn about that?";
  }
  
  if (lowerMessage.includes('recipe') || lowerMessage.includes('cook')) {
    return "I'd love to help with cooking! Here are some ways I can assist:\n\n👨‍🍳 **Recipe suggestions** based on ingredients you have\n🥘 **Cooking techniques** and tips\n⏰ **Meal planning** ideas\n🔥 **Troubleshooting** cooking problems\n\nWhat kind of dish are you thinking about? Or do you have specific ingredients you want to use? I can help you brainstorm ideas and techniques!";
  }
  
  if (lowerMessage.includes('math') || lowerMessage.includes('calculate')) {
    return "I'm here to help with math! I can assist with:\n\n🔢 **Basic arithmetic** - addition, subtraction, multiplication, division\n📐 **Geometry** - areas, volumes, angles\n📊 **Statistics** - averages, percentages, data analysis\n🧮 **Algebra** - solving equations, graphing\n📈 **Calculus** - derivatives, integrals (basics)\n💻 **Programming math** - algorithms, logic\n\nWhat specific math problem or concept would you like help with? Feel free to share the problem and I'll walk you through it step by step!";
  }
  
  if (lowerMessage.includes('advice') || lowerMessage.includes('help')) {
    return "I'm here to help with whatever you need! I can assist with:\n\n💻 **Programming & Tech** - Any coding questions or concepts\n📚 **Learning & Study** - Tips for understanding difficult topics\n🎯 **Problem Solving** - Breaking down complex challenges\n💡 **Project Ideas** - Suggestions for coding projects\n🗣️ **General Questions** - Anything you're curious about\n\nWhat's on your mind? Don't hesitate to ask about anything - I'm here to help you learn and understand!";
  }
  
  // Enhanced default response
  return "**Hi there! I'm your friendly AI learning assistant! 🤖**\n\nI'm here to help you learn and understand anything you're curious about. I specialize in:\n\n💻 **Programming** - JavaScript, Python, React, and more\n🎓 **Learning Support** - Breaking down complex topics\n🔧 **Problem Solving** - Step-by-step guidance\n💡 **Project Help** - Ideas and implementation tips\n\n**How I can help:**\n- Explain concepts in simple terms\n- Provide practical examples\n- Answer your questions thoroughly\n- Suggest next steps for learning\n\nWhat would you like to explore today? Just ask me anything - I'm here to help you succeed! 🚀";
}

// Generate comprehensive test questions with detailed analysis
export async function generateEnhancedTest(topic: string, count: number = 10): Promise<any> {
  const openai = getOpenAI();
  
  if (openai) {
    try {
      const prompt = `Create ${count} multiple choice questions about ${topic} programming. For each question, include:
1. The question text
2. 4 answer options
3. The correct answer index (0-3)
4. A detailed explanation
5. Difficulty level (Easy/Medium/Hard)
6. Key concepts tested

Format as JSON array with fields: question, options, correctAnswer, explanation, difficulty, concepts`;

      const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.4,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          const questions = JSON.parse(response);
          return {
            title: `${topic} Programming Test`,
            description: `Comprehensive test covering ${topic} concepts`,
            questions: questions.map((q: any, index: number) => ({
              id: index + 1,
              ...q
            }))
          };
        } catch {
          // Fallback to default questions
          return generateFallbackTest(topic, count);
        }
      }
    } catch (error) {
      console.error('Enhanced test generation error:', error);
    }
  }
  
  return generateFallbackTest(topic, count);
}

function generateFallbackTest(topic: string, count: number) {
  const fallbackQuestions: Record<string, any[]> = {
    javascript: [
      {
        question: "What is the correct way to declare a variable in modern JavaScript?",
        options: ["var name = 'John'", "let name = 'John'", "variable name = 'John'", "declare name = 'John'"],
        correctAnswer: 1,
        explanation: "'let' is the modern way to declare variables in JavaScript. It has block scope and prevents many common errors.",
        difficulty: "Easy",
        concepts: ["Variables", "ES6"]
      },
      {
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "add()", "append()", "insert()"],
        correctAnswer: 0,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
        difficulty: "Easy",
        concepts: ["Arrays", "Methods"]
      }
    ],
    python: [
      {
        question: "How do you create a list in Python?",
        options: ["list = {1, 2, 3}", "list = [1, 2, 3]", "list = (1, 2, 3)", "list = <1, 2, 3>"],
        correctAnswer: 1,
        explanation: "Square brackets [] are used to create lists in Python. Lists are ordered and mutable.",
        difficulty: "Easy",
        concepts: ["Lists", "Data Structures"]
      },
      {
        question: "What does the len() function do?",
        options: ["Lengthens a string", "Returns the length of an object", "Creates a new list", "Loops through items"],
        correctAnswer: 1,
        explanation: "The len() function returns the number of items in an object like strings, lists, or dictionaries.",
        difficulty: "Easy",
        concepts: ["Built-in Functions", "Data Types"]
      }
    ]
  };
  
  const questions = fallbackQuestions[topic.toLowerCase()] || fallbackQuestions.javascript;
  
  return {
    title: `${topic} Programming Test`,
    description: `Test your knowledge of ${topic} programming concepts`,
    questions: questions.slice(0, count).map((q: any, index: number) => ({ id: index + 1, ...q }))
  };
}