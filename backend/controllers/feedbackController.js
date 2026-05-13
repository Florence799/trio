const Feedback = require('../models/Feedback');
const Course = require('../models/Course');

exports.submitFeedback = async (req, res) => {
  try {
    const { teacherId, courseId, rating, comment, anonymous } = req.body;
    const studentId = req.user.id;

    const feedback = new Feedback({
      student: studentId,
      teacher: teacherId,
      course: courseId,
      rating,
      comment,
      anonymous,
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
};

exports.getTeacherFeedback = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const feedbacks = await Feedback.find({ teacher: teacherId })
      .populate('student', 'name email')
      .populate('course', 'courseName');

    // Hide student info if anonymous
    const sanitizedFeedbacks = feedbacks.map(f => {
      if (f.anonymous) {
        return { ...f._doc, student: { name: 'Anonymous' } };
      }
      return f;
    });

    res.status(200).json(sanitizedFeedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};
