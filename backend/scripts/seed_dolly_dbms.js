const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MINIMAL_PDF_B64 =
  'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHMgWzMgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL01lZGlhQm94IFswIDAgNjEyIDc5Ml0vUGFyZW50IDIgMCBSPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDc2IDAwMDAwIG4gCjAwMDAwMDAxNDEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDMKJSVFT0YK';

function ensureDbmsPdf() {
  const uploadsDir = path.join(__dirname, '../uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });
  const dest = path.join(uploadsDir, 'DBMS_Notes_Overview.pdf');
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, Buffer.from(MINIMAL_PDF_B64, 'base64'));
  }
  return '/uploads/DBMS_Notes_Overview.pdf';
}

const DBMS_QUIZ_QUESTIONS = [
  { questionText: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'], correctAnswer: 'Structured Query Language' },
  { questionText: 'Which language is used to query data in a relational database?', options: ['Java', 'SQL', 'Python', 'C++'], correctAnswer: 'SQL' },
  { questionText: 'What is a primary key?', options: ['A key that allows null values', 'A unique identifier for a record in a table', 'A key that links two tables', 'A key used for indexing only'], correctAnswer: 'A unique identifier for a record in a table' },
  { questionText: 'What is a foreign key?', options: ['A key used to encrypt data', 'A field in one table that uniquely identifies a row of another table', 'A primary key of the same table', 'A key that cannot be null'], correctAnswer: 'A field in one table that uniquely identifies a row of another table' },
  { questionText: 'Which normal form deals with partial functional dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '2NF' },
  { questionText: 'Which normal form deals with transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '3NF' },
  { questionText: 'What does ACID stand for in database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Isolation, Durability', 'Atomicity, Complexity, Isolation, Durability', 'Atomicity, Consistency, Integration, Durability'], correctAnswer: 'Atomicity, Consistency, Isolation, Durability' },
  { questionText: 'Which command is used to remove all records from a table without removing the table structure?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correctAnswer: 'TRUNCATE' },
  { questionText: 'Which command is used to undo the changes made by a transaction?', options: ['COMMIT', 'ROLLBACK', 'SAVEPOINT', 'UNDO'], correctAnswer: 'ROLLBACK' },
  { questionText: 'Which type of join returns all rows when there is a match in one of the tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correctAnswer: 'FULL OUTER JOIN' },
  { questionText: 'What is a "view" in SQL?', options: ['A virtual table based on the result-set of an SQL statement', 'A physical table stored on disk', 'A type of index', 'A backup of a table'], correctAnswer: 'A virtual table based on the result-set of an SQL statement' },
  { questionText: 'What is the purpose of an Index in a database?', options: ['To secure the data', 'To speed up data retrieval', 'To reduce data storage space', 'To prevent duplicate entries'], correctAnswer: 'To speed up data retrieval' },
  { questionText: 'Which SQL clause is used to filter the results of a GROUP BY?', options: ['WHERE', 'ORDER BY', 'HAVING', 'SELECT'], correctAnswer: 'HAVING' },
  { questionText: 'What is a Trigger in DBMS?', options: ['A manual backup process', 'A set of SQL statements that automatically execute in response to certain events', 'A way to delete all records', 'A tool for data visualization'], correctAnswer: 'A set of SQL statements that automatically execute in response to certain events' },
  { questionText: 'What is Data Redundancy?', options: ['Encryption of data', 'Unnecessary repetition of data', 'Loss of data during transfer', 'Compression of data'], correctAnswer: 'Unnecessary repetition of data' },
  { questionText: 'What is a Database Schema?', options: ['The physical storage location of data', 'The logical structure or blueprint of the database', 'The collection of all records', 'A tool for database migration'], correctAnswer: 'The logical structure or blueprint of the database' },
  { questionText: 'What is a Tuple in a relational database?', options: ['A column', 'A row', 'A table', 'A relationship'], correctAnswer: 'A row' },
  { questionText: 'Which SQL keyword is used to sort the result-set?', options: ['SORT BY', 'ALIGN BY', 'ORDER BY', 'GROUP BY'], correctAnswer: 'ORDER BY' },
  { questionText: 'Can a Primary Key contain NULL values?', options: ['Yes', 'No', 'Only if the table has no Foreign Key', 'Only in MySQL'], correctAnswer: 'No' },
  { questionText: 'Which of the following is NOT a type of SQL command?', options: ['DDL', 'DML', 'DCL', 'DXL'], correctAnswer: 'DXL' },
  { questionText: 'What is the default port for MongoDB?', options: ['3306', '5432', '27017', '6379'], correctAnswer: '27017' },
  { questionText: 'Which normal form is stronger than 3NF?', options: ['2NF', '1NF', 'BCNF', '4NF'], correctAnswer: 'BCNF' },
  { questionText: 'What is the purpose of the "UNIQUE" constraint?', options: ['To allow only one record in the table', 'To ensure all values in a column are different', 'To link two tables', 'To allow NULL values only'], correctAnswer: 'To ensure all values in a column are different' },
  { questionText: 'What is a Stored Procedure?', options: ['A prepared SQL code that you can save and reuse', 'A temporary table', 'A way to store files in a database', 'A manual data entry tool'], correctAnswer: 'A prepared SQL code that you can save and reuse' },
  { questionText: 'What is an Attribute in a relation?', options: ['A row', 'A column', 'A table', 'A constraint'], correctAnswer: 'A column' },
  { questionText: 'Which join returns all records from the left table, and the matched records from the right table?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'], correctAnswer: 'LEFT JOIN' },
  { questionText: 'What is Data Integrity?', options: ['Sharing data with others', 'The accuracy and consistency of data stored in a database', 'Deleting unwanted data', 'Hiding data from unauthorized users'], correctAnswer: 'The accuracy and consistency of data stored in a database' },
  { questionText: 'What does "Atomicity" mean in ACID properties?', options: ['Data is updated in parts', 'A transaction must be all or nothing', 'Data is stored in small atoms', 'Transactions are always fast'], correctAnswer: 'A transaction must be all or nothing' },
  { questionText: 'What is a Cursor in SQL?', options: ['A pointing device', 'A database object used to retrieve data from a result set one row at a time', 'A way to delete multiple tables', 'A type of database user'], correctAnswer: 'A database object used to retrieve data from a result set one row at a time' },
  { questionText: 'Which SQL command is used to add a new column to an existing table?', options: ['UPDATE', 'INSERT', 'ALTER TABLE', 'MODIFY'], correctAnswer: 'ALTER TABLE' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    const fileUrl = ensureDbmsPdf();

    let dolly = await User.findOne({
      $or: [
        { email: 'dolly.faculty@lms.com' },
        { registeredNumber: 'FAC_DOLLY' },
      ],
    });

    if (!dolly) {
      dolly = new User({
        name: 'Dolly',
        email: 'dolly.faculty@lms.com',
        password: 'Dolly@123',
        role: 'Faculty',
        registeredNumber: 'FAC_DOLLY',
        department: 'CSE',
        mobile: '9988776655',
      });
      await dolly.save();
      console.log('Created faculty: Dolly (dolly.faculty@lms.com)');
    } else {
      console.log('Using existing user:', dolly.name, dolly.email);
    }

    let course = await Course.findOne({
      teacher: dolly._id,
      courseName: { $regex: /^Database Management Systems/i },
    });

    if (!course) {
      course = new Course({
        courseName: 'Database Management Systems (DBMS)',
        description: 'Comprehensive study of Relational Databases, SQL, Normalization, Transactions, and NoSQL fundamentals.',
        teacher: dolly._id,
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
      });
      await course.save();
      console.log('Created course:', course.courseName);
    } else {
      console.log('Using existing course:', course.courseName);
    }

    const materialExists = await Material.findOne({
      course: course._id,
      title: 'DBMS Comprehensive Notes (PDF)',
    });
    if (!materialExists) {
      await new Material({
        title: 'DBMS Comprehensive Notes (PDF)',
        type: 'PDF',
        course: course._id,
        fileUrl,
      }).save();
      console.log('Added material: DBMS Comprehensive Notes (PDF)');
    }

    const quizTitle = 'DBMS Mastery Quiz (30 Questions)';
    let quiz = await Quiz.findOne({ course: course._id, title: quizTitle });
    if (!quiz) {
      quiz = new Quiz({
        title: quizTitle,
        course: course._id,
        timeLimit: 45,
        questions: DBMS_QUIZ_QUESTIONS,
      });
      await quiz.save();
      console.log(`Created quiz "${quizTitle}" with ${DBMS_QUIZ_QUESTIONS.length} questions`);
    }

    const assignmentTitle = 'SQL Query Design: Library Management System';
    let assignment = await Assignment.findOne({ course: course._id, title: assignmentTitle });
    if (!assignment) {
      assignment = new Assignment({
        title: assignmentTitle,
        instructions: 'Design a database schema for a Library Management System with tables: Books, Members, and Loans. Write SQL queries to: 1. Find all books by a specific author. 2. List members who have overdue books. 3. Count total books currently on loan. Submit a PDF or .sql file.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        course: course._id,
      });
      await assignment.save();
      console.log(`Created assignment: "${assignmentTitle}"`);
    }

    console.log('\nDone. Login as Dolly: dolly.faculty@lms.com / Dolly@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
