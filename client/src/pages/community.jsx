import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Users, MessageCircle, Heart, Share2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const discussions = [
  {
    id: 1,
    title: "Best practices for React hooks?",
    author: "Sarah Chen",
    avatar: "/api/placeholder/32/32",
    category: "React",
    replies: 12,
    likes: 24,
    timeAgo: "2 hours ago",
    isAnswered: true
  },
  {
    id: 2,
    title: "How to optimize database queries in Node.js?",
    author: "Mike Johnson",
    avatar: "/api/placeholder/32/32",
    category: "Backend",
    replies: 8,
    likes: 15,
    timeAgo: "4 hours ago",
    isAnswered: false
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox - When to use what?",
    author: "Emma Wilson",
    avatar: "/api/placeholder/32/32",
    category: "CSS",
    replies: 18,
    likes: 32,
    timeAgo: "6 hours ago",
    isAnswered: true
  },
  {
    id: 4,
    title: "JavaScript async/await best practices",
    author: "David Kim",
    avatar: "/api/placeholder/32/32",
    category: "JavaScript",
    replies: 6,
    likes: 19,
    timeAgo: "1 day ago",
    isAnswered: false
  }
];

const studyGroups = [
  {
    id: 1,
    name: "React Study Group",
    members: 24,
    description: "Weekly discussions on React concepts and projects",
    nextMeeting: "Tomorrow 7:00 PM",
    category: "Frontend"
  },
  {
    id: 2,
    name: "Full Stack Developers",
    members: 18,
    description: "End-to-end development discussions and code reviews",
    nextMeeting: "Friday 6:00 PM",
    category: "Full Stack"
  },
  {
    id: 3,
    name: "Algorithm Practice",
    members: 31,
    description: "Daily coding challenges and algorithm discussions",
    nextMeeting: "Daily 9:00 AM",
    category: "Algorithms"
  }
];

const categories = ["All", "React", "JavaScript", "CSS", "Backend", "Full Stack", "Algorithms"];

export default function Community() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Header />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Connect with fellow learners, ask questions, and share knowledge</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-purple-600">1,247</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Discussions</p>
                  <p className="text-2xl font-bold text-blue-600">3,456</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Groups</p>
                  <p className="text-2xl font-bold text-green-600">42</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search discussions..." className="pl-10" />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {categories.map((category) => (
                    <Badge 
                      key={category} 
                      variant={category === "All" ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-purple-100"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discussions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Recent Discussions</span>
                  </span>
                  <Button>Start Discussion</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.avatar} />
                        <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 hover:text-purple-600 cursor-pointer">
                            {discussion.title}
                          </h4>
                          {discussion.isAnswered && (
                            <Badge variant="default" className="text-xs">Answered</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>by {discussion.author}</span>
                          <Badge variant="outline">{discussion.category}</Badge>
                          <span>{discussion.timeAgo}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600">
                            <MessageCircle className="h-4 w-4" />
                            <span>{discussion.replies}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                            <Heart className="h-4 w-4" />
                            <span>{discussion.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Study Groups</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studyGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{group.name}</h4>
                      <Badge variant="outline">{group.members} members</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Next: {group.nextMeeting}</span>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  View All Groups
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Create Study Group
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Resource
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        </div>
      </main>
    </div>
  );
}
