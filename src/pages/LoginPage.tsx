import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setCurrentUser, addUser, checkUser } from '../utils/auth';
import ProjectLogo from '../components/ProjectLogo';
import { motion } from 'framer-motion';
import { ElegantPaper, GradientBackground } from '../components/styled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goals, setGoals] = useState<string[]>(Array(7).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const success = await checkUser(username, password);
      if (success) {
        setCurrentUser(username);
        navigate('/');
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !password || goals.some(g => !g.trim())) {
      setError('请填写用户名、密码和7个打卡目标');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await addUser(username, password, goals);
      setCurrentUser(username);
      navigate('/');
    } catch (err) {
      if (err instanceof Error && err.message === '用户名已存在') {
        setError('用户名已存在');
      } else {
        setError('注册失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Box sx={{ 
        position: 'absolute', 
        top: { xs: 16, sm: 24 }, 
        left: { xs: 16, sm: 24 }, 
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontSize: { xs: '1rem', sm: '1.2rem' },
        fontWeight: 500,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <CheckCircleIcon sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            Project-50
          </Box>
        </motion.div>
      </Box>

      <Container maxWidth="sm">
        <Box sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 0 }
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ width: '100%', maxWidth: 480 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 300,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '0.02em',
                  fontSize: { xs: '1.75rem', sm: '2.125rem' }
                }}
              >
                优雅生活，从此开始
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 1, 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 300,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                记录每一个美好瞬间
              </Typography>
            </Box>

            <ElegantPaper sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Tabs
                value={tab}
                onChange={(_, newValue) => setTab(newValue)}
                variant="fullWidth"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  '& .MuiTab-root': {
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 500,
                    minHeight: { xs: 40, sm: 48 }
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(90deg, #8e44ad, #9b59b6)',
                    height: 3,
                    borderRadius: '2px 2px 0 0',
                  },
                }}
              >
                <Tab label="登录" />
                <Tab label="注册" />
              </Tabs>

              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mt: 2 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 2 }}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="密码"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    sx={{ mb: tab === 1 ? 2 : 3 }}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                  />
                  
                  {tab === 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.4 }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 2, 
                          color: 'text.primary',
                          fontWeight: 400,
                          textAlign: 'center',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}
                      >
                        设定您的七个目标
                      </Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gap: { xs: 1, sm: 1.5 },
                        maxHeight: { xs: '300px', sm: 'none' },
                        overflowY: { xs: 'auto', sm: 'visible' },
                        pr: { xs: 1, sm: 0 }
                      }}>
                        {goals.map((goal, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                          >
                            <TextField
                              fullWidth
                              label={`目标 ${idx + 1}`}
                              value={goal}
                              onChange={(e) => {
                                const newGoals = [...goals];
                                newGoals[idx] = e.target.value;
                                setGoals(newGoals);
                              }}
                              disabled={loading}
                              placeholder={`例如：每天运动30分钟`}
                              size={window.innerWidth < 600 ? "small" : "medium"}
                              sx={{
                                '& .MuiInputBase-input': {
                                  fontSize: { xs: '0.875rem', sm: '1rem' }
                                }
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography 
                        color="error" 
                        sx={{ 
                          mt: 2, 
                          textAlign: 'center',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {error}
                      </Typography>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      onClick={tab === 0 ? handleLogin : handleRegister}
                      disabled={loading}
                      sx={{
                        mt: { xs: 2, sm: 3 },
                        mb: 2,
                        py: { xs: 1.2, sm: 1.5 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)',
                        boxShadow: '0 4px 15px rgba(142, 68, 173, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7d3c98 0%, #8e44ad 100%)',
                          boxShadow: '0 6px 20px rgba(142, 68, 173, 0.6)',
                        },
                        '&:disabled': {
                          background: 'rgba(0,0,0,0.12)',
                          boxShadow: 'none',
                        }
                      }}
                    >
                      {loading ? '处理中...' : (tab === 0 ? '登录' : '注册')}
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </ElegantPaper>
          </motion.div>
        </Box>
      </Container>
    </GradientBackground>
  );
} 