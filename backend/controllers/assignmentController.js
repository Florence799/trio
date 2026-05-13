const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const createAssignment = async (req, res) => {
  try {
    const { title, instructions, deadline, courseId } = req.body;
    const assignment = new Assignment({
      title,
      instructions,
      deadline,
      course: courseId,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    await assignment.save();
    res.status(201).send(assignment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.send(assignments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const submission = new Submission({
      assignment: assignmentId,
      student: req.user.id,
      fileUrl: `/uploads/${req.file.filename}`
    });
    await submission.save();
    res.status(201).send(submission);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { submissionId, marks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(submissionId, { marks, feedback }, { new: true });
    res.send(submission);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getSubmissionsForAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'name registeredNumber');
    res.send(submissions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { createAssignment, getCourseAssignments, submitAssignment, gradeSubmission, getSubmissionsForAssignment };
