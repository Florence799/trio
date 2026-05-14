const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

function normalizeOrigin(s) {
  if (!s || typeof s !== 'string') return '';
  return s
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\/$/, '');
}

// CORS: FRONTEND_URL may be comma-separated. Defaults include Cloudflare Pages production for this app.
const defaultOrigins = ['http://localhost:5173', 'https://lms-8kf.pages.dev'];
const fromEnv = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedOrigins = new Set(
  [...defaultOrigins.map(normalizeOrigin), ...fromEnv].filter(Boolean)
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
