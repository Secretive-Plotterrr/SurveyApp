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
  const [feedbacks, setFeedbacks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [stats, setStats] = useState({ today: 0, total: 0, accuracy: 0 });

  const navigate = useNavigate();

  // Check auth + load user feedback
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('table1')
          .select('feedback, rating')
          .eq('id', user.id)
          .single();

        if (data?.feedback || data?.rating) {
          setHasSubmitted(true);
          setName(user.user_metadata?.full_name || user.email.split('@')[0]);
          setRating(data.rating || 5);
          setComment(data.feedback || '');
        }
      }
    };

    checkUser();
    setIsVisible(true);
    loadAllFeedbacks();
  }, []);

  // Load all public feedbacks
  const loadAllFeedbacks = async () => {
    setIsLoading(true);
    const { data, count } = await supabase
      .from('table1')
      .select('email, feedback, rating', { count: 'exact' })
      .not('feedback', 'is', null)
      .order('answered_at', { ascending: false });

    const formatted = (data || []).map((row, i) => ({
      id: i + 100,
      name: row.email?.split('@')[0].charAt(0).toUpperCase() + row.email?.split('@')[0].slice(1) || 'User',
      rating: row.rating || 5,
      feedback: row.feedback || '',
    }));

    setFeedbacks([...staticTestimonials, ...formatted]);
    setStats(prev => ({ ...prev, total: count || 100 }));
    setIsLoading(false);
  };

  // Counter animation
  useEffect(() => {
    const animate = (setter, target, duration) => {
      let start = 0;
      const step = () => {
        start += target / (duration / 16);
        if (start < target) {
          setter(Math.floor(start));
          requestAnimationFrame(step);
        } else setter(target);
      };
      requestAnimationFrame(step);
    };

    animate(v => setStats(s => ({ ...s, today: v })), 95, 2000);
    animate(v => setStats(s => ({ ...s, total: v })), feedbacks.length || 106, 2500);
    animate(v => setStats(s => ({ ...s, accuracy: v })), 93.6, 2000);
  }, [feedbacks.length]);

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
      alert('Error saving feedback. Try again.');
      console.error(error);
    } else {
      setHasSubmitted(true);
      loadAllFeedbacks();
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-50 pt-20 transition-opacity duration-700"
      style={{ opacity: isVisible ? 1 : 0 }}>
      {isLoading && <Loading2 />}

      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h1 className="text-4xl font-bold mb-6">
          <span className="text-black">Know</span>
          <span className="text-blue-500">You</span>
        </h1>
        <p className="text-xl font-semibold mb-8 text-gray-700">See what others say about us!</p>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-blue-800">{stats.today}+</p>
            <p className="text-sm text-gray-600">Active Users Today</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-blue-800">{stats.total}+</p>
            <p className="text-sm text-gray-600">Total Feedback</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-blue-800">{stats.accuracy.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Rated Accurate</p>
          </div>
        </div>

        {/* Submit Feedback Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">
            {hasSubmitted ? 'Thank You!' : 'Leave Your Feedback'}
          </h2>

          {hasSubmitted ? (
            <div className="text-center py-8">
              <p className="text-6xl mb-4">Thank you!</p>
              <p className="text-xl text-green-600 font-bold">{rating} stars</p>
              <p className="text-lg italic text-gray-700 mt-4">"{comment}"</p>
              <p className="text-sm text-gray-500 mt-4">- {name}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <input
                type="text"
                placeholder="Your Name (as displayed)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <div className="flex justify-center gap-4 text-5xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}
                    className={`transition-all ${star <= rating ? 'text-yellow-400 scale-125' : 'text-gray-300 hover:text-yellow-400'}`}>
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={submitting || !user}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : user ? 'Submit Feedback' : 'Login to Submit'}
              </button>
            </form>
          )}
        </div>

        {/* All Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {feedbacks.slice(0, visibleCount).map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-lg shadow-md hover:scale-105 transition-all">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < t.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">"{t.feedback}"</p>
            </div>
          ))}
        </div>

        {feedbacks.length > 6 && visibleCount < feedbacks.length && (
          <button
            onClick={() => setVisibleCount(feedbacks.length)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 mb-12"
          >
            See All Feedback ({feedbacks.length})
          </button>
        )}

        <button
          onClick={handleSurveyClick}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-10 py-5 rounded-full text-xl font-bold hover:scale-105 shadow-xl"
        >
          Take The Personality Survey Now
        </button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Login Required</h3>
            <p className="text-gray-700 mb-6">Please log in to continue.</p>
            <div className="flex gap-4">
              <button onClick={handleLoginRedirect} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                Go to Login
              </button>
              <button onClick={() => setShowLoginModal(false)} className="bg-gray-200 px-6 py-3 rounded-lg">
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