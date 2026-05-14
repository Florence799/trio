import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card } from 'react-bootstrap';
import { Typography, Box, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const AssignmentsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const coursesResponse = await axios.get(`${API_BASE}/api/courses`, { headers });
        const assignmentResponses = await Promise.all(
          coursesResponse.data.map(async (course) => {
            const response = await axios.get(`${API_BASE}/api/assignments/course/${course._id}`, { headers });
            return response.data.map((assignment) => ({ ...assignment, course }));
          })
        );
        setItems(assignmentResponses.flat());
      } catch (err) {
        setError('Failed to load assignments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return <Container className="py-5 text-center"><Spinner /></Container>;
  }

  return (
    <Container className="mt-4 pb-5">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Assignments</Typography>
      {error && <Alert variant="danger">{error}</Alert>}
      {!items.length && <Alert variant="info">No assignments available.</Alert>}
      {items.map((item) => (
        <Card key={item._id} className="mb-3 shadow-sm border-0">
          <Card.Body>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.course?.courseName} | Due: {new Date(item.deadline).toLocaleString()}
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => navigate(`/courses/${item.course._id}`)}>View Details</Button>
            </Box>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default AssignmentsPage;
