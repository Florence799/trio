const express = require('express');
const multer = require('multer');
const {
  createCourse,
  getCourses,
  uploadMaterial,
  getCourseMaterials,
  deleteMaterial,
  getCourseById,
  getRegisteredStudentsByCourse,
} = require('../controllers/courseController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

function materialFileUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send({ error: 'File is too large (max 50 MB).' });
      }
      return res.status(400).send({ error: err.message || 'File upload failed.' });
    }
    next();
  });
}

// Course routes
router.post('/', auth, authorize('Faculty', 'Teacher', 'Admin'), createCourse);
router.get('/', auth, getCourses);
router.get('/:id/students', auth, authorize('Faculty', 'Teacher', 'Admin'), getRegisteredStudentsByCourse);

// Material routes (static paths before `/:id`)
router.post('/material', auth, authorize('Faculty', 'Teacher', 'Admin'), materialFileUpload, uploadMaterial);
router.delete('/materials/:materialId', auth, authorize('Faculty', 'Teacher', 'Admin'), deleteMaterial);
router.get('/:courseId/materials', auth, getCourseMaterials);
router.get('/:id', auth, getCourseById);

module.exports = router;
