import React, { useState } from 'react';
import { Container, Form, Card, Alert, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { Box, Typography, TextField, Button as MuiButton, MenuItem, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Badge from '@mui/icons-material/Badge';
import Phone from '@mui/icons-material/Phone';
import Email from '@mui/icons-material/Email';
import Person from '@mui/icons-material/Person';
import Work from '@mui/icons-material/Work';
import axios from 'axios';
import { API_BASE } from '../config';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Register = () => {
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    registeredNumber: '',
    department: '',
    section: '',
    mobile: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setError('Mobile number must contain exactly 10 digits.');
      return;
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      setError('Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, { ...formData, role });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess(`${role} registered successfully! Redirecting...`);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container className="py-5">
      <Card className="glass-card" style={{ width: '100%', maxWidth: '850px', margin: '0 auto', padding: '40px', border: 'none' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800, color: '#1e293b', mb: 4 }}>
          Join the LMS Community
        </Typography>

        <Tabs
          activeKey={role}
          onSelect={(k) => { setRole(k); setError(''); }}
          className="mb-4 custom-tabs"
          fill
        >
          <Tab eventKey="Student" title="Student Registration" />
          <Tab eventKey="Faculty" title="Faculty Registration" />
        </Tabs>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        {success && <Alert variant="success" className="text-center">{success}</Alert>}

        <Form onSubmit={handleRegister}>
          <Row>
            <Col md={6}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Col>
            <Col md={6}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Col>
          </Row>

          <Row>
            {role === 'Student' ? (
              <Col md={6}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Registered Number"
                    name="registeredNumber"
                    variant="outlined"
                    placeholder="e.g. 23A91A0501"
                    value={formData.registeredNumber}
                    onChange={handleChange}
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="primary" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
              </Col>
            ) : (
              <Col md={6}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Employee ID / Faculty ID"
                    name="registeredNumber"
                    variant="outlined"
                    placeholder="e.g. FAC123"
                    value={formData.registeredNumber}
                    onChange={handleChange}
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work color="primary" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
              </Col>
            )}
            <Col md={6}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  inputProps={{ maxLength: 10, pattern: '\\d{10}' }}
                  variant="outlined"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Col>
          </Row>

          <Row>
            <Col md={role === 'Student' ? 6 : 12}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  variant="outlined"
                  required
                >
                  {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'].map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Col>
            {role === 'Student' && (
                <Col md={6}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Section"
                      name="section"
                      placeholder="e.g. A"
                      variant="outlined"
                      value={formData.section}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                </Col>
            )}
          </Row>

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              helperText="Minimum 8 chars with 1 uppercase, 1 number, and 1 special character."
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
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
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)',
              }
            }}
          >
            Create Your Account
          </MuiButton>
        </Form>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account? <a href="/login" style={{ color: '#1a237e', textDecoration: 'none', fontWeight: 'bold' }}>Login here</a>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default Register;
