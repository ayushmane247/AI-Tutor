import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, LogOut, Settings, User, Bell, Shield, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userLevel?: string;
  userPoints?: number;
  notifications?: number;
}

export default function ProfileHeader({
  userName = "Student",
  userEmail = "student@smartaitutor.com",
  userAvatar,
  userLevel = "Advanced Learner",
  userPoints = 2450,
  notifications = 3
}: ProfileHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'advanced learner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'expert': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-primary/20 flex-shrink-0">
                <AvatarImage src={userAvatar || currentUser?.photoURL || ''} alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-lg">
                  {getInitials(currentUser?.displayName || userName)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-2xl font-bold truncate">
                  Welcome back, {currentUser?.displayName || userName}!
                </h1>
                <Badge className={`${getLevelColor(userLevel)} flex-shrink-0`}>
                  {userLevel}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm truncate">
                {currentUser?.email || userEmail}
              </p>
              <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-medium">Points:</span>
                  <span className="text-xs sm:text-sm font-bold text-primary">{userPoints.toLocaleString()}</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:block" />
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-medium">Level:</span>
                  <span className="text-xs sm:text-sm font-bold text-secondary-foreground">
                    {Math.floor(userPoints / 500) + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Dark Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 border rounded-lg">
              <Sun className="w-4 h-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="w-4 h-4" />
            </div>

            {/* Notifications */}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
                >
                  {notifications}
                </motion.span>
              )}
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 px-2 sm:px-4">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Profile</span>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser?.displayName || userName}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email || userEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Bar for Next Level */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress to Level {Math.floor(userPoints / 500) + 2}</span>
            <span className="text-sm text-muted-foreground">
              {userPoints % 500}/500 XP
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((userPoints % 500) / 500) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
