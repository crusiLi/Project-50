import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

const CorrelationContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}));

const CorrelationMatrix = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: 2,
  marginTop: theme.spacing(2)
}));

const CorrelationCell = styled(motion.div)<{ correlation: number }>(({ theme, correlation }) => {
  const getColor = (value: number) => {
    if (value > 0.7) return '#2e7d32';
    if (value > 0.4) return '#66bb6a';
    if (value > 0.1) return '#a5d6a7';
    if (value > -0.1) return '#e8f5e8';
    if (value > -0.4) return '#ffcdd2';
    if (value > -0.7) return '#ef5350';
    return '#d32f2f';
  };

  return {
    padding: theme.spacing(1),
    borderRadius: 4,
    backgroundColor: getColor(correlation),
    color: Math.abs(correlation) > 0.4 ? 'white' : 'black',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 500
  };
});

interface CorrelationData {
  goal1: string;
  goal2: string;
  correlation: number;
  significance: number;
}

interface GoalPerformance {
  goalId: number;
  goalName: string;
  completionRate: number;
  consistency: number;
  trend: number;
}

interface CorrelationChartProps {
  correlations: CorrelationData[];
  goalPerformances: GoalPerformance[];
}

const CorrelationChart: React.FC<CorrelationChartProps> = ({
  correlations,
  goalPerformances
}) => {
  // 创建相关性矩阵
  const createCorrelationMatrix = () => {
    const goals = goalPerformances.map(g => g.goalName);
    const matrix: number[][] = [];
    
    // 初始化矩阵
    for (let i = 0; i < goals.length; i++) {
      matrix[i] = new Array(goals.length).fill(0);
      matrix[i][i] = 1; // 对角线为1
    }
    
    // 填充相关性数据
    correlations.forEach(corr => {
      const index1 = goals.indexOf(corr.goal1);
      const index2 = goals.indexOf(corr.goal2);
      if (index1 !== -1 && index2 !== -1) {
        matrix[index1][index2] = corr.correlation;
        matrix[index2][index1] = corr.correlation;
      }
    });
    
    return { matrix, goals };
  };

  // 准备散点图数据
  const prepareScatterData = () => {
    return goalPerformances.map(goal => ({
      x: goal.completionRate,
      y: goal.consistency,
      z: goal.trend,
      name: goal.goalName,
      goalId: goal.goalId
    }));
  };

  // 获取相关性强度描述
  const getCorrelationStrength = (value: number): string => {
    const abs = Math.abs(value);
    if (abs > 0.8) return '极强';
    if (abs > 0.6) return '强';
    if (abs > 0.4) return '中等';
    if (abs > 0.2) return '弱';
    return '极弱';
  };

  // 获取相关性方向
  const getCorrelationDirection = (value: number): string => {
    return value > 0 ? '正相关' : '负相关';
  };

  const { matrix, goals } = createCorrelationMatrix();
  const scatterData = prepareScatterData();

  // 找出最强的相关性
  const strongCorrelations = correlations
    .filter(c => Math.abs(c.correlation) > 0.4)
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
    .slice(0, 5);

  return (
    <CorrelationContainer>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        目标关联性分析
      </Typography>

      {/* 相关性矩阵 */}
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          目标相关性矩阵
        </Typography>
        <CorrelationMatrix
          sx={{
            gridTemplateColumns: `120px repeat(${goals.length}, 1fr)`,
            gridTemplateRows: `40px repeat(${goals.length}, 1fr)`
          }}
        >
          {/* 空白角落 */}
          <Box />
          
          {/* 列标题 */}
          {goals.map((goal, index) => (
            <Box
              key={`col-${index}`}
              sx={{
                padding: 1,
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 500,
                transform: 'rotate(-45deg)',
                transformOrigin: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {goal.length > 8 ? goal.substring(0, 8) + '...' : goal}
            </Box>
          ))}
          
          {/* 行数据 */}
          {goals.map((rowGoal, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {/* 行标题 */}
              <Box
                sx={{
                  padding: 1,
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                {rowGoal.length > 12 ? rowGoal.substring(0, 12) + '...' : rowGoal}
              </Box>
              
              {/* 相关性值 */}
              {matrix[rowIndex].map((correlation, colIndex) => (
                <CorrelationCell
                  key={`cell-${rowIndex}-${colIndex}`}
                  correlation={correlation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (rowIndex + colIndex) * 0.05 }}
                >
                  {correlation.toFixed(2)}
                </CorrelationCell>
              ))}
            </React.Fragment>
          ))}
        </CorrelationMatrix>
      </Box>

      {/* 目标表现散点图 */}
      <Box mb={4}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          目标表现分布图
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              name="完成率" 
              unit="%" 
              label={{ value: '完成率 (%)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              dataKey="y" 
              name="一致性" 
              unit="%" 
              label={{ value: '一致性 (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <Paper sx={{ p: 2, maxWidth: 200 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {data.name}
                      </Typography>
                      <Typography variant="body2">
                        完成率: {data.x.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        一致性: {data.y.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        趋势: {data.z > 0 ? '上升' : data.z < 0 ? '下降' : '稳定'}
                      </Typography>
                    </Paper>
                  );
                }
                return null;
              }}
            />
            <Scatter dataKey="y" fill="#667eea">
              {scatterData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.z > 0 ? '#4caf50' : entry.z < 0 ? '#f44336' : '#ff9800'} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <Box display="flex" justifyContent="center" gap={2} mt={1}>
          <Chip 
            label="上升趋势" 
            size="small" 
            sx={{ backgroundColor: '#4caf50', color: 'white' }} 
          />
          <Chip 
            label="稳定" 
            size="small" 
            sx={{ backgroundColor: '#ff9800', color: 'white' }} 
          />
          <Chip 
            label="下降趋势" 
            size="small" 
            sx={{ backgroundColor: '#f44336', color: 'white' }} 
          />
        </Box>
      </Box>

      {/* 强相关性洞察 */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          关键洞察
        </Typography>
        {strongCorrelations.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {strongCorrelations.map((corr, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">
                      <strong>{corr.goal1}</strong> 与 <strong>{corr.goal2}</strong>
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Chip
                        label={getCorrelationDirection(corr.correlation)}
                        size="small"
                        color={corr.correlation > 0 ? 'success' : 'error'}
                      />
                      <Chip
                        label={getCorrelationStrength(corr.correlation)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    相关系数: {corr.correlation.toFixed(3)} 
                    {corr.significance < 0.05 && ' (统计显著)'}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            暂无显著的目标关联性发现，继续积累数据以获得更准确的分析。
          </Typography>
        )}
      </Box>
    </CorrelationContainer>
  );
};

export default CorrelationChart; 