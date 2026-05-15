import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Box, Typography, Avatar, Button as MuiButton } from '@mui/material';
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
import CustomCursor from './components/CustomCursor';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <CustomCursor />
      <Box className="app-shell" sx={{ flexGrow: 1, minHeight: '100vh', pt: { xs: 2, md: 2.5 } }}>
        <Navbar 
          expand="lg" 
          sticky="top" 
          className="lms-navbar"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '1rem 0'
          }}
        >
          <Container>
            <Navbar.Brand href="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #14B8A6 0%, #4F46E5 100%)',
                  p: 1,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 15px rgba(20, 184, 166, 0.25)',
                }}
              >
                <School sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>
                LMS<span style={{ color: '#14B8A6' }}>Pro</span>
              </Typography>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto align-items-center gap-1 gap-lg-4 mt-3 mt-lg-0">
                {!user && (
                  <>
                    <Nav.Link href="#home" className="px-0 fw-600 text-dark">Home</Nav.Link>
                    <Nav.Link href="#courses" className="px-0 fw-600 text-dark">Courses</Nav.Link>
                    <Nav.Link href="#features" className="px-0 fw-600 text-dark">Features</Nav.Link>
                    <Nav.Link href="#pricing" className="px-0 fw-600 text-dark">Pricing</Nav.Link>
                    <Nav.Link href="#contact" className="px-0 fw-600 text-dark">Contact</Nav.Link>
                  </>
                )}
              </Nav>
              <Nav className="align-items-center gap-2 mt-3 mt-lg-0">
                {user ? (
                  <>
                    <Nav.Link href="/dashboard" className="px-3 fw-600 text-dark">Dashboard</Nav.Link>
                    <NavDropdown 
                      title={<Avatar sx={{ width: 32, height: 32, bgcolor: '#14B8A6', fontSize: '0.875rem', fontWeight: 800 }}>{user.name[0]}</Avatar>} 
                      id="user-dropdown" 
                      align="end"
                    >
                      <NavDropdown.Header>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>{user.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{user.role}</Typography>
                      </NavDropdown.Header>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout} sx={{ color: '#ef4444', fontWeight: 700 }}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/login" className="px-3 fw-600 text-dark">Login</Nav.Link>
                    <MuiButton
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      sx={{
                        borderRadius: '10px',
                        px: 3,
                        py: 1,
                        fontWeight: 700,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #14B8A6 0%, #4F46E5 100%)',
                        boxShadow: '0 8px 15px rgba(20, 184, 166, 0.2)',
                      }}
                    >
                      Get Started
                    </MuiButton>
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
