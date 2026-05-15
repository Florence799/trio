import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Badge, Row, Col } from 'react-bootstrap';
import { Typography, Box, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const AssignmentsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const isAdmin = user.role === 'Admin';

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        if (isAdmin) {
          const response = await axios.get(`${API_BASE}/api/assignments/admin/all`, { headers });
          setItems(response.data);
        } else {
          const coursesResponse = await axios.get(`${API_BASE}/api/courses`, { headers });
          const assignmentResponses = await Promise.all(
            coursesResponse.data.map(async (course) => {
              const response = await axios.get(`${API_BASE}/api/assignments/course/${course._id}`, { headers });
              return response.data.map((assignment) => ({ ...assignment, course }));
            })
          );
          setItems(assignmentResponses.flat());
        }
      } catch (err) {
        setError('Failed to load assignments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [isAdmin]);

  if (loading) {
    return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
  }

  return (
    <Container className="mt-4 pb-5">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>Assignments</Typography>
        {isAdmin && <Badge bg="primary">Admin Monitoring</Badge>}
      </Box>

      {error && <Alert variant="danger">{error}</Alert>}
      {!items.length && <Alert variant="info">No assignments available.</Alert>}

      <Row>
        {items.map((item) => (
          <Col md={12} key={item._id} className="mb-3">
            <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Course: <strong>{item.course?.courseName}</strong> | Due: {new Date(item.deadline).toLocaleString()}
                    </Typography>

                    {isAdmin && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Badge bg="light" text="dark" className="border">
                          <i className="bi bi-person-badge me-1"></i> Faculty: {item.course?.teacher?.name || 'Unknown'}
                        </Badge>
                        <Badge bg="light" text="dark" className="border">
                          <i className="bi bi-building me-1"></i> Class: {item.course?.department} - {item.course?.year} ({item.course?.section})
                        </Badge>
                      </Box>
                    )}
                  </Box>
                  <Button 
                    variant="contained" 
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                    onClick={() => navigate(isAdmin ? `/courses/${item.course?._id}` : `/courses/${item.course?._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AssignmentsPage;
