import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Loading2 from './Loading2';

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

const staticTestimonials = [
  { id: 1, name: 'Juan Santos', rating: 4, feedback: 'Personal report. The report I got felt really personal and really insightful... pointing out some of my blind spots!' },
  { id: 2, name: 'Maria Cruz', rating: 5, feedback: 'Better than expected. I usually get bored halfway through tests, but the way this one kept me engaged, and the report was detailed.' },
  { id: 3, name: 'Angelo Reyes', rating: 4, feedback: 'Using it for dating. It’s long, but I’m using it a lot for dating, trying to find people who are compatible with me. So far, it is really helping out with that.' },
  { id: 4, name: 'Luz Garcia', rating: 5, feedback: 'Read me an open book and much more. Amazing! I have a psychology paper due where I had to write about my personality (as well as the challenges I face), and this test was great! Highly recommend!' },
  { id: 5, name: 'Miguel Lopez', rating: 4, feedback: 'A very in-depth look at your personality. A very in-depth look at your personality which reports on every aspect. I’m very impressed and hope it will help me in my future job searches.' },
  { id: 6, name: 'Sofia Ramos', rating: 5, feedback: 'This test gives me idea about myself. Really impressed with the reports on every aspect. I hope it will help me in my future job searches.' },
];

const Feedback = () => {
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState(staticTestimonials);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  // Stats
  const [totalFeedbacks, setTotalFeedbacks] = useState(100);

  const navigate = useNavigate();

  // Load user & check if already submitted
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('table1')
          .select('feedback, rating')
          .eq('id', user.id)
          .single();

        if (data?.feedback) {
          setHasSubmitted(true);
          setComment(data.feedback);
          setRating(data.rating || 5);
          setUserDisplayName(user.user_metadata?.full_name || user.email.split('@')[0]);
        } else {
          setName(user.user_metadata?.full_name || user.email.split('@')[0]);
        }
      }

      loadAllFeedbacks();
      setIsVisible(true);
    };

    init();
  }, []);

  // Load all feedbacks + update total count
  const loadAllFeedbacks = async () => {
    setIsLoading(true);
    const { data, count } = await supabase
      .from('table1')
      .select('email, feedback, rating', { count: 'exact' })
      .not('feedback', 'is', null)
      .order('answered_at', { ascending: false, nullsLast: true });

    const realFeedbacks = (data || []).map((row, i) => ({
      id: `real-${i}`,
      name: row.email?.split('@')[0].charAt(0).toUpperCase() + row.email?.split('@')[0].slice(1),
      rating: row.rating || 5,
      feedback: row.feedback,
    }));

    setFeedbacks([...staticTestimonials, ...realFeedbacks]);
    setTotalFeedbacks((count || 0) + staticTestimonials.length);
    setIsLoading(false);
  };

  // Submit feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);

    const { error } = await supabase
      .from('table1')
      .update({
        feedback: comment.trim(),
        rating: rating,
      })
      .eq('id', user.id);

    if (error) {
      alert('Failed to submit. Please try again.');
      console.error(error);
    } else {
      setHasSubmitted(true);
      setUserDisplayName(name.trim());
      loadAllFeedbacks(); // This will update total count + add new feedback
    }
    setSubmitting(false);
  };

  const handleSurveyClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/survey1');
    }, 2000);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-16">
      {isLoading && <Loading2 />}

      <div className={`container mx-auto px-6 max-w-7xl text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-gray-900">Know</span>
          <span className="text-blue-600">You</span>
        </h1>
        <p className="text-xl text-gray-700 mb-12">Real people. Real results. Real insights.</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-5xl font-bold text-blue-600">95+</p>
            <p className="text-gray-600 mt-2">Active Today</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-5xl font-bold text-blue-600">{totalFeedbacks}+</p>
            <p className="text-gray-600 mt-2">Total Feedback</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-5xl font-bold text-blue-600">93.6%</p>
            <p className="text-gray-600 mt-2">Rated Accurate</p>
          </div>
        </div>

        {/* Submit Feedback */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-16 max-w-3xl mx-auto border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {hasSubmitted ? 'Thank You!' : 'Share Your Experience'}
          </h2>

          {hasSubmitted ? (
            <div className="text-center py-10">
              <div className="text-8xl mb-6">Thank you!</div>
              <div className="text-6xl text-yellow-400 mb-4">
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </div>
              <p className="text-2xl italic text-gray-700 mb-6 leading-relaxed">"{comment}"</p>
              <p className="text-lg font-medium text-blue-600">- {userDisplayName}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <input
                type="text"
                placeholder="Your Name (as shown publicly)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                required
              />
              <div className="flex justify-center gap-4 text-6xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-all duration-200 hover:scale-125 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Tell us what you really think..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition resize-none"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl py-5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Submit My Feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Testimonials Grid */}
        <h2 className="text-4xl font-bold text-gray-800 mb-10">What People Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {feedbacks.slice(0, visibleCount).map((t) => (
            <div
              key={t.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold text-gray-800">{t.name}</p>
                  <div className="flex text-yellow-400 text-xl">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"{t.feedback}"</p>
            </div>
          ))}
        </div>

        {/* See More */}
        {visibleCount < feedbacks.length && (
          <button
            onClick={() => setVisibleCount(feedbacks.length)}
            className="bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
          >
            See All {feedbacks.length} Feedbacks
          </button>
        )}

        {/* Take Survey Button */}
        <div className="mt-20">
          <button
            onClick={handleSurveyClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-16 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition duration-300"
          >
            Take The Personality Survey Now
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">Login Required</h3>
            <p className="text-gray-700 mb-8 text-lg">You need to be logged in to take the survey or leave feedback.</p>
            <div className="flex gap-4">
              <button onClick={handleLoginRedirect} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700">
                Go to Login
              </button>
              <button onClick={() => setShowLoginModal(false)} className="flex-1 bg-gray-200 py-4 rounded-xl font-bold hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;