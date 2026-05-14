import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Typography, Box, Paper, Divider } from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../config';

const Performance = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/quizzes/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = stats.map(s => ({
    name: s.quiz?.title || 'Quiz',
    score: s.score,
    total: s.totalQuestions
  }));

  const totalScore = stats.reduce((acc, curr) => acc + curr.score, 0);
  const totalQuestions = stats.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const avgPerformance = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

  const pieData = [
    { name: 'Correct', value: totalScore },
    { name: 'Incorrect', value: totalQuestions - totalScore }
  ];
  const COLORS = ['#4caf50', '#f44336'];

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-4">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1a237e' }}>
        <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} /> Performance Analysis
      </Typography>

      <Row className="mb-4">
        <Col md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" color="textSecondary">Average Score</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#3f51b5', my: 2 }}>
              {avgPerformance.toFixed(1)}%
            </Typography>
            <Typography variant="body2">Based on {stats.length} quizzes</Typography>
          </Paper>
        </Col>
        <Col md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quiz History</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3f51b5" name="Your Score" />
                  <Bar dataKey="total" fill="#e0e0e0" name="Total Possible" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Overall Accuracy</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Col>
        <Col md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Feedback</Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.length === 0 ? (
              <Typography color="textSecondary">No feedback available yet.</Typography>
            ) : (
              stats.slice(-3).reverse().map((s, i) => (
                <Box key={i} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{s.quiz?.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {s.feedback || "Good effort! Keep practicing to improve your score."}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default Performance;
