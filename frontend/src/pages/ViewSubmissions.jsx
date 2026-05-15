import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { Typography, Box, Paper, IconButton, Avatar, Tooltip as MuiTooltip, Alert } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { API_BASE } from '../config';

const ViewSubmissions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState('');
  const [plagiarismMatches, setPlagiarismMatches] = useState([]);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState(false);
  const [showPlagiarismModal, setShowPlagiarismModal] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/quizzes/submissions/${quizId}`, {
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

  const handleCheckPlagiarism = async () => {
    try {
      setCheckingPlagiarism(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/quizzes/plagiarism/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlagiarismMatches(response.data.matches || []);
      setShowPlagiarismModal(true);
    } catch (err) {
      console.error(err);
      alert('Error checking plagiarism');
    } finally {
      setCheckingPlagiarism(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Spinner animation="border" variant="primary" />
    </Box>
  );

  return (
    <Container className="py-5">
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, bgcolor: '#f1f5f9' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Submission Oversight</Typography>
            <Typography variant="subtitle2" color="textSecondary">{quizTitle}</Typography>
          </Box>
        </Box>
        <Button 
          variant="outline-danger" 
          className="d-flex align-items-center gap-2" 
          onClick={handleCheckPlagiarism}
          disabled={checkingPlagiarism}
          style={{ borderRadius: '12px', fontWeight: 700, padding: '10px 20px' }}
        >
          {checkingPlagiarism ? <Spinner size="sm" /> : <SecurityIcon />}
          Plagiarism Check
        </Button>
      </Box>

      <Paper className="glass-card overflow-hidden" sx={{ borderRadius: 6, border: 'none' }}>
        <Table responsive hover className="mb-0 custom-table">
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th className="py-4 ps-4 border-0">Student</th>
              <th className="py-4 border-0">ID / Reg No.</th>
              <th className="py-4 border-0">Score</th>
              <th className="py-4 border-0">Performance</th>
              <th className="py-4 border-0">Timestamp</th>
              <th className="py-4 pe-4 border-0 text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-5">No submissions detected.</td></tr>
            ) : (
              submissions.map((s) => (
                <tr key={s._id} style={{ verticalAlign: 'middle' }}>
                  <td className="py-3 ps-4">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#e0e7ff', color: '#6366f1', fontWeight: 700 }}>
                        {s.student?.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {s.student?.name}
                      </Typography>
                    </Box>
                  </td>
                  <td className="py-3">
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      {s.student?.registeredNumber}
                    </Typography>
                  </td>
                  <td className="py-3">
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1" sx={{ fontWeight: 800 }}>{s.score} / {s.totalQuestions}</Typography>
                      <Typography variant="caption" color="textSecondary">Raw Points</Typography>
                    </Box>
                  </td>
                  <td className="py-3">
                    <Badge 
                      className="px-3 py-2"
                      bg="none"
                      style={{ 
                        borderRadius: '8px', 
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        backgroundColor: s.score/s.totalQuestions >= 0.7 ? '#dcfce7' : (s.score/s.totalQuestions >= 0.4 ? '#fef9c3' : '#fee2e2'),
                        color: s.score/s.totalQuestions >= 0.7 ? '#166534' : (s.score/s.totalQuestions >= 0.4 ? '#854d0e' : '#991b1b')
                      }}
                    >
                      {((s.score / s.totalQuestions) * 100).toFixed(0)}%
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </td>
                  <td className="py-3 pe-4 text-end">
                    <Button 
                      variant="light" 
                      className="px-4" 
                      style={{ borderRadius: '10px', fontWeight: 700, border: '1px solid #e2e8f0' }}
                      onClick={() => navigate(`/quiz-review/${s._id}`)}
                    >
                      Audit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Paper>

      {/* Plagiarism Modal */}
      <Modal show={showPlagiarismModal} onHide={() => setShowPlagiarismModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title sx={{ fontWeight: 800 }}>Integrity Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {plagiarismMatches.length === 0 ? (
            <Alert severity="success" icon={<SecurityIcon />} sx={{ borderRadius: 3 }}>
              No high-similarity matches found. All submissions appear unique.
            </Alert>
          ) : (
            <Box>
              <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3, borderRadius: 3 }}>
                Detected {plagiarismMatches.length} pairs of submissions with high similarity.
              </Alert>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {plagiarismMatches.map((m, i) => (
                  <Paper key={i} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff5f5', border: '1px solid #feb2b2' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.student1.name}</Typography>
                        <Typography variant="caption" color="textSecondary">vs</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.student2.name}</Typography>
                      </Box>
                      <Badge bg="danger" style={{ fontSize: '1rem' }}>{m.similarity}% Match</Badge>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowPlagiarismModal(false)} style={{ borderRadius: '10px' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewSubmissions;
