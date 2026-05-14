import React from 'react';
import { Navigate } from 'react-router-dom';

function parseUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export function FacultyOnly({ children }) {
  const u = parseUser();
  if (!['Faculty', 'Teacher', 'Admin'].includes(u.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function StudentOnly({ children }) {
  const u = parseUser();
  if (u.role !== 'Student') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function NonStudentOnly({ children }) {
  const u = parseUser();
  if (u.role === 'Student') {
    return <Navigate to="/" replace />;
  }
  return children;
}
