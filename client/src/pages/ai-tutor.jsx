import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI tutor. I'm here to help you with programming questions, coding concepts, and any technology-related topics. What would you like to learn about today?",
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
    onSuccess: (data, userMessage) => {
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
    onError: (error) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
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

    // Add user message to chat
    const newUserMessage = {
      id: Date.now() - 1,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Send to AI
    chatMutation.mutate(userMessage);
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const suggestedQuestions = [
    "Explain the difference between var, let, and const in JavaScript",
    "How do I create a REST API with Node.js?",
    "What are React hooks and when should I use them?",
    "How does Python list comprehension work?",
    "Explain object-oriented programming concepts"
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" data-testid="ai-tutor-container">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 p-8 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-8 mb-6 relative overflow-hidden" data-testid="ai-tutor-header">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-ai-tutor-title">
                  AI Tutor
                </h1>
                <p className="text-gray-600" data-testid="text-ai-tutor-description">
                  Ask questions and get instant help with programming and technology topics
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white p-4 rounded-full">
                  <Bot className="w-12 h-12 text-purple-primary" data-testid="ai-tutor-icon" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-full flex flex-col" data-testid="chat-container">
                <CardContent className="flex-1 p-0 flex flex-col">
                  {/* Messages */}
                  <ScrollArea ref={scrollAreaRef} className="flex-1 p-6" data-testid="messages-area">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                          data-testid={`message-${message.id}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="bg-purple-primary p-2 rounded-full">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div 
                            className={`max-w-[80%] p-4 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-purple-primary text-white ml-auto'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm leading-relaxed" data-testid={`text-message-content-${message.id}`}>
                              {message.content}
                            </p>
                            <p className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {message.role === 'user' && (
                            <div className="bg-gray-600 p-2 rounded-full">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      {chatMutation.isPending && (
                        <div className="flex items-start space-x-3 justify-start" data-testid="typing-indicator">
                          <div className="bg-purple-primary p-2 rounded-full">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t border-gray-200 p-6">
                    <form onSubmit={handleSendMessage} className="flex space-x-3" data-testid="message-form">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me anything about programming..."
                        className="flex-1 border-gray-300 focus:ring-purple-primary focus:border-purple-primary"
                        disabled={chatMutation.isPending}
                        data-testid="input-message"
                      />
                      <Button 
                        type="submit" 
                        disabled={!inputMessage.trim() || chatMutation.isPending}
                        className="bg-purple-primary hover:bg-purple-dark text-white px-6"
                        data-testid="button-send"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggested Questions Sidebar */}
            <div className="space-y-6">
              <Card data-testid="suggested-questions-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4" data-testid="text-suggested-questions-title">
                    Suggested Questions
                  </h3>
                  <div className="space-y-3">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(question)}
                        className="w-full text-left p-3 text-sm text-gray-600 bg-gray-50 hover:bg-purple-50 hover:text-purple-primary rounded-lg transition-colors duration-200"
                        data-testid={`button-suggested-question-${index}`}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="tips-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4" data-testid="text-tips-title">
                    Tips for Better Learning
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-primary">•</span>
                      <span>Be specific in your questions</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-primary">•</span>
                      <span>Ask for code examples</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-primary">•</span>
                      <span>Request step-by-step explanations</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-primary">•</span>
                      <span>Ask follow-up questions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}