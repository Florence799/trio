const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  targetRole: {
    type: String,
    enum: ['Student', 'Faculty', 'All'],
    default: 'All',
  },
  category: {
    type: String, // e.g., 'FDP', 'Course', 'General'
    default: 'General',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
