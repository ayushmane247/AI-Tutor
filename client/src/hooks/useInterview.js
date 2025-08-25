import { useState, useCallback } from 'react';

const API_BASE = '/api/interview';

export const useInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuestions = useCallback(async (interviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`
        },
        body: JSON.stringify(interviewData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveResponse = useCallback(async (responseData) => {
    try {
      const response = await fetch(`${API_BASE}/save-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`
        },
        body: JSON.stringify(responseData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save response');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error saving response:', err);
      throw err;
    }
  }, []);

  const generateFeedback = useCallback(async (feedbackData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/generate-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`
        },
        body: JSON.stringify(feedbackData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSession = useCallback(async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE}/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get session');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getHistory = useCallback(async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get history');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const analyzeSpeech = useCallback(async (speechData) => {
    try {
      const response = await fetch(`${API_BASE}/analyze-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'demo-token'}`
        },
        body: JSON.stringify(speechData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze speech');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error analyzing speech:', err);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    generateQuestions,
    saveResponse,
    generateFeedback,
    getSession,
    getHistory,
    analyzeSpeech
  };
};
