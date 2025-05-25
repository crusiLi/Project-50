import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <Button color="inherit" onClick={handleLogout} sx={{ position: 'absolute', right: 16, top: 16 }}>
      退出登录
    </Button>
  );
} 