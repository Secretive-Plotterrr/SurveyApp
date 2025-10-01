const express = require('express');
const router = express.Router();
const { signup, login, sendResetPassword, updatePassword, getCurrentUser, logout, getUserProfile } = require('./authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', sendResetPassword);
router.post('/update-password', updatePassword);
router.get('/user', getCurrentUser);
router.post('/logout', logout);
router.get('/profile', getUserProfile);

module.exports = router;