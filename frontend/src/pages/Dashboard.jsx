import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Typography, Box, Paper, IconButton, Button as MuiButton } from '@mui/material';
import School from '@mui/icons-material/School';
import Book from '@mui/icons-material/Book';
import Assignment from '@mui/icons-material/Assignment';
import People from '@mui/icons-material/People';
import Add from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const Dashboard = () => {
  const [coursesCount, setCoursesCount] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [userStats, setUserStats] = useState({ totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [courseRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/courses`, { headers }),
          axios.get(`${API_BASE}/api/auth/stats`, { headers })
        ]);

        const assignmentResponses = await Promise.all(
          courseRes.data.map((course) => axios.get(`${API_BASE}/api/assignments/course/${course._id}`, { headers }))
        );
        const quizResponses = await Promise.all(
          courseRes.data.map((course) => axios.get(`${API_BASE}/api/quizzes/course/${course._id}`, { headers }))
        );

        setCoursesCount(courseRes.data.length);
        setAssignmentsCount(assignmentResponses.reduce((acc, response) => acc + response.data.length, 0));
        setQuizzesCount(quizResponses.reduce((acc, response) => acc + response.data.length, 0));
        setUserStats(statsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'My Courses', count: coursesCount, icon: <School />, color: '#4caf50', path: '/my-courses' },
    { title: 'Assignments', count: assignmentsCount, icon: <Assignment />, color: '#ff9800', path: '/assignments' },
    { title: 'Quizzes', count: quizzesCount, icon: <Book />, color: '#2196f3', path: '/quizzes' },
    { title: 'Registered Users', count: userStats.totalUsers, icon: <People />, color: '#f44336', path: '/registered-users' },
  ];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary', fontWeight: 500 }}>
          Loading your dashboard…
        </Typography>
      </Container>
    );
  }

  return (
    <Container className="pb-5" style={{ maxWidth: 1100 }}>
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.9) 100%)',
          border: '1px solid rgba(15, 23, 42, 0.06)',
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.12em' }}>
            Dashboard
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Hello, {user.name}!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
            {user.role === 'Student'
              ? `${user.registeredNumber} · ${user.department} · ${user.year || 'Year not set'}`
              : `Role: ${user.role === 'Teacher' ? 'Faculty' : user.role}`}
          </Typography>
        </Box>
        {(user.role === 'Faculty' || user.role === 'Teacher' || user.role === 'Admin') && (
          <MuiButton
            variant="contained"
            startIcon={<Add />}
            size="large"
            sx={{
              borderRadius: '14px',
              px: 3,
              py: 1.25,
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
            }}
            onClick={() => navigate('/create-course')}
          >
            Create Course
          </MuiButton>
        )}
      </Box>

      {error && <Alert variant="danger" className="shadow-sm">{error}</Alert>}

      {(user.role === 'Faculty' || user.role === 'Teacher' || user.role === 'Admin') && (
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Paper
              elevation={0}
              onClick={() => navigate('/create-course')}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(124,58,237,0.06) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(99, 102, 241, 0.2)' },
              }}
            >
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                Module
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.5 }}>
                Launch a new course
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Outline, cohort, and materials — start in one flow.
              </Typography>
            </Paper>
          </Col>
          <Col md={4}>
            <Paper
              elevation={0}
              onClick={() => navigate('/feedback-analysis')}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(99,102,241,0.06) 100%)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(20, 184, 166, 0.18)' },
              }}
            >
              <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 800 }}>
                Module
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.5 }}>
                Feedback intelligence
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Review sentiment and ratings across your teaching.
              </Typography>
            </Paper>
          </Col>
          <Col md={4}>
            <Paper
              elevation={0}
              onClick={() => navigate('/registered-users')}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(244,63,94,0.06) 0%, rgba(249,115,22,0.08) 100%)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(244, 63, 94, 0.12)' },
              }}
            >
              <Typography variant="overline" sx={{ color: 'error.main', fontWeight: 800 }}>
                Module
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.5 }}>
                Learner roster
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                See who is mapped to each course cohort.
              </Typography>
            </Paper>
          </Col>
        </Row>
      )}

      <Row className="mb-5 g-3">
        {stats.map((stat, index) => (
          <Col md={3} sm={6} key={index}>
            <Paper
              className="stat-tile"
              elevation={0}
              onClick={() => navigate(stat.path)}
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: '18px',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 5,
                  bgcolor: stat.color,
                  borderRadius: '4px 0 0 4px',
                },
              }}
            >
              <IconButton
                sx={{
                  bgcolor: `${stat.color}18`,
                  color: stat.color,
                  mr: 2,
                  '&:hover': { bgcolor: `${stat.color}28` },
                }}
              >
                {stat.icon}
              </IconButton>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  {stat.count}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
