const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  timeLimit: {
    type: Number, // in minutes
    required: true,
  },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
