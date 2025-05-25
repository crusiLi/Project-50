import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * 应用图标组件
 * 显示在页面左上角的图标和标题
 */
export default function AppIcon() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        position: 'absolute',
        left: 16,
        top: 16,
        zIndex: 1,
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 28, color: 'primary.main' }} />
      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Project-50
      </Typography>
    </Box>
  );
} 