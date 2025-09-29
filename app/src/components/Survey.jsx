import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Loading2 from './Loading2'; // Adjust path based on your project structure

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const questions = [
  {
    id: 1,
    text: 'At a party, do you:',
    options: [
      { value: 'E', label: 'Interact with many, including strangers' },
      { value: 'I', label: 'Interact with a few, known to you' },
    ],
  },
  {
    id: 2,
    text: 'Are you more:',
    options: [
      { value: 'S', label: 'Realistic than speculative' },
      { value: 'N', label: 'Speculative than realistic' },
    ],
  },
  {
    id: 3,
    text: 'Is it worse to:',
    options: [
      { value: 'T', label: 'Have your head in the clouds' },
      { value: 'F', label: 'Be in a rut' },
    ],
  },
  {
    id: 4,
    text: 'Are you more impressed by:',
    options: [
      { value: 'J', label: 'Principles' },
      { value: 'P', label: 'Emotions' },
    ],
  },
  {
    id: 5,
    text: 'Are you more drawn to:',
    options: [
      { value: 'E', label: 'Convincing people' },
      { value: 'I', label: 'Touching people' },
    ],
  },
  {
    id: 6,
    text: 'Do you prefer to work:',
    options: [
      { value: 'S', label: 'To deadlines' },
      { value: 'N', label: 'Just whenever' },
    ],
  },
  {
    id: 7,
    text: 'Do you tend to choose:',
    options: [
      { value: 'T', label: 'Rather carefully' },
      { value: 'F', label: 'Somewhat impulsively' },
    ],
  },
  {
    id: 8,
    text: 'At parties do you:',
    options: [
      { value: 'J', label: 'Stay late, with increasing energy' },
      { value: 'P', label: 'Leave early, with decreased energy' },
    ],
  },
];

const Survey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // State for animation
  const navigate = useNavigate();

  // Auto-close login modal after 3 seconds
  useEffect(() => {
    if (showLoginModal) {
      const closeTimer = setTimeout(() => {
        setShowLoginModal(false);
      }, 3000);
      return () => clearTimeout(closeTimer);
    }
  }, [showLoginModal]);

  // Trigger fade-in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleOptionSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion + 1]: value }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const scores = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(answers).forEach((value) => {
      scores[value] += 1;
    });
    const type =
      (scores.E > scores.I ? 'E' : 'I') +
      (scores.N > scores.S ? 'N' : 'S') +
      (scores.T > scores.F ? 'T' : 'F') +
      (scores.J > scores.P ? 'J' : 'P');
    setResult(type);
  };

  const handleSurveyClick = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.log('User not logged in, showing login modal');
        setShowLoginModal(true);
        return;
      }

      // User is logged in, proceed to survey
      setIsLoading(true); // Show loading effect
      setTimeout(() => {
        setIsLoading(false); // Hide loading effect after 2 seconds
        navigate('/survey1'); // Navigate to survey page
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error checking user session:', error);
      setShowLoginModal(true);
    }
  };

  const handleLoginRedirect = () => {
    setIsLoading(true); // Show loading effect
    setShowLoginModal(false); // Close modal
    setTimeout(() => {
      setIsLoading(false); // Hide loading effect after 2 seconds
      navigate('/login'); // Navigate to login page
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-12 transition-opacity duration-500 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {isLoading ? (
        <Loading2 /> // Render loading component when isLoading is true
      ) : (
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Know<span className="text-blue-400">You</span></h1>
          <div className="bg-blue-100 p-6 rounded-lg mb-8">
            <p className="text-lg font-semibold text-gray-700">Frequently Asked Questions</p>
            <p className="text-md text-gray-500 mt-2">Welcome to KnowYou! Here are answers to common questions about our platform. To begin, click 'Take The Test' and respond to each question in a calm, focused setting. The Self-Efficacy and Goal Setting Behavior Survey will ask you a series of questions to evaluate your confidence and planning abilities. Completing it will provide insights into your strengths, such as determination or organization, and highlight areas for improvement, like time management, to support your personal and academic growth.</p>
          </div>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Learn about yourself</h2>
          {!result ? (
            <>
              {currentQuestion === 0 && (
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-4">
                    <p className="text-lg text-gray-600">What should I do to prepare?</p>
                    <p className="text-md text-gray-500">Choose a quiet place and time to focus, ensuring you’re relaxed to get the most accurate insights.</p>
                  </div>
                  <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-4">
                    <p className="text-lg text-gray-600">How does the survey work?</p>
                    <p className="text-md text-gray-500">Answer each question carefully. The questions are designed to reveal your natural tendencies in thinking, feeling, and interacting.</p>
                  </div>
                  <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                    <p className="text-lg text-gray-600">What will I learn from the results?</p>
                    <p className="text-md text-gray-500">You’ll receive a personalized personality type report that highlights your strengths, challenges, and unique traits.</p>
                  </div>
                </div>
              )}
              {currentQuestion > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
                  <p className="text-xl font-semibold mb-4">{questions[currentQuestion - 1].text}</p>
                  {questions[currentQuestion - 1].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionSelect(opt.value)}
                      className="block w-full text-left p-3 mb-2 bg-white hover:bg-blue-50 rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {opt.label}
                    </button>
                  ))}
                  <p className="text-sm text-gray-500 mt-4">Question {currentQuestion} of {questions.length}</p>
                </div>
              )}
              {currentQuestion === 0 && (
                <button
                  onClick={handleSurveyClick}
                  className="bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  aria-label="Start the personality survey"
                >
                  Take The Survey
                </button>
              )}
              {/* Login Required Modal */}
              {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                  <div
                    className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300"
                    style={{
                      transform: showLoginModal ? 'scale(1)' : 'scale(0.9)',
                      opacity: showLoginModal ? 1 : 0,
                    }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-center text-blue-500 mb-4">
                      Login Required
                    </h3>
                    <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                      You must log in to start the survey.
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleLoginRedirect}
                        className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors transform hover:scale-105"
                      >
                        Go to Login
                      </button>
                      <button
                        onClick={() => setShowLoginModal(false)}
                        className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors transform hover:scale-105"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-800">Your Personality Type: {result}</h3>
              <p className="mt-2 text-gray-600">This is a simplified result. For a full MBTI assessment, consult a professional.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Survey;