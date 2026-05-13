import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { Typography, Box, Paper, IconButton, Tabs, Tab, Divider } from '@mui/material';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import Movie from '@mui/icons-material/Movie';
import Description from '@mui/icons-material/Description';
import UploadFile from '@mui/icons-material/UploadFile';
import Download from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import axios from 'axios';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', type: 'PDF', file: null });
  
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitFile, setSubmitFile] = useState(null);
  
  const [activeTab, setActiveTab] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [mRes, qRes, aRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/courses/${id}/materials`, { headers }),
        axios.get(`http://localhost:5000/api/quizzes/course/${id}`, { headers }),
        axios.get(`http://localhost:5000/api/assignments/course/${id}`, { headers })
      ]);
      setMaterials(mRes.data);
      setQuizzes(qRes.data);
      setAssignments(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('type', uploadData.type);
    formData.append('courseId', id);
    formData.append('file', uploadData.file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/courses/material', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowUpload(false);
      fetchAllData();
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('assignmentId', selectedAssignment._id);
    formData.append('file', submitFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/assignments/submit', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowSubmit(false);
      alert('Assignment submitted successfully!');
    } catch (err) {
      alert('Submission failed');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'PDF': return <PictureAsPdf color="error" />;
      case 'Video': return <Movie color="primary" />;
      default: return <Description color="action" />;
    }
  };

  return (
    <Container className="py-4">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Materials" />
          <Tab label="Quizzes" />
          <Tab label="Assignments" />
        </Tabs>
      </Box>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row>
          <Col md={8}>
            {activeTab === 0 && (
              <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
                  <Typography variant="h6">Course Materials</Typography>
                  {(user.role !== 'Student') && (
                    <Button variant="outline-primary" size="sm" onClick={() => setShowUpload(true)}>
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
                        <IconButton href={`http://localhost:5000${m.fileUrl}`} target="_blank">
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
                  {(user.role !== 'Student') && (
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
                        {user.role === 'Student' && (
                          q.isCompleted ? (
                            <Button variant="outline-success" size="sm" onClick={() => navigate(`/quiz-review/${q.resultId}`)}>View Review</Button>
                          ) : (
                            <Button variant="primary" size="sm" onClick={() => navigate(`/quizzes/${q._id}`)}>Take Quiz</Button>
                          )
                        )}
                        {user.role !== 'Student' && (
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
                  {(user.role !== 'Student') && (
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
                            <Button variant="outline-dark" size="sm" href={`http://localhost:5000${a.fileUrl}`} target="_blank">
                              <Download sx={{ fontSize: 16, mr: 1 }} /> Reference
                            </Button>
                          )}
                          {user.role === 'Student' && (
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
          </Col>

          <Col md={4}>
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
      <Modal show={showUpload} onHide={() => setShowUpload(false)} centered>
        <Modal.Header closeButton><Modal.Title>Upload Material</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" onChange={(e) => setUploadData({...uploadData, title: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select onChange={(e) => setUploadData({...uploadData, type: e.target.value})}>
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="PPT">PPT</option>
                <option value="Notes">Notes</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Select File</Form.Label>
              <Form.Control type="file" onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 py-2">Start Upload</Button>
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
