import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Button, Card, Badge, Stack } from 'react-bootstrap';
import { Box, Typography, Avatar, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';

const Home = () => {
  const [materialTotal, setMaterialTotal] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    axios.get(`${API_BASE}/api/public/material-stats`)
      .then(res => setMaterialTotal(res.data.totalMaterials))
      .catch(() => {});
  }, []);

  const features = [
    { icon: 'bi-lightbulb', title: 'Smart Learning', desc: 'Personalized learning paths tailored to your pace.' },
    { icon: 'bi-cpu', title: 'AI Recommendations', desc: 'Get content suggestions based on your interests.' },
    { icon: 'bi-graph-up-arrow', title: 'Live Progress', desc: 'Track your growth with real-time analytics.' },
    { icon: 'bi-journal-check', title: 'Online Assessments', desc: 'Interactive quizzes and automated grading.' },
    { icon: 'bi-patch-check', title: 'Certificates & Badges', desc: 'Earn recognized credentials as you learn.' },
    { icon: 'bi-shield-check', title: 'Plagiarism Detection', desc: 'Advanced AI audit for academic integrity.' }
  ];

  const courses = [
    { title: 'ReactJS Mastery', level: 'Intermediate', progress: 75, color: '#61DAFB' },
    { title: 'NodeJS Backend', level: 'Advanced', progress: 40, color: '#339933' },
    { title: 'Python for AI', level: 'Beginner', progress: 90, color: '#3776AB' },
    { title: 'Data Science', level: 'Expert', progress: 20, color: '#F7931E' },
    { title: 'UI/UX Design', level: 'Beginner', progress: 65, color: '#EA4335' }
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Floating Gradient Blobs */}
      <Box sx={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%)',
        zIndex: 0,
        animation: 'blobFloat 20s infinite linear'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        zIndex: 0,
        animation: 'blobFloat 25s infinite linear reverse'
      }} />

      {/* Hero Section */}
      <section id="home" className="pt-5 mt-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="position-relative" style={{ zIndex: 1 }}>
              <Badge bg="transparent" className="mb-3 px-3 py-2 border text-teal" style={{ borderColor: '#14B8A6', color: '#14B8A6', borderRadius: '50px', fontWeight: 600 }}>
                ✨ Next-Gen Learning Experience
              </Badge>
              <Typography variant="h1" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '4rem' }, color: '#0F172A', lineHeight: 1.1 }}>
                Learn. Grow. <br />
                <span style={{ color: '#14B8A6' }}>Succeed Together.</span>
              </Typography>
              <Typography variant="h6" sx={{ color: '#64748B', mb: 4, maxWidth: '500px', fontWeight: 400, lineHeight: 1.6 }}>
                An AI-powered LMS platform designed for students, teachers, and institutions to excel in the digital age.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  as={Link} to="/login"
                  className="px-4 py-3 border-0" 
                  style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #4F46E5 100%)', borderRadius: '12px', fontWeight: 700, boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)' }}
                >
                  Launch Learning Portal
                </Button>
                <Button 
                  variant="outline-secondary"
                  className="px-4 py-3" 
                  style={{ borderRadius: '12px', fontWeight: 600, border: '2px solid #E2E8F0', color: '#64748B' }}
                >
                  Explore Courses
                </Button>
              </Stack>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <Box className="glass-panel p-4" sx={{ borderRadius: '24px', position: 'relative', transition: 'transform 0.5s ease', '&:hover': { transform: 'translateY(-10px)' } }}>
                {/* Dashboard Preview Mockup */}
                <Box sx={{ bgcolor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Student Workspace</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF5F57' }} />
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FEBC2E' }} />
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#28C840' }} />
                    </Box>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px' }}>
                          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>CURRENT PROGRESS</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>ReactJS Development</Typography>
                          <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 5, mt: 1, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#14B8A6' } }} />
                        </Box>
                      </Col>
                      <Col xs={6}>
                        <Box sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#166534' }}>12</Typography>
                          <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>COMPLETED</Typography>
                        </Box>
                      </Col>
                      <Col xs={6}>
                        <Box sx={{ p: 2, bgcolor: '#EEF2FF', borderRadius: '12px', border: '1px solid #E0E7FF' }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#3730A3' }}>4</Typography>
                          <Typography variant="caption" sx={{ color: '#3730A3', fontWeight: 600 }}>PENDING</Typography>
                        </Box>
                      </Col>
                    </Row>
                  </Box>
                </Box>
                {/* Floating elements */}
                <Box sx={{ position: 'absolute', top: '-20px', right: '-20px', bgcolor: '#22C55E', color: 'white', p: 2, borderRadius: '12px', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.3)', animation: 'float 4s infinite ease-in-out' }}>
                  <i className="bi bi-award-fill fs-4"></i>
                </Box>
              </Box>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 my-5">
        <Container>
          <div className="text-center mb-5">
            <Typography variant="overline" sx={{ color: '#14B8A6', fontWeight: 800, letterSpacing: 2 }}>POWERFUL FEATURES</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Why Choose LMS Pro?</Typography>
            <Typography variant="body1" sx={{ color: '#64748B', maxWidth: '600px', mx: 'auto' }}>
              Built with cutting-edge AI to provide a seamless learning experience for everyone.
            </Typography>
          </div>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col md={4} key={i}>
                <Box className="glass-panel h-100 p-4" sx={{ borderRadius: '20px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', bgcolor: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' } }}>
                  <Box sx={{ width: 50, height: 50, borderRadius: '12px', bgcolor: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <i className={`bi ${f.icon} fs-3`}></i>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>{f.desc}</Typography>
                </Box>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-5" style={{ background: 'rgba(79, 70, 229, 0.02)' }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <Typography variant="overline" sx={{ color: '#4F46E5', fontWeight: 800, letterSpacing: 2 }}>STUDENT DASHBOARD</Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>Analyze your performance in real-time.</Typography>
              <Typography variant="body1" sx={{ color: '#64748B', mb: 4, lineHeight: 1.7 }}>
                Get deep insights into your learning habits. Our AI analyzes your quiz attempts and assignment submissions to give you the best path forward.
              </Typography>
              <ul className="list-unstyled">
                {['Interactive Progress Charts', 'Upcoming Class Reminders', 'Detailed Quiz Analytics'].map((item, i) => (
                  <li key={i} className="mb-3 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-teal me-2" style={{ color: '#14B8A6' }}></i>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{item}</Typography>
                  </li>
                ))}
              </ul>
            </Col>
            <Col lg={7}>
              <Box className="glass-panel p-2 p-md-4" sx={{ borderRadius: '32px' }}>
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" alt="Dashboard" className="img-fluid rounded-4 shadow-lg" />
              </Box>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-5 my-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
            <div>
              <Typography variant="overline" sx={{ color: '#14B8A6', fontWeight: 800, letterSpacing: 2 }}>CURATED CATALOG</Typography>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>Explore Popular Courses</Typography>
            </div>
            <Button variant="link" className="text-decoration-none fw-bold" style={{ color: '#4F46E5' }}>View All Courses →</Button>
          </div>
          <Row className="g-4">
            {courses.map((c, i) => (
              <Col lg={4} md={6} key={i}>
                <Card className="glass-panel border-0 p-3 h-100" style={{ borderRadius: '24px', transition: 'all 0.3s ease' }}>
                  <Box sx={{ height: 180, borderRadius: '16px', bgcolor: c.color + '20', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ color: c.color, fontWeight: 900 }}>{c.title.charAt(0)}</Typography>
                  </Box>
                  <Card.Body className="p-0">
                    <Badge bg="light" className="text-dark mb-2 border">{c.level}</Badge>
                    <Card.Title className="fw-bold mb-3">{c.title}</Card.Title>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-1">
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>Progress</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{c.progress}%</Typography>
                      </div>
                      <LinearProgress variant="determinate" value={c.progress} sx={{ height: 6, borderRadius: 5, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: c.color } }} />
                    </div>
                    <Button className="w-100 border-0 py-2" style={{ background: c.color, borderRadius: '12px', fontWeight: 700 }}>Enroll Now</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-5" style={{ background: '#0F172A', color: '#94A3B8' }}>
        <Container>
          <Row className="g-5">
            <Col lg={4}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>LMS Pro</Typography>
              <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8 }}>
                The next generation of AI-powered learning management systems. Helping students and educators succeed together.
              </Typography>
              <div className="d-flex gap-3">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map(s => (
                  <i key={s} className={`bi bi-${s} fs-5`} style={{ cursor: 'pointer' }}></i>
                ))}
              </div>
            </Col>
            <Col lg={2} md={4}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>Company</Typography>
              <ul className="list-unstyled">
                {['About Us', 'Careers', 'Blog', 'Contact'].map(l => <li key={l} className="mb-2">{l}</li>)}
              </ul>
            </Col>
            <Col lg={2} md={4}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>Support</Typography>
              <ul className="list-unstyled">
                {['Help Center', 'Privacy Policy', 'Terms', 'Security'].map(l => <li key={l} className="mb-2">{l}</li>)}
              </ul>
            </Col>
            <Col lg={4} md={4}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>Newsletter</Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>Subscribe to get latest updates and offers.</Typography>
              <div className="d-flex gap-2">
                <input type="email" className="form-control border-0 px-3" placeholder="Enter email" style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                <Button variant="primary" style={{ borderRadius: '10px', bgcolor: '#14B8A6', border: 'none' }}>Join</Button>
              </div>
            </Col>
          </Row>
          <hr className="my-5" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <div className="text-center">
            <Typography variant="caption">© 2026 LMS Pro. All rights reserved.</Typography>
          </div>
        </Container>
      </footer>

      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .text-teal { color: #14B8A6 !important; }
        .min-vh-75 { min-height: 75vh; }
      `}</style>
    </Box>
  );
};

export default Home;
