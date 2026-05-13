import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';
import School from '@mui/icons-material/School';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import CourseDetails from './pages/CourseDetails';
import QuizView from './pages/QuizView';
import Performance from './pages/Performance';
import QuizReview from './pages/QuizReview';
import CreateQuiz from './pages/CreateQuiz';
import CreateAssignment from './pages/CreateAssignment';
import ViewSubmissions from './pages/ViewSubmissions';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f1f5f9' }}>
        {/* Navigation */}
        <Navbar expand="lg" sticky="top" className="mb-4 shadow-sm py-3" style={{ background: 'white' }}>
          <Container>
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <Box sx={{ 
                bgcolor: '#6366f1', 
                p: 1, 
                borderRadius: 2, 
                display: 'flex', 
                mr: 1.5,
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
              }}>
                <School sx={{ color: 'white' }} />
              </Box>
              <span style={{ fontWeight: 800, letterSpacing: '0.5px', color: '#1e293b' }}>LMS PRO</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                {user ? (
                  <>
                    <Nav.Link href="/dashboard" className="px-3">Dashboard</Nav.Link>
                    <Nav.Link href="/performance" className="px-3">Performance</Nav.Link>
                    <NavDropdown title={user.name} id="user-dropdown" className="px-3">
                      <NavDropdown.Item disabled>
                        <Typography variant="caption" color="textSecondary">
                          {user.role} {user.registeredNumber ? `(${user.registeredNumber})` : ''}
                        </Typography>
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/login" className="px-3">Login</Nav.Link>
                    <Nav.Link href="/register" className="px-3">Register</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/create-course" element={user && (user.role === 'Teacher' || user.role === 'Admin') ? <CreateCourse /> : <Navigate to="/" />} />
          <Route path="/courses/:id" element={user ? <CourseDetails /> : <Navigate to="/login" />} />
          <Route path="/quizzes/:quizId" element={user?.role === 'Student' ? <QuizView /> : <Navigate to="/" />} />
          <Route path="/performance" element={user ? <Performance /> : <Navigate to="/login" />} />
          <Route path="/quiz-review/:resultId" element={user ? <QuizReview /> : <Navigate to="/login" />} />
          <Route path="/courses/:courseId/create-quiz" element={user?.role !== 'Student' ? <CreateQuiz /> : <Navigate to="/" />} />
          <Route path="/courses/:courseId/create-assignment" element={user?.role !== 'Student' ? <CreateAssignment /> : <Navigate to="/" />} />
          <Route path="/quizzes/:quizId/submissions" element={user?.role !== 'Student' ? <ViewSubmissions /> : <Navigate to="/" />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
