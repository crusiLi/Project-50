import { styled } from '@mui/material/styles';
import { Box, LinearProgress, Paper } from '@mui/material';

export const StyledPunchItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  borderRadius: 16,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
  border: '1px solid rgba(44,62,80,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(142,68,173,0.05)',
    transform: 'translateX(8px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    borderColor: 'rgba(142,68,173,0.2)',
  },
}));

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 8,
  backgroundColor: 'rgba(44,62,80,0.1)',
  overflow: 'hidden',
  '& .MuiLinearProgress-bar': {
    borderRadius: 8,
    background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 50%, #af7ac5 100%)',
    boxShadow: '0 2px 8px rgba(142,68,173,0.3)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
      animation: 'shimmer 2s infinite',
    },
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
}));

export const ElegantPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.3)',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(20px)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #8e44ad, #9b59b6, #af7ac5)',
  },
}));

export const GradientBackground = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
}); 