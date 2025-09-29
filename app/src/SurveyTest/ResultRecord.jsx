import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Footer from '../components/Footer'; // Updated import path

const supabase = createClient(
  'https://njodostonkvbovcgrayz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb2Rvc3Rvbmt2Ym92Y2dyYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTc1MjcsImV4cCI6MjA3NDM3MzUyN30.3PAIczMstQ0UjtN260KMV5-VG56EtO9Cc5gkyIN2tTA'
);

// Function to get verbal interpretation based on mean
const getVerbal = (mean) => {
  if (mean >= 3.26) return 'High';
  if (mean >= 2.51) return 'Moderate High';
  if (mean >= 1.76) return 'Moderate Low';
  return 'Low';
};

const ResultRecord = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Track selected file

  // Define questions for Self-Efficacy and Goal Orientation
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

  // Fetch results from Supabase
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('No authenticated user found. Please log in.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('survey_results')
        .select('id, survey_result, answered_at')
        .eq('user_id', user.id)
        .order('answered_at', { ascending: false });

      if (error) {
        setError('Error fetching results: ' + error.message);
        setLoading(false);
        return;
      }

      setResults(data.filter(item => item.survey_result)); // Filter out null or empty results
      setLoading(false);
    };

    fetchResults();
  }, []);

  // Handle Done button click with scroll-to-top on next page
  const handleDone = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle file click to show only the selected result
  const handleFileClick = (index) => {
    setSelectedFile(index);
    setTimeout(() => {
      document.getElementById(`result-${index}`)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get interpretation color
  const getInterpretationColor = (interpretation) => {
    if (interpretation === 'High') return 'text-green-600';
    if (interpretation === 'Moderate High') return 'text-yellow-600';
    if (interpretation === 'Moderate Low') return 'text-orange-600';
    if (interpretation === 'Low') return 'text-red-600';
    return 'text-gray-600';
  };

  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F0F8FF] to-blue-100">
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-700 font-semibold">Loading...</div>
        </div>
      ) : error || (selectedFile === null && results.length === 0) ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <img
              src="/image/Rec.png"
              alt="No Record"
              className="mx-auto mb-4 w-48 h-48 object-contain"
            />
            <p className="text-gray-600 font-semibold text-lg">No Record</p>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full max-w-4xl mx-auto transform transition-all duration-300 ease-in-out animate-fade-in">
            <h2 className={`text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-6 sm:mb-8 ${selectedFile !== null ? 'opacity-0' : 'opacity-100'}`}>
              Your Survey <span className="text-blue-400">Results History</span>
            </h2>
            {selectedFile === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {results.map((record, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
                    onClick={() => handleFileClick(index)}
                    role="button"
                    aria-label={`View survey results from ${new Date(record.answered_at).toLocaleDateString()}`}
                  >
                    <div className="flex items-center space-x-4">
                      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-gray-900 font-semibold text-lg">
                          Survey Result {new Date(record.answered_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(record.answered_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                const record = results[selectedFile];
                const { survey_result } = record;
                const { selfEfficacy, goalOrientation } = survey_result || {};

                if (!selfEfficacy || !goalOrientation) {
                  return <div className="text-center text-gray-600 font-medium">Invalid survey data.</div>;
                }

                const selfEfficacyData = selfEfficacyQuestions.map(q => {
                  const questionData = selfEfficacy.questions.find(item => item.question === q.text) || {};
                  return {
                    question: q.text,
                    mean: questionData.mean || 0,
                    interpretation: questionData.interpretation || getVerbal(questionData.mean || 0),
                  };
                });

                const goalOrientationData = goalOrientationQuestions.map(q => {
                  const questionData = goalOrientation.questions.find(item => item.question === q.text) || {};
                  return {
                    question: q.text,
                    mean: questionData.mean || 0,
                    interpretation: questionData.interpretation || getVerbal(questionData.mean || 0),
                  };
                });

                return (
                  <div id={`result-${selectedFile}`} className="mb-12">
                    {/* Self-Efficacy Section */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-6 sm:mb-8 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]" aria-labelledby={`self-efficacy-heading-${selectedFile}`}>
                      <h4 id={`self-efficacy-heading-${selectedFile}`} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Self-Efficacy Results</h4>
                      <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left text-gray-600 font-medium border-collapse">
                          <thead>
                            <tr className="bg-blue-50 text-blue-800">
                              <th className="p-4 text-sm font-semibold border-b border-blue-100">Indicator</th>
                              <th className="p-4 text-sm font-semibold border-b border-blue-100">Score</th>
                              <th className="p-4 text-sm font-semibold border-b border-blue-100">Verbal Interpretation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selfEfficacyData.map((item, idx) => (
                              <tr key={idx} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="p-4 text-sm border-b border-gray-100">{item.question}</td>
                                <td className="p-4 text-sm border-b border-gray-100">{item.mean}</td>
                                <td className={`p-4 text-sm font-semibold border-b border-gray-100 ${getInterpretationColor(item.interpretation)}`}>{item.interpretation}</td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50 font-semibold">
                              <td className="p-4 text-sm">Grand Mean</td>
                              <td className="p-4 text-sm">{selfEfficacy.grandMean}</td>
                              <td className={`p-4 text-sm ${getInterpretationColor(selfEfficacy.grandVerbal)}`}>{selfEfficacy.grandVerbal}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Progress Bar for Grand Mean */}
                      <div className="mb-6">
                        <p className="text-gray-700 font-medium mb-2">Overall Self-Efficacy Level:</p>
                        <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-400 h-3 transition-all duration-500"
                            style={{ width: `${(parseFloat(selfEfficacy.grandMean) / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      {/* Interpretation and Suggestions */}
                      <div>
                        <p className={`text-lg font-semibold mb-2 ${getInterpretationColor(selfEfficacy.grandVerbal)}`}>Interpretation: {selfEfficacy.interpretation}</p>
                        <h5 className="text-md font-semibold text-gray-800 mb-2">Suggestions for Improvement:</h5>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          {selfEfficacy.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
                    {/* Goal Orientation Section */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-6 sm:mb-8 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]" aria-labelledby={`goal-orientation-heading-${selectedFile}`}>
                      <h4 id={`goal-orientation-heading-${selectedFile}`} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Mastery Goal Orientation Results</h4>
                      <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left text-gray-600 font-medium border-collapse">
                          <thead>
                            <tr className="bg-blue-50 text-blue-800">
                              <th className="p-4 text-sm font-semibold border-b border-blue-100">Indicator</th>
                              <th className="p-4 text-sm font-semibold border-b border-blue-100">Score</th>
                              <th className="p-4 text-sm font-semibold border-b border-blue-100">Verbal Interpretation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {goalOrientationData.map((item, idx) => (
                              <tr key={idx} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="p-4 text-sm border-b border-gray-100">{item.question}</td>
                                <td className="p-4 text-sm border-b border-gray-100">{item.mean}</td>
                                <td className={`p-4 text-sm font-semibold border-b border-gray-100 ${getInterpretationColor(item.interpretation)}`}>{item.interpretation}</td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50 font-semibold">
                              <td className="p-4 text-sm">Grand Mean</td>
                              <td className="p-4 text-sm">{goalOrientation.grandMean}</td>
                              <td className={`p-4 text-sm ${getInterpretationColor(goalOrientation.grandVerbal)}`}>{goalOrientation.grandVerbal}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Progress Bar for Grand Mean */}
                      <div className="mb-6">
                        <p className="text-gray-700 font-medium mb-2">Overall Goal Orientation Level:</p>
                        <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-400 h-3 transition-all duration-500"
                            style={{ width: `${(parseFloat(goalOrientation.grandMean) / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      {/* Interpretation and Suggestions */}
                      <div>
                        <p className={`text-lg font-semibold mb-2 ${getInterpretationColor(goalOrientation.grandVerbal)}`}>Interpretation: {goalOrientation.interpretation}</p>
                        <h5 className="text-md font-semibold text-gray-800 mb-2">Suggestions for Improvement:</h5>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          {goalOrientation.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handleBackToList}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold transform hover:scale-105 shadow-sm"
                        aria-label="Back to results list"
                      >
                        Back to List
                      </button>
                      <button
                        onClick={handleDone}
                        className="bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-500 hover:shadow-md transition-all duration-300 font-semibold transform hover:scale-105 shadow-sm"
                        aria-label="Return to the home page"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
            {selectedFile === null && (
              <div className="flex justify-center">
                <button
                  onClick={handleDone}
                  className="bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-500 hover:shadow-md transition-all duration-300 font-semibold transform hover:scale-105 shadow-sm"
                  aria-label="Return to the home page"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ResultRecord;