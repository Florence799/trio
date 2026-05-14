import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Typography, Box, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const CreateAssignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('instructions', instructions);
    formData.append('deadline', deadline);
    formData.append('courseId', courseId);
    if (file) formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/assignments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create assignment');
    }
  };

  return (
    <Container className="py-4">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1a237e' }}>Create Assignment</Typography>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="p-4 shadow-sm border-0" style={{ borderRadius: '15px', maxWidth: '700px' }}>
        <Form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Instructions"
            multiline
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 3 }}
          />
          
          <Form.Group className="mb-4">
            <Form.Label>Reference Material (Optional)</Form.Label>
            <Form.Control 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 py-2 d-flex align-items-center justify-content-center">
            <CloudUploadIcon sx={{ mr: 1 }} /> Create Assignment
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateAssignment;
