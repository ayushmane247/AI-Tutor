import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import ProfileHeader from '@/components/dashboard/ProfileHeader';
import StreakTracker from '@/components/dashboard/StreakTracker';
import TimeSpentAnalytics from '@/components/dashboard/TimeSpentAnalytics';
import PerformanceOverview from '@/components/dashboard/PerformanceOverview';
import SubjectProgress from '@/components/dashboard/SubjectProgress';
import RealTimeAnalysis from '@/components/dashboard/RealTimeAnalysis';
import MyLearning from '@/components/dashboard/my-learning';
import Achievements from '@/components/dashboard/achievements';
import Community from '@/components/dashboard/community';
import TestSection from '@/components/dashboard/TestSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// API functions
const fetchCourses = async () => {
  const response = await fetch('/api/courses');
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

const fetchUserProgress = async () => {
  const response = await fetch('/api/user/progress', {
    headers: {
      'Authorization': `Bearer demo-token` // In real app, use actual Firebase token
    }
  });
  if (!response.ok) throw new Error('Failed to fetch progress');
  return response.json();
};

const enrollInCourse = async (courseId) => {
  const response = await fetch('/api/user/enroll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer demo-token`
    },
    body: JSON.stringify({ courseId })
  });
  if (!response.ok) throw new Error('Failed to enroll');
  return response.json();
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch courses and user progress
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });
  
  const { data: userProgress = { enrolledCourses: [], totalPoints: 0, achievements: [] }, isLoading: progressLoading } = useQuery({
    queryKey: ['userProgress'],
    queryFn: fetchUserProgress,
    enabled: !!currentUser
  });
  
  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: enrollInCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      queryClient.invalidateQueries(['courses']);
    }
  });
  
  const handleEnroll = (courseId) => {
    enrollMutation.mutate(courseId);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background" data-testid="dashboard-container">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <Header />
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Profile Header with Dark Mode & Logout */}
          <ProfileHeader 
            userName={currentUser?.displayName}
            userEmail={currentUser?.email}
            userAvatar={currentUser?.photoURL}
            userLevel="Advanced Learner"
            userPoints={userProgress.totalPoints || 2450}
            notifications={3}
          />
          
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Analytics */}
            <div className="lg:col-span-1 xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Real-Time Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RealTimeAnalysis isLive={true} />
              </motion.div>
              
              {/* Performance Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <PerformanceOverview />
              </motion.div>
              
              {/* Time Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TimeSpentAnalytics />
              </motion.div>
            </div>
            
            {/* Right Column - Progress & Streak */}
            <div className="lg:col-span-1 xl:col-span-1 space-y-4 sm:space-y-6">
              {/* Streak Tracker */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StreakTracker />
              </motion.div>
              
              {/* Subject Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <SubjectProgress />
              </motion.div>
            </div>
          </div>
          
          {/* Additional Content Tabs */}
          <Tabs defaultValue="learning" className="space-y-6">
            <TabsList className="bg-transparent p-0 border-b border-border w-full justify-start rounded-none">
              <TabsTrigger 
                value="learning" 
                className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                My Learning
              </TabsTrigger>
              <TabsTrigger 
                value="tests" 
                className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                AI Tests
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger 
                value="community" 
                className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                Community
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="learning" className="space-y-6">
              <MyLearning 
                enrolledCourses={userProgress.enrolledCourses} 
                allCourses={courses}
                onEnroll={handleEnroll}
                isLoading={coursesLoading || progressLoading}
              />
            </TabsContent>
            
            <TabsContent value="tests">
              <TestSection />
            </TabsContent>
            
            <TabsContent value="achievements">
              <Achievements />
            </TabsContent>
            
            <TabsContent value="community">
              <Community />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
