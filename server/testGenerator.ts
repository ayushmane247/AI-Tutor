import { chatWithAI } from "./openai";

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface GeneratedTest {
  title: string;
  description: string;
  questions: TestQuestion[];
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
}

// Demo questions for immediate use
export const demoQuestions: { [key: string]: TestQuestion[] } = {
  javascript: [
    {
      id: 1,
      question: "What is the difference between 'let' and 'var' in JavaScript?",
      options: [
        "No difference, they are identical",
        "let is block-scoped, var is function-scoped",
        "var is block-scoped, let is function-scoped",
        "let cannot be reassigned, var can be"
      ],
      correctAnswer: 1,
      explanation: "let is block-scoped and only accessible within the block it's declared in, while var is function-scoped and accessible throughout the entire function.",
      difficulty: 'Easy',
      topic: 'Variables'
    },
    {
      id: 2,
      question: "Which method is used to add an element to the end of an array?",
      options: ["append()", "push()", "add()", "insert()"],
      correctAnswer: 1,
      explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
      difficulty: 'Easy',
      topic: 'Arrays'
    },
    {
      id: 3,
      question: "What does the '===' operator do in JavaScript?",
      options: [
        "Checks for equality with type coercion",
        "Checks for strict equality without type coercion",
        "Assigns a value to a variable",
        "Compares object references"
      ],
      correctAnswer: 1,
      explanation: "The === operator checks for strict equality, meaning both value and type must be the same. It does not perform type coercion.",
      difficulty: 'Medium',
      topic: 'Operators'
    },
    {
      id: 4,
      question: "What is a closure in JavaScript?",
      options: [
        "A way to close browser windows",
        "A function that has access to variables in its outer scope",
        "A method to end loops",
        "A type of error handling"
      ],
      correctAnswer: 1,
      explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
      difficulty: 'Hard',
      topic: 'Functions'
    },
    {
      id: 5,
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      options: ["string", "number", "object", "boolean"],
      correctAnswer: 2,
      explanation: "object is not a primitive data type. The primitive types in JavaScript are: string, number, boolean, undefined, null, symbol, and bigint.",
      difficulty: 'Medium',
      topic: 'Data Types'
    }
  ],
  python: [
    {
      id: 1,
      question: "Which of the following is the correct way to create a list in Python?",
      options: [
        "list = {1, 2, 3}",
        "list = [1, 2, 3]",
        "list = (1, 2, 3)",
        "list = <1, 2, 3>"
      ],
      correctAnswer: 1,
      explanation: "Lists in Python are created using square brackets []. Curly braces {} create sets or dictionaries, and parentheses () create tuples.",
      difficulty: 'Easy',
      topic: 'Data Structures'
    },
    {
      id: 2,
      question: "What is the output of: print(len('Hello World'))?",
      options: ["10", "11", "12", "Error"],
      correctAnswer: 1,
      explanation: "The string 'Hello World' has 11 characters including the space between 'Hello' and 'World'.",
      difficulty: 'Easy',
      topic: 'Strings'
    },
    {
      id: 3,
      question: "Which method is used to add an item to the end of a list?",
      options: ["add()", "append()", "insert()", "push()"],
      correctAnswer: 1,
      explanation: "The append() method adds an item to the end of a list. add() is for sets, insert() adds at a specific position, and push() is from other languages.",
      difficulty: 'Easy',
      topic: 'Lists'
    },
    {
      id: 4,
      question: "What is list comprehension in Python?",
      options: [
        "A way to understand lists better",
        "A concise way to create lists based on existing lists",
        "A method to compress lists",
        "A debugging technique for lists"
      ],
      correctAnswer: 1,
      explanation: "List comprehension is a concise way to create lists. It allows you to generate a new list by applying an expression to each item in an existing iterable.",
      difficulty: 'Medium',
      topic: 'List Comprehension'
    },
    {
      id: 5,
      question: "What does the 'self' parameter represent in Python class methods?",
      options: [
        "The class itself",
        "The instance of the class",
        "A static variable",
        "The parent class"
      ],
      correctAnswer: 1,
      explanation: "The 'self' parameter refers to the instance of the class. It allows you to access attributes and methods of that specific instance.",
      difficulty: 'Medium',
      topic: 'Classes'
    }
  ],
  react: [
    {
      id: 1,
      question: "What is JSX in React?",
      options: [
        "A new JavaScript framework",
        "A syntax extension for JavaScript",
        "A CSS preprocessor",
        "A database query language"
      ],
      correctAnswer: 1,
      explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets transpiled to regular JavaScript.",
      difficulty: 'Easy',
      topic: 'JSX'
    },
    {
      id: 2,
      question: "Which hook is used to manage state in functional components?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correctAnswer: 1,
      explanation: "useState is the hook used to add state to functional components. It returns an array with the current state value and a function to update it.",
      difficulty: 'Easy',
      topic: 'Hooks'
    },
    {
      id: 3,
      question: "When does useEffect run by default?",
      options: [
        "Only on component mount",
        "After every render",
        "Only on component unmount",
        "Only when state changes"
      ],
      correctAnswer: 1,
      explanation: "By default, useEffect runs after every render (both mount and update). You can control this behavior using the dependency array.",
      difficulty: 'Medium',
      topic: 'useEffect'
    },
    {
      id: 4,
      question: "What is the purpose of keys in React lists?",
      options: [
        "To style list items",
        "To help React identify which items have changed",
        "To sort the list items",
        "To encrypt the data"
      ],
      correctAnswer: 1,
      explanation: "Keys help React identify which items have changed, are added, or are removed. This helps React optimize re-rendering of lists.",
      difficulty: 'Medium',
      topic: 'Lists and Keys'
    },
    {
      id: 5,
      question: "What is prop drilling in React?",
      options: [
        "A method to validate props",
        "Passing props through multiple component levels",
        "A way to optimize component performance",
        "A debugging technique"
      ],
      correctAnswer: 1,
      explanation: "Prop drilling refers to the process of passing props through multiple levels of components to reach a deeply nested component that needs the data.",
      difficulty: 'Hard',
      topic: 'Props'
    }
  ]
};

export async function generateTestQuestions(
  topic: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  count: number = 20
): Promise<TestQuestion[]> {
  try {
    const prompt = `Generate ${count} multiple choice questions about ${topic} at ${difficulty} difficulty level. 
    
    Format each question as JSON with this structure:
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of the correct answer",
      "topic": "Specific topic area"
    }
    
    Make sure questions are educational, accurate, and appropriate for the difficulty level.
    Return only a JSON array of questions.`;

    const response = await chatWithAI(prompt);
    
    try {
      const questions = JSON.parse(response);
      return questions.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty,
        topic: q.topic || topic
      }));
    } catch (parseError) {
      console.log('Failed to parse AI response, using demo questions');
      return getDemoQuestions(topic, count);
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return getDemoQuestions(topic, count);
  }
}

function getDemoQuestions(topic: string, count: number): TestQuestion[] {
  const topicKey = topic.toLowerCase();
  const availableQuestions = demoQuestions[topicKey] || demoQuestions.javascript;
  
  // Repeat questions if we need more than available
  const questions: TestQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const questionIndex = i % availableQuestions.length;
    const baseQuestion = availableQuestions[questionIndex];
    questions.push({
      ...baseQuestion,
      id: i + 1
    });
  }
  
  return questions;
}

export async function generateFullTest(
  courseTitle: string,
  topics: string[],
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
): Promise<GeneratedTest> {
  const questionsPerTopic = Math.ceil(20 / topics.length);
  const allQuestions: TestQuestion[] = [];
  
  for (const topic of topics) {
    const questions = await generateTestQuestions(topic, difficulty, questionsPerTopic);
    allQuestions.push(...questions);
  }
  
  // Trim to exactly 20 questions
  const finalQuestions = allQuestions.slice(0, 20).map((q, index) => ({
    ...q,
    id: index + 1
  }));
  
  return {
    title: `${courseTitle} - Comprehensive Test`,
    description: `Test your knowledge of ${topics.join(', ')} with this comprehensive assessment.`,
    questions: finalQuestions,
    duration: difficulty === 'Easy' ? '30 minutes' : difficulty === 'Medium' ? '45 minutes' : '60 minutes',
    difficulty,
    topics
  };
}
