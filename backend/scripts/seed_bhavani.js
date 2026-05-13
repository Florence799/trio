const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Feedback = require('../models/Feedback');
require('dotenv').config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to DB...');

    // 1. Create Faculty
    let faculty = await User.findOne({ email: 'bhavani22email.com' });
    if (!faculty) {
      faculty = new User({
        name: 'Prof. Bhavani',
        email: 'bhavani22email.com',
        password: 'password123', // Will be hashed by pre-save hook
        role: 'Teacher',
        registeredNumber: 'FAC_BHAVANI',
        department: 'CSE',
        mobile: '9876543210'
      });
      await faculty.save();
      console.log('Faculty created: bhavani22email.com');
    }

    // 2. Create Course
    let course = await Course.findOne({ teacher: faculty._id, courseName: 'Advanced Software Engineering' });
    if (!course) {
      course = new Course({
        courseName: 'Advanced Software Engineering',
        description: 'Learn modern software architecture, agile methodologies, and testing.',
        teacher: faculty._id,
        department: 'CSE',
        year: '3rd Year',
        section: 'A'
      });
      await course.save();
      console.log('Course created: Advanced Software Engineering');
    }

    // 3. Create Material
    const materialCount = await Material.countDocuments({ course: course._id });
    if (materialCount === 0) {
      const material = new Material({
        title: 'Lecture 1: Agile Methodologies',
        type: 'PDF',
        course: course._id,
        fileUrl: '/uploads/sample_lecture.pdf' // Mock file URL
      });
      await material.save();
      console.log('Sample Material added.');
    }

    // 4. Create Assignment
    const assignmentCount = await Assignment.countDocuments({ course: course._id });
    if (assignmentCount === 0) {
      const assignment = new Assignment({
        title: 'Project Proposal Submission',
        instructions: 'Submit your team project proposal covering architecture, stack, and timeline. PDF format only.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        course: course._id
      });
      await assignment.save();
      console.log('Sample Assignment added.');
    }

    // 5. Create Quiz
    const quizCount = await Quiz.countDocuments({ course: course._id });
    if (quizCount === 0) {
      const quiz = new Quiz({
        title: 'Mid-term Assessment: Software Design Patterns',
        course: course._id,
        timeLimit: 30,
        questions: [
          { questionText: 'Which pattern ensures a class only has one instance?', options: ['Singleton', 'Factory', 'Observer', 'Builder'], correctAnswer: 'Singleton' },
          { questionText: 'What does MVC stand for?', options: ['Model View Controller', 'More Visual Code', 'Multiple View Classes', 'Main View Component'], correctAnswer: 'Model View Controller' },
          { questionText: 'Which of these is a behavioral pattern?', options: ['Adapter', 'Observer', 'Singleton', 'Decorator'], correctAnswer: 'Observer' }
        ]
      });
      await quiz.save();
      console.log('Sample Quiz added.');
    }

    // 6. Create Student & Feedback
    let student1 = await User.findOne({ email: 'student1@test.com' });
    if (!student1) {
      student1 = new User({
        name: 'Test Student 1',
        email: 'student1@test.com',
        password: 'password123',
        role: 'Student',
        registeredNumber: 'STU001',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        mobile: '1111111111'
      });
      await student1.save();
    }

    let student2 = await User.findOne({ email: 'student2@test.com' });
    if (!student2) {
      student2 = new User({
        name: 'Test Student 2',
        email: 'student2@test.com',
        password: 'password123',
        role: 'Student',
        registeredNumber: 'STU002',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        mobile: '2222222222'
      });
      await student2.save();
    }

    const feedbackCount = await Feedback.countDocuments({ course: course._id });
    if (feedbackCount === 0) {
      const fb1 = new Feedback({
        student: student1._id,
        teacher: faculty._id,
        course: course._id,
        rating: 5,
        comment: 'Excellent course material and clear explanations. Highly recommended!',
        anonymous: false
      });
      await fb1.save();

      const fb2 = new Feedback({
        student: student2._id,
        teacher: faculty._id,
        course: course._id,
        rating: 4,
        comment: 'Good assignments, but the quizzes were a bit tough.',
        anonymous: true
      });
      await fb2.save();
      console.log('Sample Feedbacks added.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seedData();
