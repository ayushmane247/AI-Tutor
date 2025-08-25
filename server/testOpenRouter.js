const { chatWithAI } = require('./openai.ts');

async function testOpenRouterConnection() {
  console.log('Testing OpenRouter API connection...');
  
  try {
    const response = await chatWithAI('Hello, can you explain what JavaScript is?');
    console.log('✅ OpenRouter API test successful!');
    console.log('Response:', response.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ OpenRouter API test failed:', error.message);
    console.log('Will use fallback knowledge base instead.');
  }
}

testOpenRouterConnection();
