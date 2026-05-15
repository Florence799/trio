const express = require('express');
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/announcementController');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, authorize('Admin'), createAnnouncement);
router.get('/', auth, getAnnouncements);
router.delete('/:id', auth, authorize('Admin'), deleteAnnouncement);

module.exports = router;
