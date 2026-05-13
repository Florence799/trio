const express = require('express');
const { createQuiz, getCourseQuizzes, submitQuiz, getQuizDetails, getQuizResult, getStudentStats, getSubmissionsByQuiz } = require('../controllers/quizController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, authorize('Teacher', 'Admin'), createQuiz);
router.get('/course/:courseId', auth, getCourseQuizzes);
router.get('/stats', auth, getStudentStats);
router.get('/result/:resultId', auth, getQuizResult);
router.get('/submissions/:quizId', auth, authorize('Teacher', 'Admin'), getSubmissionsByQuiz);
router.get('/:quizId', auth, getQuizDetails);
router.post('/submit', auth, authorize('Student'), submitQuiz);

module.exports = router;
