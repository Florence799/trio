import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';
import School from '@mui/icons-material/School';

import RequireAuth from './components/RequireAuth';
import FacultyPortalLayout from './components/FacultyPortalLayout';
import { FacultyOnly, StudentOnly, NonStudentOnly } from './components/RouteGuards';

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
import FeedbackAnalysis from './pages/FeedbackAnalysis';
import Home from './pages/Home';
import MyCourses from './pages/MyCourses';
import AssignmentsPage from './pages/AssignmentsPage';
import QuizzesPage from './pages/QuizzesPage';
import RegisteredUsers from './pages/RegisteredUsers';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Box className="app-shell" sx={{ flexGrow: 1, minHeight: '100vh', pt: { xs: 2, md: 2.5 } }}>
        <Navbar expand="lg" sticky="top" className="lms-navbar mb-0 py-0">
          <Container>
            <Navbar.Brand href="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                  p: 1.1,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.45)',
                }}
              >
                <School sx={{ color: 'white', fontSize: 26 }} />
              </Box>
              <Box component="span" sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', fontSize: '1.2rem' }}>
                  LMS Pro
                </span>
                <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Learning hub
                </Typography>
              </Box>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                {user ? (
                  <>
                    <Nav.Link href="/dashboard" className="px-3">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link href="/performance" className="px-3">
                      Performance
                    </Nav.Link>
                    <NavDropdown title={user.name} id="user-dropdown" className="px-3">
                      <NavDropdown.Item disabled>
                        <Typography variant="caption" color="textSecondary">
                          {user.role === 'Teacher' ? 'Faculty' : user.role}{' '}
                          {user.registeredNumber ? `(${user.registeredNumber})` : ''}
                        </Typography>
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/login" className="px-3">
                      Login
                    </Nav.Link>
                    <Nav.Link href="/register" className="px-3">
                      Register
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<RequireAuth />}>
            <Route element={<FacultyPortalLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/quiz-review/:resultId" element={<QuizReview />} />

              <Route
                path="/quizzes/:quizId"
                element={
                  <StudentOnly>
                    <QuizView />
                  </StudentOnly>
                }
              />

              <Route
                path="/create-course"
                element={
                  <FacultyOnly>
                    <CreateCourse />
                  </FacultyOnly>
                }
              />
              <Route
                path="/registered-users"
                element={
                  <NonStudentOnly>
                    <RegisteredUsers />
                  </NonStudentOnly>
                }
              />
              <Route
                path="/feedback-analysis"
                element={
                  <NonStudentOnly>
                    <FeedbackAnalysis />
                  </NonStudentOnly>
                }
              />
              <Route
                path="/courses/:courseId/create-quiz"
                element={
                  <NonStudentOnly>
                    <CreateQuiz />
                  </NonStudentOnly>
                }
              />
              <Route
                path="/courses/:courseId/create-assignment"
                element={
                  <NonStudentOnly>
                    <CreateAssignment />
                  </NonStudentOnly>
                }
              />
              <Route
                path="/quizzes/:quizId/submissions"
                element={
                  <NonStudentOnly>
                    <ViewSubmissions />
                  </NonStudentOnly>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
