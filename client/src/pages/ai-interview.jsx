import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Brain,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Share2,
  X
} from 'lucide-react';
import Webcam from 'react-webcam';
import jsPDF from 'jspdf';

const AIInterview = () => {
  // State management
  const [interviewState, setInterviewState] = useState('setup'); // setup, active, paused, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responses, setResponses] = useState([]);
  const [emotionData, setEmotionData] = useState({});
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [eyeContact, setEyeContact] = useState(0);
  const [speechClarity, setSpeechClarity] = useState(0);
  const [interviewType, setInterviewType] = useState('technical');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Refs
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Sample interview questions by type
  const interviewQuestions = {
    technical: [
      "Tell me about yourself and your technical background.",
      "Explain the difference between var, let, and const in JavaScript.",
      "How would you optimize a slow-performing web application?",
      "Describe your experience with version control systems like Git.",
      "Walk me through how you would debug a production issue."
    ],
    behavioral: [
      "Tell me about yourself and your professional journey.",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "How do you handle working under pressure and tight deadlines?",
      "Give me an example of when you had to work with a difficult team member.",
      "Where do you see yourself in the next 5 years?"
    ],
    hr: [
      "Tell me about yourself.",
      "Why are you interested in this position?",
      "What are your greatest strengths and weaknesses?",
      "Why are you leaving your current job?",
      "What salary expectations do you have?"
    ]
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            // Calculate speech clarity based on confidence
            const confidence = event.results[i][0].confidence || 0.8;
            setSpeechClarity(prev => Math.max(prev, confidence * 100));
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => (prev + ' ' + finalTranscript).trim());
        } else if (interimTranscript) {
          // Show interim results for better UX
          setTranscript(prev => prev + ' ' + interimTranscript);
        }
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Restart if still recording
        if (isMicOn && interviewState === 'active') {
          setTimeout(() => {
            if (recognitionRef.current && isMicOn) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Restart on error if still recording
        if (isMicOn && interviewState === 'active' && event.error !== 'aborted') {
          setTimeout(() => {
            if (recognitionRef.current && isMicOn) {
              recognitionRef.current.start();
            }
          }, 1000);
        }
      };
    }
  }, [isMicOn, interviewState]);

  // Timer for interview duration
  useEffect(() => {
    if (interviewState === 'active') {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [interviewState]);

  // Computer vision analysis (simplified)
  const analyzeFrame = useCallback(() => {
    if (webcamRef.current && canvasRef.current && isCameraOn) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (video && video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Simulate emotion and engagement analysis
        // In a real implementation, you would use TensorFlow.js or similar
        const mockAnalysis = {
          confidence: Math.random() * 100,
          eyeContact: Math.random() * 100,
          emotion: ['neutral', 'happy', 'focused', 'nervous'][Math.floor(Math.random() * 4)]
        };
        
        setConfidenceScore(mockAnalysis.confidence);
        setEyeContact(mockAnalysis.eyeContact);
        setEmotionData(prev => ({
          ...prev,
          [Date.now()]: mockAnalysis.emotion
        }));
      }
    }
  }, [isCameraOn]);

  // Analyze frames periodically during interview
  useEffect(() => {
    let frameInterval;
    if (interviewState === 'active' && isCameraOn) {
      frameInterval = setInterval(analyzeFrame, 2000);
    }
    return () => clearInterval(frameInterval);
  }, [interviewState, isCameraOn, analyzeFrame]);

  // Text-to-speech for questions
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Start microphone
  const startMicrophone = () => {
    if (recognitionRef.current) {
      setIsMicOn(true);
      setTranscript(''); // Clear previous transcript
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  // Stop microphone
  const stopMicrophone = () => {
    if (recognitionRef.current) {
      setIsMicOn(false);
      setIsListening(false);
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  // Start interview
  const startInterview = () => {
    setInterviewState('active');
    setCurrentQuestion(0);
    setTimeElapsed(0);
    startMicrophone();
    
    // Speak first question
    setTimeout(() => {
      speakQuestion(interviewQuestions[interviewType][0]);
    }, 1000);
  };

  // Next question
  const nextQuestion = () => {
    if (transcript.trim()) {
      setResponses(prev => [...prev, {
        question: interviewQuestions[interviewType][currentQuestion],
        answer: transcript.trim(),
        timestamp: Date.now(),
        confidence: confidenceScore,
        eyeContact: eyeContact
      }]);
      setTranscript('');
    }

    if (currentQuestion < interviewQuestions[interviewType].length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setTimeout(() => {
        speakQuestion(interviewQuestions[interviewType][nextQ]);
      }, 500);
    } else {
      completeInterview();
    }
  };

  // Complete interview
  const completeInterview = async () => {
    setInterviewState('completed');
    stopMicrophone();
    
    // Generate AI feedback
    const avgConfidence = responses.reduce((acc, r) => acc + r.confidence, 0) / responses.length;
    const avgEyeContact = responses.reduce((acc, r) => acc + r.eyeContact, 0) / responses.length;
    
    setFeedback({
      overallScore: Math.round((avgConfidence + avgEyeContact + speechClarity) / 3),
      confidence: Math.round(avgConfidence),
      eyeContact: Math.round(avgEyeContact),
      speechClarity: Math.round(speechClarity),
      recommendations: [
        avgConfidence < 60 ? "Work on building confidence through practice interviews" : "Great confidence level maintained throughout",
        avgEyeContact < 50 ? "Improve eye contact by looking directly at the camera" : "Excellent eye contact maintained",
        speechClarity < 70 ? "Speak more clearly and at a moderate pace" : "Clear and articulate speech",
        "Consider preparing specific examples for behavioral questions",
        "Practice technical explanations with simple analogies"
      ]
    });
  };

  // End interview and show results
  const endInterview = () => {
    // Save current response if exists
    if (transcript.trim()) {
      setResponses(prev => [...prev, {
        question: interviewQuestions[interviewType][currentQuestion],
        answer: transcript.trim(),
        timestamp: Date.now(),
        confidence: confidenceScore,
        eyeContact: eyeContact
      }]);
    }
    
    // Generate final feedback
    const avgConfidence = confidenceScore;
    const avgEyeContact = eyeContact;
    const avgSpeechClarity = speechClarity;
    
    setFeedback({
      overallScore: Math.round((avgConfidence + avgEyeContact + avgSpeechClarity) / 3),
      confidence: Math.round(avgConfidence),
      eyeContact: Math.round(avgEyeContact),
      speechClarity: Math.round(avgSpeechClarity),
      totalDuration: timeElapsed,
      questionsAnswered: responses.length + (transcript.trim() ? 1 : 0),
      totalQuestions: interviewQuestions[interviewType].length,
      recommendations: [
        avgConfidence < 60 ? "Work on building confidence through practice interviews" : "Great confidence level maintained throughout",
        avgEyeContact < 50 ? "Improve eye contact by looking directly at the camera" : "Excellent eye contact maintained",
        avgSpeechClarity < 70 ? "Speak more clearly and at a moderate pace" : "Clear and articulate speech",
        "Consider preparing specific examples for behavioral questions",
        "Practice technical explanations with simple analogies"
      ]
    });
    
    setInterviewState('completed');
    stopMicrophone();
    // Stop any ongoing speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  // Reset interview
  const resetInterview = () => {
    setInterviewState('setup');
    setCurrentQuestion(0);
    setResponses([]);
    setTranscript('');
    setTimeElapsed(0);
    setFeedback(null);
    setConfidenceScore(0);
    setEyeContact(0);
    setSpeechClarity(0);
    stopMicrophone();
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Download report functionality as PDF
  const downloadReport = () => {
    if (!feedback) return;
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;
    
    // Helper function to add text with word wrapping
    const addText = (text, fontSize = 12, isBold = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont(undefined, 'bold');
      } else {
        pdf.setFont(undefined, 'normal');
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 5;
      
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.getHeight() - 30) {
        pdf.addPage();
        yPosition = 30;
      }
    };

    // Title
    addText('AI INTERVIEW REPORT', 20, true);
    yPosition += 10;

    // Interview Details
    addText('Interview Details:', 16, true);
    addText(`Date: ${new Date().toLocaleDateString()}`);
    addText(`Time: ${new Date().toLocaleTimeString()}`);
    addText(`Interview Type: ${interviewType.charAt(0).toUpperCase() + interviewType.slice(1)}`);
    addText(`Duration: ${formatTime(feedback.totalDuration)}`);
    addText(`Questions Answered: ${feedback.questionsAnswered} of ${feedback.totalQuestions}`);
    addText(`Completion Rate: ${Math.round((feedback.questionsAnswered / feedback.totalQuestions) * 100)}%`);
    yPosition += 10;

    // Performance Scores
    addText('PERFORMANCE SCORES:', 16, true);
    addText(`Overall Score: ${feedback.overallScore}%`);
    addText(`Confidence Level: ${feedback.confidence}%`);
    addText(`Eye Contact: ${feedback.eyeContact}%`);
    addText(`Speech Clarity: ${feedback.speechClarity}%`);
    yPosition += 10;

    // AI Recommendations
    addText('AI RECOMMENDATIONS:', 16, true);
    feedback.recommendations.forEach((rec, index) => {
      addText(`${index + 1}. ${rec}`);
    });
    yPosition += 10;

    // Detailed Responses
    addText('DETAILED RESPONSES:', 16, true);
    responses.forEach((response, index) => {
      addText(`Question ${index + 1}: ${response.question}`, 12, true);
      addText(`Answer: ${response.answer}`);
      addText(`Confidence: ${Math.round(response.confidence)}%`);
      addText(`Eye Contact: ${Math.round(response.eyeContact)}%`);
      addText(`Timestamp: ${new Date(response.timestamp).toLocaleString()}`);
      yPosition += 5;
    });

    // Footer
    yPosition += 10;
    addText('Generated by AI Interview Assistant', 10);
    addText(`Report Date: ${new Date().toLocaleString()}`, 10);

    // Save the PDF
    pdf.save(`AI_Interview_Report_${interviewType}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Share functionality
  const shareResults = () => {
    setShowShareModal(true);
  };

  const shareToSocial = (platform) => {
    if (!feedback) return;
    
    const shareText = `🎯 Just completed an AI Interview! 
📊 Overall Score: ${feedback.overallScore}%
💪 Confidence: ${feedback.confidence}%
👁️ Eye Contact: ${feedback.eyeContact}%
🗣️ Speech Clarity: ${feedback.speechClarity}%
📝 Interview Type: ${interviewType.charAt(0).toUpperCase() + interviewType.slice(1)}
⏱️ Duration: ${formatTime(feedback.totalDuration)}

Practicing with AI Interview Assistant to improve my interview skills! 💼✨

#InterviewPrep #AIInterview #CareerDevelopment #JobSearch`;

    const encodedText = encodeURIComponent(shareText);
    const currentUrl = encodeURIComponent(window.location.origin);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}&summary=${encodedText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${currentUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
          alert('Interview results copied to clipboard! You can now paste it in your Instagram story or post.');
        });
        setShowShareModal(false);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Brain className="text-purple-600" />
            AI Interview Assistant
          </h1>
          <p className="text-gray-600">Practice interviews with AI-powered analysis and feedback</p>
        </div>

        {/* Setup Phase */}
        {interviewState === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Interview Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="text-purple-600" />
                  Interview Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Interview Type</label>
                  <select 
                    value={interviewType} 
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="technical">Technical Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="hr">HR Interview</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">System Check</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={startCamera}
                      variant={isCameraOn ? "default" : "outline"}
                      className="flex items-center gap-2"
                    >
                      {isCameraOn ? <Video /> : <VideoOff />}
                      {isCameraOn ? 'Camera On' : 'Enable Camera'}
                    </Button>
                    <Button
                      onClick={isMicOn ? stopMicrophone : startMicrophone}
                      variant={isMicOn ? "default" : "outline"}
                      className="flex items-center gap-2"
                    >
                      {isMicOn ? <Mic /> : <MicOff />}
                      {isMicOn ? 'Mic On' : 'Enable Microphone'}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={startInterview}
                  disabled={!isCameraOn || !isMicOn}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <Play className="mr-2" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>

            {/* Camera Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="text-purple-600" />
                  Camera Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {isCameraOn ? (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="w-full h-full object-cover"
                      mirrored={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <VideoOff className="mx-auto mb-2" size={48} />
                        <p>Camera not enabled</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Interview */}
        {(interviewState === 'active' || interviewState === 'paused') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Feed */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="text-purple-600" />
                      {interviewState === 'paused' ? 'Interview Paused' : 'Interview in Progress'}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(timeElapsed)}
                      </Badge>
                      <Badge variant="outline">
                        Question {currentQuestion + 1} of {interviewQuestions[interviewType].length}
                      </Badge>
                      {interviewState === 'paused' && (
                        <Badge variant="destructive" className="animate-pulse">
                          PAUSED
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="w-full h-full object-cover"
                      mirrored={true}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Recording indicator */}
                    {isListening && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Recording
                      </div>
                    )}
                  </div>

                  {/* Current Question */}
                  <Card className="mb-4">
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-2">Current Question:</h3>
                      <p className="text-lg">{interviewQuestions[interviewType][currentQuestion]}</p>
                    </CardContent>
                  </Card>

                  {/* Transcript */}
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <Mic className="text-purple-600" size={18} />
                          Your Response:
                        </h3>
                        {isListening && (
                          <div className="flex items-center gap-2 text-green-600">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                            <span className="text-sm">Listening...</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg min-h-[120px] border-2 border-dashed border-gray-200 relative">
                        {transcript ? (
                          <div className="text-gray-900 leading-relaxed">
                            {transcript}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic flex items-center justify-center h-full gap-3">
                            <Mic className="text-gray-400" size={24} />
                            <span>
                              {isMicOn ? (
                                isListening ? "Listening for your response..." : "Microphone ready - start speaking"
                              ) : (
                                "Enable microphone to start recording your response"
                              )}
                            </span>
                          </div>
                        )}
                        {/* Microphone status indicator in corner */}
                        <div className="absolute top-2 right-2">
                          {isMicOn ? (
                            isListening ? (
                              <Mic className="text-green-500 animate-pulse" size={16} />
                            ) : (
                              <Mic className="text-blue-500" size={16} />
                            )
                          ) : (
                            <MicOff className="text-gray-400" size={16} />
                          )}
                        </div>
                      </div>
                      {transcript && (
                        <div className="mt-2 text-sm text-gray-600">
                          Words: {transcript.split(' ').filter(word => word.length > 0).length}
                        </div>
                      )}
                    </CardContent>
                  </Card>


                  {/* Controls */}
                  <div className="flex gap-3 mt-4">
                    <Button 
                      onClick={nextQuestion} 
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={!transcript.trim()}
                    >
                      {currentQuestion < interviewQuestions[interviewType].length - 1 ? 'Next Question' : 'Finish Interview'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={isMicOn ? stopMicrophone : startMicrophone}
                      className={isMicOn ? "bg-red-50 border-red-200 text-red-700" : ""}
                    >
                      {isMicOn ? <MicOff className="mr-2" size={16} /> : <Mic className="mr-2" size={16} />}
                      {isMicOn ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    {interviewState === 'paused' ? (
                      <Button variant="outline" onClick={() => {
                        setInterviewState('active');
                        startMicrophone();
                      }} className="bg-green-50 border-green-200 text-green-700">
                        <Play className="mr-2" size={16} />
                        Resume
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => {
                        setInterviewState('paused');
                        stopMicrophone();
                        // Stop any ongoing speech synthesis
                        if ('speechSynthesis' in window) {
                          speechSynthesis.cancel();
                        }
                      }}>
                        <Pause className="mr-2" size={16} />
                        Pause
                      </Button>
                    )}
                    <Button variant="destructive" onClick={endInterview}>
                      <Square className="mr-2" size={16} />
                      End Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Analytics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-time Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Confidence</span>
                      <span className="text-sm">{Math.round(confidenceScore)}%</span>
                    </div>
                    <Progress value={confidenceScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Eye Contact</span>
                      <span className="text-sm">{Math.round(eyeContact)}%</span>
                    </div>
                    <Progress value={eyeContact} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Speech Clarity</span>
                      <span className="text-sm">{Math.round(speechClarity)}%</span>
                    </div>
                    <Progress value={speechClarity} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {interviewQuestions[interviewType].map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index < currentQuestion ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : index === currentQuestion ? (
                          <AlertCircle className="text-yellow-500" size={16} />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className={`text-sm ${index <= currentQuestion ? 'text-gray-900' : 'text-gray-400'}`}>
                          Question {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Completed Interview - Feedback */}
        {interviewState === 'completed' && feedback && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle className="text-green-500" />
                  Interview Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{feedback.overallScore}%</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{feedback.confidence}%</div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{feedback.eyeContact}%</div>
                    <div className="text-sm text-gray-600">Eye Contact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{feedback.speechClarity}%</div>
                    <div className="text-sm text-gray-600">Speech Clarity</div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                    <ul className="space-y-2">
                      {feedback.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Interview Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{formatTime(feedback.totalDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions Answered:</span>
                        <span>{feedback.questionsAnswered} of {feedback.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interview Type:</span>
                        <span className="capitalize">{interviewType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completion Rate:</span>
                        <span>{Math.round((feedback.questionsAnswered / feedback.totalQuestions) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button onClick={resetInterview} className="bg-purple-600 hover:bg-purple-700">
                    <RotateCcw className="mr-2" size={16} />
                    Start New Interview
                  </Button>
                  <Button variant="outline" onClick={downloadReport}>
                    Download Report
                  </Button>
                  <Button variant="outline" onClick={shareResults}>
                    <Share2 className="mr-2" size={16} />
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Share Your Results</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareModal(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">Share your interview performance on social media:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => shareToSocial('whatsapp')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  WhatsApp
                </Button>
                <Button
                  onClick={() => shareToSocial('linkedin')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  LinkedIn
                </Button>
                <Button
                  onClick={() => shareToSocial('facebook')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Facebook
                </Button>
                <Button
                  onClick={() => shareToSocial('twitter')}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => shareToSocial('instagram')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Instagram
                </Button>
                <Button
                  onClick={() => {
                    const shareText = `🎯 Just completed an AI Interview! 
📊 Overall Score: ${feedback.overallScore}%
💪 Confidence: ${feedback.confidence}%
👁️ Eye Contact: ${feedback.eyeContact}%
🗣️ Speech Clarity: ${feedback.speechClarity}%`;
                    navigator.clipboard.writeText(shareText);
                    alert('Results copied to clipboard!');
                    setShowShareModal(false);
                  }}
                  variant="outline"
                >
                  Copy Text
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInterview;
