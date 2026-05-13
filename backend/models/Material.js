const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['PDF', 'Video', 'DOCX', 'PPT'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
