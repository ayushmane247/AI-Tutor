
# EduPlatform - Modern Education Platform

A full-stack education platform built with React, Express.js, Firebase, and OpenRouter AI integration. Features include course management, AI tutoring, community discussions, and progress tracking.

## 🚀 Features

- **🔐 Authentication**: Firebase Auth with Google Sign-in
- **🤖 AI Tutor**: OpenRouter API integration for intelligent tutoring
- **📚 Course Management**: Browse, enroll, and track progress
- **👥 Community**: Discussion forums and study groups
- **📊 Analytics**: Progress tracking and achievements
- **📱 Responsive**: Modern, mobile-first design
- **⚡ Real-time**: Live updates and notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for state management
- **React Router** for navigation
- **Framer Motion** for animations

### Backend
- **Express.js** with TypeScript
- **Firebase** for authentication and database
- **OpenRouter API** for AI features
- **Drizzle ORM** for database operations
- **Zod** for validation

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project
- OpenRouter API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd Education
npm install
```

### 2. Environment Setup

Create `.env` file in the root directory:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Enable Firestore Database
4. Copy your config from Project Settings > General > Your apps

### 4. OpenRouter Setup

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key from the dashboard
3. Add it to your `.env` file

### 5. Run the Application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
# Backend only
npm run dev:server

# Frontend only  
npm run dev:client
```

Visit `http://localhost:3001` to see your application!

## 📁 Project Structure

```
Education/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── openai.ts         # OpenRouter integration
│   └── storage.ts        # Data layer
├── shared/               # Shared types and schemas
└── package.json         # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
npm install-deps     # Install dependencies
```

## 🎯 Key Features Explained

### Authentication Flow
- Firebase Authentication with email/password and Google OAuth
- Protected routes with automatic redirects
- User session management
- Profile management

### AI Tutor Integration
- OpenRouter API for multiple AI models
- Context-aware programming assistance
- Fallback to local knowledge base
- Real-time chat interface

### Course Management
- Browse available courses
- Enroll in courses with progress tracking
- Achievement system with points
- Personalized learning paths

### Community Features
- Discussion forums by category
- User-generated content
- Real-time updates
- Study group formation

## 🔒 Security Features

- Firebase Authentication tokens
- API route protection
- Input validation with Zod
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- Modern component library
- Accessible UI components
- Dark/light theme support

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Updates

This platform is actively maintained with regular updates for:
- Security patches
- New features
- Performance improvements
- Bug fixes

---

**Happy Learning! 🎓**
=======
# AI-Tutor
Build an Adaptive Tutor that dynamically adjusts problem difficulty based on real-time student performance and provides instant, detailed feedback including hints and explanations. Use an open-source adaptive tutoring system base (like OATutor) enhanced with LLM-powered natural language feedback generation
>>>>>>> 2fff563f946127cdc768540921eb95b472c97af6
