import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BarChartIcon from '@mui/icons-material/BarChart';
import Add from '@mui/icons-material/Add';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';

const SIDEBAR_WIDTH = 272;

function NavItem({ to, icon, label, onNavigate }) {
  return (
    <Box
      component={NavLink}
      to={to}
      onClick={onNavigate}
      className="faculty-nav-item"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        color: alpha('#fff', 0.78),
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'all 0.2s ease',
        border: '1px solid transparent',
        '&:hover': {
          bgcolor: alpha('#fff', 0.08),
          color: '#fff',
          borderColor: alpha('#fff', 0.12),
        },
        '&.active': {
          color: '#fff',
          bgcolor: alpha('#a78bfa', 0.25),
          borderColor: alpha('#c4b5fd', 0.45),
          boxShadow: `0 0 24px ${alpha('#8b5cf6', 0.35)}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', opacity: 0.95 }}>{icon}</Box>
      {label}
    </Box>
  );
}

function SidebarNav({ onNavigate }) {
  const raw = localStorage.getItem('user');
  let user = {};
  try {
    user = raw ? JSON.parse(raw) : {};
  } catch {
    user = {};
  }
  const isStudent = user.role === 'Student';

  const core = [
    { to: '/dashboard', icon: <DashboardIcon fontSize="small" />, label: 'Overview' },
    { to: '/my-courses', icon: <SchoolIcon fontSize="small" />, label: 'My courses' },
    { to: '/assignments', icon: <AssignmentIcon fontSize="small" />, label: 'Assignments' },
    { to: '/quizzes', icon: <QuizIcon fontSize="small" />, label: 'Quizzes' },
    { to: '/performance', icon: <BarChartIcon fontSize="small" />, label: 'Performance' },
  ];

  const facultyExtra = !isStudent
    ? [
        { to: '/registered-users', icon: <PeopleIcon fontSize="small" />, label: 'Learners' },
        { to: '/feedback-analysis', icon: <RateReviewIcon fontSize="small" />, label: 'Feedback hub' },
      ]
    : [];

  const create = !isStudent
    ? [{ to: '/create-course', icon: <Add fontSize="small" />, label: 'New course' }]
    : [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {!isStudent && (
        <Typography
          variant="overline"
          sx={{ px: 2, mt: 1, mb: 0.5, color: alpha('#fff', 0.45), letterSpacing: '0.14em', fontWeight: 700 }}
        >
          Create
        </Typography>
      )}
      {create.map((item) => (
        <NavItem key={item.to} {...item} onNavigate={onNavigate} />
      ))}
      <Typography
        variant="overline"
        sx={{ px: 2, mt: 1.5, mb: 0.5, color: alpha('#fff', 0.45), letterSpacing: '0.14em', fontWeight: 700 }}
      >
        Workspace
      </Typography>
      {core.map((item) => (
        <NavItem key={item.to} {...item} onNavigate={onNavigate} />
      ))}
      {facultyExtra.length > 0 && (
        <>
          <Typography
            variant="overline"
            sx={{ px: 2, mt: 1.5, mb: 0.5, color: alpha('#fff', 0.45), letterSpacing: '0.14em', fontWeight: 700 }}
          >
            Insights
          </Typography>
          {facultyExtra.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onNavigate} />
          ))}
        </>
      )}
    </Box>
  );
}

export default function FacultyPortalLayout() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const raw = localStorage.getItem('user');
  let user = {};
  try {
    user = raw ? JSON.parse(raw) : {};
  } catch {
    user = {};
  }
  const isStudent = user.role === 'Student';
  const roleLabel = user.role === 'Teacher' ? 'Faculty' : user.role || 'Member';

  const closeDrawer = () => setMobileOpen(false);

  const mainContent = (
    <Box
      component="main"
      sx={{
        flex: 1,
        minWidth: 0,
        position: 'relative',
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 2, md: 2.5 },
        '&::before': isStudent
          ? undefined
          : {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              borderRadius: '0 0 12px 12px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #14b8a6)',
              opacity: 0.85,
            },
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );

  if (isStudent) {
    return (
      <Box className="faculty-portal-student" sx={{ width: '100%' }}>
        {mainContent}
      </Box>
    );
  }

  const sidebarInner = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(165deg, #0f172a 0%, #1e1b4b 42%, #312e81 100%)',
        borderRight: `1px solid ${alpha('#fff', 0.08)}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          right: '-40%',
          width: '120%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 65%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10%',
          left: '-20%',
          width: '80%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 60%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, p: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AutoAwesomeOutlined sx={{ color: '#c4b5fd', fontSize: 22 }} />
          <Typography
            variant="overline"
            sx={{ color: alpha('#fff', 0.55), letterSpacing: '0.2em', fontWeight: 800, fontSize: '0.65rem' }}
          >
            Portal
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Faculty studio
        </Typography>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.55), display: 'block', mt: 0.5 }}>
          {user.name} · {roleLabel}
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1, px: 1.5, flex: 1, overflowY: 'auto' }}>
        <SidebarNav onNavigate={closeDrawer} />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1, p: 2, pt: 1 }}>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.35), display: 'block', textAlign: 'center' }}>
          LMS Pro · model workspace
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      className="faculty-portal-root"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        alignItems: 'stretch',
        minHeight: 'calc(100vh - 72px)',
      }}
    >
      {isMdUp ? (
        <Box
          component="aside"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            position: 'sticky',
            top: 72,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 72px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '0 20px 20px 0',
            boxShadow: '8px 0 40px rgba(15, 23, 42, 0.18)',
            my: { md: 1.5 },
            ml: { md: 1 },
          }}
        >
          {sidebarInner}
        </Box>
      ) : (
        <Box sx={{ width: '100%', flexShrink: 0 }}>
          <Box
            sx={{
              position: 'sticky',
              top: 72,
              zIndex: 10,
              width: '100%',
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: alpha('#0f172a', 0.92),
              backdropFilter: 'blur(12px)',
              borderBottom: `1px solid ${alpha('#fff', 0.08)}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
              Faculty studio
            </Typography>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#fff' }} aria-label="Open menu">
              <Menu />
            </IconButton>
          </Box>
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={closeDrawer}
            PaperProps={{
              sx: {
                width: SIDEBAR_WIDTH,
                bgcolor: 'transparent',
                boxShadow: 'none',
              },
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={closeDrawer} sx={{ color: '#fff' }} aria-label="Close menu">
                  <Close />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1, overflow: 'auto' }}>{sidebarInner}</Box>
            </Box>
          </Drawer>
        </Box>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        {mainContent}
      </Box>
    </Box>
  );
}
