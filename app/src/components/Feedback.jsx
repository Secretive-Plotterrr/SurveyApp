import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Loading2 from './Loading2'; // Adjust path based on your project structure

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const testimonials = [
  {
    id: 1,
    name: 'Juan Santos',
    rating: 4,
    feedback: 'Personal report. The report I got felt really personal and really insightful... pointing out some of my blind spots!'
  },
  {
    id: 2,
    name: 'Maria Cruz',
    rating: 5,
    feedback: 'Better than expected. I usually get bored halfway through tests, but the way this one kept me engaged, and the report was detailed.'
  },
  {
    id: 3,
    name: 'Angelo Reyes',
    rating: 4,
    feedback: 'Using it for dating. It’s long, but I’m using it a lot for dating, trying to find people who are compatible with me. So far, it is really helping out with that.'
  },
  {
    id: 4,
    name: 'Luz Garcia',
    rating: 5,
    feedback: 'Read me an open book and much more. Amazing! I have a psychology paper due where I had to write about my personality (as well as the challenges I face), and this test was great! Highly recommend!'
  },
  {
    id: 5,
    name: 'Miguel Lopez',
    rating: 4,
    feedback: 'A very in-depth look at your personality. A very in-depth look at your personality which reports on every aspect. I’m very impressed and hope it will help me in my future job searches.'
  },
  {
    id: 6,
    name: 'Sofia Ramos',
    rating: 5,
    feedback: 'This test gives me idea about myself. This test gives me idea about myself. Really impressed with the reports on every aspect. I hope it will help me in my future job searches.'
  },
];

const Feedback = () => {
  const [feedbackToday, setFeedbackToday] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [ratingsAccuracy, setRatingsAccuracy] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // State for animation
  const navigate = useNavigate();

  // Trigger fade-in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const animateCount = (setValue, target, duration) => {
      let start = 0;
      const increment = target / (duration / 16); // 60fps approximation
      const step = () => {
        start += increment;
        if (start < target) {
          setValue(Math.floor(start));
          requestAnimationFrame(step);
        } else {
          setValue(target);
        }
      };
      requestAnimationFrame(step);
    };

    animateCount(setFeedbackToday, 95, 2000); // 95 over 2s
    animateCount(setTotalFeedback, 100, 2500); // 100 over 2.5s
    animateCount(setRatingsAccuracy, 93.6, 2000); // 93.6% over 2s
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

  const handleSeeMore = () => {
    setVisibleTestimonials(testimonials.length);
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
      className="min-h-screen flex flex-col items-center justify-start bg-blue-50 pt-20 transition-opacity duration-500 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {isLoading ? (
        <Loading2 /> // Render loading component when isLoading is true
      ) : (
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-black">Know</span>
            <span className="text-blue-500">You</span>
          </h1>
          <p className="text-xl font-semibold mb-8 text-gray-700">
            See what others say about us!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-4xl font-bold text-blue-800">{feedbackToday}+</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-4xl font-bold text-blue-800">{totalFeedback}+</p>
              <p className="text-sm text-gray-600">Total Feedback</p>
            </div>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-4xl font-bold text-blue-800">{ratingsAccuracy}%</p>
              <p className="text-sm text-gray-600">Ratings Accuracy</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {testimonials.slice(0, visibleTestimonials).map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md text-left transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <div className="flex">
                      {Array(testimonial.rating).fill().map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{testimonial.feedback}</p>
              </div>
            ))}
          </div>
          {testimonials.length > 6 && visibleTestimonials < testimonials.length && (
            <button
              onClick={handleSeeMore}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-12 hover:bg-blue-700 transition transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              See More
            </button>
          )}
          <button
            onClick={handleSurveyClick}
            className="bg-blue-400 text-white px-6 py-3 rounded-lg mb-12 hover:bg-blue-700 transition transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            aria-label="Start the personality survey"
          >
            Take The Survey
          </button>
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

export default Feedback;