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

// Import official assets
import campusBg from '../assets/collegeimage.jpeg';
import collegeLogo from '../assets/logo.jpeg';

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
        flex: isMobile ? '1' : '0 0 38%', 
        background: 'linear-gradient(135deg, #020E2B 0%, #06163A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        {/* Abstract Wave Pattern Overlay */}
        <Box className="wave-pattern-overlay" />

        {/* Glassmorphism Login Card */}
        <Box sx={{
          width: '85%',
          maxWidth: 400,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          padding: { xs: 3, md: 4.5 },
          animation: 'fadeInLeft 0.8s ease-out'
        }}>
          {/* College Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <img 
              src={collegeLogo} 
              alt="Logo" 
              style={{ width: 65, height: 65, objectFit: 'contain' }}
            />
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, lineHeight: 1.1, fontSize: '1rem' }}>
                SWARNANDHRA
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: '0.75rem', opacity: 0.9 }}>
                COLLEGE OF ENGINEERING
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>Login</Typography>

          {error && <Alert variant="danger" className="py-2 small text-center mb-3">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Box sx={{ mb: 2.5 }}>
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
                        <Email sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: { 
                      color: '#0F172A', 
                      bgcolor: 'white',
                      borderRadius: '8px',
                      height: '52px',
                      '& fieldset': { border: 'none' },
                    }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, display: 'block', ml: 0.5 }}>
                Email
              </Typography>
            </Box>

            <Box sx={{ mb: 3.5 }}>
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
                        <Lock sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748B' }}>
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { 
                      color: '#0F172A', 
                      bgcolor: 'white',
                      borderRadius: '8px',
                      height: '52px',
                      '& fieldset': { border: 'none' },
                    }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, display: 'block', ml: 0.5 }}>
                Password
              </Typography>
            </Box>

            <MuiButton
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                borderRadius: '8px',
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: '#0061FF',
                boxShadow: '0 4px 12px rgba(0, 97, 255, 0.3)',
                '&:hover': {
                  background: '#0056E0',
                }
              }}
            >
              Login
            </MuiButton>
          </Form>

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Link component={RouterLink} to="/forgot-password" sx={{ color: 'white', textDecoration: 'none', fontSize: '0.8rem', opacity: 0.8 }}>
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
        justifyContent: 'center',
        backgroundImage: `url(${campusBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'rgba(13, 27, 62, 0.05)', // Very subtle blue tint
        }
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: '25%',
          right: '8%',
          zIndex: 1, 
          textAlign: 'right', 
          animation: 'fadeInRight 1s ease-out' 
        }}>
          <Typography variant="h1" sx={{ 
            color: '#06163A', // EXACT Dark Navy from the image
            fontWeight: 800, 
            fontSize: { md: '3.5rem', lg: '4rem' }, 
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            maxWidth: '550px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Learning and <br /> Academic Support
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .wave-pattern-overlay {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px);
          opacity: 0.6;
        }
      `}</style>
    </Box>
  );
};

export default Login;
