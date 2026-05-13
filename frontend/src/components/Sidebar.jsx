import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar = () => {
  const [totalUsers, setTotalUsers] = React.useState(0);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalUsers(response.data.totalUsers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Performance', icon: <BarChartIcon />, path: '/performance' },
  ];

  return (
    <Box sx={{ 
      width: 280, 
      minHeight: 'calc(100vh - 76px)', 
      bgcolor: 'white', 
      borderRight: '1px solid #e2e8f0',
      display: { xs: 'none', lg: 'block' },
      position: 'sticky',
      top: 76,
      p: 2,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="overline" sx={{ px: 2, fontWeight: 'bold', color: '#64748b' }}>
        Main Menu
      </Typography>
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={NavLink} 
            to={item.path}
            sx={{
              borderRadius: 3,
              mb: 1,
              color: '#475569',
              '&.active': {
                bgcolor: '#6366f115',
                color: '#6366f1',
                '& .MuiListItemIcon-root': { color: '#6366f1' }
              },
              '&:hover': {
                bgcolor: '#f8fafc'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 45, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="overline" sx={{ px: 2, fontWeight: 'bold', color: '#64748b' }}>
        Community
      </Typography>
      <List sx={{ mt: 1 }}>
        <ListItem sx={{ borderRadius: 3, mb: 1, color: '#475569' }}>
          <ListItemIcon sx={{ minWidth: 45, color: 'inherit' }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Registered Users" 
            secondary={`${totalUsers} active users`}
            primaryTypographyProps={{ fontWeight: 600 }} 
          />
        </ListItem>
      </List>

      <Box sx={{ 
        mt: 'auto', 
        p: 2, 
        bgcolor: '#6366f1', 
        borderRadius: 4, 
        color: 'white',
        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)'
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>LMS Community</Typography>
        <Typography variant="caption">Join thousands of students learning together.</Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
