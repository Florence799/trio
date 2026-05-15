import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner, Card, Form, Row, Col, Badge } from 'react-bootstrap';
import { Typography, Box, MenuItem, TextField, Tabs, Tab } from '@mui/material';
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

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const isAdmin = user?.role === 'Admin';

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isAdmin) {
        // Admin fetches global lists
        const roleFilter = activeTab === 'Students' ? 'Student' : 'Faculty';
        const response = await axios.get(`${API_BASE}/api/auth/users?role=${roleFilter}`, { headers });
        setUsers(response.data);
      } else {
        // Faculty fetches course-specific students
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Registered Users
        </Typography>
        {isAdmin && (
          <Badge bg="primary" className="px-3 py-2">Admin View</Badge>
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
                      {u.role === 'Student' ? u.registeredNumber : `ID: ${u.registeredNumber}`}
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
    </Container>
  );
};

export default RegisteredUsers;
