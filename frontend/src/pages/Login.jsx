import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import {
  Box,
  Typography,
  TextField,
  Button as MuiButton,
  InputAdornment,
  IconButton,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import axios from 'axios';
import { API_BASE } from '../config';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const payload = identifier.includes('@') 
      ? { email: identifier, password } 
      : { registeredNumber: identifier, password };

    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw',
      overflow: 'hidden',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      
      {/* Left Login Panel */}
      <Box sx={{ 
        flex: isMobile ? '1' : '0 0 40%', 
        background: 'linear-gradient(135deg, #06163A 0%, #0B255E 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 3, md: 5 },
        zIndex: 2
      }}>
        {/* Abstract Wave Pattern Overlay */}
        <Box className="wave-pattern-overlay" />

        {/* Glassmorphism Login Card */}
        <Box sx={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          padding: { xs: 4, md: 5 },
          animation: 'fadeInLeft 0.8s ease-out'
        }}>
          {/* College Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
            <img 
              src="/assets/college_logo.png" 
              alt="Logo" 
              style={{ width: 60, height: 60, objectFit: 'contain' }}
            />
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.1, letterSpacing: '0.02em' }}>
                SWARNANDHRA
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.05em' }}>
                COLLEGE OF ENGINEERING
              </Typography>
            </Box>
          </Box>

          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>Login</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            Please enter your credentials to continue
          </Typography>

          {error && <Alert variant="danger" className="py-2 small text-center mb-3">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    sx: { 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                    }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1, display: 'block', ml: 1 }}>
                Email
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                    }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1, display: 'block', ml: 1 }}>
                Password
              </Typography>
            </Box>

            <MuiButton
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                borderRadius: '12px',
                py: 1.8,
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(90deg, #0061FF 0%, #60EFFF 100%)',
                boxShadow: '0 8px 25px rgba(0, 97, 255, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(0, 97, 255, 0.5)',
                }
              }}
            >
              Login
            </MuiButton>
          </Form>

          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Link component={RouterLink} to="/forgot-password" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, fontSize: '0.85rem' }}>
              Forgot Password?
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Right Campus Image Section */}
      <Box sx={{ 
        flex: isMobile ? '0' : '1', 
        position: 'relative',
        display: isMobile ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '10%',
        backgroundImage: 'url(/assets/campus_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #06163A 0%, transparent 100%)',
          opacity: 0.3
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'right', animation: 'fadeInRight 1s ease-out' }}>
          <Typography variant="h1" sx={{ 
            color: '#06163A', 
            fontWeight: 900, 
            fontSize: '3.5rem', 
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: '500px'
          }}>
            Learning and <br /> Academic Support
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .wave-pattern-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-4c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm20-46c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM21 39c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm65 31c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM82 34c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM56 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm75 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM29 13c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
          opacity: 0.3;
        }
      `}</style>
    </Box>
  );
};

export default Login;
