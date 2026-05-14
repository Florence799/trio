import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { Typography, Box, Paper, IconButton, Tabs, Tab, Divider, Rating } from '@mui/material';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import Movie from '@mui/icons-material/Movie';
import Description from '@mui/icons-material/Description';
import UploadFile from '@mui/icons-material/UploadFile';
import Download from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import axios from 'axios';
import { API_BASE } from '../config';
import FeedbackForm from '../components/FeedbackForm';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', type: 'PDF', file: null });
  const [materialUploading, setMaterialUploading] = useState(false);
  const [materialNotice, setMaterialNotice] = useState(null);
  
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitFile, setSubmitFile] = useState(null);
  
  const [activeTab, setActiveTab] = useState(0);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();
  const userId = user.id || user._id;
  const userRole = user.role;

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const requests = [
        axios.get(`${API_BASE}/api/courses/${id}`, { headers }),
        axios.get(`${API_BASE}/api/courses/${id}/materials`, { headers }),
        axios.get(`${API_BASE}/api/quizzes/course/${id}`, { headers }),
        axios.get(`${API_BASE}/api/assignments/course/${id}`, { headers })
      ];
      
      if (userRole && userRole !== 'Student' && userId) {
        requests.push(axios.get(`${API_BASE}/api/feedback/teacher/${userId}`, { headers }));
        requests.push(axios.get(`${API_BASE}/api/courses/${id}/students`, { headers }));
      }

      const results = await Promise.all(requests);
      
      setCourse(results[0].data);
      setMaterials(results[1].data);
      setQuizzes(results[2].data);
      setAssignments(results[3].data);
      if (userRole && userRole !== 'Student' && results[4]) {
        const courseFeedback = results[4].data.filter(f => f.course?._id === id || f.course === id);
        setFeedbacks(courseFeedback);
        if (results[5]) {
          setRegisteredStudents(results[5].data.students || []);
        }
      } else {
        setFeedbacks([]);
        setRegisteredStudents([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      setMaterialNotice({ variant: 'danger', text: 'Please select a file to upload.' });
      return;
    }
    const titleUsed = uploadData.title.trim();
    const formData = new FormData();
    formData.append('title', titleUsed);
    formData.append('type', uploadData.type);
    formData.append('courseId', id);
    formData.append('file', uploadData.file);

    setMaterialUploading(true);
    setMaterialNotice(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/courses/material`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowUpload(false);
      setUploadData({ title: '', type: 'PDF', file: null });
      setMaterialNotice({
        variant: 'success',
        text: `Material "${titleUsed}" was uploaded successfully and appears in the list below.`,
      });
      await fetchAllData();
    } catch (err) {
      let msg = err.response?.data?.error;
      if (!msg && (err.code === 'ERR_NETWORK' || err.message === 'Network Error')) {
        msg =
          'Could not reach the server (often a CORS or network issue). If you changed your Pages URL, the API must allow that origin.';
      }
      if (!msg) msg = err.message || 'Upload failed';
      setMaterialNotice({ variant: 'danger', text: msg });
    } finally {
      setMaterialUploading(false);
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submitFile || !selectedAssignment?._id) {
      alert('Please select a file to submit.');
      return;
    }
    const formData = new FormData();
    formData.append('assignmentId', selectedAssignment._id);
    formData.append('file', submitFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/assignments/submit`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowSubmit(false);
      alert('Assignment submitted successfully!');
    } catch (err) {
      alert('Submission failed');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <PictureAsPdf color="error" />;
      case 'Video':
        return <Movie color="primary" />;
      case 'Notes':
      case 'DOCX':
      case 'PPT':
        return <Description color="action" />;
      default:
        return <Description color="action" />;
    }
  };

  return (
    <Container className="py-4">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Materials" />
          <Tab label="Quizzes" />
          <Tab label="Assignments" />
          {userRole && userRole !== 'Student' && <Tab label="Feedback Analysis" />}
          {userRole && userRole !== 'Student' && <Tab label="Registered Students" />}
        </Tabs>
      </Box>

      {materialNotice && (
        <Alert
          variant={materialNotice.variant === 'success' ? 'success' : 'danger'}
          dismissible
          onClose={() => setMaterialNotice(null)}
          className="mb-3"
        >
          {materialNotice.text}
        </Alert>
      )}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row>
          <Col md={8}>
            {activeTab === 0 && (
              <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
                  <Typography variant="h6">Course Materials</Typography>
                  {(userRole && userRole !== 'Student') && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setMaterialNotice(null);
                        setShowUpload(true);
                      }}
                    >
                      <UploadFile /> Add Material
                    </Button>
                  )}
                </Card.Header>
                <ListGroup variant="flush">
                  {materials.length === 0 ? (
                    <ListGroup.Item className="py-5 text-center text-muted">No materials available.</ListGroup.Item>
                  ) : (
                    materials.map((m) => (
                      <ListGroup.Item key={m._id} className="py-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {getIcon(m.type)}
                          <div className="ms-3">
                            <Typography variant="subtitle2">{m.title}</Typography>
                            <Typography variant="caption" color="textSecondary">{m.type} • {new Date(m.createdAt).toLocaleDateString()}</Typography>
                          </div>
                        </div>
                        <IconButton href={`${API_BASE}${m.fileUrl}`} target="_blank" download>
                          <Download />
                        </IconButton>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card>
            )}

            {activeTab === 1 && (
              <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
                  <Typography variant="h6">Interactive Quizzes</Typography>
                  {(userRole && userRole !== 'Student') && (
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/courses/${id}/create-quiz`)}>
                      <QuizIcon /> Create Quiz
                    </Button>
                  )}
                </Card.Header>
                <ListGroup variant="flush">
                  {quizzes.length === 0 ? (
                    <ListGroup.Item className="py-5 text-center text-muted">No quizzes assigned.</ListGroup.Item>
                  ) : (
                    quizzes.map((q) => (
                      <ListGroup.Item key={q._id} className="py-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <QuizIcon color="secondary" />
                          <div className="ms-3">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">{q.title}</Typography>
                              {q.isCompleted && <Badge bg="success">Completed</Badge>}
                            </Box>
                            <Typography variant="caption" color="textSecondary">{q.timeLimit} mins</Typography>
                          </div>
                        </div>
                        {userRole === 'Student' && (
                          q.isCompleted ? (
                            <Button variant="outline-success" size="sm" onClick={() => navigate(`/quiz-review/${q.resultId}`)}>View Review</Button>
                          ) : (
                            <Button variant="primary" size="sm" onClick={() => navigate(`/quizzes/${q._id}`)}>Take Quiz</Button>
                          )
                        )}
                        {userRole && userRole !== 'Student' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => navigate(`/quizzes/${q._id}/submissions`)}
                            >
                              View Submissions
                            </Button>
                            <Badge bg="secondary">{q.submissionCount || 0} Submissions</Badge>
                          </Box>
                        )}
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card>
            )}

            {activeTab === 2 && (
              <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
                  <Typography variant="h6">Assignments</Typography>
                  {(userRole && userRole !== 'Student') && (
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/courses/${id}/create-assignment`)}>
                      <AssignmentIcon /> Post Assignment
                    </Button>
                  )}
                </Card.Header>
                <ListGroup variant="flush">
                  {assignments.length === 0 ? (
                    <ListGroup.Item className="py-5 text-center text-muted">No assignments yet.</ListGroup.Item>
                  ) : (
                    assignments.map((a) => (
                      <ListGroup.Item key={a._id} className="py-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex">
                            <AssignmentIcon color="primary" />
                            <div className="ms-3">
                              <Typography variant="subtitle2">{a.title}</Typography>
                              <Typography variant="body2" color="textSecondary">{a.instructions}</Typography>
                            </div>
                          </div>
                          <Badge bg="danger">Due: {new Date(a.deadline).toLocaleDateString()}</Badge>
                        </div>
                        <div className="mt-2 d-flex gap-2">
                          {a.fileUrl && (
                            <Button variant="outline-dark" size="sm" href={`${API_BASE}${a.fileUrl}`} target="_blank">
                              <Download sx={{ fontSize: 16, mr: 1 }} /> Reference
                            </Button>
                          )}
                          {userRole === 'Student' && (
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => { setSelectedAssignment(a); setShowSubmit(true); }}
                            >
                              Submit Assignment
                            </Button>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card>
            )}

            {activeTab === 3 && userRole && userRole !== 'Student' && (
              <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-white border-0 py-3">
                  <Typography variant="h6">Student Feedback & Ratings</Typography>
                </Card.Header>
                <ListGroup variant="flush">
                  {feedbacks.length === 0 ? (
                    <ListGroup.Item className="py-5 text-center text-muted">No feedback received yet.</ListGroup.Item>
                  ) : (
                    feedbacks.map((f) => (
                      <ListGroup.Item key={f._id} className="py-4">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {f.anonymous ? 'Anonymous Student' : f.student?.name}
                          </Typography>
                          <Rating value={f.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" color="textSecondary">"{f.comment}"</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                          Submitted on {new Date(f.createdAt).toLocaleDateString()}
                        </Typography>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card>
            )}

            {activeTab === 4 && userRole && userRole !== 'Student' && (
              <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-white border-0 py-3">
                  <Typography variant="h6">Registered Students</Typography>
                </Card.Header>
                <ListGroup variant="flush">
                  {registeredStudents.length === 0 ? (
                    <ListGroup.Item className="py-5 text-center text-muted">No students are currently registered for this course.</ListGroup.Item>
                  ) : (
                    registeredStudents.map((s) => (
                      <ListGroup.Item key={s._id} className="py-3 d-flex justify-content-between align-items-center">
                        <div>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{s.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{s.email}</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Badge bg="info" className="me-2">{s.registeredNumber || 'N/A'}</Badge>
                            <Badge bg="secondary">{s.department} - Year {s.year} ({s.section})</Badge>
                          </Box>
                        </div>
                        {s.mobile && (
                          <Typography variant="body2" color="primary">📞 {s.mobile}</Typography>
                        )}
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card>
            )}
          </Col>

          <Col md={4}>
            {userRole && userRole !== 'Student' && feedbacks.length > 0 && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#eef2ff', border: '1px solid #c7d2fe', mb: 3 }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>COURSE RATING</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {(feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)}
                  </Typography>
                  <Box>
                    <Rating value={feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length} readOnly precision={0.5} />
                    <Typography variant="caption" className="d-block text-muted">{feedbacks.length} Student Reviews</Typography>
                  </Box>
                </Box>
              </Paper>
            )}
            {userRole === 'Student' && course && (
              <Box sx={{ mb: 4 }}>
                <FeedbackForm 
                  courseId={id} 
                  teacherId={course.teacher?._id} 
                />
              </Box>
            )}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" gutterBottom>Dashboard</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Access all your academic resources here.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <div className="mb-2">
                <Typography variant="caption" className="d-block fw-bold text-muted">MATERIALS</Typography>
                <Typography variant="h6">{materials.length}</Typography>
              </div>
              <div className="mb-2">
                <Typography variant="caption" className="d-block fw-bold text-muted">QUIZZES</Typography>
                <Typography variant="h6">{quizzes.length}</Typography>
              </div>
              <div>
                <Typography variant="caption" className="d-block fw-bold text-muted">ASSIGNMENTS</Typography>
                <Typography variant="h6">{assignments.length}</Typography>
              </div>
            </Paper>
          </Col>
        </Row>
      )}

      {/* Upload Modal for Materials */}
      <Modal show={showUpload} onHide={() => !materialUploading && setShowUpload(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={uploadData.type}
                onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
              >
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="PPT">PPT</option>
                <option value="Notes">Notes</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                key={showUpload ? 'upload-open' : 'upload-closed'}
                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 py-2" disabled={materialUploading}>
              {materialUploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Uploading…
                </>
              ) : (
                'Start Upload'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Submission Modal */}
      <Modal show={showSubmit} onHide={() => setShowSubmit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit: {selectedAssignment?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAssignment}>
            <Form.Group className="mb-4">
              <Form.Label>Upload your work (PDF/Doc/Zip)</Form.Label>
              <Form.Control 
                type="file" 
                required 
                onChange={(e) => setSubmitFile(e.target.files[0])} 
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100 py-2">
              Confirm Submission
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourseDetails;
