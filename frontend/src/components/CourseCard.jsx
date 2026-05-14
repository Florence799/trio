import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Typography, Box, Stack } from '@mui/material';
import Person from '@mui/icons-material/Person';

const CourseCard = ({ course, onOpen, facultyActions }) => {
  const desc = course.description || '';
  const preview = desc.length > 80 ? `${desc.substring(0, 80)}...` : desc || '—';

  return (
    <Card
      className="h-100 border-0 lms-card-hover"
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Box
        sx={{
          height: '6px',
          background: 'linear-gradient(90deg, #6366f1 0%, #7c3aed 50%, #14b8a6 100%)',
        }}
      />
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge className="rounded-pill px-3 py-2" style={{ fontSize: '0.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white', border: 'none' }}>
            {course.department}
          </Badge>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {course.year} · {course.section}
          </Typography>
        </div>
        <Card.Title className="mt-2" style={{ fontWeight: 800, minHeight: '2.75rem', fontSize: '1.1rem', lineHeight: 1.35, color: '#0f172a' }}>
          {course.courseName}
        </Card.Title>
        <Card.Text className="small" style={{ minHeight: '3rem', color: '#64748b', lineHeight: 1.5 }}>
          {preview}
        </Card.Text>
        <hr className="my-3 opacity-25" />
        <div className="d-flex align-items-center mb-3">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <Person sx={{ fontSize: 20, color: 'primary.main' }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {course.teacher?.name || 'Faculty'}
          </Typography>
        </div>

        {facultyActions ? (
          <Stack spacing={1.25}>
            <Button
              variant="primary"
              className="w-100 fw-semibold py-2"
              style={{ borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 6px 18px rgba(99, 102, 241, 0.35)' }}
              onClick={() => facultyActions.onViewMaterials(course)}
            >
              View Materials
            </Button>
            <Button
              variant="outline-secondary"
              className="w-100 fw-semibold py-2"
              style={{ borderRadius: '12px', borderWidth: 2 }}
              onClick={() => facultyActions.onViewFeedback(course)}
            >
              View Feedback
            </Button>
            <Button
              variant="outline-primary"
              className="w-100 fw-semibold py-2"
              style={{ borderRadius: '12px', borderWidth: 2 }}
              onClick={() => onOpen(course._id)}
            >
              Course details
            </Button>
          </Stack>
        ) : (
          <Button
            variant="primary"
            className="w-100 fw-semibold py-2"
            style={{ borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 6px 18px rgba(99, 102, 241, 0.35)' }}
            onClick={() => onOpen(course._id)}
          >
            View Materials
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
