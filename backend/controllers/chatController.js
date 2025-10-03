const { supabase } = require('../config/supabase');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'; // Updated to available model

const getLevel = (score) => {
  if (score > 32) return 'High';
  if (score >= 20) return 'Moderate High';
  return 'Low';
};

const generateResponse = async (req, res, next) => {
  try {
    const { message, selfEfficacyScore, goalOrientationScore } = req.body;
    const authHeader = req.headers.authorization;

    console.log('Chat request received:', { message, selfEfficacyScore, goalOrientationScore, authHeader });

    if (!authHeader) {
      console.error('No authorization header provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Token missing in authorization header');
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Use Supabase to verify the token (since frontend uses Supabase access_token)
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      console.error('Supabase token verification error:', error?.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    const userId = data.user.id;
    console.log('Token verified, userId:', userId);

    if (!message || message.trim().length === 0) {
      console.error('Empty message received');
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (typeof selfEfficacyScore !== 'number' || typeof goalOrientationScore !== 'number' || isNaN(selfEfficacyScore) || isNaN(goalOrientationScore)) {
      console.error('Invalid scores:', { selfEfficacyScore, goalOrientationScore });
      return res.status(400).json({ error: 'Scores must be valid numbers' });
    }

    const selfEfficacyLevel = getLevel(selfEfficacyScore);
    const goalOrientationLevel = getLevel(goalOrientationScore);

    // Check if this is the first message for the user
    const { count, error: countError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error checking message count:', countError.message);
      // Fallback to treating as first message to avoid blocking
      const isFirstMessage = true;
    } else {
      const isFirstMessage = count === 0 || count === null;
    }

    let prompt;
    if (isFirstMessage) {
      prompt = `You are a helpful assistant for the KnowYou Survey App. The user completed a self-efficacy survey (score: ${selfEfficacyScore}/40, level: ${selfEfficacyLevel}) and a goal orientation survey (score: ${goalOrientationScore}/40, level: ${goalOrientationLevel}). Respond to their question about their results in a supportive, encouraging, and insightful way, using the accurate levels and scores provided. Keep responses concise (under 150 words) and relevant to personality development, goal setting, or self-improvement. If the question is unrelated, gently steer back to survey themes.
User question: ${message}`;
    } else {
      prompt = `You are a helpful assistant for the KnowYou Survey App. The user has a self-efficacy score of ${selfEfficacyScore}/40 (${selfEfficacyLevel}) and goal orientation score of ${goalOrientationScore}/40 (${goalOrientationLevel}). Respond directly and accurately to their question in a supportive, encouraging, and insightful way. Keep responses concise (under 150 words) and focus on personality development, goal setting, or self-improvement. Reference scores only if relevant to the question.
User question: ${message}`;
    }

    let text;
    try {
      console.log('Calling Gemini API with key:', GEMINI_API_KEY ? 'Present' : 'Missing');
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API response error:', errorData);
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Gemini API raw response:', JSON.stringify(data, null, 2));
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I didn’t understand that.';
      console.log('Extracted Gemini response:', text);
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError.message, geminiError.stack);
      return res.status(500).json({ error: `Failed to generate response from AI service: ${geminiError.message}` });
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({ user_id: userId, message, response: text });
      if (error) {
        console.error('Supabase insert error:', error.message, error.details, error.hint);
      } else {
        console.log('Chat message saved to Supabase');
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError.message, supabaseError.stack);
    }

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Chat endpoint error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to generate response. Please try again.' });
  }
};

module.exports = { generateResponse };