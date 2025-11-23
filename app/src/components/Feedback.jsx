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
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Form
  const [displayName, setDisplayName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userSubmittedName, setUserSubmittedName] = useState('');

  // Stats
  const [totalFeedbacks, setTotalFeedbacks] = useState(106);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('table1')
          .select('feedback, rating, display_name')
          .eq('id', user.id)
          .single();

        if (data?.feedback) {
          setHasSubmitted(true);
          setComment(data.feedback || '');
          setRating(data.rating || 5);
          setUserSubmittedName(data.display_name || 'You');
          setDisplayName(data.display_name || '');
        } else {
          setDisplayName(user.user_metadata?.full_name || user.email.split('@')[0]);
        }
      }

      loadAllFeedbacks();
    };
    init();
  }, []);

  const loadAllFeedbacks = async () => {
    setIsLoading(true);
    const { data, count } = await supabase
      .from('table1')
      .select('display_name, feedback, rating', { count: 'exact' })
      .not('feedback', 'is', null)
      .order('answered_at', { ascending: false });

    const realFeedbacks = (data || []).map((row, i) => ({
      id: `real-${i}`,
      name: row.display_name || 'Anonymous',
      rating: row.rating || 5,
      feedback: row.feedback || '',
    }));

    setFeedbacks([...staticTestimonials, ...realFeedbacks]);
    setTotalFeedbacks((count || 0) + staticTestimonials.length);
    setIsLoading(false);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!displayName.trim() || !comment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('table1')
      .update({
        feedback: comment.trim(),
        rating: rating,
        display_name: displayName.trim(),
      })
      .eq('id', user.id);

    if (error) {
      alert('Failed to submit. Try again.');
      console.error(error);
    } else {
      setHasSubmitted(true);
      setUserSubmittedName(displayName.trim());
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

  const visibleFeedbacks = showAll ? feedbacks : feedbacks.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24 pb-32 px-6">
      {isLoading && <Loading2 />}

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">KnowYou</h1>
          <p className="text-xl text-gray-600">Real insights from real people</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-sky-100/70 backdrop-blur-sm rounded-3xl p-10 text-center border border-sky-200">
            <p className="text-5xl font-bold text-sky-700">95+</p>
            <p className="text-lg text-sky-600 mt-2">Active Today</p>
          </div>
          <div className="bg-sky-100/70 backdrop-blur-sm rounded-3xl p-10 text-center border border-sky-200">
            <p className="text-5xl font-bold text-sky-700">{totalFeedbacks}+</p>
            <p className="text-lg text-sky-600 mt-2">Total Feedback</p>
          </div>
          <div className="bg-sky-100/70 backdrop-blur-sm rounded-3xl p-10 text-center border border-sky-200">
            <p className="text-5xl font-bold text-sky-700">93.6%</p>
            <p className="text-lg text-sky-600 mt-2">Rated Accurate</p>
          </div>
        </div>

        {/* Submit Feedback */}
        <div className="bg-white rounded-3xl shadow-lg p-12 mb-20 border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            {hasSubmitted ? 'Thank You!' : 'Share Your Experience'}
          </h2>

          {hasSubmitted ? (
            <div className="text-center py-10">
              <p className="text-7xl font-bold text-sky-600 mb-6">Thank you!</p>
              <div className="text-6xl mb-6">
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </div>
              <p className="text-2xl italic text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">"{comment}"</p>
              <p className="text-xl font-medium text-sky-700">- {userSubmittedName}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-8 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Your name (as shown publicly)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-8 py-5 text-lg border border-gray-300 rounded-2xl focus:border-sky-500 focus:outline-none transition"
                required
              />
              <div className="flex justify-center gap-6 text-6xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-all hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="What did you think of your results?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="w-full px-8 py-5 text-lg border border-gray-300 rounded-2xl focus:border-sky-500 focus:outline-none resize-none"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-600 text-white font-bold text-xl py-5 rounded-2xl hover:bg-sky-700 transition disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Testimonials */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What People Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {visibleFeedbacks.map((t) => (
            <div key={t.id} className="bg-sky-50/80 backdrop-blur-sm rounded-3xl p-10 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-sky-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold text-xl text-gray-800">{t.name}</p>
                  <div className="flex text-2xl text-yellow-400">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg italic leading-relaxed">"{t.feedback}"</p>
            </div>
          ))}
        </div>

        {/* Toggle Button */}
        {feedbacks.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-sky-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-sky-700 transition"
            >
              {showAll ? 'Hide Feedback' : `Show All ${feedbacks.length} Feedbacks`}
            </button>
          </div>
        )}

        {/* Take Survey Button */}
        <div className="text-center mt-24">
          <button
            onClick={handleSurveyClick}
            className="bg-sky-600 text-white px-16 py-6 rounded-full text-2xl font-bold hover:bg-sky-700 transition shadow-xl hover:shadow-2xl"
          >
            Take The Survey
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
            <h3 className="text-3xl font-bold text-sky-600 mb-6">Login Required</h3>
            <p className="text-lg text-gray-700 mb-10">You need to be logged in to leave feedback or take the survey.</p>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  navigate('/login');
                }, 2000);
              }}
              className="bg-sky-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-sky-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;