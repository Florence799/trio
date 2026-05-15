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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 5 }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              bgcolor: 'white',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={collegeLogo} 
                alt="Logo" 
                style={{ width: '90%', height: '90%', objectFit: 'contain' }}
              />
            </Box>
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
                      color: '#06163A', 
                      bgcolor: 'white',
                      borderRadius: '8px',
                      '& fieldset': { border: 'none' },
                      '& input::placeholder': { color: '#94A3B8', opacity: 1 }
                    }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, display: 'block', ml: 1, fontWeight: 600 }}>
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
                        <Lock sx={{ color: '#64748B' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748B' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { 
                      color: '#06163A', 
                      bgcolor: 'white',
                      borderRadius: '8px',
                      '& fieldset': { border: 'none' },
                      '& input::placeholder': { color: '#94A3B8', opacity: 1 }
                    }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, display: 'block', ml: 1, fontWeight: 600 }}>
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
        justifyContent: 'center',
        backgroundImage: `url(${campusBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%', // Focused on the building
        backgroundRepeat: 'no-repeat',
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: '15%',
          right: '5%',
          zIndex: 1, 
          textAlign: 'right', 
          animation: 'fadeInRight 1s ease-out' 
        }}>
          <Typography variant="h1" sx={{ 
            color: 'white', 
            fontWeight: 800, 
            fontSize: { md: '3.5rem', lg: '4.5rem' }, 
            lineHeight: 1,
            letterSpacing: '-0.01em',
            maxWidth: '600px',
            fontFamily: "'Poppins', sans-serif",
            textShadow: '0 4px 15px rgba(0,0,0,0.5)'
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
          background: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
          background-size: 24px 24px;
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px);
          opacity: 0.8;
        }
      `}</style>
    </Box>
  );
};

export default Login;
