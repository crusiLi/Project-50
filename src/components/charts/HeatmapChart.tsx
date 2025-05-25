import React from 'react';
import { Box, Typography, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const HeatmapContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}));

const HeatmapGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(53, 1fr)',
  gap: 2,
  marginTop: theme.spacing(2)
}));

const HeatmapCell = styled(motion.div)<{ intensity: number }>(({ theme, intensity }) => ({
  width: 12,
  height: 12,
  borderRadius: 2,
  backgroundColor: intensity === 0 
    ? '#ebedf0' 
    : intensity <= 25 
      ? '#c6e48b' 
      : intensity <= 50 
        ? '#7bc96f' 
        : intensity <= 75 
          ? '#239a3b' 
          : '#196127',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}));

const MonthLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginBottom: theme.spacing(1)
}));

const WeekdayLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  textAlign: 'right',
  paddingRight: theme.spacing(1),
  lineHeight: '12px'
}));

interface HeatmapData {
  date: string;
  count: number;
  completionRate: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  year?: number;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ 
  data, 
  year = new Date().getFullYear() 
}) => {
  // 生成一年的所有日期
  const generateYearDates = (year: number): Date[] => {
    const dates: Date[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  // 获取数据映射
  const getDataMap = (): Map<string, HeatmapData> => {
    const map = new Map();
    data.forEach(item => {
      map.set(item.date, item);
    });
    return map;
  };

  const yearDates = generateYearDates(year);
  const dataMap = getDataMap();
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                  '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekdays = ['', '一', '', '三', '', '五', ''];

  // 计算统计数据
  const totalDays = data.length;
  const activeDays = data.filter(d => d.count > 0).length;
  const averageCompletion = data.reduce((sum, d) => sum + d.completionRate, 0) / totalDays || 0;
  const maxStreak = calculateMaxStreak(data);

  function calculateMaxStreak(data: HeatmapData[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const item of sortedData) {
      if (item.completionRate >= 100) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }

  return (
    <HeatmapContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {year}年度打卡热力图
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Typography variant="caption" color="textSecondary">
            少
          </Typography>
          <Box display="flex" gap={0.5}>
            {[0, 25, 50, 75, 100].map(intensity => (
              <Box
                key={intensity}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 1,
                  backgroundColor: intensity === 0 
                    ? '#ebedf0' 
                    : intensity <= 25 
                      ? '#c6e48b' 
                      : intensity <= 50 
                        ? '#7bc96f' 
                        : intensity <= 75 
                          ? '#239a3b' 
                          : '#196127'
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="textSecondary">
            多
          </Typography>
        </Box>
      </Box>

      {/* 统计概览 */}
      <Box display="flex" gap={3} mb={3} flexWrap="wrap">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {activeDays}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            活跃天数
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            {averageCompletion.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="textSecondary">
            平均完成率
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="warning.main">
            {maxStreak}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            最长连击
          </Typography>
        </Box>
      </Box>

      {/* 月份标签 */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1} mb={1}>
        {months.map((month, index) => (
          <MonthLabel key={index}>{month}</MonthLabel>
        ))}
      </Box>

      {/* 热力图主体 */}
      <Box display="flex">
        {/* 星期标签 */}
        <Box display="flex" flexDirection="column" mr={1}>
          {weekdays.map((day, index) => (
            <WeekdayLabel key={index} sx={{ height: 12, mb: 0.25 }}>
              {day}
            </WeekdayLabel>
          ))}
        </Box>

        {/* 热力图网格 */}
        <Box>
          <HeatmapGrid sx={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
            {yearDates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayData = dataMap.get(dateStr);
              const intensity = dayData ? dayData.completionRate : 0;
              
              return (
                <Tooltip
                  key={index}
                  title={
                    <Box>
                      <Typography variant="body2">
                        {date.toLocaleDateString('zh-CN')}
                      </Typography>
                      <Typography variant="caption">
                        完成率: {intensity.toFixed(1)}%
                      </Typography>
                      {dayData && (
                        <Typography variant="caption" display="block">
                          打卡次数: {dayData.count}
                        </Typography>
                      )}
                    </Box>
                  }
                  arrow
                >
                  <HeatmapCell
                    intensity={intensity}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: index * 0.001 
                    }}
                  />
                </Tooltip>
              );
            })}
          </HeatmapGrid>
        </Box>
      </Box>
    </HeatmapContainer>
  );
};

export default HeatmapChart; 