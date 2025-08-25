import { Routes, Route } from 'react-router-dom';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/responsive.css";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatbot from "./components/FloatingChatbot";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LearningPath from "@/pages/learning-path";
import AITutor from "@/pages/ai-tutor";
import AIInterview from "@/pages/ai-interview";
import Courses from "@/pages/courses";
import Assignments from "@/pages/assignments";
import Tests from "@/pages/tests";
import ResumeAnalyzer from "@/pages/resume-analyzer";
import Achievements from "@/pages/achievements";
import Progress from "@/pages/progress";
import Community from "@/pages/community";
import Settings from "@/pages/settings";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
      <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
      <Route path="/ai-interview" element={<ProtectedRoute><AIInterview /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
      <Route path="/assignments/:courseId" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
      <Route path="/tests" element={<ProtectedRoute><Tests /></ProtectedRoute>} />
      <Route path="/tests/:courseId" element={<ProtectedRoute><Tests /></ProtectedRoute>} />
      <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/community" element={<Community />} /> {/* Community can be public */}
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ai-tutor-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
            <FloatingChatbot />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;