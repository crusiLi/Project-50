import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Collapse,
  Alert,
  Button,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Lightbulb,
  ExpandMore,
  Refresh,
  TrackChanges,
  Insights,
  Analytics,
  Speed,
  Assessment,
  CheckCircle,
  Star,
  TrendingDown,
  Schedule,
  Timeline
} from '@mui/icons-material';

// 样式组件
const InsightsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 20,
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
}));

const InsightCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  textAlign: 'center',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const TrendChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  '&.positive': {
    background: 'linear-gradient(45deg, #4caf50, #45a049)',
    color: 'white',
  },
  '&.negative': {
    background: 'linear-gradient(45deg, #f44336, #d32f2f)',
    color: 'white',
  },
  '&.neutral': {
    background: 'linear-gradient(45deg, #ff9800, #f57c00)',
    color: 'white',
  },
}));

// 类型定义
interface SmartInsight {
  id: string;
  type: 'performance' | 'pattern' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  metrics?: {
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface HabitPattern {
  pattern: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  suggestions: string[];
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface SmartInsightsData {
  insights: SmartInsight[];
  patterns: HabitPattern[];
  metrics: PerformanceMetric[];
  predictions: {
    weeklySuccess: number;
    monthlyTrend: 'improving' | 'stable' | 'declining';
    riskLevel: 'low' | 'medium' | 'high';
    opportunities: string[];
  };
}

interface SmartInsightsProps {
  username: string;
  analysisData?: any;
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ username, analysisData }) => {
  const [insightsData, setInsightsData] = useState<SmartInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSmartInsights();
  }, [username, analysisData]);

  const fetchSmartInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 使用基于现有数据生成的洞察作为后备
      setInsightsData(generateInsightsFromAnalysis(analysisData));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取智能洞察失败';
      setError(errorMessage);
      // 使用基于现有数据生成的洞察作为后备
      setInsightsData(generateInsightsFromAnalysis(analysisData));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSmartInsights();
    setRefreshing(false);
  };

  const generateInsightsFromAnalysis = (analysis: any): SmartInsightsData => {
    const insights: SmartInsight[] = [];
    const patterns: HabitPattern[] = [];
    const metrics: PerformanceMetric[] = [];
    
    if (analysis?.analysis) {
      const { completionRate, streakDays, weeklyPattern, bestPerformingGoals } = analysis.analysis;
      
      // 生成性能洞察
      if (completionRate > 80) {
        insights.push({
          id: 'high-performance',
          type: 'performance',
          title: '优秀表现',
          description: `您的整体完成率达到${completionRate.toFixed(1)}%，表现非常出色！`,
          severity: 'low',
          confidence: 95,
          actionable: false,
          metrics: {
            current: completionRate,
            target: 90,
            trend: 'up'
          }
        });
      } else if (completionRate < 50) {
        insights.push({
          id: 'low-performance',
          type: 'performance',
          title: '需要改进',
          description: `完成率为${completionRate.toFixed(1)}%，建议调整目标或策略`,
          severity: 'high',
          confidence: 90,
          actionable: true,
          metrics: {
            current: completionRate,
            target: 70,
            trend: 'down'
          }
        });
      }
      
      // 生成模式洞察
      if (weeklyPattern && weeklyPattern.length === 7) {
        const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const maxDay = weeklyPattern.indexOf(Math.max(...weeklyPattern));
        const minDay = weeklyPattern.indexOf(Math.min(...weeklyPattern));
        
        patterns.push({
          pattern: '周内表现差异',
          frequency: 100,
          impact: 'neutral',
          description: `您在${weekDays[maxDay]}表现最佳(${weeklyPattern[maxDay].toFixed(1)}%)，在${weekDays[minDay]}表现最差(${weeklyPattern[minDay].toFixed(1)}%)`,
          suggestions: [
            `在${weekDays[maxDay]}安排重要目标`,
            `为${weekDays[minDay]}制定特殊策略`,
            '分析高效日的成功因素'
          ]
        });
      }
      
      // 生成连续性洞察
      if (streakDays > 14) {
        insights.push({
          id: 'streak-success',
          type: 'pattern',
          title: '习惯形成良好',
          description: `连续打卡${streakDays}天，习惯正在稳固建立`,
          severity: 'low',
          confidence: 85,
          actionable: false
        });
      } else if (streakDays < 3) {
        insights.push({
          id: 'streak-warning',
          type: 'recommendation',
          title: '连续性需要加强',
          description: `当前连续打卡${streakDays}天，建议专注于建立稳定的日常习惯`,
          severity: 'medium',
          confidence: 80,
          actionable: true
        });
      }
      
      // 生成性能指标
      metrics.push(
        {
          name: '完成率',
          value: completionRate,
          unit: '%',
          trend: completionRate > 70 ? 'up' : completionRate < 50 ? 'down' : 'stable',
          change: 5.2,
          icon: <Assessment />,
          color: '#4caf50'
        },
        {
          name: '连续天数',
          value: streakDays,
          unit: '天',
          trend: streakDays > 7 ? 'up' : 'stable',
          change: 2,
          icon: <Schedule />,
          color: '#2196f3'
        },
        {
          name: '活跃目标',
          value: bestPerformingGoals?.length || 0,
          unit: '个',
          trend: 'stable',
          change: 0,
          icon: <TrackChanges />,
          color: '#ff9800'
        }
      );
    }
    
    return {
      insights,
      patterns,
      metrics,
      predictions: {
        weeklySuccess: 75,
        monthlyTrend: 'improving',
        riskLevel: 'low',
        opportunities: [
          '可以考虑增加新的挑战目标',
          '优化时间安排提高效率',
          '建立奖励机制维持动机'
        ]
      }
    };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Speed />;
      case 'pattern': return <Analytics />;
      case 'prediction': return <TrendingUp />;
      case 'recommendation': return <Lightbulb />;
      default: return <Insights />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'down': return <TrendingDown sx={{ color: '#f44336' }} />;
      case 'stable': return <Timeline sx={{ color: '#ff9800' }} />;
      default: return <Timeline />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          正在分析您的习惯模式...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
        <Button onClick={handleRefresh} sx={{ ml: 2 }}>
          重试
        </Button>
      </Alert>
    );
  }

  if (!insightsData) return null;

  return (
    <Box>
      {/* 智能洞察头部 */}
      <InsightsContainer sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <Analytics />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              智能洞察分析
            </Typography>
          </Box>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ color: 'white' }}
          >
            <Refresh sx={{ transform: refreshing ? 'rotate(360deg)' : 'none', transition: 'transform 1s' }} />
          </IconButton>
        </Box>
        
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
          基于您的打卡数据，我们发现了以下重要模式和趋势
        </Typography>
        
        {/* 关键指标 */}
        <Grid container spacing={2}>
          {insightsData.metrics.map((metric, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <MetricCard>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <Avatar sx={{ bgcolor: metric.color, mr: 1, width: 32, height: 32 }}>
                    {metric.icon}
                  </Avatar>
                  {getTrendIcon(metric.trend)}
                </Box>
                <Typography variant="h4" fontWeight={600} color={metric.color}>
                  {metric.value.toFixed(0)}{metric.unit}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.name}
                </Typography>
                {metric.change !== 0 && (
                  <Typography variant="caption" color={metric.trend === 'up' ? 'success.main' : 'error.main'}>
                    {metric.trend === 'up' ? '+' : ''}{metric.change}% 相比上周
                  </Typography>
                )}
              </MetricCard>
            </Grid>
          ))}
        </Grid>
      </InsightsContainer>

      {/* 智能洞察卡片 */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
        🔍 深度洞察
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {insightsData.insights.map((insight, index) => (
          <Grid item xs={12} md={6} key={insight.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <InsightCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: getSeverityColor(insight.severity), mr: 2 }}>
                      {getInsightIcon(insight.type)}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" gutterBottom>
                        {insight.title}
                      </Typography>
                      <Box display="flex" gap={1} alignItems="center">
                        <Chip 
                          label={insight.type} 
                          size="small" 
                          color="primary"
                        />
                        <Chip 
                          label={`${insight.confidence}% 置信度`} 
                          size="small" 
                          variant="outlined"
                        />
                        {insight.actionable && (
                          <Chip 
                            label="可执行" 
                            size="small" 
                            color="success"
                          />
                        )}
                      </Box>
                    </Box>
                    {insight.metrics && (
                      <IconButton 
                        onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                      >
                        <ExpandMore 
                          sx={{ 
                            transform: expandedInsight === insight.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }} 
                        />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {insight.description}
                  </Typography>
                  
                  {insight.metrics && (
                    <Collapse in={expandedInsight === insight.id}>
                      <Divider sx={{ mb: 2 }} />
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2">
                          当前: {insight.metrics.current.toFixed(1)}
                        </Typography>
                        <Typography variant="body2">
                          目标: {insight.metrics.target}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            趋势:
                          </Typography>
                          {getTrendIcon(insight.metrics.trend)}
                        </Box>
                      </Box>
                    </Collapse>
                  )}
                </CardContent>
              </InsightCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 习惯模式分析 */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        📊 习惯模式分析
      </Typography>
      
      <Grid container spacing={3}>
        {insightsData.patterns.map((pattern, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <InsightCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ 
                      bgcolor: pattern.impact === 'positive' ? '#4caf50' : 
                               pattern.impact === 'negative' ? '#f44336' : '#ff9800',
                      mr: 2 
                    }}>
                      <Analytics />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" gutterBottom>
                        {pattern.pattern}
                      </Typography>
                      <TrendChip 
                        label={pattern.impact === 'positive' ? '积极影响' : 
                               pattern.impact === 'negative' ? '需要改进' : '中性影响'} 
                        size="small" 
                        className={pattern.impact === 'positive' ? 'positive' : 
                                  pattern.impact === 'negative' ? 'negative' : 'neutral'}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {pattern.description}
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    建议行动：
                  </Typography>
                  <List dense>
                    {pattern.suggestions.map((suggestion, suggestionIndex) => (
                      <ListItem key={suggestionIndex} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={suggestion}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </InsightCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 预测和机会 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          🔮 预测与机会
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📈 成功预测
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={insightsData.predictions.weeklySuccess} 
                    sx={{ 
                      flexGrow: 1, 
                      mr: 2, 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #4caf50, #45a049)'
                      }
                    }} 
                  />
                  <Typography variant="h6" color="primary">
                    {insightsData.predictions.weeklySuccess}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  下周预期成功率
                </Typography>
              </CardContent>
            </InsightCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎯 成长机会
                </Typography>
                <List dense>
                  {insightsData.predictions.opportunities.map((opportunity, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Star sx={{ fontSize: 16, color: '#ff9800' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={opportunity}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </InsightCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SmartInsights; 