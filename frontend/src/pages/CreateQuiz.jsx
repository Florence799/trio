import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Typography, Box, TextField, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const CreateQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [error, setError] = useState('');

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate that all questions have a correct answer selected
    const invalid = questions.find(q => q.correctAnswer === '');
    if (invalid) {
      setError('Please select a correct answer for all questions.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/quizzes`, {
        title,
        courseId,
        timeLimit,
        questions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quiz');
    }
  };

  return (
    <Container className="py-4">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#1e293b' }}>Design New Quiz</Typography>
      
      {error && <Alert variant="danger" className="rounded-3 shadow-sm">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="glass-card mb-4 p-4 border-0">
          <Row>
            <Col md={8}>
              <TextField
                fullWidth
                label="Quiz Title"
                placeholder="e.g. Mid-Term Assessment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Col>
            <Col md={4}>
              <TextField
                fullWidth
                label="Time Limit (minutes)"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                required
                variant="outlined"
              />
            </Col>
          </Row>
        </Card>

        {questions.map((q, qIndex) => (
          <Card key={qIndex} className="glass-card mb-4 p-4 border-0">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6366f1' }}>Question {qIndex + 1}</Typography>
              <IconButton color="error" onClick={() => handleRemoveQuestion(qIndex)} disabled={questions.length === 1}>
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <TextField
              fullWidth
              label="Question Description"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              required
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>OPTIONS</Typography>
            <Row>
              {q.options.map((opt, optIndex) => (
                <Col md={6} key={optIndex} className="mb-3">
                  <TextField
                    fullWidth
                    label={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    required
                    variant="outlined"
                  />
                </Col>
              ))}
            </Row>

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                select
                label="Select Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                required
                variant="outlined"
                helperText="Which of the above is the right answer?"
              >
                {q.options.map((opt, i) => (
                  <MenuItem key={i} value={opt}>
                    {opt ? opt : `Option ${i + 1} (Empty)`}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Card>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button 
            variant="outline-primary" 
            onClick={handleAddQuestion} 
            className="d-flex align-items-center rounded-pill px-4 py-2"
          >
            <AddIcon sx={{ mr: 1 }} /> Add More Questions
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            className="btn-primary-custom rounded-pill px-5 py-2"
          >
            Publish Quiz
          </Button>
        </Box>
      </Form>
    </Container>
  );
};

export default CreateQuiz;
