import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Typography, Box, Paper, Divider, Chip, Avatar } from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import CheckCircle from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import axios from 'axios';
import { API_BASE } from '../config';

const Performance = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

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
    name: s.quiz?.title?.substring(0, 10) + (s.quiz?.title?.length > 10 ? '...' : '') || 'Quiz',
    score: s.score,
    total: s.totalQuestions,
    percentage: (s.score / s.totalQuestions) * 100
  }));

  const totalScore = stats.reduce((acc, curr) => acc + curr.score, 0);
  const totalQuestions = stats.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const avgPerformance = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

  const pieData = [
    { name: 'Correct', value: totalScore },
    { name: 'Incorrect', value: totalQuestions - totalScore }
  ];
  const COLORS = ['#6366f1', '#f43f5e'];

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Spinner animation="grow" variant="primary" />
    </Box>
  );

  return (
    <Container className="py-5">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, background: 'linear-gradient(45deg, #1e293b 30%, #475569 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Performance Analytics
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
          Welcome back, {user?.name}. Here's your learning progress.
        </Typography>
      </Box>

      <Row className="g-4 mb-5">
        <Col lg={4}>
          <Paper className="glass-card h-100" sx={{ p: 4, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600 }}>Overall Accuracy</Typography>
              <Typography variant="h1" sx={{ fontWeight: 900, my: 2, fontSize: '4.5rem' }}>
                {avgPerformance.toFixed(0)}<span style={{ fontSize: '2rem', opacity: 0.7 }}>%</span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stats.length} Quizzes Completed
                </Typography>
              </Box>
            </Box>
            <LocalFireDepartmentIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: '15rem', opacity: 0.1, transform: 'rotate(-15deg)' }} />
          </Paper>
        </Col>

        <Col lg={8}>
          <Paper className="glass-card h-100" sx={{ p: 4, borderRadius: 6 }}>
            <Box sx={{ d: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Score Trends</Typography>
              <Chip label="Live Data" size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 700 }} />
            </Box>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="percentage" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={5}>
          <Paper className="glass-card h-100" sx={{ p: 4, borderRadius: 6 }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Answer Distribution</Typography>
            <Box sx={{ height: 320, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ textAlign: 'center', mt: -18, mb: 10 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>{totalScore}</Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Correct</Typography>
            </Box>
          </Paper>
        </Col>

        <Col lg={7}>
          <Paper className="glass-card h-100" sx={{ p: 4, borderRadius: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Avatar sx={{ bgcolor: '#fef2f2', color: '#ef4444' }}>
                <FeedbackIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Faculty Insights</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {stats.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f8fafc', borderRadius: 4 }}>
                  <Typography color="textSecondary" sx={{ fontWeight: 500 }}>No feedback reports available yet.</Typography>
                </Box>
              ) : (
                stats.slice(-3).reverse().map((s, i) => (
                  <Box key={i} className="feedback-item" sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateX(8px)', borderColor: '#e2e8f0', bgcolor: '#f8fafc' }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        {s.quiz?.title}
                      </Typography>
                      <Chip 
                        label={`${((s.score / s.totalQuestions) * 100).toFixed(0)}%`} 
                        size="small" 
                        sx={{ fontWeight: 800, bgcolor: s.score/s.totalQuestions >= 0.7 ? '#dcfce7' : '#fee2e2', color: s.score/s.totalQuestions >= 0.7 ? '#15803d' : '#b91c1c' }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, fontStyle: s.feedback ? 'normal' : 'italic' }}>
                      {s.feedback || "Standard system evaluation: Your performance shows a steady grasp of the material. Review the incorrect answers to strengthen weak areas."}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default Performance;
