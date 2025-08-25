import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// Course and Discussion interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  image: string;
  instructor: string;
  rating: number;
  enrolledCount: number;
  createdAt: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  replies: number;
  views: number;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  enrolledCourses: string[];
  completedLessons: Record<string, number>;
  achievements: string[];
  totalPoints: number;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | undefined>;
  
  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress>;
  enrollUserInCourse(userId: string, courseId: string): Promise<void>;
  
  // Community methods
  getDiscussions(): Promise<Discussion[]>;
  createDiscussion(discussion: Omit<Discussion, 'id' | 'authorName' | 'replies' | 'views'>): Promise<Discussion>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private courses: Map<string, Course>;
  private discussions: Map<string, Discussion>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.discussions = new Map();
    this.userProgress = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getUserProgress(userId: string): Promise<UserProgress> {
    let progress = this.userProgress.get(userId);
    if (!progress) {
      progress = {
        userId,
        enrolledCourses: [],
        completedLessons: {},
        achievements: [],
        totalPoints: 0
      };
      this.userProgress.set(userId, progress);
    }
    return progress;
  }

  async enrollUserInCourse(userId: string, courseId: string): Promise<void> {
    const progress = await this.getUserProgress(userId);
    if (!progress.enrolledCourses.includes(courseId)) {
      progress.enrolledCourses.push(courseId);
      progress.totalPoints += 10; // Bonus points for enrollment
      this.userProgress.set(userId, progress);
    }
  }

  async getDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createDiscussion(discussionData: Omit<Discussion, 'id' | 'authorName' | 'replies' | 'views'>): Promise<Discussion> {
    const id = randomUUID();
    const discussion: Discussion = {
      ...discussionData,
      id,
      authorName: 'Anonymous User', // In real app, get from user data
      replies: 0,
      views: 0
    };
    this.discussions.set(id, discussion);
    return discussion;
  }

  private initializeSampleData() {
    // Sample courses
    const sampleCourses: Course[] = [
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        category: 'Programming',
        difficulty: 'beginner',
        duration: '4 weeks',
        lessons: 20,
        image: '/api/placeholder/300/200',
        instructor: 'John Doe',
        rating: 4.8,
        enrolledCount: 1250,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'React Development',
        description: 'Build modern web applications with React',
        category: 'Web Development',
        difficulty: 'intermediate',
        duration: '6 weeks',
        lessons: 30,
        image: '/api/placeholder/300/200',
        instructor: 'Jane Smith',
        rating: 4.9,
        enrolledCount: 980,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Python for Data Science',
        description: 'Master Python for data analysis and machine learning',
        category: 'Data Science',
        difficulty: 'intermediate',
        duration: '8 weeks',
        lessons: 40,
        image: '/api/placeholder/300/200',
        instructor: 'Dr. Alex Johnson',
        rating: 4.7,
        enrolledCount: 756,
        createdAt: new Date().toISOString()
      }
    ];

    sampleCourses.forEach(course => this.courses.set(course.id, course));

    // Sample discussions
    const sampleDiscussions: Discussion[] = [
      {
        id: '1',
        title: 'Best practices for React hooks?',
        content: 'What are some best practices when using React hooks in large applications?',
        category: 'React',
        authorId: 'user1',
        authorName: 'CodeMaster',
        replies: 12,
        views: 156,
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        title: 'JavaScript async/await vs Promises',
        content: 'When should I use async/await over traditional promises?',
        category: 'JavaScript',
        authorId: 'user2',
        authorName: 'DevLearner',
        replies: 8,
        views: 89,
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ];

    sampleDiscussions.forEach(discussion => this.discussions.set(discussion.id, discussion));
  }
}

export const storage = new MemStorage();
