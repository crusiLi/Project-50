import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { getCurrentUser, getUserData } from '../utils/auth';
import { format, isSameDay, startOfDay, isBefore } from 'date-fns';
import AppIcon from '../components/AppIcon';
import type { TodoItem, User } from '../utils/types';

export default function TodoCalendarPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getUserData(getCurrentUser());
      setUserData(data);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    navigate(`/todo/${format(date, 'yyyy-MM-dd')}`);
  };

  const getDateTodos = (date: Date): TodoItem[] => {
    if (!userData?.todos) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    return userData.todos[dateStr] || [];
  };

  const getDateCompletionRate = (date: Date): number => {
    const todos = getDateTodos(date);
    if (todos.length === 0) return 0;
    const completedCount = todos.filter(todo => todo.completed).length;
    return (completedCount / todos.length) * 100;
  };

  const CustomDay = (props: PickersDayProps<Date>) => {
    const completionRate = getDateCompletionRate(props.day);
    const isToday = isSameDay(props.day, new Date());
    const isPast = isBefore(props.day, startOfDay(new Date()));

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => handleDateClick(props.day)}
      >
        <PickersDay
          {...props}
          sx={{
            color: isToday ? 'primary.main' : 'text.primary',
            fontWeight: isToday ? 'bold' : 'normal',
          }}
        />
        {completionRate > 0 && (
          <Box
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              bgcolor: completionRate === 100 ? 'success.main' : 'warning.main',
              mt: 0.5,
              position: 'absolute',
              bottom: '2px',
          }}
        />
        )}
      </Box>
    );
  };

  if (!userData) {
    return <div style={{textAlign: 'center', marginTop: 40}}>加载中...</div>;
    }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: { xs: 2, sm: 4 }, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        px: { xs: 1, sm: 2 },
        pb: { xs: 10, sm: 12 }
      }}>
        <AppIcon />
        <Typography 
          component="h1" 
          variant="h5" 
          sx={{ 
            mt: 2,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            textAlign: 'center'
          }}
        >
          日历
        </Typography>
        <Paper sx={{ 
          width: '100%', 
          mt: { xs: 2, sm: 3 }, 
          p: { xs: 1, sm: 2 },
          mx: { xs: 0.5, sm: 0 }
        }}>
          <DateCalendar
            slots={{
              day: CustomDay,
            }}
            sx={{
              width: '100%',
              '& .MuiPickersCalendarHeader-root': {
                paddingLeft: { xs: 1, sm: 2 },
                paddingRight: { xs: 1, sm: 2 },
                marginTop: { xs: 0.5, sm: 1 },
                marginBottom: { xs: 0.5, sm: 1 }
              },
              '& .MuiPickersCalendarHeader-label': {
                fontSize: { xs: '1rem', sm: '1.25rem' }
              },
              '& .MuiDayCalendar-header': {
                paddingLeft: { xs: 0, sm: 1 },
                paddingRight: { xs: 0, sm: 1 }
              },
              '& .MuiDayCalendar-weekDayLabel': {
                width: { xs: '32px', sm: '36px' },
                height: { xs: '32px', sm: '36px' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                margin: { xs: '0 1px', sm: '0 2px' }
              },
              '& .MuiPickersDay-root': {
                width: { xs: '32px', sm: '36px' },
                height: { xs: '32px', sm: '36px' },
                margin: { xs: '0 1px', sm: '0 2px' },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              },
              '& .MuiDayCalendar-weekContainer': {
                margin: { xs: '2px 0', sm: '4px 0' }
              }
            }}
          />
          
          {/* 图例说明 */}
          <Box sx={{ 
            mt: { xs: 1, sm: 2 }, 
            pt: { xs: 1, sm: 2 }, 
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, sm: 3 },
            flexWrap: 'wrap'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: { xs: 8, sm: 10 },
                  height: { xs: 8, sm: 10 },
                  borderRadius: '50%',
                  bgcolor: 'success.main'
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: 'text.secondary'
                }}
              >
                全部完成
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: { xs: 8, sm: 10 },
                  height: { xs: 8, sm: 10 },
                  borderRadius: '50%',
                  bgcolor: 'warning.main'
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: 'text.secondary'
                }}
              >
                部分完成
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 