import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, ListGroup } from 'react-bootstrap';
import { Typography, Box, Rating, Paper } from '@mui/material';
import axios from 'axios';
import { API_BASE } from '../config';

const FeedbackAnalysis = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const teacherId = user?._id || user?.id;
        const response = await axios.get(`${API_BASE}/api/feedback/teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbacks(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const tid = user?._id || user?.id;
    if (tid) {
      fetchFeedback();
    } else {
      setLoading(false);
    }
  }, [user?._id, user?.id]);

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <Container className="py-4">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#1e293b' }}>Global Feedback Analysis</Typography>
      
      <Row>
        <Col md={4}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#eef2ff', border: '1px solid #c7d2fe', mb: 4 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase' }}>Overall Faculty Rating</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#4338ca' }}>
                {averageRating}
              </Typography>
              <Box>
                <Rating value={parseFloat(averageRating)} readOnly precision={0.5} size="large" />
                <Typography variant="caption" className="d-block text-muted">{feedbacks.length} Total Reviews Across All Courses</Typography>
              </Box>
            </Box>
          </Paper>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0 glass-card" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-white border-0 py-3">
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#334155' }}>Detailed Student Reviews</Typography>
            </Card.Header>
            <ListGroup variant="flush">
              {feedbacks.length === 0 ? (
                <ListGroup.Item className="py-5 text-center text-muted border-0">No feedback received yet.</ListGroup.Item>
              ) : (
                feedbacks.map((f) => (
                  <ListGroup.Item key={f._id} className="py-4 border-bottom">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                          {f.anonymous ? 'Anonymous Student' : f.student?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, borderRadius: 1 }}>
                          Course: {f.course?.courseName || 'Unknown Course'}
                        </Typography>
                      </Box>
                      <Rating value={f.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#475569', fontStyle: 'italic', pl: 2, borderLeft: '3px solid #cbd5e1' }}>
                      "{f.comment}"
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                      Submitted on {new Date(f.createdAt).toLocaleDateString()}
                    </Typography>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FeedbackAnalysis;
