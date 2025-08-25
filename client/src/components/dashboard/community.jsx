import { MessageCircle, Users, TrendingUp, Clock, MessageSquare, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function Community() {
  const discussions = [
    {
      id: 1,
      title: 'Best practices for learning Java',
      author: 'Alex Johnson',
      avatar: 'AJ',
      time: '2h ago',
      replies: 12,
      likes: 45,
      isLiked: false,
      isFollowing: true
    },
    {
      id: 2,
      title: 'Understanding React Hooks - Need help!',
      author: 'Sam Wilson',
      avatar: 'SW',
      time: '5h ago',
      replies: 8,
      likes: 23,
      isLiked: true,
      isFollowing: false
    },
    {
      id: 3,
      title: 'Project collaboration: Building an Edu App',
      author: 'Taylor Swift',
      avatar: 'TS',
      time: '1d ago',
      replies: 5,
      likes: 18,
      isLiked: false,
      isFollowing: true
    }
  ];

  const studyGroups = [
    {
      id: 1,
      name: 'JavaScript Masters',
      members: 1245,
      active: true
    },
    {
      id: 2,
      name: 'Python for Beginners',
      members: 876,
      active: true
    },
    {
      id: 3,
      name: 'Data Science Community',
      members: 2341,
      active: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Community</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
              Recent Discussions
            </h3>
            <button className="text-sm text-purple-600 hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{discussion.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium hover:text-purple-600 cursor-pointer">
                          {discussion.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          by {discussion.author} • {discussion.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  {discussion.isFollowing && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Following
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-purple-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>{discussion.replies} replies</span>
                  </button>
                  <button 
                    className={`flex items-center space-x-1 ${discussion.isLiked ? 'text-purple-600' : 'hover:text-gray-700'}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${discussion.isLiked ? 'fill-current' : ''}`} />
                    <span>{discussion.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Groups */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Study Groups
            </h3>
            <button className="text-sm text-purple-600 hover:underline">Browse All</button>
          </div>

          <div className="space-y-4">
            {studyGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{group.name}</h4>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{group.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  <Button size="sm" variant={group.active ? 'default' : 'outline'}>
                    {group.active ? 'Joined' : 'Join Group'}
                  </Button>
                </div>
                {group.active && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Next study session: Tomorrow, 6 PM</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Trending Topics */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Trending Topics
            </h3>
            <div className="space-y-2">
              {['#javascript', '#reactjs', '#python', '#webdev', '#beginners'].map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${tag.substring(1)}`}
                  className="inline-block px-3 py-1 mr-2 mb-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 hover:text-gray-900"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
