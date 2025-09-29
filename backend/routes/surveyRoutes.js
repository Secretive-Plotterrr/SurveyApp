const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submit', authMiddleware, surveyController.submitSurvey);
router.get('/results/:userId', authMiddleware, surveyController.getSurveyResults);

module.exports = router;