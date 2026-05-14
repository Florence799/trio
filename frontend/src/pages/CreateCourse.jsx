import React, { useState } from 'react';
import { Container, Form, Card, Alert, Row, Col } from 'react-bootstrap';
import { Box, Typography, TextField, Button as MuiButton, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    department: '',
    year: '',
    section: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/courses`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Course created successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    }
  };

  return (
    <Container className="py-5">
      <Card style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: 'none' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create New Course
        </Typography>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <TextField
              fullWidth
              label="Course Name"
              name="courseName"
              variant="outlined"
              value={formData.courseName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
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
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <TextField
                  fullWidth
                  select
                  label="Target Year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  variant="outlined"
                  required
                >
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </TextField>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
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
          </Form.Group>

          <MuiButton
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{ borderRadius: '10px', py: 1.5 }}
          >
            Create Course
          </MuiButton>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateCourse;
