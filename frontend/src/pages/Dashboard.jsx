import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Typography, Box, Paper, IconButton, Button as MuiButton } from '@mui/material';
import School from '@mui/icons-material/School';
import Book from '@mui/icons-material/Book';
import Assignment from '@mui/icons-material/Assignment';
import People from '@mui/icons-material/People';
import Add from '@mui/icons-material/Add';
import Assessment from '@mui/icons-material/Assessment';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
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

  const stats = user.role === 'Student' ? [
    { title: 'My Courses', count: coursesCount, icon: <School />, color: '#6366f1', path: '/my-courses' }, // Indigo
    { title: 'Assignments', count: assignmentsCount, icon: <Assignment />, color: '#ec4899', path: '/assignments' }, // Pink
    { title: 'Quizzes', count: quizzesCount, icon: <Book />, color: '#8b5cf6', path: '/quizzes' }, // Violet
    { title: 'Performance', count: 'View', icon: <Assessment />, color: '#10b981', path: '/performance' }, // Emerald
  ] : [
    { title: 'My Courses', count: coursesCount, icon: <School />, color: '#6366f1', path: '/my-courses' },
    { title: 'Assignments', count: assignmentsCount, icon: <Assignment />, color: '#ec4899', path: '/assignments' },
    { title: 'Quizzes', count: quizzesCount, icon: <Book />, color: '#8b5cf6', path: '/quizzes' },
    { title: 'Registered Users', count: userStats.totalUsers, icon: <People />, color: '#f59e0b', path: '/registered-users' }, // Amber
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
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.12em' }}>
            Dashboard
          </Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 900, 
            color: '#0f172a', 
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}>
            Hello, <Box component="span" sx={{ 
              background: 'linear-gradient(90deg, #4f46e5 0%, #9333ea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>{user.name}</Box>! 👋
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

      {/* Hero Section Explaining Portal Purpose */}
      <Box 
        sx={{ 
          mb: 5, 
          p: { xs: 4, md: 6 }, 
          borderRadius: 5, 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.5)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="overline" sx={{ color: '#a855f7', fontWeight: 800, letterSpacing: '0.15em', display: 'block', mb: 1 }}>
            Welcome to the Smart Learning System
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            Empowering Your Academic Excellence
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6, mb: 4 }}>
            Our portal is designed to seamlessly connect students and faculty. Here you can discover interactive course modules, engage with assignments and quizzes, receive insightful feedback, and track your performance. Scroll down to access your personalized dashboard details and manage your academic journey.
          </Typography>
          <MuiButton 
            variant="outlined" 
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.3)', 
              borderRadius: '20px', 
              px: 4, 
              py: 1.5, 
              fontWeight: 600,
              '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' }
            }}
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.6, behavior: 'smooth' })}
          >
            Explore Dashboard
          </MuiButton>
        </Box>
        {/* Background Decorative Elements */}
        <Box sx={{ position: 'absolute', top: '-20%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
      </Box>

      {/* Stats Section with Special Heading */}
      <Box sx={{ mb: 3, mt: 2, px: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
          <Assessment fontSize="small" />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: 900, 
          background: 'linear-gradient(90deg, #0f172a 0%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.01em'
        }}>
          Key Performance Metrics
        </Typography>
      </Box>

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
                borderRadius: '22px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
                  borderColor: stat.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 6,
                  bgcolor: stat.color,
                  borderRadius: '4px 0 0 4px',
                },
              }}
            >
              <IconButton
                sx={{
                  bgcolor: `${stat.color}15`,
                  color: stat.color,
                  mr: 2,
                  width: 48,
                  height: 48,
                  '&:hover': { bgcolor: `${stat.color}25` },
                }}
              >
                {stat.icon}
              </IconButton>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, color: '#0f172a' }}>
                  {stat.count}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mt: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Col>
        ))}
      </Row>

      {/* Module/Action Section with Special Heading */}
      <Box sx={{ mb: 3, px: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'secondary.main', color: 'white', display: 'flex' }}>
          <EmojiEvents fontSize="small" />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: 900, 
          background: 'linear-gradient(90deg, #0f172a 0%, #9333ea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.01em'
        }}>
          {user.role === 'Student' ? 'Your Learning Path' : 'Faculty Management Hub'}
        </Typography>
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

      {user.role === 'Student' && (
        <Row className="mb-4 g-3">
          <Col md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(79,70,229,0.1) 100%)',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(79, 70, 229, 0.15)' },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="overline" sx={{ color: '#4f46e5', fontWeight: 800, letterSpacing: '0.1em' }}>
                  Your Learning Journey
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a', letterSpacing: '-0.02em', mt: 0.5 }}>
                  Keep the momentum going!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: '80%', fontWeight: 500 }}>
                  Consistency is the key to mastery. Dive back into your courses, complete your pending assignments, and prepare for upcoming quizzes. You've got this!
                </Typography>
                <MuiButton
                  variant="contained"
                  onClick={() => navigate('/my-courses')}
                  sx={{
                    borderRadius: '12px',
                    px: 3.5,
                    py: 1.25,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 28px rgba(99, 102, 241, 0.45)',
                    }
                  }}
                >
                  Continue Learning
                </MuiButton>
              </Box>
              <School sx={{ 
                position: 'absolute', 
                right: -20, 
                bottom: -30, 
                fontSize: 220, 
                color: 'rgba(79, 70, 229, 0.08)',
                transform: 'rotate(-15deg)',
                pointerEvents: 'none',
              }} />
            </Paper>
          </Col>
          <Col md={4}>
            <Paper
              elevation={0}
              onClick={() => navigate('/performance')}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.4)' },
              }}
            >
               <EmojiEvents sx={{ fontSize: 70, color: '#fbbf24', mb: 2, filter: 'drop-shadow(0 4px 12px rgba(251,191,36,0.3))' }} />
               <Typography variant="h5" sx={{ fontWeight: 800 }}>
                 Student Hub
               </Typography>
               <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1.5, fontWeight: 500 }}>
                 Track your overall performance, recent feedback, and academic growth in one place.
               </Typography>
            </Paper>
          </Col>
        </Row>
      )}

    </Container>
  );
};

export default Dashboard;
