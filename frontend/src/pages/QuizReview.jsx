import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { Typography, Box, Paper, Divider, Avatar, TextField } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import ArrowBack from '@mui/icons-material/ArrowBack';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import axios from 'axios';
import { API_BASE } from '../config';

const QuizReview = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const isFaculty = user?.role !== 'Student';

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/quizzes/result/${resultId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResult(response.data);
        setNotes(response.data.studentNotes || '');
        setFeedback(response.data.feedback || '');
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
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/quizzes/result/${resultId}/notes`, 
        { studentNotes: notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Personal notes archived.');
    } catch (err) {
      console.error(err);
      alert('Archive operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeedback = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/quizzes/result/${resultId}/feedback`, 
        { feedback: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Faculty insights published.');
    } catch (err) {
      console.error(err);
      alert('Publication failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Spinner animation="grow" variant="primary" />
    </Box>
  );

  return (
    <Container className="py-5">
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, bgcolor: '#f1f5f9' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Post-Quiz Analysis</Typography>
            <Typography variant="subtitle2" color="textSecondary">{result?.quiz?.title}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#e0e7ff', color: '#6366f1' }}>
            <PsychologyIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{result?.student?.name || user?.name}</Typography>
            <Typography variant="caption" color="textSecondary">Examinee</Typography>
          </Box>
        </Box>
      </Box>

      {result && (
        <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
          <Paper className="glass-card" sx={{ p: 5, mb: 5, borderRadius: 6, textAlign: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: '#6366f1', letterSpacing: 2 }}>Final Score Outcome</Typography>
            <Typography variant="h1" sx={{ fontWeight: 900, color: '#1e293b', my: 1 }}>
              {result.score} <span style={{ fontSize: '2rem', color: '#94a3b8' }}>/ {result.totalQuestions}</span>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Badge bg="none" style={{ backgroundColor: '#dcfce7', color: '#166534', borderRadius: '10px', padding: '8px 16px', fontWeight: 800 }}>
                {((result.score / result.totalQuestions) * 100).toFixed(1)}% Accuracy
              </Badge>
              <Badge bg="none" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '10px', padding: '8px 16px', fontWeight: 800 }}>
                {new Date(result.createdAt).toLocaleDateString()}
              </Badge>
            </Box>
          </Paper>

          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: '#1e293b', px: 2 }}>Question Breakdown</Typography>
          
          {result.quiz?.questions.map((q, index) => {
            const studentAns = result.answers.find(a => a.questionIndex === index);
            const isCorrect = studentAns?.isCorrect;

            return (
              <Card key={index} className="mb-4 border-0 overflow-hidden shadow-sm" style={{ borderRadius: '24px' }}>
                <Box sx={{ height: '6px', bgcolor: isCorrect ? '#22c55e' : '#ef4444' }} />
                <Card.Body className="p-4">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', flex: 1 }}>
                      {index + 1}. {q.questionText}
                    </Typography>
                    <Avatar sx={{ bgcolor: isCorrect ? '#dcfce7' : '#fee2e2', color: isCorrect ? '#166534' : '#991b1b', width: 32, height: 32 }}>
                      {isCorrect ? <CheckCircle sx={{ fontSize: 20 }} /> : <Cancel sx={{ fontSize: 20 }} />}
                    </Avatar>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {q.options.map((opt, optIndex) => {
                      const isChosen = studentAns?.chosenAnswer === opt;
                      const isRightAns = q.correctAnswer === opt;

                      return (
                        <Box 
                          key={optIndex} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 3, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            border: '1px solid',
                            borderColor: isChosen ? (isCorrect ? '#22c55e' : '#ef4444') : (isRightAns ? '#22c55e' : '#f1f5f9'),
                            bgcolor: isChosen ? (isCorrect ? '#f0fdf4' : '#fef2f2') : (isRightAns ? '#f0fdf4' : 'transparent'),
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: isChosen || isRightAns ? 700 : 500, color: isChosen || isRightAns ? '#1e293b' : '#64748b' }}>
                            {opt}
                          </Typography>
                          {isChosen && (
                            <Chip 
                              label={isCorrect ? "Correct Choice" : "Your Answer"} 
                              size="small" 
                              sx={{ fontWeight: 800, bgcolor: isCorrect ? '#22c55e' : '#ef4444', color: 'white' }} 
                            />
                          )}
                          {!isChosen && isRightAns && (
                            <Chip label="Correct Answer" variant="outlined" size="small" sx={{ fontWeight: 800, borderColor: '#22c55e', color: '#166534' }} />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Card.Body>
              </Card>
            );
          })}

          <Row className="g-4 mt-2">
            <Col md={6}>
              <Paper className="glass-card" sx={{ p: 4, borderRadius: 6, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <DriveFileRenameOutlineIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Student Workspace</Typography>
                </Box>
                {!isFaculty ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      placeholder="Synthesize your learnings or mark questions for review..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
                    />
                    <Button 
                      className="mt-3 w-100" 
                      onClick={handleSaveNotes} 
                      disabled={saving}
                      style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', padding: '12px', fontWeight: 700 }}
                    >
                      {saving ? 'Syncing...' : 'Save Observations'}
                    </Button>
                  </>
                ) : (
                  <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 700 }}>Student's Notes:</Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                      {notes || "No workspace entries made by the student."}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Col>

            <Col md={6}>
              <Paper className="glass-card" sx={{ p: 4, borderRadius: 6, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#fff7ed', color: '#ea580c', width: 24, height: 24 }}>
                    <PsychologyIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Faculty Insights</Typography>
                </Box>
                {isFaculty ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      placeholder="Provide constructive feedback for the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#fff7ed' } }}
                    />
                    <Button 
                      className="mt-3 w-100" 
                      onClick={handleSaveFeedback} 
                      disabled={saving}
                      style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', border: 'none', padding: '12px', fontWeight: 700 }}
                    >
                      {saving ? 'Publishing...' : 'Submit Feedback'}
                    </Button>
                  </>
                ) : (
                  <Box sx={{ p: 3, bgcolor: '#fff7ed', borderRadius: 4, border: '1px solid #ffedd5' }}>
                    <Typography variant="body1" sx={{ color: '#9a3412', lineHeight: 1.6, fontStyle: feedback ? 'normal' : 'italic' }}>
                      {feedback || "Awaiting faculty evaluation. Check back soon for detailed insights."}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Col>
          </Row>
        </Box>
      )}
    </Container>
  );
};

export default QuizReview;
