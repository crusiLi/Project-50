import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Paper,
  Checkbox,
  Alert,
  LinearProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getCurrentUser, getUserData, updateUserTodos } from '../utils/auth';
import type { TodoItem, User } from '../utils/types';
import { format, isBefore, startOfDay } from 'date-fns';
import AppIcon from '../components/AppIcon';

/**
 * 待办事项页面组件
 * 用于显示和管理特定日期的待办事项
 */
export default function TodoPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const username = getCurrentUser();
  const [userData, setUserData] = useState<User | undefined>(undefined);

  const isPastDate = date ? isBefore(new Date(date), startOfDay(new Date())) : false;

  const completedCount = todos.filter(todo => todo.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    if (!date) return;

    try {
      setLoading(true);
      const data = await getUserData(username);
      setUserData(data);
      if (data?.todos) {
        setTodos(data.todos[date] || []);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim() || !date || !userData) return;
    if (isPastDate) return;

    const newItem: TodoItem = {
      id: Date.now().toString(),
      content: newTodo.trim(),
      completed: false,
    };

    const newTodos = [...todos, newItem];
    setTodos(newTodos);
    try {
      setLoading(true);
      await updateUserTodos(username, date, newTodos);
    } catch (error) {
      console.error('添加待办失败:', error);
    } finally {
      setLoading(false);
    }
    setNewTodo('');
  };

  const handleDeleteTodo = async (id: string) => {
    if (!date || !userData) return;
    if (isPastDate) return;

    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    try {
      setLoading(true);
      await updateUserTodos(username, date, newTodos);
    } catch (error) {
      console.error('删除待办失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    if (!date || !userData) return;

    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    try {
      setLoading(true);
      await updateUserTodos(username, date, newTodos);
    } catch (error) {
      console.error('更新待办状态失败:', error);
    } finally {
      setLoading(false);
    }
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
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          mt: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              mr: { xs: 0, sm: 1 },
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            component="h1" 
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              textAlign: { xs: 'center', sm: 'left' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {date ? format(new Date(date), 'yyyy年MM月dd日') : '待办事项'}
          </Typography>
        </Box>

        <Paper sx={{ 
          width: '100%', 
          mt: { xs: 2, sm: 3 }, 
          p: { xs: 1.5, sm: 2 },
          mx: { xs: 0.5, sm: 0 }
        }}>
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ 
                height: { xs: 8, sm: 10 }, 
                borderRadius: 5 
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                textAlign: 'center'
              }}
            >
              {completedCount} / {todos.length} 项已完成
            </Typography>
          </Box>

          {isPastDate && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              过去的日期不能添加或删除待办事项
            </Alert>
          )}

          <Box sx={{ 
            display: 'flex', 
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <TextField
              fullWidth
              label="新待办"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={isPastDate || loading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTodo();
                }
              }}
              size={window.innerWidth < 600 ? "small" : "medium"}
            />
            <Button
              variant="contained"
              onClick={handleAddTodo}
              disabled={!newTodo.trim() || isPastDate || loading}
              sx={{ 
                ml: { xs: 0, sm: 1 },
                minWidth: { xs: '100%', sm: 'auto' },
                height: { xs: 40, sm: 56 }
              }}
            >
              添加
            </Button>
          </Box>

          <List sx={{ px: { xs: 0, sm: 1 } }}>
            {todos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 }
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  disabled={loading}
                  size={window.innerWidth < 600 ? "small" : "medium"}
                />
                <ListItemText
                  primary={todo.content}
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.secondary' : 'text.primary',
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.4
                    }
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={isPastDate || loading}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {todos.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: { xs: 3, sm: 4 },
              color: 'text.secondary'
            }}>
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                暂无待办事项
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 