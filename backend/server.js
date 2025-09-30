// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the KnowYou Survey App Backend' });
});

// Rate limiting for /api/auth/chat
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many chat requests, please try again later.',
});

// Routes
app.use('/api/auth', authRoutes);

// Apply rate limiting to chat endpoint
app.use('/api/auth/chat', chatLimiter);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});