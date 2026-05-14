import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Card, Alert, Tab, Tabs } from 'react-bootstrap';
import {
  Box,
  Typography,
  TextField,
  Button as MuiButton,
  InputAdornment,
  IconButton,
  Stack,
  Chip,
  Link,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Badge from '@mui/icons-material/Badge';
import Email from '@mui/icons-material/Email';
import School from '@mui/icons-material/School';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import AutoGraphOutlined from '@mui/icons-material/AutoGraphOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import axios from 'axios';
import { API_BASE } from '../config';

const Login = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [loginType, setLoginType] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const isEmail = identifier.includes('@');
    const payload = isEmail ? { email: identifier, password } : { registeredNumber: identifier, password };

    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const showcase = (
    <Box
      className="login-showcase"
      sx={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        minHeight: { md: 'min(640px, calc(100vh - 100px))' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { md: 5, lg: 7 },
        py: { xs: 3, md: 4 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '12%',
          right: '8%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)',
          filter: 'blur(2px)',
          animation: 'loginOrbA 14s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '18%',
          left: '5%',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, transparent 68%)',
          filter: 'blur(2px)',
          animation: 'loginOrbB 18s ease-in-out infinite',
        }}
      />

      <Stack spacing={2.5} sx={{ position: 'relative', maxWidth: 420 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            }}
          >
            <School sx={{ fontSize: 30, color: '#4f46e5' }} />
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: alpha('#fff', 0.75), fontWeight: 800, letterSpacing: '0.2em' }}>
              LMS Pro
            </Typography>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
              Sign in to your learning space
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body1" sx={{ color: alpha('#fff', 0.88), lineHeight: 1.7, fontSize: '1.05rem' }}>
          Sign in to open your dashboard — courses, quizzes, assignments, and shared files stay protected until you authenticate.
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          <Chip
            icon={<ShieldOutlined sx={{ color: `${alpha('#fff', 0.95)} !important` }} />}
            label="Secure session"
            sx={{ bgcolor: alpha('#fff', 0.12), color: '#fff', fontWeight: 600, border: `1px solid ${alpha('#fff', 0.2)}`, backdropFilter: 'blur(8px)' }}
          />
          <Chip
            icon={<MenuBookOutlined sx={{ color: `${alpha('#fff', 0.95)} !important` }} />}
            label="Learning hub after sign-in"
            sx={{ bgcolor: alpha('#fff', 0.12), color: '#fff', fontWeight: 600, border: `1px solid ${alpha('#fff', 0.2)}`, backdropFilter: 'blur(8px)' }}
          />
          <Chip
            icon={<AutoGraphOutlined sx={{ color: `${alpha('#fff', 0.95)} !important` }} />}
            label="Progress after login"
            sx={{ bgcolor: alpha('#fff', 0.12), color: '#fff', fontWeight: 600, border: `1px solid ${alpha('#fff', 0.2)}`, backdropFilter: 'blur(8px)' }}
          />
          {!materialStatsError && (
            <Chip
              icon={<Inventory2Outlined sx={{ color: `${alpha('#fff', 0.95)} !important` }} />}
              label={
                materialTotal === null
                  ? 'Checking catalog…'
                  : `${materialTotal} published file${materialTotal === 1 ? '' : 's'} in hub (open after sign-in)`
              }
              sx={{ bgcolor: alpha('#fff', 0.12), color: '#fff', fontWeight: 600, border: `1px solid ${alpha('#fff', 0.2)}`, backdropFilter: 'blur(8px)' }}
            />
          )}
        </Stack>

        <Box
          sx={{
            mt: 2,
            p: 2.5,
            borderRadius: 3,
            bgcolor: alpha('#0f172a', 0.35),
            border: `1px solid ${alpha('#fff', 0.12)}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.75), fontStyle: 'italic', lineHeight: 1.65 }}>
            Materials, uploads, and saving your work unlock only after you log in — nothing is stored from this screen until you enter your workspace.
            {!materialStatsError && materialTotal !== null && (
              <>
                {' '}
                Right now the catalog holds{' '}
                <Box component="span" sx={{ fontWeight: 800, fontStyle: 'normal', color: alpha('#fff', 0.95) }}>
                  {materialTotal}
                </Box>{' '}
                published learning file{materialTotal === 1 ? '' : 's'}; titles and downloads appear only inside your signed-in workspace.
              </>
            )}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

  const formCard = (
    <Card
      className="glass-card floating-card login-form-card"
      style={{
        width: '100%',
        maxWidth: 440,
        padding: 0,
        border: 'none',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: 5,
          background: 'linear-gradient(90deg, #6366f1, #a855f7, #14b8a6)',
        }}
      />
      <Box sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.14em' }}>
          Access
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sign in to reach your courses. Uploading files, viewing materials, and saving progress happen only inside your account after login.
        </Typography>

        {!materialStatsError && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6 }}>
              {materialTotal === null
                ? 'Checking how many published materials are in the catalog…'
                : `The catalog currently has ${materialTotal} published learning file${materialTotal === 1 ? '' : 's'}. Lists, previews, and downloads are available only after you sign in.`}
            </Typography>
          </Box>
        )}

        <Tabs
          activeKey={loginType}
          onSelect={(k) => {
            setLoginType(k);
            setIdentifier('');
            setError('');
          }}
          className="mb-4 custom-tabs"
          fill
        >
          <Tab eventKey="student" title="Student" />
          <Tab eventKey="staff" title="Faculty / Admin" />
        </Tabs>

        {error && (
          <Alert variant="danger" className="py-2 text-center mb-3" style={{ borderRadius: 12 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleLogin}>
          <Box sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              label={loginType === 'student' ? 'Email Address or Registered Number' : 'Email Address or Faculty ID'}
              variant="outlined"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                },
              }}
              placeholder={loginType === 'student' ? 'student@email.com or 23A91A0501' : 'faculty@email.com or FAC123'}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="Toggle password">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <MuiButton
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{
              borderRadius: '14px',
              py: 2,
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 8px 28px rgba(99, 102, 241, 0.35)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 14px 36px rgba(99, 102, 241, 0.45)',
              },
            }}
          >
            Enter workspace
          </MuiButton>
        </Form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            New here?{' '}
            <Link component={RouterLink} to="/register" fontWeight={700} underline="hover">
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box className="login-page login-page-creative" sx={{ position: 'relative' }}>
      <Box className="login-mesh-overlay" aria-hidden />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: { xs: 'calc(100vh - var(--navbar-height))', md: 'calc(100vh - var(--navbar-height))' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: { md: 'center' },
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, md: 3 },
        }}
      >
        {!isMdUp && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#fff', 0.15),
                  border: `1px solid ${alpha('#fff', 0.25)}`,
                }}
              >
                <School sx={{ color: '#fff', fontSize: 26 }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>
                LMS Pro
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
              Sign in below to continue
            </Typography>
          </Box>
        )}

        {isMdUp && (
          <Box
            sx={{
              flex: '1 1 48%',
              maxWidth: { md: 520 },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showcase}
          </Box>
        )}

        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '1 1 45%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 1, md: 2 },
          }}
        >
          {formCard}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
