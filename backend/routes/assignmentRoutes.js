const express = require('express');
const { createAssignment, getCourseAssignments, submitAssignment, gradeSubmission, getSubmissionsForAssignment, getAllAssignmentsAdmin } = require('../controllers/assignmentController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', auth, authorize('Faculty', 'Teacher', 'Admin'), upload.single('file'), createAssignment);
router.get('/course/:courseId', auth, getCourseAssignments);
router.get('/admin/all', auth, authorize('Admin'), getAllAssignmentsAdmin);
router.post('/submit', auth, authorize('Student'), upload.single('file'), submitAssignment);
router.post('/grade', auth, authorize('Faculty', 'Teacher', 'Admin'), gradeSubmission);
router.get('/submissions/:assignmentId', auth, authorize('Faculty', 'Teacher', 'Admin'), getSubmissionsForAssignment);

module.exports = router;
