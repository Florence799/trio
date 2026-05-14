const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allowed browser origins (edit this list when you add new frontend URLs).
const ALLOWED_FRONTEND_ORIGINS = [
  'http://localhost:5173',
  'https://lms-8kf.pages.dev',
];

function normalizeOrigin(s) {
  if (!s || typeof s !== 'string') return '';
  return s
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\/$/, '');
}

const allowedOrigins = new Set(
  ALLOWED_FRONTEND_ORIGINS.map(normalizeOrigin).filter(Boolean)
);

function isOriginAllowed(origin) {
  const o = normalizeOrigin(origin);
  return o && allowedOrigins.has(o);
}

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (isOriginAllowed(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Public read-only stats (no auth)
app.use('/api/public', require('./routes/publicRoutes'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

app.get('/', (req, res) => {
  res.send('LMS Backend API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
