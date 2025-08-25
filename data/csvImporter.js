import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class CSVImporter {
  constructor() {
    this.dataDirectory = path.join(__dirname, 'csv');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDirectory)) {
      fs.mkdirSync(this.dataDirectory, { recursive: true });
    }
  }

  /**
   * Import questions from CSV file
   * @param {string} subjectId - Subject identifier
   * @param {string} csvFileName - Name of CSV file
   * @returns {Promise<Array>} Array of formatted questions
   */
  async importQuestionsFromCSV(subjectId, csvFileName) {
    return new Promise((resolve, reject) => {
      const csvPath = path.join(this.dataDirectory, csvFileName);
      const questions = [];

      if (!fs.existsSync(csvPath)) {
        reject(new Error(`CSV file not found: ${csvPath}`));
        return;
      }

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          const question = this.formatQuestionFromRow(row, subjectId);
          if (question) {
            questions.push(question);
          }
        })
        .on('end', () => {
          console.log(`✅ Imported ${questions.length} questions from ${csvFileName}`);
          resolve(questions);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Format CSV row into question object
   * @param {Object} row - CSV row data
   * @param {string} subjectId - Subject identifier
   * @returns {Object|null} Formatted question object
   */
  formatQuestionFromRow(row, subjectId) {
    try {
      // Expected CSV columns:
      // question,type,options,correctAnswer,explanation,difficulty,topic
      
      const question = {
        id: `${subjectId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question: row.question?.trim(),
        type: row.type?.toLowerCase() || 'multiple-choice',
        difficulty: row.difficulty?.toLowerCase() || 'beginner',
        topic: row.topic?.trim() || 'General',
        explanation: row.explanation?.trim() || '',
        subjectId: subjectId
      };

      // Handle different question types
      if (question.type === 'multiple-choice') {
        question.options = this.parseOptions(row.options);
        question.correctAnswer = parseInt(row.correctAnswer) || 0;
      } else if (question.type === 'essay') {
        question.options = [];
        question.correctAnswer = null;
      }

      // Validate required fields
      if (!question.question) {
        console.warn('Skipping question with missing question text');
        return null;
      }

      return question;
    } catch (error) {
      console.error('Error formatting question from row:', error);
      return null;
    }
  }

  /**
   * Parse options string into array
   * @param {string} optionsString - Comma-separated options
   * @returns {Array} Array of options
   */
  parseOptions(optionsString) {
    if (!optionsString) return [];
    
    // Split by comma and clean up
    return optionsString
      .split(',')
      .map(option => option.trim())
      .filter(option => option.length > 0);
  }

  /**
   * Get available CSV files for a subject
   * @param {string} subjectId - Subject identifier
   * @returns {Array} Array of CSV file names
   */
  getAvailableCSVFiles(subjectId) {
    try {
      const files = fs.readdirSync(this.dataDirectory);
      return files.filter(file => 
        file.endsWith('.csv') && 
        file.toLowerCase().includes(subjectId.toLowerCase())
      );
    } catch (error) {
      console.error('Error reading CSV directory:', error);
      return [];
    }
  }

  /**
   * Create sample CSV file for a subject
   * @param {string} subjectId - Subject identifier
   * @param {string} subjectName - Subject name
   */
  createSampleCSV(subjectId, subjectName) {
    const sampleData = this.getSampleData(subjectId, subjectName);
    const csvPath = path.join(this.dataDirectory, `${subjectId}_questions.csv`);
    
    const csvContent = this.convertToCSV(sampleData);
    
    fs.writeFileSync(csvPath, csvContent);
    console.log(`✅ Created sample CSV file: ${csvPath}`);
  }

  /**
   * Get sample data for a subject
   * @param {string} subjectId - Subject identifier
   * @param {string} subjectName - Subject name
   * @returns {Array} Sample question data
   */
  getSampleData(subjectId, subjectName) {
    const sampleQuestions = {
      dsa: [
        {
          question: "What is the time complexity of binary search?",
          type: "multiple-choice",
          options: "O(1),O(log n),O(n),O(n²)",
          correctAnswer: "1",
          explanation: "Binary search has O(log n) time complexity because it divides the search space in half with each iteration.",
          difficulty: "beginner",
          topic: "Searching"
        },
        {
          question: "Which data structure follows LIFO principle?",
          type: "multiple-choice",
          options: "Queue,Stack,Linked List,Tree",
          correctAnswer: "1",
          explanation: "Stack follows LIFO (Last In, First Out) principle where the last element added is the first one to be removed.",
          difficulty: "beginner",
          topic: "Stacks & Queues"
        }
      ],
      cn: [
        {
          question: "Which layer of the OSI model is responsible for routing?",
          type: "multiple-choice",
          options: "Physical Layer,Data Link Layer,Network Layer,Transport Layer",
          correctAnswer: "2",
          explanation: "The Network Layer (Layer 3) is responsible for routing packets between different networks.",
          difficulty: "beginner",
          topic: "OSI Model"
        }
      ],
      os: [
        {
          question: "What is a deadlock and what are its necessary conditions?",
          type: "essay",
          options: "",
          correctAnswer: "",
          explanation: "A deadlock occurs when two or more processes are blocked waiting for resources held by each other. The four necessary conditions are: mutual exclusion, hold and wait, no preemption, and circular wait.",
          difficulty: "intermediate",
          topic: "Deadlocks"
        }
      ],
      dbms: [
        {
          question: "What are ACID properties in database transactions?",
          type: "essay",
          options: "",
          correctAnswer: "",
          explanation: "ACID stands for Atomicity (all or nothing), Consistency (data integrity), Isolation (concurrent transactions don't interfere), and Durability (permanent changes).",
          difficulty: "intermediate",
          topic: "ACID Properties"
        }
      ],
      webdev: [
        {
          question: "What is the difference between localStorage and sessionStorage?",
          type: "essay",
          options: "",
          correctAnswer: "",
          explanation: "localStorage persists data even after the browser is closed, while sessionStorage data is cleared when the browser session ends.",
          difficulty: "beginner",
          topic: "JavaScript"
        }
      ]
    };

    return sampleQuestions[subjectId] || [];
  }

  /**
   * Convert data array to CSV format
   * @param {Array} data - Array of question objects
   * @returns {string} CSV content
   */
  convertToCSV(data) {
    const headers = ['question', 'type', 'options', 'correctAnswer', 'explanation', 'difficulty', 'topic'];
    
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }

  /**
   * Validate CSV file structure
   * @param {string} csvFileName - Name of CSV file
   * @returns {Promise<Object>} Validation result
   */
  async validateCSV(csvFileName) {
    return new Promise((resolve, reject) => {
      const csvPath = path.join(this.dataDirectory, csvFileName);
      const results = {
        valid: true,
        errors: [],
        warnings: [],
        questionCount: 0
      };

      if (!fs.existsSync(csvPath)) {
        results.valid = false;
        results.errors.push('File not found');
        resolve(results);
        return;
      }

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row, index) => {
          results.questionCount++;
          
          // Validate required fields
          if (!row.question) {
            results.errors.push(`Row ${index + 1}: Missing question text`);
          }
          
          if (!row.type) {
            results.warnings.push(`Row ${index + 1}: Missing question type, defaulting to multiple-choice`);
          }
          
          if (row.type === 'multiple-choice' && !row.options) {
            results.errors.push(`Row ${index + 1}: Multiple choice question missing options`);
          }
          
          if (row.type === 'multiple-choice' && !row.correctAnswer) {
            results.errors.push(`Row ${index + 1}: Multiple choice question missing correct answer`);
          }
        })
        .on('end', () => {
          results.valid = results.errors.length === 0;
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}

export default CSVImporter;
