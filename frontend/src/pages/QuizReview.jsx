import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { Typography, Box, Paper, Divider } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import ArrowBack from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { API_BASE } from '../config';

const QuizReview = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/quizzes/result/${resultId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResult(response.data);
        setNotes(response.data.studentNotes || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/quizzes/result/${resultId}/notes`, 
        { studentNotes: notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Notes saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-4">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button variant="link" onClick={() => navigate('/performance')} className="p-0 me-3">
          <ArrowBack />
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Quiz Review</Typography>
      </Box>

      {result && (
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
            <Typography variant="h5" gutterBottom>{result.quiz?.title}</Typography>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
              {result.score} / {result.totalQuestions}
            </Typography>
            <Typography variant="body1" color="textSecondary">Final Score</Typography>
          </Paper>

          {result.quiz?.questions.map((q, index) => {
            const studentAns = result.answers.find(a => a.questionIndex === index);
            const isCorrect = studentAns?.isCorrect;

            return (
              <Card key={index} className="mb-4 shadow-sm border-0" style={{ borderRadius: '15px', borderLeft: `8px solid ${isCorrect ? '#4caf50' : '#f44336'}` }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Typography variant="h6">
                      Question {index + 1}: {q.questionText}
                    </Typography>
                    {isCorrect ? <CheckCircle color="success" /> : <Cancel color="error" />}
                  </div>
                  <Divider sx={{ my: 2 }} />
                  <ListGroup variant="flush">
                    {q.options.map((opt, optIndex) => {
                      const isChosen = studentAns?.chosenAnswer === opt;
                      const isRightAns = q.correctAnswer === opt; // Faculty can see this, or we show after completion

                      return (
                        <ListGroup.Item 
                          key={optIndex} 
                          className={`border-0 rounded mb-2 ${isChosen ? (isCorrect ? 'bg-success-subtle' : 'bg-danger-subtle') : (isRightAns ? 'bg-success-subtle' : '')}`}
                          style={{ border: isChosen || isRightAns ? '1px solid' : 'none' }}
                        >
                          <div className="d-flex justify-content-between">
                            <span>{opt}</span>
                            {isChosen && <Badge bg={isCorrect ? "success" : "danger"}>Your Answer</Badge>}
                            {!isChosen && isRightAns && <Badge bg="success">Correct Answer</Badge>}
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            );
          })}
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>Personal Notes</Typography>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Add your notes about this quiz here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ borderRadius: '12px', padding: '15px', border: '1px solid #ddd' }}
            />
            <Button 
              className="mt-3" 
              onClick={handleSaveNotes} 
              disabled={savingNotes}
              style={{ borderRadius: '10px', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', border: 'none', padding: '10px 25px' }}
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default QuizReview;
