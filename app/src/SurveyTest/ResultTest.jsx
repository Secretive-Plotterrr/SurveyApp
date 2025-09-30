import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const getVerbal = (mean) => {
  if (mean >= 3.26) return 'High';
  if (mean >= 2.51) return 'Moderate High';
  if (mean >= 1.76) return 'Moderate Low';
  return 'Low';
};

const ResultTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasSavedResults = useRef(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://surveyapp-3-mj3e.onrender.com';
  console.log('ResultTest loaded, Backend URL:', backendUrl);

  const selfEfficacyQuestions = [
    { id: 'q1', text: 'I can always manage to solve difficult problems if I try hard enough.' },
    { id: 'q2', text: 'If someone opposes me, I can find the means and ways to get what I want.' },
    { id: 'q3', text: 'It is easy for me to stick to my aims and accomplish my goals.' },
    { id: 'q4', text: 'I am confident that I could deal efficiently with unexpected events.' },
    { id: 'q5', text: 'Thanks to my resourcefulness, I know how to handle unforeseen situations.' },
    { id: 'q6', text: 'I can solve most problems if I invest the necessary effort.' },
    { id: 'q7', text: 'I can remain calm when facing difficulties because I can rely on my coping abilities.' },
    { id: 'q8', text: 'When I am confronted with a problem, I can usually find several solutions.' },
    { id: 'q9', text: 'If I am in trouble, I can usually think of a solution.' },
    { id: 'q10', text: 'I can usually handle whatever comes my way.' },
  ];

  const goalOrientationQuestions = [
    { id: 'q11', text: 'I set goals to achieve what I think is important.' },
    { id: 'q12', text: 'I imagine what life will be like when I reach my goal.' },
    { id: 'q13', text: 'My goals are meaningful to me.' },
    { id: 'q14', text: 'My goals are based on my own interests and plans for the future.' },
    { id: 'q15', text: 'I set goals to help me be more successful in school.' },
    { id: 'q16', text: 'I set goals to help me do my personal best.' },
    { id: 'q17', text: 'When I want to learn something, I make small goals to track my progress.' },
    { id: 'q18', text: 'I focus on my own improvement instead of worrying about whether other people are doing better than me.' },
    { id: 'q19', text: 'When I set goals, I think about barriers that might get in my way.' },
    { id: 'q20', text: 'I adjust my goal-setting approach based on what I have learned from past experiences.' },
  ];

  const selfEfficacyData = selfEfficacyQuestions.map(q => {
    const score = parseInt(formData[q.id] || 0);
    return { question: q.text, mean: score, interpretation: getVerbal(score) };
  });

  const goalOrientationData = goalOrientationQuestions.map(q => {
    const score = parseInt(formData[q.id] || 0);
    return { question: q.text, mean: score, interpretation: getVerbal(score) };
  });

  const selfEfficacyGrandMean = (selfEfficacyData.reduce((sum, item) => sum + item.mean, 0) / selfEfficacyData.length).toFixed(2);
  const goalOrientationGrandMean = (goalOrientationData.reduce((sum, item) => sum + item.mean, 0) / goalOrientationData.length).toFixed(2);

  const selfEfficacyGrandVerbal = getVerbal(parseFloat(selfEfficacyGrandMean));
  const goalOrientationGrandVerbal = getVerbal(parseFloat(goalOrientationGrandMean));

  const getInterpretationColor = (interpretation) => {
    if (interpretation === 'High') return 'text-green-600';
    if (interpretation === 'Moderate High') return 'text-yellow-600';
    if (interpretation === 'Moderate Low') return 'text-orange-600';
    if (interpretation === 'Low') return 'text-red-600';
    return 'text-gray-600';
  };

  const selfEfficacyTotal = parseFloat(selfEfficacyGrandMean) * 10;
  let selfEfficacyInterpretation = '';
  let selfEfficacySuggestions = [];
  let selfEfficacyColor = '';
  if (selfEfficacyTotal > 32) {
    selfEfficacyInterpretation = 'High Self-Efficacy: You have a strong belief in your ability to handle challenges and achieve goals.';
    selfEfficacySuggestions = [
      'Continue leveraging your confidence by taking on new challenges to further build your skills.',
      'Mentor others who may struggle with self-doubt to reinforce your own efficacy.',
      'Set stretch goals that push your boundaries while maintaining realistic expectations.'
    ];
    selfEfficacyColor = 'text-green-600';
  } else if (selfEfficacyTotal >= 20) {
    selfEfficacyInterpretation = 'Moderate High Self-Efficacy: You have a reasonable level of confidence, but there is room for improvement in handling unexpected situations.';
    selfEfficacySuggestions = [
      'Practice positive self-talk and reflect on past successes to boost your confidence.',
      'Break down complex tasks into smaller, manageable steps to experience more frequent wins.',
      'Seek feedback from trusted peers or mentors to identify and address areas of doubt.'
    ];
    selfEfficacyColor = 'text-yellow-600';
  } else {
    selfEfficacyInterpretation = 'Low Self-Efficacy: You may doubt your abilities in facing difficulties, which could hinder your progress.';
    selfEfficacySuggestions = [
      'Start with small, achievable tasks to build a track record of success and gradually increase difficulty.',
      'Engage in activities that align with your strengths to rebuild confidence.',
      'Consider professional support, such as counseling or self-efficacy workshops, to develop coping strategies.'
    ];
    selfEfficacyColor = 'text-red-600';
  }

  const goalOrientationTotal = parseFloat(goalOrientationGrandMean) * 10;
  let goalOrientationInterpretation = '';
  let goalOrientationSuggestions = [];
  let goalOrientationColor = '';
  if (goalOrientationTotal > 32) {
    goalOrientationInterpretation = 'High Mastery Goal Orientation: You are highly focused on personal growth, learning, and overcoming barriers through adaptive goal-setting.';
    goalOrientationSuggestions = [
      'Maintain your approach by regularly reviewing and refining your goals based on new insights.',
      'Share your goal-setting strategies with others to inspire collective improvement.',
      'Explore advanced techniques like SMART goals or OKRs to enhance your already strong orientation.'
    ];
    goalOrientationColor = 'text-green-600';
  } else if (goalOrientationTotal >= 20) {
    goalOrientationInterpretation = 'Moderate High Mastery Goal Orientation: You show interest in self-improvement but may not consistently focus on barriers or past learnings.';
    goalOrientationSuggestions = [
      'Incorporate barrier analysis into your goal-planning to anticipate and mitigate obstacles.',
      'Track your progress with journals or apps to learn from experiences and adjust strategies.',
      'Focus on intrinsic motivations by aligning goals more closely with personal interests and values.'
    ];
    goalOrientationColor = 'text-yellow-600';
  } else {
    goalOrientationInterpretation = 'Low Mastery Goal Orientation: You may struggle with setting meaningful goals or focusing on personal development over comparison.';
    goalOrientationSuggestions = [
      'Begin by setting small, daily goals focused on learning rather than performance to shift your mindset.',
      'Avoid comparing yourself to others; instead, celebrate personal milestones and improvements.',
      'Read books or take courses on goal-setting (e.g., "Atomic Habits" by James Clear) to build better habits.'
    ];
    goalOrientationColor = 'text-red-600';
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (hasSavedResults.current) return;
    hasSavedResults.current = true;

    const saveResults = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('No authenticated user found:', userError?.message || 'User not logged in');
        return;
      }

      const results = {
        selfEfficacy: {
          questions: selfEfficacyData,
          grandMean: selfEfficacyGrandMean,
          grandVerbal: selfEfficacyGrandVerbal,
          total: selfEfficacyTotal,
          interpretation: selfEfficacyInterpretation,
          suggestions: selfEfficacySuggestions
        },
        goalOrientation: {
          questions: goalOrientationData,
          grandMean: goalOrientationGrandMean,
          grandVerbal: goalOrientationGrandVerbal,
          total: goalOrientationTotal,
          interpretation: goalOrientationInterpretation,
          suggestions: goalOrientationSuggestions
        }
      };

      const { error } = await supabase
        .from('survey_results')
        .insert({
          user_id: user.id,
          survey_result: results,
          answered_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving survey results:', error.message);
      } else {
        console.log('Survey results saved successfully');
      }
    };

    saveResults();
  }, [selfEfficacyData, goalOrientationData, selfEfficacyGrandMean, goalOrientationGrandMean, selfEfficacyGrandVerbal, goalOrientationGrandVerbal, selfEfficacyTotal, goalOrientationTotal, selfEfficacyInterpretation, goalOrientationInterpretation, selfEfficacySuggestions, goalOrientationSuggestions]);

  const handleDone = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const [messages, setMessages] = useState([{ text: 'Hello! Ask me any questions about your results.', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
    };
    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');

    try {
      const token = localStorage.getItem('token');
      console.log('Sending chat request with:', { token: token ? 'Present' : 'Missing', message: userMessage });

      if (!token) {
        console.error('No token found in localStorage');
        setMessages((prev) => [...prev, { text: 'Please log in to use the chatbot.', sender: 'bot' }]);
        return;
      }

      const selfEfficacyScore = selfEfficacyData.reduce((sum, item) => sum + item.mean, 0);
      const goalOrientationScore = goalOrientationData.reduce((sum, item) => sum + item.mean, 0);

      if (typeof selfEfficacyScore !== 'number' || typeof goalOrientationScore !== 'number' || isNaN(selfEfficacyScore) || isNaN(goalOrientationScore)) {
        console.error('Invalid scores:', { selfEfficacyScore, goalOrientationScore });
        setMessages((prev) => [...prev, { text: 'Error: Invalid or missing survey scores. Please complete the survey again.', sender: 'bot' }]);
        return;
      }

      console.log('Sending request to:', `${backendUrl}/api/auth/chat`, {
        selfEfficacyScore,
        goalOrientationScore,
        message: userMessage,
      });

      const response = await fetch(`${backendUrl}/api/auth/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    message: userMessage,
    selfEfficacyScore,
    goalOrientationScore
  }),
});

console.log('Sending request to:', `${backendUrl}/api/auth/chat`);
console.log('Request method:', 'POST');
console.log('Request headers:', {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});
console.log('Request body:', JSON.stringify({
  message: userMessage,
  selfEfficacyScore,
  goalOrientationScore
}, null, 2));

      console.log('Fetch response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        setMessages((prev) => [
          ...prev,
          { text: errorData.error || 'Sorry, the server encountered an error. Please try again later.', sender: 'bot' },
        ]);
        return;
      }

      const data = await response.json();
      console.log('Server response data:', data);
      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Chat fetch error:', error.message, error.stack);
      setMessages((prev) => [...prev, { text: 'Oops, something went wrong. Please try again!', sender: 'bot' }]);
    }
  };

  const handleChatOpen = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsChatOpen(true), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F8FF] to-blue-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto transform transition-all duration-300 ease-in-out animate-fade-in relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-6 sm:mb-8">
          Your Survey <span className="text-blue-500">Results</span>
        </h2>
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl mb-6 sm:mb-8 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]" aria-labelledby="self-efficacy-heading">
          <h3 id="self-efficacy-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Self-Efficacy Results</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-gray-600 font-medium border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="p-4 text-sm font-semibold border-b border-blue-200">Indicator</th>
                  <th className="p-4 text-sm font-semibold border-b border-blue-200">Score</th>
                  <th className="p-4 text-sm font-semibold border-b border-blue-200">Verbal Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {selfEfficacyData.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="p-4 text-sm border-b border-gray-100">{item.question}</td>
                    <td className="p-4 text-sm border-b border-gray-100">{item.mean}</td>
                    <td className={`p-4 text-sm font-semibold border-b border-gray-100 ${getInterpretationColor(item.interpretation)}`}>{item.interpretation}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="p-4 text-sm">Grand Mean</td>
                  <td className="p-4 text-sm">{selfEfficacyGrandMean}</td>
                  <td className={`p-4 text-sm ${getInterpretationColor(selfEfficacyGrandVerbal)}`}>{selfEfficacyGrandVerbal}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Overall Self-Efficacy Level:</p>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 transition-all duration-500"
                style={{ width: `${(parseFloat(selfEfficacyGrandMean) / 4) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <p className={`text-lg font-semibold mb-2 ${selfEfficacyColor}`}>Interpretation: {selfEfficacyInterpretation}</p>
            <h4 className="text-md font-semibold text-gray-800 mb-2">Suggestions for Improvement:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {selfEfficacySuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl mb-6 sm:mb-8 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]" aria-labelledby="goal-orientation-heading">
          <h3 id="goal-orientation-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Mastery Goal Orientation Results</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-gray-600 font-medium border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="p-4 text-sm font-semibold border-b border-blue-200">Indicator</th>
                  <th className="p-4 text-sm font-semibold border-b border-blue-200">Score</th>
                  <th className="p-4 text-sm font-semibold border-b border-blue-200">Verbal Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {goalOrientationData.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="p-4 text-sm border-b border-gray-100">{item.question}</td>
                    <td className="p-4 text-sm border-b border-gray-100">{item.mean}</td>
                    <td className={`p-4 text-sm font-semibold border-b border-gray-100 ${getInterpretationColor(item.interpretation)}`}>{item.interpretation}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="p-4 text-sm">Grand Mean</td>
                  <td className="p-4 text-sm">{goalOrientationGrandMean}</td>
                  <td className={`p-4 text-sm ${getInterpretationColor(goalOrientationGrandVerbal)}`}>{goalOrientationGrandVerbal}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Overall Goal Orientation Level:</p>
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 transition-all duration-500"
                style={{ width: `${(parseFloat(goalOrientationGrandMean) / 4) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <p className={`text-lg font-semibold mb-2 ${goalOrientationColor}`}>Interpretation: {goalOrientationInterpretation}</p>
            <h4 className="text-md font-semibold text-gray-800 mb-2">Suggestions for Improvement:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {goalOrientationSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </section>
        <div className="flex flex-col items-center space-y-4 mb-8">
          <button
            onClick={handleDone}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 hover:shadow-md transition-all duration-300 font-semibold transform hover:scale-105 shadow-sm"
            aria-label="Return to the home page"
          >
            Done
          </button>
          <div className="sm:hidden flex flex-col items-center space-y-2">
            <span className="text-gray-600 font-medium mt-2 mb-2">or</span>
            <button
              onClick={handleChatOpen}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105 shadow-sm"
              aria-label="Open chatbot"
            >
              Ask Chatbot
            </button>
          </div>
        </div>
        <div className="hidden sm:block fixed bottom-6 right-1 z-50">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            aria-label="Toggle chatbot"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
        {isChatOpen && (
          <div className="fixed inset-0 sm:bottom-20 sm:right-8 sm:inset-auto flex items-start sm:items-center justify-center sm:bg-transparent bg-gray-600 bg-opacity-50 sm:bg-opacity-0 z-50 transition-all duration-300 pt-[10vh] sm:pt-0">
            <div
              ref={chatRef}
              className="w-[95vw] h-[500px] sm:w-[400px] sm:h-[450px] bg-white sm:rounded-2xl sm:shadow-xl flex flex-col overflow-hidden transform transition-all duration-500 ease-in-out sm:scale-100 scale-95"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🤖</span>
                  <span className="font-semibold text-sm">Results Assistant</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-white opacity-0 w-5 h-5"
                    aria-hidden="true"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label="Close chatbot"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-grow p-4 bg-gray-50 overflow-y-auto space-y-3">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-sm transition-all duration-200 ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                      }`}
                    >
                      <span className="text-sm">{msg.text}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-grow p-2 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Ask about your results..."
                  aria-label="Type your question for the chatbot"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white p-2 w-10 h-10 rounded-full hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
                  aria-label="Send message to chatbot"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResultTest;