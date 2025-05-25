import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';

const HabitContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}));

const StageIndicator = styled(Box)<{ stage: 'forming' | 'developing' | 'established' }>(({ theme, stage }) => {
  const getColor = () => {
    switch (stage) {
      case 'forming': return '#ff9800';
      case 'developing': return '#2196f3';
      case 'established': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return {
    padding: theme.spacing(1, 2),
    borderRadius: 20,
    backgroundColor: getColor(),
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 500,
    textAlign: 'center'
  };
});

interface HabitData {
  day: number;
  consistency: number;
  difficulty: number;
  motivation: number;
  automaticity: number;
  stage: 'forming' | 'developing' | 'established';
}

interface GoalHabitData {
  goalId: number;
  goalName: string;
  data: HabitData[];
  currentStage: 'forming' | 'developing' | 'established';
  daysToEstablish: number;
  strengthScore: number;
}

interface HabitFormationChartProps {
  goalHabits: GoalHabitData[];
}

const HabitFormationChart: React.FC<HabitFormationChartProps> = ({ goalHabits }) => {
  const [selectedGoal, setSelectedGoal] = useState<number>(goalHabits[0]?.goalId || 0);
  const [viewMode, setViewMode] = useState<'individual' | 'comparison'>('individual');

  const selectedHabit = goalHabits.find(h => h.goalId === selectedGoal);

  // 习惯形成阶段定义
  const habitStages = [
    { name: '形成期', range: [1, 21], color: '#ff9800', description: '建立新习惯的初期阶段' },
    { name: '发展期', range: [22, 66], color: '#2196f3', description: '习惯逐渐稳固的阶段' },
    { name: '稳定期', range: [67, 100], color: '#4caf50', description: '习惯完全自动化的阶段' }
  ];

  // 获取阶段信息
  const getStageInfo = (day: number) => {
    if (day <= 21) return habitStages[0];
    if (day <= 66) return habitStages[1];
    return habitStages[2];
  };

  // 准备比较数据
  const prepareComparisonData = () => {
    const maxDays = Math.max(...goalHabits.map(h => h.data.length));
    const comparisonData = [];

    for (let day = 1; day <= maxDays; day++) {
      const dayData: any = { day };
      goalHabits.forEach(habit => {
        const habitDay = habit.data.find(d => d.day === day);
        dayData[habit.goalName] = habitDay ? habitDay.automaticity : null;
      });
      comparisonData.push(dayData);
    }

    return comparisonData;
  };

  // 计算习惯强度
  const calculateHabitStrength = (data: HabitData[]): number => {
    if (data.length === 0) return 0;
    const recent = data.slice(-7); // 最近7天
    const avgConsistency = recent.reduce((sum, d) => sum + d.consistency, 0) / recent.length;
    const avgAutomaticity = recent.reduce((sum, d) => sum + d.automaticity, 0) / recent.length;
    return (avgConsistency + avgAutomaticity) / 2;
  };

  // 预测习惯建立时间
  const predictEstablishmentTime = (data: HabitData[]): number => {
    if (data.length === 0) return 66; // 默认66天
    
    const recentTrend = data.slice(-14); // 最近14天趋势
    if (recentTrend.length < 7) return 66;
    
    const avgGrowth = recentTrend.reduce((sum, d, i) => {
      if (i === 0) return 0;
      return sum + (d.automaticity - recentTrend[i-1].automaticity);
    }, 0) / (recentTrend.length - 1);
    
    const currentLevel = data[data.length - 1].automaticity;
    const daysNeeded = Math.max(21, Math.min(100, (90 - currentLevel) / Math.max(0.1, avgGrowth)));
    
    return Math.round(daysNeeded);
  };

  const comparisonData = prepareComparisonData();

  return (
    <HabitContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          习惯形成曲线分析
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="individual">单个分析</ToggleButton>
          <ToggleButton value="comparison">对比分析</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 习惯阶段说明 */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        {habitStages.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Paper sx={{ p: 2, backgroundColor: stage.color, color: 'white' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {stage.name} ({stage.range[0]}-{stage.range[1]}天)
              </Typography>
              <Typography variant="caption">
                {stage.description}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </Box>

      {viewMode === 'individual' && selectedHabit && (
        <>
          {/* 目标选择 */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              选择目标
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {goalHabits.map(habit => (
                <Chip
                  key={habit.goalId}
                  label={habit.goalName}
                  onClick={() => setSelectedGoal(habit.goalId)}
                  color={selectedGoal === habit.goalId ? 'primary' : 'default'}
                  variant={selectedGoal === habit.goalId ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          {/* 当前状态概览 */}
          <Box display="flex" gap={3} mb={3} flexWrap="wrap">
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {selectedHabit.data.length}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                已坚持天数
              </Typography>
            </Box>
            <Box>
              <StageIndicator stage={selectedHabit.currentStage}>
                {selectedHabit.currentStage === 'forming' ? '形成期' : 
                 selectedHabit.currentStage === 'developing' ? '发展期' : '稳定期'}
              </StageIndicator>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {selectedHabit.strengthScore.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                习惯强度
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {selectedHabit.daysToEstablish}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                预计建立天数
              </Typography>
            </Box>
          </Box>

          {/* 习惯形成曲线 */}
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              习惯形成进度曲线
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={selectedHabit.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: '天数', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  label={{ value: '强度 (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const stageInfo = getStageInfo(Number(label));
                      return (
                        <Paper sx={{ p: 2, maxWidth: 250 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            第 {label} 天 - {stageInfo.name}
                          </Typography>
                          {payload.map((entry, index) => (
                            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%
                            </Typography>
                          ))}
                        </Paper>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                
                {/* 阶段分界线 */}
                <ReferenceLine x={21} stroke="#ff9800" strokeDasharray="5 5" />
                <ReferenceLine x={66} stroke="#2196f3" strokeDasharray="5 5" />
                
                <Area
                  type="monotone"
                  dataKey="automaticity"
                  stackId="1"
                  stroke="#667eea"
                  fill="#667eea"
                  fillOpacity={0.6}
                  name="自动化程度"
                />
                <Area
                  type="monotone"
                  dataKey="consistency"
                  stackId="2"
                  stroke="#4caf50"
                  fill="#4caf50"
                  fillOpacity={0.4}
                  name="一致性"
                />
                <Line
                  type="monotone"
                  dataKey="motivation"
                  stroke="#ff9800"
                  strokeWidth={2}
                  dot={false}
                  name="动机水平"
                />
                <Line
                  type="monotone"
                  dataKey="difficulty"
                  stroke="#f44336"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                  name="感知难度"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}

      {viewMode === 'comparison' && (
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            目标习惯对比
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                label={{ value: '天数', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: '自动化程度 (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Paper sx={{ p: 2, maxWidth: 200 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          第 {label} 天
                        </Typography>
                        {payload.map((entry, index) => (
                          entry.value !== null && (
                            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                              {entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%
                            </Typography>
                          )
                        ))}
                      </Paper>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              
              {/* 阶段分界线 */}
              <ReferenceLine x={21} stroke="#ff9800" strokeDasharray="5 5" />
              <ReferenceLine x={66} stroke="#2196f3" strokeDasharray="5 5" />
              
              {goalHabits.map((habit, index) => (
                <Line
                  key={habit.goalId}
                  type="monotone"
                  dataKey={habit.goalName}
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* 习惯对比统计 */}
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              习惯建立进度对比
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {goalHabits.map((habit, index) => (
                <motion.div
                  key={habit.goalId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" fontWeight="bold">
                        {habit.goalName}
                      </Typography>
                      <Box display="flex" gap={2} alignItems="center">
                        <StageIndicator stage={habit.currentStage}>
                          {habit.currentStage === 'forming' ? '形成期' : 
                           habit.currentStage === 'developing' ? '发展期' : '稳定期'}
                        </StageIndicator>
                        <Typography variant="body2" color="textSecondary">
                          强度: {habit.strengthScore.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          预计: {habit.daysToEstablish}天
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </HabitContainer>
  );
};

export default HabitFormationChart; 