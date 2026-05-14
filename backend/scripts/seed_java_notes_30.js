/**
 * Seeds a "Java Notes Masterclass" course using the uploaded Java OOP PDF,
 * with a high-quality 30-question quiz.
 *
 * Run from repo root: node backend/scripts/seed_java_notes_30.js
 */
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const JAVA_NOTES_QUIZ = [
  { questionText: 'Which keyword is used to access the parent class constructor?', options: ['super()', 'this()', 'parent()', 'base()'], correctAnswer: 'super()' },
  { questionText: 'What is the default value of a char variable?', options: ['0', 'u0000', 'null', 'not defined'], correctAnswer: 'u0000' },
  { questionText: 'Which of these is a valid way to instantiate an array?', options: ['int a = new int[5]', 'int a[] = new int(5)', 'int a[] = new int[5]', 'int a = new int(5)'], correctAnswer: 'int a[] = new int[5]' },
  { questionText: 'What is the return type of the hashCode() method?', options: ['int', 'long', 'void', 'Object'], correctAnswer: 'int' },
  { questionText: 'Which method is used to stop a thread in Java?', options: ['stop()', 'terminate()', 'interrupt()', 'halt()'], correctAnswer: 'interrupt()' },
  { questionText: 'What is the difference between equals() and ==?', options: ['== compares references, equals() compares values', '== compares values, equals() compares references', 'They are the same', 'None'], correctAnswer: '== compares references, equals() compares values' },
  { questionText: 'Which of these is not a feature of Java?', options: ['Object-oriented', 'Use of pointers', 'Portable', 'Dynamic'], correctAnswer: 'Use of pointers' },
  { questionText: 'Which keyword is used to define a block of code that must run after try-catch?', options: ['final', 'finally', 'last', 'stop'], correctAnswer: 'finally' },
  { questionText: 'What is the purpose of the "volatile" keyword?', options: ['To make a variable immutable', 'To ensure thread safety for a variable', 'To define a constant', 'None'], correctAnswer: 'To ensure thread safety for a variable' },
  { questionText: 'Which interface is used to make a class serializable?', options: ['Serializable', 'Cloneable', 'Remote', 'Threadable'], correctAnswer: 'Serializable' },
  { questionText: 'What is the default capacity of a Vector?', options: ['5', '10', '15', '20'], correctAnswer: '10' },
  { questionText: 'Which class is used to wrap a primitive into an object?', options: ['Wrapper class', 'Box class', 'Envelope class', 'None'], correctAnswer: 'Wrapper class' },
  { questionText: 'What is the use of the "transient" keyword?', options: ['To prevent serialization of a variable', 'To make a variable global', 'To handle exceptions', 'None'], correctAnswer: 'To prevent serialization of a variable' },
  { questionText: 'Which of these is used to find the length of an array?', options: ['length()', 'size()', 'length', 'count'], correctAnswer: 'length' },
  { questionText: 'What is an inner class?', options: ['A class inside a method', 'A class inside another class', 'A class in a package', 'None'], correctAnswer: 'A class inside another class' },
  { questionText: 'Which keyword is used to inherit a class?', options: ['implements', 'extends', 'inherits', 'super'], correctAnswer: 'extends' },
  { questionText: 'What is the purpose of the JVM?', options: ['To compile code', 'To execute bytecode', 'To design UI', 'None'], correctAnswer: 'To execute bytecode' },
  { questionText: 'Which of these is a reserved keyword in Java?', options: ['null', 'true', 'false', 'all of these'], correctAnswer: 'all of these' },
  { questionText: 'What is method overriding?', options: ['Redefining a method in a subclass', 'Defining multiple methods with same name', 'Calling a method from parent', 'None'], correctAnswer: 'Redefining a method in a subclass' },
  { questionText: 'What is the default access modifier in an interface?', options: ['private', 'protected', 'public', 'package-private'], correctAnswer: 'public' },
  { questionText: 'Which class is the superclass of all classes?', options: ['Object', 'Class', 'Main', 'System'], correctAnswer: 'Object' },
  { questionText: 'What is the use of "strictfp"?', options: ['To ensure floating point precision', 'To make code faster', 'To define constants', 'None'], correctAnswer: 'To ensure floating point precision' },
  { questionText: 'Can a constructor be static?', options: ['Yes', 'No', 'Only if it is private', 'None'], correctAnswer: 'No' },
  { questionText: 'Which of these is used for exception handling?', options: ['try', 'catch', 'throw', 'all of these'], correctAnswer: 'all of these' },
  { questionText: 'What is an abstract method?', options: ['A method with no body', 'A method with static keyword', 'A method with private keyword', 'None'], correctAnswer: 'A method with no body' },
  { questionText: 'What is encapsulation?', options: ['Data hiding', 'Inheritance', 'Polymorphism', 'None'], correctAnswer: 'Data hiding' },
  { questionText: 'Which keyword is used to refer to the current object?', options: ['this', 'super', 'self', 'current'], correctAnswer: 'this' },
  { questionText: 'What is the size of int in Java?', options: ['16-bit', '32-bit', '64-bit', 'None'], correctAnswer: '32-bit' },
  { questionText: 'Which collection allows null elements?', options: ['ArrayList', 'HashSet', 'Both', 'None'], correctAnswer: 'Both' },
  { questionText: 'What is a lambda expression?', options: ['A short way to write anonymous methods', 'A way to define constants', 'A type of exception', 'None'], correctAnswer: 'A short way to write anonymous methods' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    const javaNotesPdf = '/uploads/1778665847138-Java OOPS Concepts .pdf';

    // 1. Find/Create Faculty
    let dolly = await User.findOne({ email: 'dolly.faculty@lms.com' });
    if (!dolly) {
      dolly = new User({
        name: 'Dolly',
        email: 'dolly.faculty@lms.com',
        password: 'Dolly@Password123',
        role: 'Faculty',
        registeredNumber: 'FAC_DOLLY',
        department: 'CSE',
        mobile: '9123456780'
      });
      await dolly.save();
    }

    // 2. Create Course
    const courseName = 'Java Notes Masterclass';
    let course = await Course.findOne({ courseName, teacher: dolly._id });
    if (!course) {
      course = new Course({
        courseName,
        description: 'Comprehensive study based on core Java notes.',
        teacher: dolly._id,
        department: 'CSE',
        year: '2nd Year',
        section: 'C'
      });
      await course.save();
      console.log(`Created Course: ${courseName}`);
    }

    // 3. Add Material
    const material = await Material.findOne({ title: 'Java Core Notes', course: course._id });
    if (!material) {
      await new Material({
        title: 'Java Core Notes',
        type: 'PDF',
        course: course._id,
        fileUrl: javaNotesPdf
      }).save();
      console.log('Added Material: Java Core Notes');
    }

    // 4. Add 30-Question Quiz
    const quizTitle = 'Java Notes Comprehensive Quiz';
    let quiz = await Quiz.findOne({ title: quizTitle, course: course._id });
    if (!quiz) {
      await new Quiz({
        title: quizTitle,
        course: course._id,
        timeLimit: 40,
        questions: JAVA_NOTES_QUIZ
      }).save();
      console.log('Added 30-Question Quiz');
    }

    console.log('\nSeed successful! Course "Java Notes Masterclass" is ready.');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
