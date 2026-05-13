const express = require('express');
const { submitFeedback, getTeacherFeedback } = require('../controllers/feedbackController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/submit', auth, authorize('Student'), submitFeedback);
router.get('/teacher/:teacherId', auth, authorize('Teacher', 'Admin'), getTeacherFeedback);

module.exports = router;
