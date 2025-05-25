import React from 'react';
import { Box, Skeleton } from '@mui/material';

const LoadingSkeleton = () => (
  <Box sx={{ width: '100%', mt: 4 }}>
    <Skeleton variant="text" width="40%" height={40} />
    <Skeleton variant="rectangular" height={60} sx={{ mt: 2, borderRadius: 2 }} />
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <Skeleton 
        key={i} 
        variant="rectangular" 
        height={50} 
        sx={{ mt: 1, borderRadius: 1 }} 
      />
    ))}
  </Box>
);

export default LoadingSkeleton; 