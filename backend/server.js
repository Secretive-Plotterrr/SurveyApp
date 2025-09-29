const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-project.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Rate limiting for /auth/chat
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many chat requests, please try again later.',
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Routes
app.use('/auth', authRoutes);
app.use('/auth/chat', chatLimiter);

// Error handling middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});