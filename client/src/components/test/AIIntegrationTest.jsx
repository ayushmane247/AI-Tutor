import React, { useState } from 'react';
import enhancedAI from '@/services/enhancedAI';

export default function AIIntegrationTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [providerStatus, setProviderStatus] = useState(null);

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
    }
    setLoading(prev => ({ ...prev, [testName]: false }));
  };

  const testEvaluateAnswer = () => runTest('evaluateAnswer', async () => {
    return await enhancedAI.evaluateAnswer(
      "What is 2 + 2?",
      "4",
      "multiple-choice",
      { options: ["3", "4", "5", "6"], correct_answer: 1 }
    );
  });

  const testGenerateQuestion = () => runTest('generateQuestion', async () => {
    return await enhancedAI.generateAdaptiveQuestion(
      "Mathematics",
      "beginner",
      "Basic Arithmetic"
    );
  });

  const testTutoringExplanation = () => runTest('tutoringExplanation', async () => {
    return await enhancedAI.getTutoringExplanation(
      "What is the derivative of x²?",
      "x",
      "2x"
    );
  });

  const testConversationalTutoring = () => runTest('conversationalTutoring', async () => {
    return await enhancedAI.conversationalTutoring(
      "I don't understand calculus derivatives"
    );
  });

  const testLearningPath = () => runTest('learningPath', async () => {
    return await enhancedAI.analyzeLearningPath(
      { totalQuestions: 20, correctAnswers: 15, averageScore: 75 },
      ["Mathematics", "Physics", "Chemistry"]
    );
  });

  const testErrorAnalysis = () => runTest('errorAnalysis', async () => {
    return await enhancedAI.analyzeErrors(
      ["Forgot to apply chain rule", "Made sign error in calculation"],
      "Calculus"
    );
  });

  const checkProviderStatus = async () => {
    setLoading(prev => ({ ...prev, providerStatus: true }));
    try {
      const status = await enhancedAI.getProviderStatus();
      setProviderStatus(status);
    } catch (error) {
      setProviderStatus({ error: error.message });
    }
    setLoading(prev => ({ ...prev, providerStatus: false }));
  };

  const TestButton = ({ testName, onTest, label }) => (
    <button
      onClick={onTest}
      disabled={loading[testName]}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        loading[testName]
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {loading[testName] ? 'Testing...' : label}
    </button>
  );

  const TestResult = ({ testName }) => {
    const result = testResults[testName];
    if (!result) return null;

    return (
      <div className={`mt-2 p-3 rounded-lg text-sm ${
        result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        {result.success ? (
          <div>
            <div className="text-green-800 font-medium mb-2">✅ Success</div>
            <pre className="text-green-700 overflow-auto max-h-40">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-red-800">
            <div className="font-medium mb-1">❌ Error</div>
            <div>{result.error}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Enhanced AI Integration Test</h1>
        
        {/* Provider Status */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-700">AI Provider Status</h2>
            <button
              onClick={checkProviderStatus}
              disabled={loading.providerStatus}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:bg-gray-300"
            >
              {loading.providerStatus ? 'Checking...' : 'Check Status'}
            </button>
          </div>
          
          {providerStatus && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(providerStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Cases */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">AI Feature Tests</h2>
            <div className="grid gap-4">
              
              {/* Answer Evaluation Test */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">Answer Evaluation</h3>
                  <TestButton 
                    testName="evaluateAnswer" 
                    onTest={testEvaluateAnswer} 
                    label="Test Evaluation" 
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Tests AI evaluation of student answers</p>
                <TestResult testName="evaluateAnswer" />
              </div>

              {/* Question Generation Test */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">Adaptive Question Generation</h3>
                  <TestButton 
                    testName="generateQuestion" 
                    onTest={testGenerateQuestion} 
                    label="Generate Question" 
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Tests AI-powered question generation</p>
                <TestResult testName="generateQuestion" />
              </div>

              {/* Tutoring Explanation Test */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">Tutoring Explanation</h3>
                  <TestButton 
                    testName="tutoringExplanation" 
                    onTest={testTutoringExplanation} 
                    label="Get Explanation" 
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Tests detailed tutoring explanations</p>
                <TestResult testName="tutoringExplanation" />
              </div>

              {/* Conversational Tutoring Test */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">Conversational Tutoring</h3>
                  <TestButton 
                    testName="conversationalTutoring" 
                    onTest={testConversationalTutoring} 
                    label="Start Conversation" 
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Tests interactive tutoring conversations</p>
                <TestResult testName="conversationalTutoring" />
              </div>

              {/* Learning Path Test */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">Learning Path Analysis</h3>
                  <TestButton 
                    testName="learningPath" 
                    onTest={testLearningPath} 
                    label="Analyze Path" 
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Tests personalized learning recommendations</p>
                <TestResult testName="learningPath" />
              </div>

              {/* Error Analysis Test */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">Error Analysis</h3>
                  <TestButton 
                    testName="errorAnalysis" 
                    onTest={testErrorAnalysis} 
                    label="Analyze Errors" 
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Tests targeted error analysis and remediation</p>
                <TestResult testName="errorAnalysis" />
              </div>

            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Testing Instructions</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• First check the AI provider status to see which providers are available</li>
            <li>• Test each feature individually to verify the integration is working</li>
            <li>• Green results indicate successful AI responses</li>
            <li>• Red results show fallback responses when AI is unavailable</li>
            <li>• All features should work even if Python dependencies aren't installed (fallback mode)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
