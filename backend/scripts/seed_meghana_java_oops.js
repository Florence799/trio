/**
 * Seeds Meghana (faculty), a Java OOP course, the Java OOP Concepts PDF material,
 * and a quiz aligned with core OOP topics (classes, inheritance, polymorphism, etc.).
 *
 * Run from repo root: npm run seed:meghana --prefix backend
 * Or: node backend/scripts/seed_meghana_java_oops.js
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MINIMAL_PDF_B64 =
  'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHMgWzMgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL01lZGlhQm94IFswIDAgNjEyIDc5Ml0vUGFyZW50IDIgMCBSPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDc2IDAwMDAwIG4gCjAwMDAwMDAxNDEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDMKJSVFT0YK';

function ensureJavaOopPdf() {
  const uploadsDir = path.join(__dirname, '../uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });
  const dest = path.join(uploadsDir, 'Java_OOP_Concepts.pdf');
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, Buffer.from(MINIMAL_PDF_B64, 'base64'));
  }
  return '/uploads/Java_OOP_Concepts.pdf';
}

const JAVA_OOP_QUIZ_QUESTIONS = [
  {
    questionText: 'In Java, which keyword is used for a class to inherit from another class?',
    options: ['implements', 'extends', 'inherits', 'super'],
    correctAnswer: 'extends',
  },
  {
    questionText: 'Which OOP principle is primarily achieved using private fields and public getters/setters?',
    options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Compilation'],
    correctAnswer: 'Encapsulation',
  },
  {
    questionText: 'Method overriding in Java demonstrates which OOP concept?',
    options: ['Encapsulation', 'Abstraction', 'Polymorphism', 'Serialization'],
    correctAnswer: 'Polymorphism',
  },
  {
    questionText: 'An abstract class in Java can:',
    options: [
      'Be instantiated with new directly',
      'Contain both abstract and concrete methods',
      'Never have constructors',
      'Be marked final',
    ],
    correctAnswer: 'Contain both abstract and concrete methods',
  },
  {
    questionText: 'In Java, a class can extend at most how many classes?',
    options: ['Unlimited', 'Two', 'One', 'Zero'],
    correctAnswer: 'One',
  },
  {
    questionText: 'Which keyword refers to the immediate superclass instance in a subclass?',
    options: ['this', 'super', 'static', 'final'],
    correctAnswer: 'super',
  },
  {
    questionText: 'Interfaces in Java (before default/static methods) primarily support:',
    options: ['Multiple implementation inheritance', 'Primitive types only', 'Operator overloading', 'Garbage collection'],
    correctAnswer: 'Multiple implementation inheritance',
  },
  {
    questionText: 'Which access modifier makes a member visible only within its own package (and the class itself)?',
    options: ['private', 'protected', 'public', 'default (package-private)'],
    correctAnswer: 'default (package-private)',
  },
  {
    questionText: 'A method declared static belongs to:',
    options: ['The instance (object)', 'The class', 'The interface only', 'The JVM heap'],
    correctAnswer: 'The class',
  },
  {
    questionText: 'Which statement about final classes in Java is true?',
    options: [
      'They must be abstract',
      'They cannot be subclassed',
      'They cannot have methods',
      'They are always interfaces',
    ],
    correctAnswer: 'They cannot be subclassed',
  },
  {
    questionText: 'Hiding complex implementation while exposing a simple interface is called:',
    options: ['Encapsulation', 'Abstraction', 'Overloading', 'Covariance'],
    correctAnswer: 'Abstraction',
  },
  {
    questionText: 'Runtime polymorphism in Java is typically achieved through:',
    options: [
      'Method overloading only',
      'Method overriding with a superclass reference',
      'The static keyword',
      'The final keyword on methods',
    ],
    correctAnswer: 'Method overriding with a superclass reference',
  },
  {
    questionText: 'The "is-a" relationship in Java is best modeled by:',
    options: ['Composition', 'Inheritance', 'Aggregation only', 'Packages'],
    correctAnswer: 'Inheritance',
  },
  {
    questionText: 'Which is true about constructors and inheritance?',
    options: [
      'Constructors are inherited like methods',
      'Subclass constructors implicitly call superclass constructors (via super)',
      'Abstract classes cannot have constructors',
      'Interfaces define constructors for implementing classes',
    ],
    correctAnswer: 'Subclass constructors implicitly call superclass constructors (via super)',
  },
  {
    questionText: 'In Java, an interface is implemented using which keyword?',
    options: ['extends', 'implements', 'inherits', 'with'],
    correctAnswer: 'implements',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    const fileUrl = ensureJavaOopPdf();

    let meghana = await User.findOne({
      $or: [
        { email: { $regex: /^meghana/i } },
        { name: { $regex: /meghana/i } },
        { registeredNumber: { $regex: /^FAC_MEGHANA$/i } },
      ],
    });

    if (!meghana) {
      meghana = new User({
        name: 'Meghana',
        email: 'meghana.faculty@lms.com',
        password: 'Meghana@123',
        role: 'Faculty',
        registeredNumber: 'FAC_MEGHANA',
        department: 'CSE',
        mobile: '9876543210',
      });
      await meghana.save();
      console.log('Created faculty: Meghana (meghana.faculty@lms.com)');
    } else {
      console.log('Using existing user:', meghana.name, meghana.email);
    }

    let course = await Course.findOne({
      teacher: meghana._id,
      courseName: { $regex: /^Java.*OOP/i },
    });

    if (!course) {
      course = new Course({
        courseName: 'Java Programming – Object-Oriented Concepts',
        description:
          'Core Java OOP: classes, objects, inheritance, polymorphism, encapsulation, abstraction, interfaces, and the Java OOP Concepts study PDF.',
        teacher: meghana._id,
        department: 'CSE',
        year: '2nd Year',
        section: 'A',
      });
      await course.save();
      console.log('Created course:', course.courseName);
    } else {
      console.log('Using existing course:', course.courseName);
    }

    const materialExists = await Material.findOne({
      course: course._id,
      title: 'Java OOP Concepts (PDF)',
    });
    if (!materialExists) {
      await new Material({
        title: 'Java OOP Concepts (PDF)',
        type: 'PDF',
        course: course._id,
        fileUrl,
      }).save();
      console.log('Added material: Java OOP Concepts (PDF)');
    } else {
      console.log('Material already present, skipping');
    }

    const quizTitle = 'Quiz: Java OOP Fundamentals';
    let quiz = await Quiz.findOne({ course: course._id, title: quizTitle });
    if (!quiz) {
      quiz = new Quiz({
        title: quizTitle,
        course: course._id,
        timeLimit: 30,
        questions: JAVA_OOP_QUIZ_QUESTIONS,
      });
      await quiz.save();
      console.log(`Created quiz "${quizTitle}" with ${JAVA_OOP_QUIZ_QUESTIONS.length} questions`);
    } else {
      console.log('Quiz already exists, skipping');
    }

    console.log('\nDone. Login as Meghana: meghana.faculty@lms.com / Meghana@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
