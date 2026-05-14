/**
 * Seeds Dolly (faculty), an Advanced Java OOP course,
 * using the uploaded Java OOP PDF material,
 * and a 30-question quiz plus 5 Java assignments.
 *
 * Run from repo root: node backend/scripts/seed_dolly_java.js
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const JAVA_QUIZ_30 = [
  { questionText: 'Which principle of OOP is used to hide the internal details of an object?', options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'], correctAnswer: 'Encapsulation' },
  { questionText: 'Which keyword is used to inherit a class in Java?', options: ['implements', 'extends', 'inherits', 'super'], correctAnswer: 'extends' },
  { questionText: 'What is the root class of the Java class hierarchy?', options: ['Object', 'Class', 'Main', 'System'], correctAnswer: 'Object' },
  { questionText: 'Which of these cannot be used for a variable name in Java?', options: ['identifier', 'keyword', 'method', 'none'], correctAnswer: 'keyword' },
  { questionText: 'Which keyword is used to define an interface?', options: ['class', 'interface', 'abstract', 'implements'], correctAnswer: 'interface' },
  { questionText: 'What is the size of a char in Java?', options: ['8-bit', '16-bit', '32-bit', '64-bit'], correctAnswer: '16-bit' },
  { questionText: 'Which method is called first when an object is created?', options: ['start()', 'main()', 'constructor', 'init()'], correctAnswer: 'constructor' },
  { questionText: 'Can an abstract class have a constructor?', options: ['Yes', 'No', 'Only if it has no abstract methods', 'Only if it is public'], correctAnswer: 'Yes' },
  { questionText: 'Which keyword is used to prevent method overriding?', options: ['static', 'final', 'private', 'sealed'], correctAnswer: 'final' },
  { questionText: 'What is method overloading?', options: ['Same name, same params', 'Same name, different params', 'Different name, same params', 'None'], correctAnswer: 'Same name, different params' },
  { questionText: 'What is polymorphism?', options: ['One form', 'Two forms', 'Many forms', 'No form'], correctAnswer: 'Many forms' },
  { questionText: 'Which collection does not allow duplicate elements?', options: ['List', 'Set', 'Map', 'Queue'], correctAnswer: 'Set' },
  { questionText: 'What is the default access modifier in Java?', options: ['public', 'private', 'protected', 'package-private'], correctAnswer: 'package-private' },
  { questionText: 'Which keyword is used to refer to the superclass constructor?', options: ['this', 'super', 'parent', 'base'], correctAnswer: 'super' },
  { questionText: 'Which of these is not an OOP concept?', options: ['Encapsulation', 'Compilation', 'Inheritance', 'Polymorphism'], correctAnswer: 'Compilation' },
  { questionText: 'What is the purpose of the "finally" block?', options: ['To catch exceptions', 'To execute code after try-catch', 'To throw exceptions', 'To define constants'], correctAnswer: 'To execute code after try-catch' },
  { questionText: 'Which class is used for reading from the console?', options: ['PrintStream', 'Scanner', 'InputStream', 'Reader'], correctAnswer: 'Scanner' },
  { questionText: 'What is the output of 10 + 20 + "Java"?', options: ['1020Java', '30Java', 'Java30', 'Error'], correctAnswer: '30Java' },
  { questionText: 'Which keyword is used to define a constant in Java?', options: ['const', 'static', 'final', 'immutable'], correctAnswer: 'final' },
  { questionText: 'Can an interface have instance variables?', options: ['Yes', 'No', 'Only if final', 'Only if static'], correctAnswer: 'No' },
  { questionText: 'What is a wrapper class?', options: ['A class that wraps an object', 'A class that wraps a primitive into an object', 'A class for file handling', 'None'], correctAnswer: 'A class that wraps a primitive into an object' },
  { questionText: 'Which keyword is used for memory deallocation in Java?', options: ['delete', 'free', 'None', 'remove'], correctAnswer: 'None' },
  { questionText: 'What is an anonymous inner class?', options: ['A class with no name', 'A class with no methods', 'A class with no variables', 'None'], correctAnswer: 'A class with no name' },
  { questionText: 'Which package is imported by default in every Java program?', options: ['java.util', 'java.io', 'java.lang', 'java.net'], correctAnswer: 'java.lang' },
  { questionText: 'What is the use of the "static" keyword?', options: ['To make a variable dynamic', 'To make a variable/method belong to the class', 'To prevent inheritance', 'None'], correctAnswer: 'To make a variable/method belong to the class' },
  { questionText: 'Which of these is used to define a block of code?', options: ['( )', '[ ]', '{ }', '< >'], correctAnswer: '{ }' },
  { questionText: 'What is the size of float in Java?', options: ['16-bit', '32-bit', '64-bit', '8-bit'], correctAnswer: '32-bit' },
  { questionText: 'Which keyword is used to throw an exception explicitly?', options: ['throws', 'throw', 'catch', 'try'], correctAnswer: 'throw' },
  { questionText: 'What is an abstract class?', options: ['A class that can be instantiated', 'A class that cannot be instantiated', 'A class with only static methods', 'None'], correctAnswer: 'A class that cannot be instantiated' },
  { questionText: 'What is the default value of a boolean?', options: ['true', 'false', 'null', '0'], correctAnswer: 'false' }
];

const JAVA_ASSIGNMENTS = [
  { title: 'Assignment 1: Abstract vs Interface', instructions: 'Explain the difference between Abstract Class and Interface with a code example.' },
  { title: 'Assignment 2: Multiple Inheritance', instructions: 'Implement a scenario of Multiple Inheritance using Interfaces in Java.' },
  { title: 'Assignment 3: Custom Exception', instructions: 'Create a custom Exception class in Java and demonstrate its usage with a try-catch block.' },
  { title: 'Assignment 4: Method Overriding', instructions: 'Write a program to demonstrate Method Overriding and how it differs from Overloading.' },
  { title: 'Assignment 5: "super" and "this"', instructions: 'Explain the "super" and "this" keywords with appropriate examples in a constructor hierarchy.' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    const oopPdfPath = '/uploads/1778665847138-Java OOPS Concepts .pdf';

    // 1. Create/Find Faculty Dolly
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
      console.log('Created Faculty: Dolly');
    }

    // 2. Create Course
    let course = await Course.findOne({ courseName: 'Advanced Java OOP', teacher: dolly._id });
    if (!course) {
      course = new Course({
        courseName: 'Advanced Java OOP',
        description: 'Advanced study of Java Object-Oriented Programming concepts based on uploaded notes.',
        teacher: dolly._id,
        department: 'CSE',
        year: '2nd Year',
        section: 'B'
      });
      await course.save();
      console.log('Created Course: Advanced Java OOP');
    }

    // 3. Add Material (Using the actual uploaded file)
    const material = await Material.findOne({ title: 'Java OOP Concepts Notes', course: course._id });
    if (!material) {
      await new Material({
        title: 'Java OOP Concepts Notes',
        type: 'PDF',
        course: course._id,
        fileUrl: oopPdfPath
      }).save();
      console.log('Added Material: Java OOP Concepts Notes');
    }

    // 4. Add 30-Question Quiz
    const quizTitle = 'Java OOP Mastery Quiz';
    let quiz = await Quiz.findOne({ title: quizTitle, course: course._id });
    if (!quiz) {
      await new Quiz({
        title: quizTitle,
        course: course._id,
        timeLimit: 45,
        questions: JAVA_QUIZ_30
      }).save();
      console.log('Added 30-Question Quiz');
    }

    // 5. Add 5 Assignments
    for (const data of JAVA_ASSIGNMENTS) {
      let assignment = await Assignment.findOne({ title: data.title, course: course._id });
      if (!assignment) {
        await new Assignment({
          title: data.title,
          instructions: data.instructions,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          course: course._id
        }).save();
        console.log(`Added Assignment: ${data.title}`);
      }
    }

    console.log('\nSeed successful! Login as Dolly: dolly.faculty@lms.com / Dolly@Password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
