import React, { useState } from 'react';
import { Container, Form, Card, Alert, Tab, Tabs } from 'react-bootstrap';
import { Box, Typography, TextField, Button as MuiButton, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Badge from '@mui/icons-material/Badge';
import Email from '@mui/icons-material/Email';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginType, setLoginType] = useState('student'); // 'student' or 'staff'
  const [identifier, setIdentifier] = useState(''); // email or reg number
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const isEmail = identifier.includes('@');
    const payload = isEmail 
      ? { email: identifier, password } 
      : { registeredNumber: identifier, password };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '30px', border: 'none' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800, mb: 4, color: '#1e293b' }}>
          Welcome Back
        </Typography>

        <Tabs
          activeKey={loginType}
          onSelect={(k) => { setLoginType(k); setIdentifier(''); setError(''); }}
          className="mb-4 custom-tabs"
          fill
        >
          <Tab eventKey="student" title="Student Login" />
          <Tab eventKey="staff" title="Staff/Admin Login" />
        </Tabs>

        {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label={loginType === 'student' ? "Registered Number or Email" : "Email or Staff ID"}
              variant="outlined"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {loginType === 'student' ? <Badge color="action" /> : <Email color="action" />}
                    </InputAdornment>
                  ),
                },
              }}
              placeholder={loginType === 'student' ? "e.g. 23A91A0501" : "e.g. admin@lms.com"}
            />
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
              borderRadius: '16px', 
              py: 2, 
              fontSize: '1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 25px rgba(99, 102, 241, 0.4)',
              }
            }}
          >
            Sign In to Your Account
          </MuiButton>
        </Form>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            New student? <a href="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>Register Account</a>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
