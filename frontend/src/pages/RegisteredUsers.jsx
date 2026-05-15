import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner, Card, Form, Row, Col, Badge, Modal, Button as BsButton } from 'react-bootstrap';
import { Typography, Box, MenuItem, TextField, Tabs, Tab, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { API_BASE } from '../config';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const RegisteredUsers = () => {
  const [activeTab, setActiveTab] = useState('Students');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Registration Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: 'User@123', role: 'Student',
    registeredNumber: '', department: '', year: '1st Year', section: 'A', mobile: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const isAdmin = user?.role === 'Admin';

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isAdmin) {
        const roleFilter = activeTab === 'Students' ? 'Student' : 'Faculty';
        const response = await axios.get(`${API_BASE}/api/auth/users?role=${roleFilter}`, { headers });
        setUsers(response.data);
      } else {
        const coursesResponse = await axios.get(`${API_BASE}/api/courses`, { headers });
        setCourses(coursesResponse.data);
        if (coursesResponse.data.length && !selectedCourseId) {
          const firstCourseId = coursesResponse.data[0]._id;
          setSelectedCourseId(firstCourseId);
          fetchStudentsForCourse(firstCourseId);
        } else if (selectedCourseId) {
          fetchStudentsForCourse(selectedCourseId);
        }
      }
    } catch (err) {
      setError('Failed to load registered users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForCourse = async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/courses/${courseId}/students`, { headers });
      setUsers(response.data.students);
    } catch (err) {
      setError('Failed to fetch students for this course.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, isAdmin]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        ...newUser,
        role: activeTab === 'Students' ? 'Student' : 'Faculty'
      });
      setShowAddModal(false);
      setNewUser({
        name: '', email: '', password: 'User@123', role: 'Student',
        registeredNumber: '', department: '', year: '1st Year', section: 'A', mobile: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const updateYear = async (userId, year) => {
    try {
      await axios.patch(`${API_BASE}/api/auth/students/${userId}/year`, { year }, { headers });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, year } : u)));
    } catch (err) {
      setError('Failed to update academic year.');
    }
  };

  if (loading && !users.length) return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>;

  return (
    <Container className="mt-4 pb-5">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Registered Users
          </Typography>
          {isAdmin && (
            <Badge bg="primary" className="px-3 py-1 mt-1">Admin Management</Badge>
          )}
        </Box>
        {isAdmin && (
          <BsButton 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
            className="d-flex align-items-center gap-2 rounded-pill px-4"
          >
            <AddIcon /> Register {activeTab === 'Students' ? 'Student' : 'Faculty'}
          </BsButton>
        )}
      </Box>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {isAdmin ? (
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="Students" label={`Students (${activeTab === 'Students' ? users.length : '...'})`} />
          <Tab value="Faculty" label={`Faculty (${activeTab === 'Faculty' ? users.length : '...'})`} />
        </Tabs>
      ) : (
        <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
          <Card.Body>
            <Form.Label className="fw-bold text-muted small">Select Course</Form.Label>
            <TextField
              select
              fullWidth
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                fetchStudentsForCourse(e.target.value);
              }}
              size="small"
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.courseName} ({course.department} - {course.year} {course.section})
                </MenuItem>
              ))}
            </TextField>
          </Card.Body>
        </Card>
      )}

      {!users.length && !loading && (
        <Alert variant="info" className="text-center py-4">
          No registered {activeTab.toLowerCase()} found.
        </Alert>
      )}

      <Row>
        {users.map((u) => (
          <Col md={6} key={u._id} className="mb-3">
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '15px', transition: '0.3s' }}>
              <Card.Body>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{u.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
                      {u.role === 'Student' ? u.registeredNumber : `Faculty ID: ${u.registeredNumber}`}
                    </Typography>
                    <div className="small text-muted mb-2">
                      <i className="bi bi-envelope me-2"></i>{u.email}<br />
                      <i className="bi bi-telephone me-2"></i>{u.mobile}
                    </div>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Badge bg="light" text="dark" className="border">Dept: {u.department}</Badge>
                      {u.role === 'Student' && (
                        <>
                          <Badge bg="light" text="dark" className="border">Sec: {u.section}</Badge>
                          <Badge bg="info" className="ms-auto">{u.year || 'No Year'}</Badge>
                        </>
                      )}
                    </Box>
                  </Box>
                  
                  {u.role === 'Student' && (
                    <Box sx={{ minWidth: 120 }}>
                      <TextField
                        select
                        size="small"
                        value={u.year || ''}
                        onChange={(e) => updateYear(u._id, e.target.value)}
                        fullWidth
                        label="Year"
                      >
                        {YEAR_OPTIONS.map((year) => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  )}
                </Box>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Registration Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            Register New {activeTab === 'Students' ? 'Student' : 'Faculty'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddUser}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{activeTab === 'Students' ? 'Registered Number' : 'Faculty ID'}</Form.Label>
                  <Form.Control type="text" required value={newUser.registeredNumber} onChange={(e) => setNewUser({...newUser, registeredNumber: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control type="text" required value={newUser.mobile} onChange={(e) => setNewUser({...newUser, mobile: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select required value={newUser.department} onChange={(e) => setNewUser({...newUser, department: e.target.value})}>
                    <option value="">Select Dept</option>
                    {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'].map(d => <option key={d} value={d}>{d}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              {activeTab === 'Students' && (
                <>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Year</Form.Label>
                      <Form.Select value={newUser.year} onChange={(e) => setNewUser({...newUser, year: e.target.value})}>
                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Section</Form.Label>
                      <Form.Control type="text" value={newUser.section} onChange={(e) => setNewUser({...newUser, section: e.target.value})} />
                    </Form.Group>
                  </Col>
                </>
              )}
              <Col md={12}>
                <Alert variant="info" className="py-2 mb-0">
                  <small>Default password is set to: <strong>User@123</strong>. The user can change this after their first login.</small>
                </Alert>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <BsButton variant="light" onClick={() => setShowAddModal(false)}>Cancel</BsButton>
            <BsButton variant="primary" type="submit" className="px-4">Confirm Registration</BsButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default RegisteredUsers;
