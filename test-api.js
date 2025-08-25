const fetch = require('node-fetch');

async function testChatAPI() {
  try {
    console.log('Testing chat API...');
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, can you explain JavaScript variables?'
      })
    });

    const data = await response.json();
    console.log('Response:', data);
    
    if (data.response && data.response.length > 0) {
      console.log('✅ API is working correctly');
    } else {
      console.log('❌ API returned empty response');
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testChatAPI();
