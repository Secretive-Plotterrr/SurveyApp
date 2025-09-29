import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './About.css'; // Import custom CSS for additional styling
import Loading2 from './Loading2'; // Adjust path based on your project structure

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const About = () => {
  // State for loading effect
  const [isLoading, setIsLoading] = useState(false);
  // State for login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  // State for animation
  const [isVisible, setIsVisible] = useState(false);
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

  // Handle survey button click
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
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 pb-12 px-4 transition-opacity duration-500 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {isLoading ? (
        <Loading2 /> // Render loading component when isLoading is true
      ) : (
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Discover <span className="text-blue-400">Your True Self</span>
          </h2>
          <p className="text-lg mb-8">
            Explore your unique drive, goals, and personality traits to enhance your personal growth, work, and relationships through knowing yourself more.
          </p>

          <div className="big-border">
            <div className="grid-container">
              {/* Card 1: One-on-One Personality Coaching */}
              <div className="inner-border transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="icon mb-2">
                  <svg
                    className="w-12 h-12 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.5-3.5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">One-on-One Personality Coaching</h3>
                <p className="text-base text-gray-700">
                  Connect with KnowYou practitioners for personalized guidance—clarifying your personality profile, answering your questions, and helping you apply insights to real-life situations.
                </p>
              </div>

              {/* Card 2: Relationship Dynamics & Compatibility */}
              <div className="inner-border transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="icon mb-2">
                  <svg
                    className="w-12 h-12 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 4c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0-8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Relationship Dynamics & Compatibility</h3>
                <p className="text-base text-gray-700">
                  Unlock a deeper understanding of how your KnowYou profile interacts with others, fostering empathy, better communication, and emotional connection in relationships.
                </p>
              </div>

              {/* Card 3: In-Depth Personality Report */}
              <div className="inner-border transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="icon mb-2">
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">In-Depth KnowYou Personality Report</h3>
                <p className="text-base text-gray-700">
                  Receive a detailed breakdown of your KnowYou profile, including cognitive functions, strengths, potential blind spots, and how your personality impacts work, love, and everyday life.
                </p>
              </div>

              {/* Card 4: Self-Discovery & Personal Growth */}
              <div className="inner-border transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="icon mb-2">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Self-Discovery & Personal Growth</h3>
                <p className="text-base text-gray-700">
                  Explore the core of your personality with KnowYou to better understand your motivations, decision-making style, and emotional needs—empowering long-term self-awareness and growth.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSurveyClick}
              className="px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-700 transition duration-300 inline-block"
              aria-label="Start the personality survey"
            >
              Take the Survey
            </button>
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
        </div>
      )}
    </div>
  );
};

export default About;