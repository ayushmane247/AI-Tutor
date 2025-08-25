import { Home, BookOpen, FileText, Users, Award, BarChart3, Settings, Bot, MessageCircle, GraduationCap, Rocket, Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: FileText, label: 'Tests', path: '/tests' },
  { icon: GraduationCap, label: 'My Learning', path: '/learning-path' },
  { icon: BarChart3, label: 'Progress', path: '/progress' },
  { icon: Award, label: 'Community', path: '/community' },
  { icon: Bot, label: 'AI Tutor', path: '/ai-tutor' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const getEnrolledCoursesCount = () => {
  const learningPath = JSON.parse(localStorage.getItem('learningPathData') || '[]');
  return learningPath.length;
};

const getTestReportsCount = () => {
  const reports = JSON.parse(localStorage.getItem('testReports') || '[]');
  return reports.length;
};

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-background border border-border"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        data-testid="mobile-menu-toggle"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 min-h-screen flex flex-col bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} 
        data-testid="sidebar"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="bg-sidebar-primary p-2 rounded-lg">
              <GraduationCap className="text-sidebar-primary-foreground w-6 h-6" data-testid="logo-icon" />
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-bold text-lg" data-testid="logo-title">Smart AI</h1>
              <p className="text-sidebar-foreground/70 text-sm" data-testid="logo-subtitle">Tutor</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              return (
                <li key={item.path}>
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.path === '/learning-path' && getEnrolledCoursesCount() > 0 && (
                      <Badge variant="secondary" className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                        {getEnrolledCoursesCount()}
                      </Badge>
                    )}
                    {item.path === '/progress' && getTestReportsCount() > 0 && (
                      <Badge variant="secondary" className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                        {getTestReportsCount()}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
