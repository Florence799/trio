const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: explicit origins + any Cloudflare Pages preview/production (*.pages.dev).
const ALLOWED_FRONTEND_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://lms-8kf.pages.dev',
  'https://lms.pages.dev',
  'https://edu.basketind.in',
  'http://edu.basketind.in',
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
  if (!o) return false;
  if (allowedOrigins.has(o)) return true;
  try {
    const { protocol, hostname } = new URL(o);
    if (protocol === 'https:' && hostname.endsWith('.pages.dev')) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
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
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
  console.error('FATAL: MONGODB_URI must be set in production (Render → Environment).');
  process.exit(1);
}

// Fail fast instead of buffering operations for 10s when disconnected
mongoose.set('bufferCommands', false);

async function start() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      // Helps Windows / some networks where mongodb+srv SRV lookup fails (ECONNREFUSED querySrv)
      family: 4,
    });
    console.log('MongoDB connected');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory ready');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error(
      'Check MONGODB_URI, Atlas IP access (allow 0.0.0.0/0 or Render outbound), and database user/password.'
    );
    process.exit(1);
  }
}

start();
