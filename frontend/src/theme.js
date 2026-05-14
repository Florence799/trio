import { createTheme } from '@mui/material/styles';

const primary = {
  main: '#5b5cf0',
  light: '#818cf8',
  dark: '#4338ca',
  contrastText: '#ffffff',
};

const secondary = {
  main: '#0d9488',
  light: '#2dd4bf',
  dark: '#0f766e',
  contrastText: '#ffffff',
};

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary,
    secondary,
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': { borderWidth: 2 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.15)',
        },
      },
    },
  },
});
