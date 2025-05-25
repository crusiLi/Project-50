import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',      // 深蓝灰色，沉稳典雅
      light: '#34495e',
      dark: '#1a252f',
    },
    secondary: {
      main: '#8e44ad',      // 优雅紫色
      light: '#9b59b6',
      dark: '#7d3c98',
    },
    background: {
      default: '#f8f9fa',   // 温和的浅灰白
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
    success: {
      main: '#27ae60',
      light: '#2ecc71',
    },
    warning: {
      main: '#f39c12',
      light: '#e67e22',
    },
  },
  typography: {
    fontFamily: '"Noto Serif SC", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300,
      letterSpacing: '0.02em',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8e44ad',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8e44ad',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme; 