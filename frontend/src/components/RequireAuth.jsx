import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const raw = localStorage.getItem('user');
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default RequireAuth;
