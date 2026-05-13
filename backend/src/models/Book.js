const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  category: {
    type: String,
    enum: ['Programming', 'AI & ML', 'Mathematics', 'Physics', 'Chemistry', 'Research'],
  },
  pdfUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
