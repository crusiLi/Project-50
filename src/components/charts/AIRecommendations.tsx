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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Psychology,
  TrendingUp,
  Lightbulb,
  EmojiEvents,
  Warning,
  ExpandMore,
  Refresh,
  AutoAwesome,
  Timeline,
  TrackChanges,
  Insights
} from '@mui/icons-material';

// 样式组件
const AIContainer = styled(Box)(({ theme }) => ({
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

const RecommendationCard = styled(Card)(({ theme }) => ({
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

const InsightChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  '&.success': {
    background: 'linear-gradient(45deg, #4caf50, #45a049)',
    color: 'white',
  },
  '&.warning': {
    background: 'linear-gradient(45deg, #ff9800, #f57c00)',
    color: 'white',
  },
  '&.suggestion': {
    background: 'linear-gradient(45deg, #2196f3, #1976d2)',
    color: 'white',
  },
  '&.encouragement': {
    background: 'linear-gradient(45deg, #9c27b0, #7b1fa2)',
    color: 'white',
  },
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  marginBottom: theme.spacing(2),
}));

// 类型定义
interface AIInsight {
  type: 'success' | 'warning' | 'suggestion' | 'encouragement';
  title: string;
  content: string;
  priority: number;
}

interface AIRecommendation {
  id: string;
  category: 'habit' | 'timing' | 'motivation' | 'strategy';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  actionSteps: string[];
}

interface AIAnalysisData {
  insights: AIInsight[];
  recommendations: string[];
  motivationalMessage: string;
  personalizedTips: AIRecommendation[];
  progressPrediction: {
    nextWeekSuccess: number;
    monthlyTrend: 'improving' | 'stable' | 'declining';
    riskFactors: string[];
    opportunities: string[];
  };
}

interface AIRecommendationsProps {
  username: string;
  analysisData?: any;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ username, analysisData }) => {
  const [aiData, setAiData] = useState<AIAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAIRecommendations();
  }, [username, analysisData]);

  const fetchAIRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取AI分析数据
      const response = await fetch(`http://localhost:3001/api/users/${username}/ai-recommendations`);
      
      if (!response.ok) {
        throw new Error('获取AI建议失败');
      }
      
      const data = await response.json();
      
      // 生成个性化建议
      const personalizedTips = generatePersonalizedRecommendations(data, analysisData);
      const progressPrediction = generateProgressPrediction(data, analysisData);
      
      setAiData({
        ...data,
        personalizedTips,
        progressPrediction
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取AI建议失败');
      // 使用模拟数据作为后备
      setAiData(generateMockAIData());
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAIRecommendations();
    setRefreshing(false);
  };

  const generatePersonalizedRecommendations = (data: any, analysis: any): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    if (analysis?.analysis?.completionRate < 70) {
      recommendations.push({
        id: 'improve-consistency',
        category: 'habit',
        title: '提升一致性策略',
        description: '基于您的完成率分析，建议采用渐进式目标设定方法',
        impact: 'high',
        difficulty: 'medium',
        timeframe: '2-3周',
        actionSteps: [
          '选择1-2个最重要的目标优先完成',
          '设置每日提醒和奖励机制',
          '记录完成时的感受和环境因素',
          '每周回顾并调整策略'
        ]
      });
    }
    
    if (analysis?.analysis?.weeklyPattern) {
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const bestDay = analysis.analysis.weeklyPattern.indexOf(Math.max(...analysis.analysis.weeklyPattern));
      const worstDay = analysis.analysis.weeklyPattern.indexOf(Math.min(...analysis.analysis.weeklyPattern));
      
      recommendations.push({
        id: 'optimize-timing',
        category: 'timing',
        title: '优化时间安排',
        description: `您在${weekDays[bestDay]}表现最佳，在${weekDays[worstDay]}需要改进`,
        impact: 'medium',
        difficulty: 'easy',
        timeframe: '1-2周',
        actionSteps: [
          `将重要目标安排在${weekDays[bestDay]}`,
          `为${weekDays[worstDay]}制定特殊策略`,
          '分析高效日和低效日的差异',
          '调整作息和环境因素'
        ]
      });
    }
    
    recommendations.push({
      id: 'motivation-boost',
      category: 'motivation',
      title: '动机维持系统',
      description: '建立长期动机维持机制，防止中途放弃',
      impact: 'high',
      difficulty: 'medium',
      timeframe: '持续进行',
      actionSteps: [
        '设定里程碑奖励',
        '找到习惯伙伴或社群',
        '可视化进步过程',
        '定期回顾初始目标'
      ]
    });
    
    return recommendations;
  };

  const generateProgressPrediction = (data: any, analysis: any) => {
    const completionRate = analysis?.analysis?.completionRate || 0;
    const streakDays = analysis?.analysis?.streakDays || 0;
    
    let nextWeekSuccess = completionRate;
    let monthlyTrend: 'improving' | 'stable' | 'declining' = 'stable';
    
    if (streakDays > 7) {
      nextWeekSuccess = Math.min(100, completionRate + 10);
      monthlyTrend = 'improving';
    } else if (streakDays < 3) {
      nextWeekSuccess = Math.max(0, completionRate - 15);
      monthlyTrend = 'declining';
    }
    
    const riskFactors = [];
    const opportunities = [];
    
    if (completionRate < 50) {
      riskFactors.push('完成率偏低，需要调整目标难度');
    }
    if (streakDays < 3) {
      riskFactors.push('连续性不足，容易中断习惯');
    }
    
    if (completionRate > 80) {
      opportunities.push('表现优秀，可以考虑增加挑战');
    }
    if (streakDays > 14) {
      opportunities.push('习惯已初步形成，可以优化细节');
    }
    
    return {
      nextWeekSuccess,
      monthlyTrend,
      riskFactors,
      opportunities
    };
  };

  const generateMockAIData = (): AIAnalysisData => ({
    insights: [
      {
        type: 'success',
        title: '表现优秀',
        content: '您在运动方面表现出色，连续打卡已超过两周！',
        priority: 5
      },
      {
        type: 'suggestion',
        title: '时间优化',
        content: '建议将阅读时间调整到晚上，这样完成率可能会更高。',
        priority: 4
      },
      {
        type: 'warning',
        title: '注意休息',
        content: '最近几天的完成率有所下降，注意不要过度疲劳。',
        priority: 3
      }
    ],
    recommendations: [
      '尝试将困难的目标安排在精力最充沛的时间',
      '建立奖励机制，完成一周目标后给自己小奖励',
      '找一个习惯伙伴，互相监督和鼓励'
    ],
    motivationalMessage: '您已经走在正确的道路上！每一天的坚持都在塑造更好的自己。',
    personalizedTips: [],
    progressPrediction: {
      nextWeekSuccess: 85,
      monthlyTrend: 'improving',
      riskFactors: [],
      opportunities: ['可以考虑增加新的挑战目标']
    }
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <EmojiEvents />;
      case 'warning': return <Warning />;
      case 'suggestion': return <Lightbulb />;
      case 'encouragement': return <Psychology />;
      default: return <Insights />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'habit': return <TrackChanges />;
      case 'timing': return <Timeline />;
      case 'motivation': return <Psychology />;
      case 'strategy': return <TrendingUp />;
      default: return <AutoAwesome />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'low': return '#2196f3';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          AI正在分析您的数据...
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

  if (!aiData) return null;

  return (
    <Box>
      {/* AI分析头部 */}
      <AIContainer sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <AutoAwesome />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              AI智能建议
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
          {aiData.motivationalMessage}
        </Typography>
        
        {/* 进度预测 */}
        <ProgressSection>
          <Typography variant="h6" gutterBottom>
            📈 进度预测
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" gutterBottom>
                下周预期成功率
              </Typography>
              <Box display="flex" alignItems="center">
                <LinearProgress 
                  variant="determinate" 
                  value={aiData.progressPrediction.nextWeekSuccess} 
                  sx={{ 
                    flexGrow: 1, 
                    mr: 1, 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4caf50, #45a049)'
                    }
                  }} 
                />
                <Typography variant="body2" fontWeight={600}>
                  {aiData.progressPrediction.nextWeekSuccess.toFixed(0)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" gutterBottom>
                月度趋势
              </Typography>
              <Chip 
                label={
                  aiData.progressPrediction.monthlyTrend === 'improving' ? '📈 上升' :
                  aiData.progressPrediction.monthlyTrend === 'declining' ? '📉 下降' : '➡️ 稳定'
                }
                color={
                  aiData.progressPrediction.monthlyTrend === 'improving' ? 'success' :
                  aiData.progressPrediction.monthlyTrend === 'declining' ? 'error' : 'default'
                }
              />
            </Grid>
          </Grid>
        </ProgressSection>
      </AIContainer>

      {/* 洞察卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {aiData.insights.map((insight, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RecommendationCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: getInsightColor(insight.type), mr: 2 }}>
                      {getInsightIcon(insight.type)}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" gutterBottom>
                        {insight.title}
                      </Typography>
                      <InsightChip 
                        label={insight.type} 
                        size="small" 
                        className={insight.type}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {insight.content}
                  </Typography>
                </CardContent>
              </RecommendationCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 个性化建议 */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        🎯 个性化行动建议
      </Typography>
      
      <Grid container spacing={3}>
        {aiData.personalizedTips.map((tip, index) => (
          <Grid item xs={12} md={6} key={tip.id}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RecommendationCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: getImpactColor(tip.impact), mr: 2 }}>
                      {getCategoryIcon(tip.category)}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" gutterBottom>
                        {tip.title}
                      </Typography>
                      <Box display="flex" gap={1} mb={1}>
                        <Chip label={`影响: ${tip.impact}`} size="small" />
                        <Chip label={`难度: ${tip.difficulty}`} size="small" />
                        <Chip label={tip.timeframe} size="small" />
                      </Box>
                    </Box>
                    <IconButton 
                      onClick={() => setExpandedCard(expandedCard === tip.id ? null : tip.id)}
                    >
                      <ExpandMore 
                        sx={{ 
                          transform: expandedCard === tip.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }} 
                      />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {tip.description}
                  </Typography>
                  
                  <Collapse in={expandedCard === tip.id}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      行动步骤：
                    </Typography>
                    {tip.actionSteps.map((step, stepIndex) => (
                      <Typography 
                        key={stepIndex} 
                        variant="body2" 
                        sx={{ mb: 1, pl: 2 }}
                      >
                        {stepIndex + 1}. {step}
                      </Typography>
                    ))}
                  </Collapse>
                </CardContent>
              </RecommendationCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 快速建议 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          💡 快速建议
        </Typography>
        <Grid container spacing={2}>
          {aiData.recommendations.map((rec, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ 
                  p: 2, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <Typography variant="body2">
                    {rec}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const getInsightColor = (type: string) => {
  switch (type) {
    case 'success': return '#4caf50';
    case 'warning': return '#ff9800';
    case 'suggestion': return '#2196f3';
    case 'encouragement': return '#9c27b0';
    default: return '#757575';
  }
};

export default AIRecommendations; 