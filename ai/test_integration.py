#!/usr/bin/env python3
"""
Test script for Enhanced AI Integration
Verifies that all components are working correctly
"""

import json
import sys
import os
from enhanced_ai_agent import EnhancedAITutor
from llm_config import llm_manager

def test_provider_status():
    """Test provider status and availability"""
    print("🔍 Testing Provider Status...")
    
    tutor = EnhancedAITutor()
    status = tutor.get_provider_status()
    
    print("Available Providers:")
    for provider, info in status.items():
        status_icon = "✅" if info['available'] else "❌"
        print(f"  {status_icon} {provider}: {info['type']}")
    
    return status

def test_answer_evaluation():
    """Test answer evaluation functionality"""
    print("\n📝 Testing Answer Evaluation...")
    
    tutor = EnhancedAITutor()
    
    # Test multiple choice evaluation
    result = tutor.evaluate_answer(
        question="What is the derivative of f(x) = x²?",
        answer="2x",
        question_type="multiple-choice",
        context={
            "options": ["x", "2x", "x²", "2x²"],
            "correct_answer": 1
        }
    )
    
    print(f"Multiple Choice Result:")
    print(f"  Correct: {result.get('correct', 'N/A')}")
    print(f"  Score: {result.get('score', 'N/A')}")
    print(f"  Provider: {result.get('provider', 'N/A')}")
    print(f"  Feedback: {result.get('feedback', 'N/A')[:100]}...")
    
    return result

def test_essay_evaluation():
    """Test essay evaluation functionality"""
    print("\n📄 Testing Essay Evaluation...")
    
    tutor = EnhancedAITutor()
    
    essay_content = """
    Climate change is one of the most pressing issues facing our planet today. 
    The scientific consensus is clear that human activities, particularly the 
    burning of fossil fuels, are contributing to global warming. This warming 
    leads to various environmental impacts including rising sea levels, more 
    frequent extreme weather events, and changes in ecosystems.
    
    To address climate change, we need to take immediate action. This includes 
    transitioning to renewable energy sources, improving energy efficiency, 
    and implementing policies that reduce greenhouse gas emissions. 
    Individual actions also matter, such as reducing energy consumption 
    and supporting sustainable practices.
    """
    
    result = tutor.evaluate_essay(
        content=essay_content,
        context={"topic": "Climate Change"}
    )
    
    print(f"Essay Evaluation Result:")
    print(f"  Score: {result.get('score', 'N/A')}")
    print(f"  Provider: {result.get('provider', 'N/A')}")
    print(f"  Feedback: {result.get('feedback', 'N/A')[:100]}...")
    
    return result

def test_question_generation():
    """Test adaptive question generation"""
    print("\n❓ Testing Question Generation...")
    
    tutor = EnhancedAITutor()
    
    result = tutor.generate_adaptive_question(
        subject="Mathematics",
        difficulty="intermediate",
        topic="Calculus",
        previous_questions=["What is the derivative of x²?"]
    )
    
    print(f"Generated Question:")
    print(f"  Question: {result.get('question', 'N/A')}")
    print(f"  Type: {result.get('type', 'N/A')}")
    print(f"  Difficulty: {result.get('difficulty', 'N/A')}")
    print(f"  Provider: {result.get('provider', 'N/A')}")
    
    return result

def test_conversational_tutoring():
    """Test conversational tutoring"""
    print("\n💬 Testing Conversational Tutoring...")
    
    tutor = EnhancedAITutor()
    
    result = tutor.conversational_tutoring(
        student_message="I'm having trouble understanding derivatives. Can you help me?",
        conversation_history=[]
    )
    
    print(f"Conversational Response:")
    print(f"  Response: {result.get('response', 'N/A')[:100]}...")
    print(f"  Type: {result.get('response_type', 'N/A')}")
    print(f"  Provider: {result.get('provider', 'N/A')}")
    
    return result

def test_learning_path_analysis():
    """Test learning path analysis"""
    print("\n📊 Testing Learning Path Analysis...")
    
    tutor = EnhancedAITutor()
    
    student_progress = {
        "totalQuestions": 45,
        "correctAnswers": 38,
        "averageScore": 84,
        "subjects": {
            "Mathematics": {"progress": 75, "level": "Advanced"},
            "Physics": {"progress": 60, "level": "Intermediate"}
        }
    }
    
    result = tutor.analyze_learning_path(
        student_progress=student_progress,
        subjects=["Mathematics", "Physics", "Chemistry"]
    )
    
    print(f"Learning Path Analysis:")
    print(f"  Recommended Subjects: {len(result.get('recommended_subjects', []))}")
    print(f"  Learning Sequence: {len(result.get('learning_sequence', []))}")
    print(f"  Provider: {result.get('provider', 'N/A')}")
    
    return result

def test_error_analysis():
    """Test error analysis"""
    print("\n🔍 Testing Error Analysis...")
    
    tutor = EnhancedAITutor()
    
    student_errors = [
        "Forgot to apply the chain rule when differentiating composite functions",
        "Made a sign error when solving the quadratic equation",
        "Didn't check the domain restrictions for the logarithmic function"
    ]
    
    result = tutor.analyze_errors(
        student_errors=student_errors,
        subject="Calculus"
    )
    
    print(f"Error Analysis:")
    print(f"  Error Patterns: {len(result.get('error_patterns', []))}")
    print(f"  Targeted Remediation: {len(result.get('targeted_remediation', []))}")
    print(f"  Provider: {result.get('provider', 'N/A')}")
    
    return result

def run_all_tests():
    """Run all integration tests"""
    print("🚀 Starting Enhanced AI Integration Tests\n")
    
    tests = [
        ("Provider Status", test_provider_status),
        ("Answer Evaluation", test_answer_evaluation),
        ("Essay Evaluation", test_essay_evaluation),
        ("Question Generation", test_question_generation),
        ("Conversational Tutoring", test_conversational_tutoring),
        ("Learning Path Analysis", test_learning_path_analysis),
        ("Error Analysis", test_error_analysis)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            print(f"Running {test_name}...")
            result = test_func()
            results[test_name] = {"status": "✅ PASS", "result": result}
        except Exception as e:
            print(f"❌ {test_name} failed: {str(e)}")
            results[test_name] = {"status": "❌ FAIL", "error": str(e)}
    
    # Summary
    print("\n" + "="*50)
    print("📋 TEST SUMMARY")
    print("="*50)
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        status = result["status"]
        if "PASS" in status:
            passed += 1
        else:
            failed += 1
        print(f"{status} {test_name}")
    
    print(f"\nTotal: {passed + failed} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All tests passed! Enhanced AI integration is working correctly.")
    else:
        print(f"\n⚠️ {failed} test(s) failed. Please check the configuration.")
    
    return results

if __name__ == "__main__":
    # Check if we're in the right directory
    if not os.path.exists("enhanced_ai_agent.py"):
        print("❌ Error: Please run this script from the backend/ai directory")
        sys.exit(1)
    
    # Run tests
    results = run_all_tests()
    
    # Exit with appropriate code
    failed_tests = sum(1 for result in results.values() if "FAIL" in result["status"])
    sys.exit(failed_tests)
