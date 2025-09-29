import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading4 from '../components/Loading4'; // Adjust the path based on your project structure

const Survey2 = () => {
  const [formData, setFormData] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
    q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  // Trigger animation on page change
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300); // Reset after animation
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      const currentPageQuestions = Object.keys(newData).slice((currentPage - 1) * 5, currentPage * 5);
      if (currentPageQuestions.every(key => newData[key])) {
        if (currentPage < 4 && !Object.values(newData).slice(currentPage * 5, 20).some(value => !value)) {
          setCurrentPage(currentPage + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return newData;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const allAnswered = Object.values(formData)
      .slice((currentPage - 1) * 5, currentPage * 5)
      .every((value) => value);
    if (allAnswered) {
      if (currentPage < 4) {
        setCurrentPage(currentPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          navigate('/ResultTest', { state: { formData } });
        }, 2500);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/survey1');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const questions = [
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
    { id: 'q11', text: 'I set goals to achieve what I think is important.' },
    { id: 'q12', text: 'I imagine what life will be like when I reach my goal.' },
    { id: 'q13', text: 'My goals are meaningful to me.' },
    { id: 'q14', text: 'My goals are based on my own interests and plans for the future.' },
    { id: 'q15', text: 'I set goals to help me be more successful in school.' },
    { id: 'q16', text: 'I set goals to help me do my personal best.' },
    { id: 'q17', text: 'When I want to learn something, I make small goals to track my progress.' },
    { id: 'q18', text: 'I focus on my own improvement instead of worrying about whether other people are doing better than me.' },
    { id: 'q19', text: 'When I set goals, I think about barriers that might get in my way.' },
    { id: 'q20', text: 'I adjust my goal-setting approach based on what I have learned from past experiences.' }
  ];

  const currentQuestions = questions.slice((currentPage - 1) * 5, currentPage * 5);

  const answeredCount = Object.values(formData).filter(Boolean).length;
  const progressPercentage = (answeredCount / 20) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F8FF] to-blue-100 px-4 sm:px-6 lg:px-8">
      {isLoading && <Loading4 />}
      <div className={`bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-4 sm:my-6 transform transition-all duration-300 ease-in-out ${animate ? 'animate-page' : ''} pb-6 sm:pb-8`}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-4 sm:mb-6">
          Know<span className="text-blue-500">You</span> Survey
        </h1>
        <div className="bg-gray-200 h-2 mb-4 sm:mb-6 rounded-full">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base font-medium">
          {progressPercentage.toFixed(0)}% - Step {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, 20)} of 20
        </div>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-lg font-medium">
          Choose how accurately each statement reflects you.
        </p>
        <div className="space-y-4 sm:space-y-6">
          {currentQuestions.map((q) => (
            <div key={q.id} className="bg-white p-3 sm:p-4 mb-2 sm:mb-4 rounded-lg shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base mb-2 sm:mb-3 font-medium">{q.text}</p>
              <div className="flex flex-wrap justify-around items-center gap-2 sm:gap-4">
                {[4, 3, 2, 1].map((value) => (
                  <label key={value} className="flex flex-col items-center space-y-1 w-1/5 sm:w-auto">
                    <input
                      type="radio"
                      name={q.id}
                      value={value}
                      checked={formData[q.id] === value.toString()}
                      onChange={handleChange}
                      className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 focus:ring-blue-500 border-gray-300 rounded-full"
                      required
                      aria-label={`Rate ${q.text} as ${value === 4 ? 'Strongly Agree' : value === 3 ? 'Agree' : value === 2 ? 'Disagree' : 'Strongly Disagree'}`}
                    />
                    <span className={`text-xs sm:text-sm font-medium ${value === 4 ? 'text-green-500' : value === 3 ? 'text-green-400' : value === 2 ? 'text-red-400' : 'text-red-500'}`}>
                      {value === 4 ? 'Strongly Agree' : value === 3 ? 'Agree' : value === 2 ? 'Disagree' : 'Strongly Disagree'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-center space-x-4 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="w-1/3 bg-gray-500 text-white p-2 sm:p-3 rounded-lg hover:bg-gray-600 hover:shadow-md transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-105 shadow-sm"
              aria-label={currentPage === 1 ? 'Go back to the previous survey' : 'Go to the previous set of questions'}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-1/3 bg-blue-500 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-600 hover:shadow-md transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-105 shadow-sm"
              aria-label={currentPage === 4 ? 'Submit survey and view results' : 'Proceed to the next set of questions'}
              disabled={isLoading}
            >
              {currentPage === 4 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
      {/* Modal for incomplete answers */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all ease-out duration-300 scale-100 opacity-100 animate-fade-in">
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-center text-red-500 mb-4">
              Incomplete Answers
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              Please answer all questions on this page before proceeding.
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 hover:shadow-md transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-105 shadow-sm"
                aria-label="Close incomplete answers warning"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes page-transition {
          0% { opacity: 0.7; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-page {
          animation: page-transition 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Survey2;