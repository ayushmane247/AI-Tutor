import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, X, Minimize2, Bot, User, Loader2, BookOpen, Code, HelpCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi there! 👋 I'm your AI learning assistant. I can help you with programming questions, explain course concepts, and provide coding examples. What would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  const chatMutation = useMutation({
    mutationFn: async (message) => {
      return apiRequest('/api/chat', {
        method: 'POST',
        body: { message }
      });
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
      ]);
    },
    onError: () => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
          timestamp: new Date()
        }
      ]);
    }
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    const newUserMessage = {
      id: Date.now() - 1,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    chatMutation.mutate(userMessage);
  };

  const quickQuestions = [
    { icon: Code, text: "Explain JavaScript basics", question: "Can you explain JavaScript fundamentals with examples?" },
    { icon: BookOpen, text: "Help with Python", question: "I need help understanding Python concepts" },
    { icon: HelpCircle, text: "React components", question: "How do React components work?" }
  ];

  useEffect(() => {
    if (scrollAreaRef.current && isOpen && !isMinimized) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (inputRef.current && isOpen && !isMinimized) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  return (
    <div>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <MessageCircle className="w-6 h-6" />
            </div>
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-96 shadow-2xl transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[400px] sm:h-[500px]'
        }`}>
          {/* Header */}
          <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">AI Learning Assistant</span>
                <span className="xs:hidden">AI Assistant</span>
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[436px]">
              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex items-start space-x-2 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                      )}
                      <div 
                        className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex items-start space-x-2 justify-start">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="p-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">Quick questions:</p>
                  <div className="space-y-2">
                    {quickQuestions.map((q, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(q.question)}
                        className="w-full text-left p-2 text-xs text-gray-600 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <q.icon className="w-3 h-3" />
                        <span>{q.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    disabled={chatMutation.isPending}
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputMessage.trim() || chatMutation.isPending}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
