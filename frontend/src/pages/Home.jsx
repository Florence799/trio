import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Box, Typography, Button, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import AutoStories from '@mui/icons-material/AutoStories';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
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
    <Box className="hero-page">
      <Box className="hero-overlay" />
      <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
        <Stack className="animate-reveal" direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Chip icon={<AutoStories sx={{ color: 'white !important' }} />} label="Courses & materials" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, backdropFilter: 'blur(8px)' }} />
          <Chip icon={<TrendingUp sx={{ color: 'white !important' }} />} label="Track progress" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, backdropFilter: 'blur(8px)' }} />
          {!materialStatsError && (
            <Chip
              icon={<Inventory2Outlined sx={{ color: 'white !important' }} />}
              label={
                materialTotal === null
                  ? 'Checking catalog…'
                  : `${materialTotal} published file${materialTotal === 1 ? '' : 's'} (open after sign-in)`
              }
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, backdropFilter: 'blur(8px)' }}
            />
          )}
        </Stack>
        <Box className="animate-reveal" sx={{ maxWidth: 720, py: { xs: 2, md: 4 }, animationDelay: '0.2s' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 45%, #c4b5fd 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 30px rgba(99, 102, 241, 0.3)',
            }}
          >
            Learn smarter. Teach clearer.
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(226, 232, 240, 0.95)', mb: 4, fontWeight: 400, lineHeight: 1.65, maxWidth: 560 }}>
            One place for faculty and students: courses, uploads, assignments, quizzes, and feedback — with a calm, focused experience.
            {!materialStatsError && materialTotal !== null && (
              <Box component="span" sx={{ display: 'block', mt: 1.5, fontSize: '0.95rem', opacity: 0.92 }}>
                The shared catalog currently includes {materialTotal} published learning file{materialTotal === 1 ? '' : 's'}. Sign in to browse titles and download your course materials.
              </Box>
            )}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: '0 12px 32px rgba(99, 102, 241, 0.35)',
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 40px rgba(99, 102, 241, 0.45)',
                }
              }}
            >
              Sign in with Email
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                color: 'white',
                borderRadius: '12px',
                borderColor: 'rgba(255,255,255,0.55)',
                borderWidth: 2,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Register with Email
            </Button>
          </Stack>
        </Box>

        {/* New Purpose Section */}
        <Box className="animate-reveal" sx={{ mt: 10, pt: 8, borderTop: '1px solid rgba(255,255,255,0.1)', animationDelay: '0.4s' }}>
          <Typography variant="overline" sx={{ color: '#c4b5fd', fontWeight: 800, letterSpacing: '0.2em' }}>
            Portal Purpose
          </Typography>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>
            Why choose LMS Pro?
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box sx={{ flex: 1, p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>For Students</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Access all your course materials, take interactive quizzes, submit assignments, and track your academic growth in one beautiful, distraction-free environment.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>For Faculty</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Easily manage your courses, distribute study materials, create automated quizzes, and analyze student feedback with built-in sentiment analysis.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>Secure & Unified</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                A secure login system ensures your data and intellectual property are protected. Integrated email-based authentication provides a seamless cross-device experience.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
