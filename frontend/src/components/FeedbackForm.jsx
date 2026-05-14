import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Typography, Box, Rating, TextField, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import { API_BASE } from '../config';

const FeedbackForm = ({ courseId, teacherId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/feedback/submit`, {
        courseId,
        teacherId,
        rating,
        comment,
        anonymous
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setComment('');
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success" className="rounded-4">
        Thank you! Your feedback has been submitted.
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <Card.Body className="p-4">
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Share Your Feedback
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Your feedback helps us improve the learning experience.
        </Typography>

        <Form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend" variant="subtitle2">Rating</Typography>
            <Rating
              name="course-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            label="Your Comments"
            multiline
            rows={3}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={anonymous} 
                  onChange={(e) => setAnonymous(e.target.checked)} 
                  color="primary"
                />
              }
              label={<Typography variant="body2">Submit anonymously</Typography>}
            />
          </Box>

          {error && <Alert variant="danger" className="mb-3 py-2">{error}</Alert>}

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 py-2 rounded-pill fw-bold"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm;
