import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Typography, Box, Paper } from '@mui/material';
import Report from '@mui/icons-material/Report';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 4, maxWidth: '600px' }}>
            <Report sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => window.location.reload()}
                style={{ borderRadius: '10px', padding: '10px 30px' }}
              >
                Reload Page
              </Button>
            </Box>
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 4, textAlign: 'left', bgcolor: '#f5f5f5', p: 2, borderRadius: 2, overflowX: 'auto' }}>
                <Typography variant="caption" component="pre">
                  {this.state.error && this.state.error.toString()}
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
