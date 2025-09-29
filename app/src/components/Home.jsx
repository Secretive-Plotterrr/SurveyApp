import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Loading2 from './Loading2'; // Adjust the path based on your project structure
import '../components/Home.css'; // Import the CSS file (adjust the path based on your project structure)

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const Home = () => {
  // State for animated numbers
  const [participants, setParticipants] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [metrics, setMetrics] = useState(0);
  // State for content animation
  const [isVisible, setIsVisible] = useState(false);
  // State for loading effect
  const [isLoading, setIsLoading] = useState(false);
  // State for login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Animation effect for counting and content entrance
  useEffect(() => {
    // Trigger ease-in animation on mount
    setIsVisible(true);

    // Animate counting numbers
    const animateCount = (setCount, target, duration) => {
      let start = 0;
      const increment = target / (duration / 16); // 60fps approximation
      const step = () => {
        start += increment;
        if (start < target) {
          setCount(Math.ceil(start));
          requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      requestAnimationFrame(step);
    };

    animateCount(setParticipants, 100, 200); // 1000+ participants over 2s
    animateCount(setCompletionRate, 85, 2000); // 95% completion rate over 2s
    animateCount(setMetrics, 5, 2000); // 5 metrics over 2s
  }, []);

  // Auto-close login modal after 3 seconds
  useEffect(() => {
    if (showLoginModal) {
      const closeTimer = setTimeout(() => {
        setShowLoginModal(false);
      }, 3000);
      return () => clearTimeout(closeTimer);
    }
  }, [showLoginModal]);

  const handleSurveyClick = async () => {
    // Check if user is logged in
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
      }, 2000); // Adjust duration as needed
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600 py-12 px-4">
      {isLoading ? (
        <Loading2 /> // Render the loading component when isLoading is true
      ) : (
        <>
          {/* Content wrapper with white border, padding, and margin */}
          <div
            className={`flex flex-col max-w-[1000px]:flex-col md:flex-row items-center justify-center content-wrapper transition-all duration-1000 ease-in-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Image container */}
            <div className="w-full md:w-1/2 flex justify-center image-container order-1 md:order-2">
              <img
                src="./image/pfp.png"
                alt="Profile"
                className={`w-full rounded-lg shadow-lg object-cover transition-all duration-1000 ease-in-out ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />
            </div>
            {/* Text container */}
            <div className="text-center text-container order-2 md:order-1">
              <h2 className="heading text-white mb-4">
                Welcome to Self-Efficacy and Goal Setting Behavior Survey
              </h2>
              <p className="paragraph text-gray-100 mb-6">
                Empowering Future Accountants: Measure Your Drive And Define Your Goals. Scroll down to learn more about the survey!
              </p>
              <button
                onClick={handleSurveyClick}
                className={`button inline-block bg-white text-blue-600 font-semibold shadow-md hover:bg-blue-100 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Take The Survey
              </button>
            </div>
          </div>
          {/* Stats container with three bordered sections */}
          <div
            className={`flex flex-col max-w-[1000px]:flex-col md:flex-row justify-center gap-4 mt-8 w-full max-w-6xl stat-container transition-all duration-1000 ease-in-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Stat item 1 */}
            <div className="stat-item flex flex-col items-center justify-center p-4 border rounded-lg">
              <span className="stat-number text-white font-bold">{participants}+</span>
              <span className="stat-text text-gray-100">Participants</span>
            </div>
            {/* Stat item 2 */}
            <div className="stat-item flex flex-col items-center justify-center p-4 border rounded-lg">
              <span className="stat-number text-white font-bold">{completionRate}%</span>
              <span className="stat-text text-gray-100">Completion Rate</span>
            </div>
            {/* Stat item 3 */}
            <div className="stat-item flex flex-col items-center justify-center p-4 border rounded-lg">
              <span className="stat-number text-white font-bold">{metrics}</span>
              <span className="stat-text text-gray-100">Key Metrics</span>
            </div>
          </div>
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
      )}
    </div>
  );
};

export default Home;