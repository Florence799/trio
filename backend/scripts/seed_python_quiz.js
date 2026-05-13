const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
require('dotenv').config();

const questions = [
  { questionText: "What is the 'base case' in recursion?", options: ["The recursive call", "The condition to stop recursion", "The first line of code", "The largest input"], correctAnswer: "The condition to stop recursion" },
  { questionText: "What happens if a recursive function has no base case?", options: ["It runs once", "It returns None", "Stack Overflow (RecursionError)", "It deletes the file"], correctAnswer: "Stack Overflow (RecursionError)" },
  { questionText: "Which data structure is used internally to manage recursion?", options: ["Queue", "Stack", "Heap", "Tree"], correctAnswer: "Stack" },
  { questionText: "What is the default recursion limit in Python?", options: ["100", "500", "1000", "Unlimited"], correctAnswer: "1000" },
  { questionText: "Which function is used to change the recursion limit?", options: ["sys.setrecursionlimit()", "math.limit()", "os.recursion()", "sys.maxsize"], correctAnswer: "sys.setrecursionlimit()" },
  { questionText: "What is 'Tail Recursion'?", options: ["Recursion at the start", "Last action is the recursive call", "Infinite recursion", "Recursion with 2 base cases"], correctAnswer: "Last action is the recursive call" },
  { questionText: "What is the output of def f(n): return 1 if n==1 else n*f(n-1) for f(4)?", options: ["10", "12", "24", "6"], correctAnswer: "24" },
  { questionText: "In Fibonacci sequence, what is the recursive formula?", options: ["f(n) + f(n-1)", "f(n-1) + f(n-2)", "f(n) * f(n-1)", "f(n-2) - f(n-1)"], correctAnswer: "f(n-1) + f(n-2)" },
  { questionText: "What is 'Indirect Recursion'?", options: ["Function calls itself", "A calls B, B calls A", "Function calls its child", "Recursion via a loop"], correctAnswer: "A calls B, B calls A" },
  { questionText: "What is the output: def s(n): return 0 if n==0 else n+s(n-1); print(s(5))?", options: ["5", "10", "15", "20"], correctAnswer: "15" },
  { questionText: "What is 'Memoization'?", options: ["Deleting memory", "Storing results of expensive calls", "Writing a memo", "Clearing the stack"], correctAnswer: "Storing results of expensive calls" },
  { questionText: "Trace this: def x(n): if n>0: x(n-1); print(n). For x(3), output is:", options: ["3 2 1", "1 2 3", "0 1 2 3", "3 3 3"], correctAnswer: "1 2 3" },
  { questionText: "Trace this: def y(n): if n>0: print(n); y(n-1). For y(3), output is:", options: ["3 2 1", "1 2 3", "3 2 1 0", "0 1 2 3"], correctAnswer: "3 2 1" },
  { questionText: "How many recursive calls are made for fib(5)?", options: ["5", "9", "15", "25"], correctAnswer: "15" },
  { questionText: "In a recursive tree, what do the 'leaves' represent?", options: ["Recursive calls", "Base cases", "Root function", "Errors"], correctAnswer: "Base cases" },
  { questionText: "Which sorting algorithm is inherently recursive?", options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"], correctAnswer: "Merge Sort" },
  { questionText: "What is the time complexity of recursive Factorial?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correctAnswer: "O(n)" },
  { questionText: "What is the space complexity of recursive Factorial?", options: ["O(1)", "O(n)", "O(log n)", "O(n!)"], correctAnswer: "O(n)" },
  { questionText: "Which module provides lru_cache for memoization?", options: ["math", "functools", "sys", "collections"], correctAnswer: "functools" },
  { questionText: "Output of def p(s): return s if len(s)<=1 else p(s[1:])+s[0]; p('abc')?", options: ["abc", "cba", "bca", "acb"], correctAnswer: "cba" },
  { questionText: "What will f(5) return for def f(n): if n<=0: return 0; return n + f(n-2)?", options: ["15", "9", "5", "8"], correctAnswer: "9" },
  { questionText: "Recursion is most natural for which structure?", options: ["Array", "Linked List", "Binary Tree", "Hash Map"], correctAnswer: "Binary Tree" },
  { questionText: "What is the base case for binary search?", options: ["Array is sorted", "Low > High", "Mid is 0", "Array is full"], correctAnswer: "Low > High" },
  { questionText: "What does sys.setrecursionlimit(2000) do?", options: ["Doubles speed", "Increases stack size", "Deletes old calls", "Stops errors"], correctAnswer: "Increases stack size" },
  { questionText: "Which is a 'Recursive Step'?", options: ["Base case", "The part reducing problem size", "The return", "The import"], correctAnswer: "The part reducing problem size" },
  { questionText: "Recursive depth refers to:", options: ["Number of variables", "Number of active calls", "Number of lines", "Time taken"], correctAnswer: "Number of active calls" },
  { questionText: "What is 'Mutual Recursion'?", options: ["Same as Indirect", "Two loops", "Shared memory", "None"], correctAnswer: "Same as Indirect" },
  { questionText: "Is recursion always better than loops?", options: ["Yes", "No", "Only for math", "Only for Python"], correctAnswer: "No" },
  { questionText: "What is the base case for sum(list)?", options: ["List is full", "List is empty", "First element is 0", "None"], correctAnswer: "List is empty" },
  { questionText: "Tower of Hanoi is solved using:", options: ["Iteration", "Recursion", "Queues", "Stack"], correctAnswer: "Recursion" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    // Find the first course to attach to (or specify one)
    const course = await Course.findOne();
    if (!course) {
      console.log('No course found. Create a course first!');
      process.exit();
    }

    const quiz = new Quiz({
      title: "Python Recursion: The Ultimate Challenge",
      course: course._id,
      timeLimit: 45,
      questions: questions
    });

    await quiz.save();
    console.log(`Quiz added successfully to course: ${course.courseName}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
