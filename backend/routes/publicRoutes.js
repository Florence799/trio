const express = require('express');
const { getMaterialStats } = require('../controllers/publicController');

const router = express.Router();

router.get('/material-stats', getMaterialStats);

module.exports = router;
