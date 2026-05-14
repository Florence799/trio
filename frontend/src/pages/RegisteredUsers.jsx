import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner, Card, Form } from 'react-bootstrap';
import { Typography, Box, MenuItem, TextField, Button } from '@mui/material';
import axios from 'axios';
import { API_BASE } from '../config';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const RegisteredUsers = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStudentsForCourse = async (courseId) => {
    if (!courseId) return;
    const response = await axios.get(`${API_BASE}/api/courses/${courseId}/students`, { headers });
    setStudents(response.data.students);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get(`${API_BASE}/api/courses`, { headers });
        setCourses(coursesResponse.data);
        if (coursesResponse.data.length) {
          const firstCourseId = coursesResponse.data[0]._id;
          setSelectedCourseId(firstCourseId);
          await fetchStudentsForCourse(firstCourseId);
        }
      } catch (err) {
        setError('Failed to load registered users.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateYear = async (userId, year) => {
    try {
      await axios.patch(`${API_BASE}/api/auth/students/${userId}/year`, { year }, { headers });
      setStudents((prev) => prev.map((student) => (student._id === userId ? { ...student, year } : student)));
    } catch (err) {
      setError('Failed to update academic year.');
    }
  };

  if (loading) return <Container className="py-5 text-center"><Spinner /></Container>;

  return (
    <Container className="mt-4 pb-5">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Registered Users</Typography>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Form.Label>Select Course</Form.Label>
          <TextField
            select
            fullWidth
            value={selectedCourseId}
            onChange={async (e) => {
              const courseId = e.target.value;
              setSelectedCourseId(courseId);
              await fetchStudentsForCourse(courseId);
            }}
          >
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.courseName} ({course.department} - {course.year} {course.section})
              </MenuItem>
            ))}
          </TextField>
        </Card.Body>
      </Card>

      {!students.length && <Alert variant="info">No registered students found for this course.</Alert>}
      {students.map((student) => (
        <Card key={student._id} className="mb-3 border-0 shadow-sm">
          <Card.Body>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6">{student.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.registeredNumber} | {student.email} | {student.mobile}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Department: {student.department} | Section: {student.section} | Academic Year: {student.year || 'Not set'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  select
                  size="small"
                  value={student.year || ''}
                  onChange={(e) => updateYear(student._id, e.target.value)}
                  sx={{ minWidth: 140 }}
                >
                  {YEAR_OPTIONS.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default RegisteredUsers;
