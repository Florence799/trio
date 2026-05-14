/**
 * Seeds Dolly (faculty), a Core Java Interview Prep course,
 * using the uploaded Interview Questions PDF material,
 * and a 30-question quiz plus 2 assignments.
 *
 * Run from repo root: node backend/scripts/seed_dolly_interview.js
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

const JAVA_INTERVIEW_QUIZ = [
  { questionText: 'What is the difference between JDK and JRE?', options: ['JDK is for development, JRE is for running', 'JRE is for development, JDK is for running', 'They are the same', 'None'], correctAnswer: 'JDK is for development, JRE is for running' },
  { questionText: 'What is the use of the "volatile" keyword?', options: ['For thread safety', 'To prevent inheritance', 'To make a variable constant', 'None'], correctAnswer: 'For thread safety' },
  { questionText: 'What is a Marker Interface?', options: ['An interface with one method', 'An interface with no methods', 'An interface with static methods', 'None'], correctAnswer: 'An interface with no methods' },
  { questionText: 'What is the purpose of the "intern()" method in String?', options: ['To create a new string', 'To return a canonical representation from the pool', 'To find the length', 'None'], correctAnswer: 'To return a canonical representation from the pool' },
  { questionText: 'What is a memory leak in Java?', options: ['JVM crashing', 'Objects no longer used but still referenced', 'Garbage collector not working', 'None'], correctAnswer: 'Objects no longer used but still referenced' },
  { questionText: 'What is the difference between fail-fast and fail-safe iterators?', options: ['Fail-fast throws ConcurrentModificationException', 'Fail-safe throws Exception', 'They are the same', 'None'], correctAnswer: 'Fail-fast throws ConcurrentModificationException' },
  { questionText: 'What is the default capacity of an ArrayList?', options: ['5', '10', '15', '20'], correctAnswer: '10' },
  { questionText: 'What is the difference between HashMap and Hashtable?', options: ['HashMap is synchronized', 'Hashtable is synchronized', 'HashMap allows one null key', 'Both B and C'], correctAnswer: 'Both B and C' },
  { questionText: 'What is a functional interface?', options: ['An interface with multiple abstract methods', 'An interface with exactly one abstract method', 'An interface with no methods', 'None'], correctAnswer: 'An interface with exactly one abstract method' },
  { questionText: 'What is the purpose of the "Optional" class?', options: ['To handle null pointer exceptions', 'To make code faster', 'To define constants', 'None'], correctAnswer: 'To handle null pointer exceptions' },
  { questionText: 'What is the difference between sleep() and wait()?', options: ['sleep() releases lock', 'wait() releases lock', 'They are the same', 'None'], correctAnswer: 'wait() releases lock' },
  { questionText: 'What is a deadlock?', options: ['Two threads waiting for each other', 'A thread finishing execution', 'A crash', 'None'], correctAnswer: 'Two threads waiting for each other' },
  { questionText: 'What is the purpose of the "finalized" method?', options: ['To clean up resources before GC', 'To start a thread', 'To create a class', 'None'], correctAnswer: 'To clean up resources before GC' },
  { questionText: 'What is the difference between String, StringBuilder, and StringBuffer?', options: ['String is immutable', 'StringBuilder is not synchronized', 'StringBuffer is synchronized', 'All of the above'], correctAnswer: 'All of the above' },
  { questionText: 'What is a ClassLoader?', options: ['A part of JRE that loads classes', 'A tool for debugging', 'A compiler', 'None'], correctAnswer: 'A part of JRE that loads classes' },
  { questionText: 'What is the purpose of the "static" block?', options: ['To initialize static variables', 'To create objects', 'To handle exceptions', 'None'], correctAnswer: 'To initialize static variables' },
  { questionText: 'What is Method References in Java 8?', options: ['A way to call methods by name', 'A shorthand for lambda expressions', 'A way to override methods', 'None'], correctAnswer: 'A shorthand for lambda expressions' },
  { questionText: 'What is the "diamond problem" in inheritance?', options: ['Conflict from multiple inheritance', 'A performance issue', 'A security flaw', 'None'], correctAnswer: 'Conflict from multiple inheritance' },
  { questionText: 'What is an Abstract Class?', options: ['A class that cannot be inherited', 'A class that cannot be instantiated', 'A class with only static methods', 'None'], correctAnswer: 'A class that cannot be instantiated' },
  { questionText: 'What is the difference between throw and throws?', options: ['throw is used to throw an exception', 'throws is used to declare an exception', 'Both A and B', 'None'], correctAnswer: 'Both A and B' },
  { questionText: 'What is a Transient variable?', options: ['A variable that is not serialized', 'A variable that is constant', 'A variable for threads', 'None'], correctAnswer: 'A variable that is not serialized' },
  { questionText: 'What is the purpose of the "Externalizable" interface?', options: ['Manual serialization control', 'Automatic serialization', 'Encryption', 'None'], correctAnswer: 'Manual serialization control' },
  { questionText: 'What is a WeakReference?', options: ['A reference that does not prevent GC', 'A strong reference', 'A null reference', 'None'], correctAnswer: 'A reference that does not prevent GC' },
  { questionText: 'What is the difference between Checked and Unchecked exceptions?', options: ['Checked are checked at compile time', 'Unchecked are checked at runtime', 'Both A and B', 'None'], correctAnswer: 'Both A and B' },
  { questionText: 'What is a Singleton class?', options: ['A class with only one instance', 'A class with no methods', 'A class with static methods only', 'None'], correctAnswer: 'A class with only one instance' },
  { questionText: 'What is the purpose of the "Native" keyword?', options: ['To call C/C++ code', 'To define a constant', 'To handle threads', 'None'], correctAnswer: 'To call C/C++ code' },
  { questionText: 'What is Reflection API?', options: ['To inspect classes at runtime', 'To compile code', 'To run threads', 'None'], correctAnswer: 'To inspect classes at runtime' },
  { questionText: 'What is the difference between yield() and join()?', options: ['yield() releases lock', 'join() waits for thread completion', 'They are the same', 'None'], correctAnswer: 'join() waits for thread completion' },
  { questionText: 'What is a Shutdown Hook?', options: ['A thread that runs before JVM exits', 'A tool for debugging', 'A security feature', 'None'], correctAnswer: 'A thread that runs before JVM exits' },
  { questionText: 'What is the purpose of "Strictfp"?', options: ['To ensure portable floating-point results', 'To make code faster', 'To define constants', 'None'], correctAnswer: 'To ensure portable floating-point results' }
];

const INTERVIEW_ASSIGNMENTS = [
  { title: 'Assignment 1: Singleton Design Pattern', instructions: 'Implement a thread-safe Singleton class in Java using the double-checked locking principle.' },
  { title: 'Assignment 2: Java 8 Stream API', instructions: 'Write a program to filter a list of employees based on their salary (>50000) and collect their names into a list using Streams.' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    const interviewPdfPath = '/uploads/1778578174251-Core Java Interview Questions .pdf';

    // 1. Find Faculty Dolly
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
    let course = await Course.findOne({ courseName: 'Core Java Interview Prep', teacher: dolly._id });
    if (!course) {
      course = new Course({
        courseName: 'Core Java Interview Prep',
        description: 'Prepare for top-tier Java technical interviews with these curated questions and tasks.',
        teacher: dolly._id,
        department: 'CSE',
        year: '4th Year',
        section: 'A'
      });
      await course.save();
      console.log('Created Course: Core Java Interview Prep');
    }

    // 3. Add Material
    const material = await Material.findOne({ title: 'Core Java Interview PDF', course: course._id });
    if (!material) {
      await new Material({
        title: 'Core Java Interview PDF',
        type: 'PDF',
        course: course._id,
        fileUrl: interviewPdfPath
      }).save();
      console.log('Added Material: Core Java Interview PDF');
    }

    // 4. Add 30-Question Quiz
    const quizTitle = 'Core Java Interview Challenge';
    let quiz = await Quiz.findOne({ title: quizTitle, course: course._id });
    if (!quiz) {
      await new Quiz({
        title: quizTitle,
        course: course._id,
        timeLimit: 60,
        questions: JAVA_INTERVIEW_QUIZ
      }).save();
      console.log('Added 30-Question Interview Quiz');
    }

    // 5. Add 2 Assignments
    for (const data of INTERVIEW_ASSIGNMENTS) {
      let assignment = await Assignment.findOne({ title: data.title, course: course._id });
      if (!assignment) {
        await new Assignment({
          title: data.title,
          instructions: data.instructions,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          course: course._id
        }).save();
        console.log(`Added Assignment: ${data.title}`);
      }
    }

    console.log('\nSeed successful! Course "Core Java Interview Prep" added for Dolly.');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
