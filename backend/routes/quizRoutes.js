const express = require('express');
const { 
  createQuiz, 
  getCourseQuizzes, 
  submitQuiz, 
  getQuizDetails, 
  getQuizResult, 
  getStudentStats, 
  getSubmissionsByQuiz,
  saveStudentNotes,
  saveFacultyFeedback,
  checkPlagiarism
} = require('../controllers/quizController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, authorize('Faculty', 'Teacher', 'Admin'), createQuiz);
router.get('/course/:courseId', auth, getCourseQuizzes);
router.get('/stats', auth, getStudentStats);
router.get('/result/:resultId', auth, getQuizResult);
router.get('/submissions/:quizId', auth, authorize('Faculty', 'Teacher', 'Admin'), getSubmissionsByQuiz);
router.get('/plagiarism/:quizId', auth, authorize('Faculty', 'Teacher', 'Admin'), checkPlagiarism);
router.post('/result/:resultId/notes', auth, authorize('Student'), saveStudentNotes);
router.post('/result/:resultId/feedback', auth, authorize('Faculty', 'Teacher', 'Admin'), saveFacultyFeedback);
router.get('/:quizId', auth, getQuizDetails);
router.post('/submit', auth, authorize('Student'), submitQuiz);

module.exports = router;
