const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/authController'); // Adjust path as needed

router.post('/chat', generateResponse);

// Other routes (e.g., signup, login, etc.)
router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', sendResetPassword);
router.post('/update-password', updatePassword);
router.get('/current-user', getCurrentUser);
router.post('/logout', logout);
router.get('/profile', getUserProfile);

module.exports = router;