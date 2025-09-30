const express = require('express');
const { signup, login, updatePassword, getCurrentUser, logout, getUserProfile, sendResetPassword } = require('../controllers/authController');
const { generateResponse } = require('../controllers/chatController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', sendResetPassword);
router.post('/update-password', updatePassword);
router.get('/user', getCurrentUser);
router.post('/logout', logout);
router.get('/profile', getUserProfile);
router.post('/chat', generateResponse);

module.exports = router;