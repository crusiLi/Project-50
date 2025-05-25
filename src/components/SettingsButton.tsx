import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 16,
  top: 16,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.05) rotate(90deg)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(255, 255, 255, 0.1)'
      : '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    right: 12,
    top: 12,
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
}));

export default function SettingsButton() {
  const navigate = useNavigate();
  
  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <Tooltip title="设置" placement="left">
      <StyledIconButton onClick={handleSettings}>
        <Settings />
      </StyledIconButton>
    </Tooltip>
  );
} 