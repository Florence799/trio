import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Typography, Box, Grid, Paper, IconButton, Button as MuiButton } from '@mui/material';
import School from '@mui/icons-material/School';
import Book from '@mui/icons-material/Book';
import Assignment from '@mui/icons-material/Assignment';
import People from '@mui/icons-material/People';
import Add from '@mui/icons-material/Add';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
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
          axios.get('http://localhost:5000/api/courses', { headers }),
          axios.get('http://localhost:5000/api/auth/stats', { headers })
        ]);
        
        setCourses(courseRes.data);
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
    { title: 'My Courses', count: courses.length, icon: <School />, color: '#4caf50' },
    { title: 'Assignments', count: 0, icon: <Assignment />, color: '#ff9800' },
    { title: 'Quizzes', count: 0, icon: <Book />, color: '#2196f3' },
    { title: 'Registered Users', count: userStats.totalUsers, icon: <People />, color: '#f44336' },
  ];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading Dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container className="mt-4 pb-5">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Hello, {user.name}!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {user.role === 'Student' ? `${user.registeredNumber} | ${user.department} | ${user.year}` : `Role: ${user.role}`}
          </Typography>
        </Box>
        {(user.role === 'Teacher' || user.role === 'Admin') && (
          <MuiButton 
            variant="contained" 
            startIcon={<Add />} 
            sx={{ borderRadius: '10px' }}
            onClick={() => navigate('/create-course')}
          >
            Create Course
          </MuiButton>
        )}
      </Box>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-5">
        {stats.map((stat, index) => (
          <Col md={3} sm={6} key={index} className="mb-3">
            <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 3, borderLeft: `5px solid ${stat.color}` }}>
              <IconButton sx={{ bgcolor: `${stat.color}11`, color: stat.color, mr: 2 }}>
                {stat.icon}
              </IconButton>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{stat.count}</Typography>
                <Typography variant="body2" color="textSecondary">{stat.title}</Typography>
              </Box>
            </Paper>
          </Col>
        ))}
      </Row>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {user.role === 'Student' ? 'My Enrolled Courses' : 'My Courses'}
      </Typography>

      {courses.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: '#f1f3f4' }}>
          <School sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">No courses found yet.</Typography>
          <Typography variant="body2" color="textSecondary">Check back later or contact your instructor.</Typography>
        </Paper>
      ) : (
        <Row>
          {courses.map((course) => (
            <Col md={4} key={course._id} className="mb-4">
              <CourseCard course={course} onOpen={(id) => navigate(`/courses/${id}`)} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
