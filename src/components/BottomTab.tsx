import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PsychologyIcon from '@mui/icons-material/Psychology';

export default function BottomTab() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getTabValue = () => {
    if (location.pathname.startsWith('/calendar') || location.pathname.startsWith('/todo')) {
      return 1;
    } else if (location.pathname.startsWith('/analysis')) {
      return 2;
    }
    return 0;
  };
  
  const [value, setValue] = React.useState(getTabValue());

  React.useEffect(() => {
    setValue(getTabValue());
  }, [location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/calendar');
        break;
      case 2:
        navigate('/analysis');
        break;
    }
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }} 
      elevation={3}
    >
      <BottomNavigation 
        value={value} 
        onChange={handleChange}
        sx={{
          height: { xs: 60, sm: 70 },
          '& .MuiBottomNavigationAction-root': {
            minWidth: { xs: 60, sm: 80 },
            padding: { xs: '6px 12px', sm: '8px 16px' },
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              '&.Mui-selected': {
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }
            },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }
          }
        }}
      >
        <BottomNavigationAction
          label="打卡"
          icon={<CheckCircleOutlineIcon />}
        />
        <BottomNavigationAction
          label="待办"
          icon={<CalendarMonthIcon />}
        />
        <BottomNavigationAction
          label="AI分析"
          icon={<PsychologyIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
} 