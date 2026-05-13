import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Typography, Box } from '@mui/material';
import School from '@mui/icons-material/School';
import Person from '@mui/icons-material/Person';
import Group from '@mui/icons-material/Group';

const CourseCard = ({ course, onOpen }) => {
  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
      <Box sx={{ height: '10px', bgcolor: '#1a237e' }} />
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="primary" style={{ fontSize: '0.8rem' }}>{course.department}</Badge>
          <Typography variant="caption" color="textSecondary">{course.year} - {course.section}</Typography>
        </div>
        <Card.Title style={{ fontWeight: 'bold', minHeight: '3rem' }}>{course.courseName}</Card.Title>
        <Card.Text className="text-secondary small" style={{ minHeight: '3rem' }}>
          {course.description?.substring(0, 80)}...
        </Card.Text>
        <hr />
        <div className="d-flex align-items-center mb-3">
          <Person sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="textSecondary">Prof. {course.teacher?.name}</Typography>
        </div>
        <Button 
          variant="outline-primary" 
          className="w-100" 
          style={{ borderRadius: '10px' }}
          onClick={() => onOpen(course._id)}
        >
          View Materials
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
