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
  gap: 3,
  marginTop: theme.spacing(1)
}));

const HeatmapCell = styled(motion.div)<{ intensity: number }>(({ theme, intensity }) => ({
  width: 16,
  height: 16,
  borderRadius: 3,
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
  lineHeight: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end'
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
  // 生成一年的所有日期，按周排列
  const generateYearGrid = (year: number) => {
    const dates: Date[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    
    // 找到年初第一天是星期几（0=周日，1=周一...）
    const firstDayOfWeek = start.getDay();
    
    // 从年初第一周的周日开始
    const gridStart = new Date(start);
    gridStart.setDate(start.getDate() - firstDayOfWeek);
    
    // 生成足够的日期来填满网格
    for (let d = new Date(gridStart); d <= end || dates.length % 7 !== 0; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  };

  // 计算月份标签位置
  const calculateMonthPositions = (year: number, yearDates: Date[]) => {
    const monthPositions: Array<{ month: string; position: number; width: number }> = [];
    
    for (let month = 0; month < 12; month++) {
      // 在yearDates中找到该月第一天和最后一天的位置
      let firstWeek = -1;
      let lastWeek = -1;
      
      for (let i = 0; i < yearDates.length; i++) {
        const date = yearDates[i];
        const weekIndex = Math.floor(i / 7);
        
        if (date.getFullYear() === year && date.getMonth() === month) {
          if (firstWeek === -1) {
            firstWeek = weekIndex;
          }
          lastWeek = weekIndex;
        }
      }
      
      if (firstWeek !== -1 && lastWeek !== -1) {
        monthPositions.push({
          month: ['一月', '二月', '三月', '四月', '五月', '六月', 
                  '七月', '八月', '九月', '十月', '十一月', '十二月'][month],
          position: firstWeek,
          width: lastWeek - firstWeek + 1
        });
      }
    }
    
    return monthPositions;
  };

  // 获取数据映射
  const getDataMap = (): Map<string, HeatmapData> => {
    const map = new Map();
    data.forEach(item => {
      map.set(item.date, item);
    });
    return map;
  };

  const yearDates = generateYearGrid(year);
  const monthPositions = calculateMonthPositions(year, yearDates);
  const dataMap = getDataMap();
  const weekdays = ['', '一', '', '三', '', '五', ''];
  
  // 计算总周数
  const totalWeeks = Math.ceil(yearDates.length / 7);

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
      <Box display="flex">
        {/* 占位符，与星期标签对齐 */}
        <Box width="48px" mr={1.5} />
        
        {/* 月份标签容器 */}
        <Box position="relative" mb={1.5} height="24px" flex={1}>
          {monthPositions.map((monthInfo, index) => (
            <MonthLabel 
              key={index}
              sx={{
                position: 'absolute',
                left: `${(monthInfo.position / totalWeeks) * 100}%`,
                width: `${(monthInfo.width / totalWeeks) * 100}%`,
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {monthInfo.month}
            </MonthLabel>
          ))}
        </Box>
      </Box>

      {/* 热力图主体 */}
      <Box display="flex">
        {/* 星期标签 */}
        <Box display="flex" flexDirection="column" mr={1.5} width="48px">
          {weekdays.map((day, index) => (
            <WeekdayLabel key={index} sx={{ mb: 0.375 }}>
              {day}
            </WeekdayLabel>
          ))}
        </Box>

        {/* 热力图网格 */}
        <Box flex={1}>
          <HeatmapGrid sx={{ 
            gridTemplateColumns: `repeat(${totalWeeks}, 1fr)`,
            gridTemplateRows: 'repeat(7, 1fr)',
            gridAutoFlow: 'column',
            width: '100%'
          }}>
            {yearDates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayData = dataMap.get(dateStr);
              const intensity = dayData ? dayData.completionRate : 0;
              
              // 判断是否是当前年份的日期
              const isCurrentYear = date.getFullYear() === year;
              const opacity = isCurrentYear ? 1 : 0.3;
              
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
                    intensity={isCurrentYear ? intensity : 0}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: opacity, scale: 1 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: index * 0.001 
                    }}
                    style={{ opacity }}
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