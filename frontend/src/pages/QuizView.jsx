import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { Typography, Box, Paper, Divider } from '@mui/material';
import Timer from '@mui/icons-material/Timer';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircle from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const QuizView = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Block retakes
        if (response.data.isCompleted) {
          navigate(`/quiz-review/${response.data.resultId}`);
          return;
        }

        setQuiz(response.data);
        setTimeLeft(response.data.timeLimit * 60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted && quiz) {
      handleSubmit();
    }
  }, [timeLeft, submitted, quiz]);

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/quizzes/submit`, {
        quizId,
        answers: Object.values(answers)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

  if (submitted && result) {
    return (
      <Container className="py-5 text-center">
        <Paper elevation={3} sx={{ p: 5, borderRadius: 4, maxWidth: '500px', margin: '0 auto' }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Quiz Completed!</Typography>
          <Typography variant="h5" color="primary" sx={{ my: 3, fontWeight: 'bold' }}>
            Your Score: {result.score} / {result.totalQuestions}
          </Typography>
          <ProgressBar now={(result.score / result.totalQuestions) * 100} variant="success" className="mb-4" style={{ height: '15px', borderRadius: '10px' }} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outline-primary" onClick={() => navigate(`/quiz-review/${result.resultId}`)}>Detailed Analysis</Button>
            <Button variant="primary" onClick={() => navigate('/performance')}>View Performance</Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {quiz && (
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
          <Box className="d-flex justify-content-between align-items-center mb-4 sticky-top bg-white py-3 shadow-sm px-3 rounded">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{quiz.title}</Typography>
            <Box className="d-flex align-items-center text-danger">
              <Timer sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{formatTime(timeLeft)}</Typography>
            </Box>
          </Box>

          {quiz.questions.map((q, index) => (
            <Card key={index} className="mb-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <Typography variant="h6" gutterBottom>
                  Question {index + 1}: {q.questionText}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Form>
                  {q.options.map((opt, optIndex) => (
                    <Form.Check 
                      type="radio"
                      id={`q-${index}-opt-${optIndex}`}
                      key={optIndex}
                      label={opt}
                      name={`question-${index}`}
                      className="py-2"
                      onChange={() => setAnswers({...answers, [index]: opt})}
                    />
                  ))}
                </Form>
              </Card.Body>
            </Card>
          ))}

          <Button 
            variant="success" 
            size="large" 
            className="w-100 py-3 mt-3 shadow" 
            style={{ borderRadius: '12px', fontSize: '1.2rem' }}
            onClick={handleSubmit}
          >
            Submit Quiz
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default QuizView;
