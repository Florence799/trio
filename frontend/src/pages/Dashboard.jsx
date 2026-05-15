import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Typography, Box, Paper, IconButton, Button as MuiButton, Avatar, Chip } from '@mui/material';
import School from '@mui/icons-material/School';
import Book from '@mui/icons-material/Book';
import Assignment from '@mui/icons-material/Assignment';
import People from '@mui/icons-material/People';
import Add from '@mui/icons-material/Add';
import Assessment from '@mui/icons-material/Assessment';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import TrendingUp from '@mui/icons-material/TrendingUp';
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
    { title: 'My Courses', count: coursesCount, icon: <School />, color: '#6366f1', path: '/my-courses' },
    { title: 'Assignments', count: assignmentsCount, icon: <Assignment />, color: '#10b981', path: '/assignments' },
    { title: 'Quizzes', count: quizzesCount, icon: <Book />, color: '#f59e0b', path: '/quizzes' },
    { title: 'Performance', count: 'View', icon: <Assessment />, color: '#ec4899', path: '/performance' },
  ] : [
    { title: 'My Courses', count: coursesCount, icon: <School />, color: '#6366f1', path: '/my-courses' },
    { title: 'Assignments', count: assignmentsCount, icon: <Assignment />, color: '#10b981', path: '/assignments' },
    { title: 'Quizzes', count: quizzesCount, icon: <Book />, color: '#f59e0b', path: '/quizzes' },
    { title: 'Active Users', count: userStats.totalUsers, icon: <People />, color: '#ef4444', path: '/registered-users' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spinner animation="grow" variant="primary" />
      </Box>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 1200 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 900, letterSpacing: 2 }}>Workspace Overview</Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>
            Welcome back, {user.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            {user.role === 'Student'
              ? `${user.registeredNumber} • ${user.department} • Year ${user.year || 'N/A'}`
              : `Authorized ${user.role === 'Teacher' ? 'Faculty' : user.role} Access`}
          </Typography>
        </Box>
        {(user.role === 'Faculty' || user.role === 'Teacher' || user.role === 'Admin') && (
          <MuiButton
            variant="contained"
            startIcon={<Add />}
            sx={{
              borderRadius: '16px',
              px: 4,
              py: 1.5,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
              textTransform: 'none',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)' }
            }}
            onClick={() => navigate('/create-course')}
          >
            New Course Module
          </MuiButton>
        )}
      </Box>

      {/* Main Feature Card */}
      <Paper 
        sx={{ 
          mb: 5, 
          p: { xs: 4, md: 6 }, 
          borderRadius: 8, 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(15, 23, 42, 0.25)'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <Chip label="Core Mission" sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 800, mb: 2, px: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em' }}>
            Empowering Academic Growth
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '1.1rem', lineHeight: 1.6, mb: 4 }}>
            Your centralized portal for high-performance learning. Track your progress, engage with smart course materials, and receive real-time insights into your academic journey.
          </Typography>
          <Stack direction="row" spacing={2}>
            <MuiButton 
              variant="contained" 
              sx={{ 
                bgcolor: 'white', 
                color: '#0f172a', 
                borderRadius: '12px', 
                px: 4, 
                py: 1.5, 
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': { bgcolor: '#f1f5f9' }
              }}
              onClick={() => navigate('/my-courses')}
            >
              Explore Courses
            </MuiButton>
            <MuiButton 
              variant="outlined" 
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '12px', 
                px: 4, 
                py: 1.5, 
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
              onClick={() => navigate('/performance')}
            >
              View Stats
            </MuiButton>
          </Stack>
        </Box>
        {/* Abstract Background Orbs */}
        <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <School sx={{ position: 'absolute', right: 40, bottom: -40, fontSize: 300, color: 'rgba(255,255,255,0.03)', transform: 'rotate(-15deg)' }} />
      </Paper>

      <Row className="g-4 mb-5">
        {stats.map((stat, index) => (
          <Col md={3} sm={6} key={index}>
            <Paper
              className="glass-card"
              onClick={() => navigate(stat.path)}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                cursor: 'pointer',
                borderRadius: 6,
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 25px 50px rgba(15, 23, 42, 0.1)',
                  borderColor: stat.color
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, width: 48, height: 48 }}>
                  {stat.icon}
                </Avatar>
                <TrendingUp sx={{ color: '#cbd5e1', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  {stat.count}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Col>
        ))}
      </Row>

      {/* Quick Access Modules */}
      {(user.role === 'Faculty' || user.role === 'Teacher' || user.role === 'Admin') && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, color: '#1e293b' }}>Management Console</Typography>
          <Row className="g-4">
            <Col md={4}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 6,
                  cursor: 'pointer',
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#fff', transform: 'scale(1.02)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
                }}
                onClick={() => navigate('/feedback-analysis')}
              >
                <EmojiEvents sx={{ color: '#f59e0b', mb: 2, fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Insight Analysis</Typography>
                <Typography variant="body2" color="textSecondary">Review teaching metrics and student sentiment trends.</Typography>
              </Paper>
            </Col>
            <Col md={4}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 6,
                  cursor: 'pointer',
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#fff', transform: 'scale(1.02)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
                }}
                onClick={() => navigate('/registered-users')}
              >
                <Groups sx={{ color: '#6366f1', mb: 2, fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>User Directory</Typography>
                <Typography variant="body2" color="textSecondary">Manage academic cohorts and individual student mapping.</Typography>
              </Paper>
            </Col>
            <Col md={4}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 6,
                  cursor: 'pointer',
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#fff', transform: 'scale(1.02)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
                }}
                onClick={() => navigate('/my-courses')}
              >
                <Book sx={{ color: '#10b981', mb: 2, fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Content Studio</Typography>
                <Typography variant="body2" color="textSecondary">Directly edit course modules and upload study assets.</Typography>
              </Paper>
            </Col>
          </Row>
        </Box>
      )}

      {error && <Alert variant="danger" className="mt-4 border-0 shadow-sm">{error}</Alert>}
    </Container>
  );
};

export default Dashboard;
