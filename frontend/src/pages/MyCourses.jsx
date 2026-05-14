import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import {
  Typography,
  Box,
  IconButton,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { API_BASE } from '../config';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [materialsModal, setMaterialsModal] = useState({ open: false, course: null });
  const [materialsList, setMaterialsList] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  const [feedbackModal, setFeedbackModal] = useState({ open: false, course: null });
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isFaculty = user.role === 'Faculty' || user.role === 'Teacher' || user.role === 'Admin';
  const facultyId = user.id || user._id;

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/courses`, {
          headers: authHeaders(),
        });
        setCourses(response.data);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [authHeaders]);

  const openMaterialsModal = async (course) => {
    setError('');
    setMaterialsModal({ open: true, course });
    setMaterialsLoading(true);
    setMaterialsList([]);
    try {
      const res = await axios.get(`${API_BASE}/api/courses/${course._id}/materials`, {
        headers: authHeaders(),
      });
      setMaterialsList(res.data);
    } catch (err) {
      setError('Failed to load materials.');
      setMaterialsModal({ open: false, course: null });
    } finally {
      setMaterialsLoading(false);
    }
  };

  const closeMaterialsModal = () => {
    setMaterialsModal({ open: false, course: null });
    setMaterialsList([]);
  };

  const openFeedbackModal = async (course) => {
    setError('');
    setFeedbackModal({ open: true, course });
    setFeedbackLoading(true);
    setFeedbackList([]);
    try {
      if (!facultyId) throw new Error('No faculty id');
      const res = await axios.get(`${API_BASE}/api/feedback/teacher/${facultyId}`, {
        headers: authHeaders(),
      });
      const cid = String(course._id);
      const forCourse = res.data
        .filter((f) => {
          const fid = f.course && f.course._id ? String(f.course._id) : String(f.course || '');
          return fid === cid;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeedbackList(forCourse);
    } catch (err) {
      setError('Failed to load feedback.');
      setFeedbackModal({ open: false, course: null });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, course: null });
    setFeedbackList([]);
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!materialsModal.course || !window.confirm('Delete this material? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE}/api/courses/materials/${materialId}`, {
        headers: authHeaders(),
      });
      setMaterialsList((prev) => prev.filter((m) => m._id !== materialId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete material.');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!isFaculty) {
    return (
      <Container className="pb-5" style={{ maxWidth: 1100 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.1em' }}>
            Enrolment
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            My Courses
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Open a course to view materials, quizzes, and assignments.
          </Typography>
        </Box>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
          {courses.map((course) => (
            <Col md={4} key={course._id} className="mb-4">
              <CourseCard course={course} onOpen={(id) => navigate(`/courses/${id}`)} />
            </Col>
          ))}
        </Row>
        {!courses.length && <Alert variant="info">No courses found.</Alert>}
      </Container>
    );
  }

  return (
    <Container className="pb-5" style={{ maxWidth: 1100 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.1em' }}>
          Teaching
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          My Courses
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Use View Materials or View Feedback on each card — or open full course details.
        </Typography>
      </Box>
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {!courses.length && <Alert variant="info">No courses found.</Alert>}

      <Row>
        {courses.map((course) => (
          <Col md={4} lg={4} key={course._id} className="mb-4">
            <CourseCard
              course={course}
              onOpen={(id) => navigate(`/courses/${id}`)}
              facultyActions={{
                onViewMaterials: openMaterialsModal,
                onViewFeedback: openFeedbackModal,
              }}
            />
          </Col>
        ))}
      </Row>

      <Dialog open={materialsModal.open} onClose={closeMaterialsModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Uploaded materials
          {materialsModal.course && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {materialsModal.course.courseName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {materialsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : materialsList.length === 0 ? (
            <Typography color="text.secondary">No materials uploaded yet.</Typography>
          ) : (
            materialsList.map((m) => (
              <Box
                key={m._id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1,
                  py: 1.5,
                  borderBottom: '1px solid #e2e8f0',
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {m.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {m.type}
                    {m.createdAt && ` · ${new Date(m.createdAt).toLocaleDateString()}`}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Button
                      size="small"
                      href={`${API_BASE}${m.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open file
                    </Button>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  aria-label="Delete material"
                  onClick={() => handleDeleteMaterial(m._id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMaterialsModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={feedbackModal.open} onClose={closeFeedbackModal} fullWidth maxWidth="sm">
        <DialogTitle>
          Student feedback
          {feedbackModal.course && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {feedbackModal.course.courseName}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {feedbackLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : feedbackList.length === 0 ? (
            <Typography color="text.secondary">No feedback for this course yet.</Typography>
          ) : (
            feedbackList.map((f) => (
              <Box
                key={f._id}
                sx={{
                  py: 1.5,
                  borderBottom: '1px solid #ede9fe',
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {f.createdAt && new Date(f.createdAt).toLocaleString()}
                  </Typography>
                  <Rating value={f.rating} size="small" readOnly />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {f.anonymous ? 'Anonymous student' : f.student?.name || 'Student'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  &ldquo;{f.comment}&rdquo;
                </Typography>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFeedbackModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyCourses;
