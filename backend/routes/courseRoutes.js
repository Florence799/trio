const express = require('express');
const { createCourse, getCourses, uploadMaterial, getCourseMaterials, getCourseById } = require('../controllers/courseController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Course routes
router.post('/', auth, authorize('Teacher', 'Admin'), createCourse);
router.get('/', auth, getCourses);

// Material routes
router.post('/material', auth, authorize('Teacher', 'Admin'), upload.single('file'), uploadMaterial);
router.get('/:courseId/materials', auth, getCourseMaterials);
router.get('/:id', auth, getCourseById);

module.exports = router;
