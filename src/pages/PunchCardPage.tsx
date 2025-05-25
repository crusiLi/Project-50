import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Grid } from '@mui/material';
import { getCurrentUser, getUserData, updateUserPunchItems, getUserWeeklyPunchRecords } from '../utils/auth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';
import AppIcon from '../components/AppIcon';
import { motion, AnimatePresence } from 'framer-motion';
import type { PunchItem, PunchRecord } from '../utils/types';
import { 
  StyledPunchItem, 
  StyledLinearProgress, 
  ElegantPaper
} from '../components/styled';
import LoadingSkeleton from '../components/LoadingSkeleton';
import SuccessFeedback from '../components/SuccessFeedback';

export default function PunchCardPage() {
  const [userData, setUserData] = useState<{
    punchItems: PunchItem[];
    currentDay: number;
  } | null>(null);
  const [weeklyRecords, setWeeklyRecords] = useState<PunchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const username = getCurrentUser();
      const data = await getUserData(username);
      if (data) {
        // 计算当前是第几天（从注册日期开始，第一天为1）
        const cycleStart = new Date(data.cycleStart);
        const today = new Date();
        const diffTime = today.getTime() - cycleStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 第一天为1
        
        setUserData({
          punchItems: data.punchItems,
          currentDay: diffDays,
        });
        const records = await getUserWeeklyPunchRecords(username);
        setWeeklyRecords(records);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (id: number) => {
    if (!userData) return;

    const updatedItems = userData.punchItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );

    try {
      await updateUserPunchItems(getCurrentUser(), updatedItems);
      // 更新 userData
      setUserData({
        ...userData,
        punchItems: updatedItems,
      });

      // 本地同步更新 weeklyRecords
      const todayStr = new Date().toISOString().slice(0, 10);
      let updatedWeeklyRecords = [...weeklyRecords];
      const todayIndex = updatedWeeklyRecords.findIndex(r => r.date === todayStr);
      if (todayIndex !== -1) {
        // 已有今日记录，更新
        updatedWeeklyRecords[todayIndex] = {
          ...updatedWeeklyRecords[todayIndex],
          items: updatedItems.reduce((acc, item) => ({
            ...acc,
            [item.id]: item.completed
          }), {})
        };
      } else {
        // 没有今日记录，新增
        updatedWeeklyRecords.push({
          date: todayStr,
          items: updatedItems.reduce((acc, item) => ({
            ...acc,
            [item.id]: item.completed
          }), {})
        });
      }
      setWeeklyRecords(updatedWeeklyRecords);

      // 检查是否全部完成
      const allCompleted = updatedItems.every(item => item.completed);
      if (allCompleted) {
        setShowSuccess(true);
      }

      // 后台更新数据，不影响UI
      loadData();
    } catch (error) {
      console.error('更新打卡状态失败:', error);
      // 如果更新失败，恢复原状态
      setUserData({
        ...userData,
        punchItems: userData.punchItems,
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!userData) {
    return <div style={{textAlign: 'center', marginTop: 40}}>加载中...</div>;
  }

  const completedCount = userData.punchItems.filter(item => item.completed).length;
  const dailyProgress = (completedCount / userData.punchItems.length) * 100;
  
  // 计算50天挑战的总体进度
  const totalProgress = (userData.currentDay / 50) * 100;

  // 获取当前周的日期范围（周一到周日）
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 从周一开始
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // 到周日结束
  const dates = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(date => 
    format(date, 'yyyy-MM-dd')
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 1, sm: 2 },
      pb: { xs: 10, sm: 12 }
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 0 }
          }}>
            <AppIcon />
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                mt: 2, 
                mb: 1,
                fontWeight: 300,
                color: 'text.primary',
                textAlign: 'center',
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
              }}
            >
              今日打卡
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                textAlign: 'center',
                fontStyle: 'italic',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              坚持每一天，成就更好的自己
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 400, 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  打卡进度
                </Typography>
                <ElegantPaper sx={{ 
                  p: { xs: 2, sm: 3 },
                  mx: { xs: 1, sm: 0 }
                }}>
                  <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 400,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}
                      >
                        第 {userData.currentDay} 天
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          px: { xs: 1.5, sm: 2 }, 
                          py: 0.5, 
                          borderRadius: 2, 
                          bgcolor: 'rgba(142,68,173,0.1)',
                          color: 'secondary.main',
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        50天挑战
                      </Typography>
                    </Box>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                    >
                      <StyledLinearProgress 
                        variant="determinate" 
                        value={totalProgress} 
                        sx={{ 
                          height: { xs: 8, sm: 10 },
                          borderRadius: { xs: 4, sm: 5 },
                          '& .MuiLinearProgress-bar': {
                            transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          }
                        }}
                      />
                    </motion.div>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mt: 1,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 0.5, sm: 0 },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        50天挑战进度：第 {userData.currentDay} 天
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        {totalProgress.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: { xs: 1.5, sm: 2 }
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 400,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}
                      >
                        今日目标
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {completedCount}/{userData.punchItems.length} ({dailyProgress.toFixed(0)}%)
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: { xs: 1, sm: 1.5 }
                    }}>
                      <AnimatePresence>
                        {userData.punchItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            transition={{ 
                              duration: 0.4, 
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 100
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <StyledPunchItem
                              onClick={() => handleToggleItem(item.id)}
                              sx={{
                                p: { xs: 1.5, sm: 2 },
                                borderRadius: { xs: 2, sm: 3 },
                                minHeight: { xs: 48, sm: 56 },
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': item.completed ? {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))',
                                  pointerEvents: 'none',
                                } : {}
                              }}
                            >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: { xs: 1.5, sm: 2 },
                              width: '100%'
                            }}>
                              {item.completed ? (
                                <CheckCircleIcon 
                                  sx={{ 
                                    color: 'success.main',
                                    fontSize: { xs: '1.5rem', sm: '1.75rem' }
                                  }} 
                                />
                              ) : (
                                <CheckCircleOutlineIcon 
                                  sx={{ 
                                    color: 'text.disabled',
                                    fontSize: { xs: '1.5rem', sm: '1.75rem' }
                                  }} 
                                />
                              )}
                              <Typography 
                                sx={{ 
                                  flex: 1,
                                  textDecoration: item.completed ? 'line-through' : 'none',
                                  color: item.completed ? 'text.secondary' : 'text.primary',
                                  fontWeight: item.completed ? 400 : 500,
                                  fontSize: { xs: '0.875rem', sm: '1rem' },
                                  lineHeight: 1.4
                                }}
                              >
                                {item.content}
                              </Typography>
                            </Box>
                          </StyledPunchItem>
                        </motion.div>
                      ))}
                      </AnimatePresence>
                    </Box>
                  </Box>
                </ElegantPaper>
              </motion.div>
            </Grid>

            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 400, 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  本周记录
                </Typography>
                <ElegantPaper sx={{ 
                  p: { xs: 1, sm: 2, md: 3 },
                  mx: { xs: 1, sm: 0 },
                  overflow: 'hidden'
                }}>
                  <TableContainer sx={{ 
                    maxHeight: { xs: 400, sm: 500 },
                    '& .MuiTable-root': {
                      minWidth: { xs: 280, sm: 400 }
                    }
                  }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              py: { xs: 1, sm: 1.5 }
                            }}
                          >
                            日期
                          </TableCell>
                          {userData.punchItems.map(item => (
                            <TableCell 
                              key={item.id} 
                              align="center"
                              sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                py: { xs: 1, sm: 1.5 },
                                px: { xs: 0.5, sm: 1 },
                                maxWidth: { xs: 40, sm: 60 },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={item.content}
                            >
                              {item.content.length > 4 ? item.content.substring(0, 4) + '...' : item.content}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dates.map(date => {
                          const record = weeklyRecords.find(r => r.date === date);
                          const isToday = isSameDay(parseISO(date), today);
                          
                          return (
                            <TableRow 
                              key={date}
                              sx={{
                                backgroundColor: isToday ? 'rgba(142,68,173,0.05)' : 'transparent',
                                '&:hover': {
                                  backgroundColor: isToday ? 'rgba(142,68,173,0.1)' : 'rgba(0,0,0,0.04)'
                                }
                              }}
                            >
                              <TableCell 
                                sx={{ 
                                  fontWeight: isToday ? 600 : 400,
                                  color: isToday ? 'secondary.main' : 'text.primary',
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  py: { xs: 1, sm: 1.5 }
                                }}
                              >
                                {format(parseISO(date), 'MM/dd EEE', { locale: zhCN })}
                                {isToday && (
                                  <Typography 
                                    component="span" 
                                    sx={{ 
                                      ml: 1, 
                                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                      color: 'secondary.main',
                                      fontWeight: 500
                                    }}
                                  >
                                    今天
                                  </Typography>
                                )}
                              </TableCell>
                              {userData.punchItems.map(item => (
                                <TableCell 
                                  key={item.id} 
                                  align="center"
                                  sx={{ 
                                    py: { xs: 1, sm: 1.5 },
                                    px: { xs: 0.5, sm: 1 }
                                  }}
                                >
                                  {record?.items[item.id] ? (
                                    <CheckCircleIcon 
                                      sx={{ 
                                        color: 'success.main', 
                                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                                      }} 
                                    />
                                  ) : (
                                    <CheckCircleOutlineIcon 
                                      sx={{ 
                                        color: 'text.disabled', 
                                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                                      }} 
                                    />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ElegantPaper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
      
      {/* 成功反馈组件 */}
      <SuccessFeedback
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="恭喜完成！"
        subMessage="今日所有目标已达成"
      />
    </Box>
  );
} 