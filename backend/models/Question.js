const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [String], // For MCQs
  answer: String,
  type: {
    type: String,
    enum: ['MCQ', 'True/False', 'Descriptive'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
