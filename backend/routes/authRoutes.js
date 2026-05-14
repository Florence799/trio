const express = require('express');
const { register, login, getUserStats, updateStudentYear } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/stats', auth, getUserStats);
router.patch('/students/:userId/year', auth, authorize('Faculty', 'Teacher', 'Admin'), updateStudentYear);

module.exports = router;
