const express = require('express');
const { register, login, getUserStats } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/stats', require('../middleware/auth').auth, getUserStats);

module.exports = router;
