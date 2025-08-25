# Enhanced AI Integration for AI-TUTOR

This directory contains the enhanced AI integration system that supports multiple LLM providers for intelligent tutoring.

## 🚀 Features

### Multi-Provider LLM Support
- **OpenAI GPT-4**: Advanced reasoning and tutoring
- **Anthropic Claude**: Excellent for essay evaluation and writing
- **Ollama**: Local models for privacy-sensitive applications
- **Hugging Face**: Open-source models and custom deployments
- **Mock Provider**: Fallback for testing and development

### Advanced Educational Features
- **Adaptive Question Generation**: AI-powered question creation
- **Intelligent Essay Evaluation**: Comprehensive writing analysis
- **Conversational Tutoring**: Natural language tutoring sessions
- **Learning Path Analysis**: Personalized learning recommendations
- **Error Pattern Analysis**: Targeted remediation strategies
- **Batch Processing**: Efficient evaluation of multiple responses

## 📁 File Structure

```
ai/
├── enhanced_ai_agent.py      # Main enhanced AI agent
├── llm_config.py            # LLM provider configuration
├── llm_providers.py         # Provider implementations
├── prompt_templates.py      # Educational prompt templates
├── ai_agent.py             # Original AI agent (legacy)
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🛠 Installation

### 1. Install Python Dependencies

```bash
cd backend/ai
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy the example configuration and set up your API keys:

```bash
cp ../config/llm.env.example ../.env
```

Edit the `.env` file with your API keys:

```env
# OpenAI (Recommended for tutoring)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4

# Anthropic (Excellent for essay evaluation)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Ollama (Local models - privacy-focused)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Hugging Face (Open-source models)
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf

# Default provider
DEFAULT_LLM_PROVIDER=openai
```

### 3. Test the Integration

```bash
# Test with a simple evaluation
python3 enhanced_ai_agent.py '{"action": "evaluate_answer", "question": "What is 2+2?", "answer": "4", "type": "multiple-choice"}'

# Test provider status
python3 enhanced_ai_agent.py '{"action": "get_provider_status"}'
```

## 🔧 Usage

### Basic Answer Evaluation

```python
from enhanced_ai_agent import EnhancedAITutor

tutor = EnhancedAITutor()

# Evaluate multiple choice answer
result = tutor.evaluate_answer(
    question="What is the derivative of x²?",
    answer="2x",
    question_type="multiple-choice",
    context={
        "options": ["x", "2x", "x²", "2x²"],
        "correct_answer": 1
    }
)
```

### Essay Evaluation

```python
# Evaluate essay
result = tutor.evaluate_essay(
    content="Your essay content here...",
    context={"topic": "Climate Change"}
)
```

### Generate Adaptive Questions

```python
# Generate new question
question = tutor.generate_adaptive_question(
    subject="Mathematics",
    difficulty="intermediate",
    topic="Calculus",
    previous_questions=["What is the derivative of x²?"]
)
```

### Conversational Tutoring

```python
# Get tutoring response
response = tutor.conversational_tutoring(
    student_message="I don't understand derivatives",
    conversation_history=[
        {"student": "What is calculus?", "tutor": "Calculus is..."}
    ]
)
```

## 🌐 API Endpoints

The enhanced AI system is exposed through REST API endpoints:

### Answer Evaluation
```http
POST /api/enhanced-ai/evaluate
{
  "question": "What is 2+2?",
  "answer": "4",
  "type": "multiple-choice",
  "context": {
    "options": ["3", "4", "5", "6"],
    "correct_answer": 1
  }
}
```

### Question Generation
```http
POST /api/enhanced-ai/generate-question
{
  "subject": "Mathematics",
  "difficulty": "intermediate",
  "topic": "Algebra",
  "previousQuestions": ["Previous question 1", "Previous question 2"]
}
```

### Conversational Tutoring
```http
POST /api/enhanced-ai/conversational-tutoring
{
  "studentMessage": "I need help with calculus",
  "conversationHistory": [
    {"student": "Hello", "tutor": "Hi! How can I help you?"}
  ]
}
```

### Learning Path Analysis
```http
POST /api/enhanced-ai/learning-path
{
  "studentProgress": {
    "totalQuestions": 50,
    "correctAnswers": 35,
    "averageScore": 70
  },
  "subjects": ["Mathematics", "Physics", "Chemistry"]
}
```

### Error Analysis
```http
POST /api/enhanced-ai/error-analysis
{
  "studentErrors": [
    "Forgot to apply chain rule",
    "Made sign error in calculation"
  ],
  "subject": "Calculus"
}
```

## 🔄 Provider Selection

The system automatically selects the best provider for each task:

- **Essay Evaluation**: Claude (Anthropic) preferred
- **Tutoring**: GPT-4 (OpenAI) preferred
- **Privacy-Sensitive**: Local models (Ollama) preferred
- **Fallback**: Mock provider for testing

### Manual Provider Selection

```python
# Force specific provider
result = tutor._call_llm_with_fallback(
    prompt="Your prompt here",
    task_type="tutoring",
    force_provider="anthropic"
)
```

## 📊 Monitoring and Logging

The system includes comprehensive logging:

```python
import logging
logging.basicConfig(level=logging.INFO)

# Check provider status
status = tutor.get_provider_status()
print(status)
```

## 🧪 Testing

### Unit Tests

```bash
# Run Python tests
python -m pytest tests/

# Test specific provider
python -m pytest tests/test_openai_provider.py
```

### Integration Tests

```bash
# Test API endpoints
npm test -- --grep "enhanced-ai"

# Test provider availability
curl -X GET http://localhost:5000/api/enhanced-ai/provider-status
```

## 🔒 Security Considerations

1. **API Key Management**: Store keys securely in environment variables
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Input Validation**: Validate all inputs before processing
4. **Privacy**: Use local models for sensitive data
5. **Error Handling**: Never expose internal errors to clients

## 🚀 Performance Optimization

### Caching
- Provider status is cached for 5 minutes
- Consider implementing response caching for repeated queries

### Batch Processing
- Use batch evaluation for multiple responses
- Implement parallel processing for independent tasks

### Timeout Management
- 30-second timeout for Python script execution
- Configurable timeouts per provider

## 🔧 Troubleshooting

### Common Issues

1. **Python Script Not Found**
   ```bash
   # Ensure Python 3 is installed
   python3 --version
   
   # Check file permissions
   chmod +x enhanced_ai_agent.py
   ```

2. **Provider Not Available**
   ```bash
   # Check API keys
   echo $OPENAI_API_KEY
   
   # Test provider connectivity
   python3 -c "from llm_providers import OpenAIProvider; print(OpenAIProvider(config).is_available())"
   ```

3. **JSON Parsing Errors**
   - Check prompt templates for proper JSON formatting
   - Verify LLM responses are valid JSON

### Debug Mode

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Enable detailed logging
tutor = EnhancedAITutor()
```

## 📈 Future Enhancements

- **Multi-modal Support**: Image and voice processing
- **Real-time Streaming**: Live response streaming
- **Advanced Analytics**: Learning pattern analysis
- **Custom Models**: Fine-tuned educational models
- **Collaborative Learning**: Multi-student sessions

## 🤝 Contributing

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure backward compatibility
5. Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
