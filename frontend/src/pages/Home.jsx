import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Box, Typography, Button, Chip, Stack, Avatar, AvatarGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import AutoStories from '@mui/icons-material/AutoStories';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Security from '@mui/icons-material/Security';
import School from '@mui/icons-material/School';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import Groups from '@mui/icons-material/Groups';
import axios from 'axios';
import { API_BASE } from '../config';

const Home = () => {
  const [materialTotal, setMaterialTotal] = useState(null);
  const [materialStatsError, setMaterialStatsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/api/public/material-stats`)
      .then((res) => {
        if (!cancelled && typeof res.data?.totalMaterials === 'number') {
          setMaterialTotal(res.data.totalMaterials);
        }
      })
      .catch(() => {
        if (!cancelled) setMaterialStatsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box className="hero-page" sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      {/* Animated Mesh Gradient Background */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'radial-gradient(circle at 0% 0%, #0f172a 0%, transparent 50%), radial-gradient(circle at 100% 100%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 50% 50%, #312e81 0%, #0f172a 100%)',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          animation: 'meshMove 20s linear infinite',
        }
      }} />

      {/* Floating Decorative Elements */}
      <Box sx={{ position: 'absolute', top: '15%', left: '10%', animation: 'float 6s ease-in-out infinite', opacity: 0.6 }}>
        <School sx={{ fontSize: 120, color: 'rgba(99, 102, 241, 0.15)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '20%', right: '15%', animation: 'float 8s ease-in-out infinite', opacity: 0.5 }}>
        <RocketLaunch sx={{ fontSize: 100, color: 'rgba(168, 85, 247, 0.15)' }} />
      </Box>

      <Container className="position-relative" style={{ zIndex: 1 }}>
        <Row className="align-items-center">
          <Col lg={7}>
            <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label="Next-Gen Learning" 
                sx={{ 
                  bgcolor: 'rgba(99, 102, 241, 0.15)', 
                  color: '#818cf8', 
                  fontWeight: 800, 
                  fontSize: '0.75rem', 
                  letterSpacing: 1, 
                  textTransform: 'uppercase',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              {!materialStatsError && materialTotal !== null && (
                <Chip 
                  label={`${materialTotal}+ Learning Assets`} 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.05)', 
                    color: 'white', 
                    fontWeight: 600, 
                    fontSize: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
              )}
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(to bottom right, #ffffff 30%, #94a3b8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Elevate your <br />
              <span style={{ color: '#6366f1', WebkitTextFillColor: '#6366f1' }}>educational journey.</span>
            </Typography>

            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5, fontWeight: 400, lineHeight: 1.7, maxWidth: 600, fontSize: '1.15rem' }}>
              A unified ecosystem for modern educators and ambitious students. 
              Manage courses, assessments, and feedback in a high-performance environment designed for clarity.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)',
                  textTransform: 'none',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 20px 45px rgba(99, 102, 241, 0.5)',
                  }
                }}
              >
                Launch Learning Portal
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="text"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: '#818cf8'
                  },
                }}
              >
                Create New Account
              </Button>
            </Stack>

            <Box sx={{ mt: 8, display: 'flex', alignItems: 'center', gap: 2 }}>
              <AvatarGroup max={4}>
                <Avatar alt="Student 1" src="https://i.pravatar.cc/150?u=1" sx={{ width: 32, height: 32, border: '2px solid #0f172a !important' }} />
                <Avatar alt="Student 2" src="https://i.pravatar.cc/150?u=2" sx={{ width: 32, height: 32, border: '2px solid #0f172a !important' }} />
                <Avatar alt="Student 3" src="https://i.pravatar.cc/150?u=3" sx={{ width: 32, height: 32, border: '2px solid #0f172a !important' }} />
                <Avatar alt="Student 4" src="https://i.pravatar.cc/150?u=4" sx={{ width: 32, height: 32, border: '2px solid #0f172a !important' }} />
              </AvatarGroup>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Joined by <span style={{ color: 'white' }}>500+</span> active learners this week
              </Typography>
            </Box>
          </Col>

          <Col lg={5} className="d-none d-lg-block">
            <Box sx={{ 
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                zIndex: -1
              }
            }}>
              <Box className="floating-card" sx={{ 
                p: 4, 
                borderRadius: 8, 
                bgcolor: 'rgba(255,255,255,0.03)', 
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
              }}>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                      <AutoStories />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800 }}>Smart Materials</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>AI-organized study sets</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                      <TrendingUp />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800 }}>Live Performance</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>Real-time growth tracking</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
                      <Security />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800 }}>Integrity Check</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>Advanced plagiarism audit</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Col>
        </Row>
      </Container>

      {/* Global CSS for unique animations */}
      <style>{`
        @keyframes meshMove {
          0% { transform: translate(-5%, -5%) rotate(0deg); }
          50% { transform: translate(5%, 5%) rotate(180deg); }
          100% { transform: translate(-5%, -5%) rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </Box>
  );
};

export default Home;
