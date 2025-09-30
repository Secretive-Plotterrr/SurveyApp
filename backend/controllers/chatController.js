const { supabase } = require('../config/supabase');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const getLevel = (score) => {
  if (score > 32) return 'High';
  if (score >= 20) return 'Moderate High';
  return 'Low';
};

const generateResponse = async (req, res, next) => {
  try {
    const { message, selfEfficacyScore, goalOrientationScore } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      console.error('Token verification error:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.log('Received chat message:', { message, userId, selfEfficacyScore, goalOrientationScore });

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    if (typeof selfEfficacyScore !== 'number' || typeof goalOrientationScore !== 'number' || isNaN(selfEfficacyScore) || isNaN(goalOrientationScore)) {
      return res.status(400).json({ error: 'Scores must be valid numbers' });
    }

    const selfEfficacyLevel = getLevel(selfEfficacyScore);
    const goalOrientationLevel = getLevel(goalOrientationScore);

    const prompt = `You are a helpful assistant for the KnowYou Survey App. The user completed a self-efficacy survey (score: ${selfEfficacyScore}/40, level: ${selfEfficacyLevel}) and a goal orientation survey (score: ${goalOrientationScore}/40, level: ${goalOrientationLevel}). Respond to their question about their results in a supportive, encouraging, and insightful way, using the accurate levels and scores provided. Keep responses concise (under 150 words) and relevant to personality development, goal setting, or self-improvement. If the question is unrelated, gently steer back to survey themes.
User question: ${message}`;

    let text;
    try {
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
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }
      const data = await response.json();
      text = data.candidates[0]?.content?.parts[0]?.text || 'I didn’t understand that.';
      console.log('Gemini response:', text);
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
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError.message, supabaseError.stack);
      // Continue with response even if storage fails
    }

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Chat error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to generate response. Please try again.' });
  }
};

module.exports = { generateResponse };