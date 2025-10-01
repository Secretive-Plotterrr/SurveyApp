const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the KnowYou Survey App Backend' });
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many chat requests, please try again later.',
});

app.use('/api/auth', authRoutes);
app.use('/api/auth/chat', chatLimiter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});