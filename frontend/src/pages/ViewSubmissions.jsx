import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Card, Badge, Spinner, Button } from 'react-bootstrap';
import { Typography, Box, Paper, IconButton } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const ViewSubmissions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/quizzes/submissions/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(response.data.submissions);
        setQuizTitle(response.data.quizTitle);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [quizId]);

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-4">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Student Submissions</Typography>
      </Box>

      <Card className="glass-card p-4 border-0">
        <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Quiz: {quizTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Total Participants: {submissions.length}
        </Typography>

        <Table responsive hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Registered No.</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4">No submissions yet.</td></tr>
            ) : (
              submissions.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td>{s.student?.name}</td>
                  <td>{s.student?.registeredNumber}</td>
                  <td><strong>{s.score}</strong> / {s.totalQuestions}</td>
                  <td>
                    <Badge bg={s.score/s.totalQuestions >= 0.7 ? "success" : (s.score/s.totalQuestions >= 0.4 ? "warning" : "danger")}>
                      {((s.score / s.totalQuestions) * 100).toFixed(1)}%
                    </Badge>
                  </td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button variant="link" size="sm" onClick={() => navigate(`/quiz-review/${s._id}`)}>Review</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default ViewSubmissions;
