const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

const createQuiz = async (req, res) => {
  try {
    const { title, courseId, timeLimit, questions } = req.body;
    const quiz = new Quiz({
      title,
      course: courseId,
      timeLimit,
      questions
    });
    await quiz.save();
    res.status(201).send(quiz);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId }).select('-questions.correctAnswer');
    
    // If student, check which ones they've already completed
    if (req.user.role === 'Student') {
      const results = await QuizResult.find({ student: req.user.id, quiz: { $in: quizzes.map(q => q._id) } });
      const completedIds = results.map(r => r.quiz.toString());
      
      const quizzesWithStatus = quizzes.map(q => {
        const quizObj = q.toObject();
        quizObj.isCompleted = completedIds.includes(q._id.toString());
        if (quizObj.isCompleted) {
          quizObj.resultId = results.find(r => r.quiz.toString() === q._id.toString())._id;
        }
        return quizObj;
      });
      return res.send(quizzesWithStatus);
    }
    
    // If faculty/admin, get submission counts for each quiz
    if (req.user.role !== 'Student') {
      const quizzesWithCounts = await Promise.all(quizzes.map(async (q) => {
        const count = await QuizResult.countDocuments({ quiz: q._id });
        const quizObj = q.toObject();
        quizObj.submissionCount = count;
        return quizObj;
      }));
      return res.send(quizzesWithCounts);
    }
    
    res.send(quizzes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) return res.status(404).send({ error: 'Quiz not found' });

    let score = 0;
    const detailedAnswers = quiz.questions.map((q, index) => {
      const chosen = answers[index];
      const isCorrect = chosen === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionIndex: index,
        chosenAnswer: chosen,
        isCorrect
      };
    });

    const result = new QuizResult({
      quiz: quizId,
      student: req.user.id,
      score,
      totalQuestions: quiz.questions.length,
      answers: detailedAnswers
    });
    
    await result.save();
    res.send({ score, totalQuestions: quiz.questions.length, resultId: result._id, answers: detailedAnswers });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getQuizResult = async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.resultId)
      .populate({
        path: 'quiz',
        select: 'title questions'
      });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getSubmissionsByQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).send({ error: 'Quiz not found' });

    const submissions = await QuizResult.find({ quiz: req.params.quizId })
      .populate('student', 'name registeredNumber')
      .sort({ createdAt: -1 });

    res.send({ 
      quizTitle: quiz.title, 
      submissions 
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getStudentStats = async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.user.id }).populate('quiz', 'title');
    res.send(results);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getQuizDetails = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).send({ error: 'Quiz not found' });
    
    const quizData = quiz.toObject();
    if (req.user.role === 'Student') {
      quizData.questions.forEach(q => delete q.correctAnswer);
    }
    res.send(quizData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const saveStudentNotes = async (req, res) => {
  try {
    const { studentNotes } = req.body;
    const result = await QuizResult.findById(req.params.resultId);
    if (!result) return res.status(404).send({ error: 'Result not found' });
    
    // Only student who owns the result can save notes
    if (result.student.toString() !== req.user.id) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    result.studentNotes = studentNotes;
    await result.save();
    res.send({ message: 'Notes saved successfully', studentNotes });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const saveFacultyFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const result = await QuizResult.findById(req.params.resultId);
    if (!result) return res.status(404).send({ error: 'Result not found' });
    
    // Only faculty/admin can save feedback
    if (req.user.role === 'Student') {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    result.feedback = feedback;
    await result.save();
    res.send({ message: 'Feedback saved successfully', feedback });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const checkPlagiarism = async (req, res) => {
  try {
    const { quizId } = req.params;
    const submissions = await QuizResult.find({ quiz: quizId }).populate('student', 'name registeredNumber');
    
    if (submissions.length < 2) {
      return res.send({ message: 'Not enough submissions to check plagiarism', matches: [] });
    }

    const { checkSimilarity } = require('../utils/plagiarism');
    const matches = [];

    for (let i = 0; i < submissions.length; i++) {
      for (let j = i + 1; j < submissions.length; j++) {
        // For quiz, we can compare the answers array (if they are text-based or just same choices)
        // Usually plagiarism is for assignments, but for quizzes we can check if they have identical answers
        const s1 = submissions[i];
        const s2 = submissions[j];
        
        // Convert answers to a string for comparison
        const ans1 = s1.answers.map(a => a.chosenAnswer).join(' ');
        const ans2 = s2.answers.map(a => a.chosenAnswer).join(' ');
        
        const similarity = checkSimilarity(ans1, ans2);
        
        if (similarity > 80) { // Threshold 80%
          matches.push({
            student1: s1.student,
            student2: s2.student,
            similarity: similarity.toFixed(2),
            resultId1: s1._id,
            resultId2: s2._id
          });
        }
      }
    }

    res.send({ matches });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { 
  createQuiz, 
  getCourseQuizzes, 
  submitQuiz, 
  getQuizResult, 
  getStudentStats, 
  getQuizDetails, 
  getSubmissionsByQuiz,
  saveStudentNotes,
  saveFacultyFeedback,
  checkPlagiarism
};

