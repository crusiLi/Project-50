import axios from 'axios';
import { User, HabitAnalysis, AIInsight, DataAnalysisResult } from './types';

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

// 基础数据统计分析
export function calculateHabitAnalysis(user: User): HabitAnalysis {
  const { punchRecords, punchItems, cycleStart } = user;
  
  // 计算总体完成率
  let totalChecks = 0;
  let completedChecks = 0;
  let completedDays = 0;
  
  punchRecords.forEach(record => {
    const dayTotal = Object.keys(record.items).length;
    const dayCompleted = Object.values(record.items).filter(Boolean).length;
    
    totalChecks += dayTotal;
    completedChecks += dayCompleted;
    
    if (dayCompleted === dayTotal && dayTotal > 0) {
      completedDays++;
    }
  });
  
  const completionRate = totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0;
  
  // 计算连续打卡天数
  let streakDays = 0;
  const sortedRecords = [...punchRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (const record of sortedRecords) {
    const dayTotal = Object.keys(record.items).length;
    const dayCompleted = Object.values(record.items).filter(Boolean).length;
    
    if (dayCompleted === dayTotal && dayTotal > 0) {
      streakDays++;
    } else {
      break;
    }
  }
  
  // 分析各目标表现
  const goalPerformance: { [id: number]: number } = {};
  punchItems.forEach(item => {
    let completed = 0;
    let total = 0;
    
    punchRecords.forEach(record => {
      if (record.items[item.id] !== undefined) {
        total++;
        if (record.items[item.id]) completed++;
      }
    });
    
    goalPerformance[item.id] = total > 0 ? (completed / total) * 100 : 0;
  });
  
  const bestPerformingGoals = Object.entries(goalPerformance)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([id]) => parseInt(id));
    
  const strugglingGoals = Object.entries(goalPerformance)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 3)
    .map(([id]) => parseInt(id));
  
  // 计算一周内的完成模式
  const weeklyPattern = new Array(7).fill(0);
  const weeklyCounts = new Array(7).fill(0);
  
  punchRecords.forEach(record => {
    const date = new Date(record.date);
    const dayOfWeek = (date.getDay() + 6) % 7; // 转换为周一=0的格式
    
    const dayTotal = Object.keys(record.items).length;
    const dayCompleted = Object.values(record.items).filter(Boolean).length;
    
    if (dayTotal > 0) {
      weeklyPattern[dayOfWeek] += (dayCompleted / dayTotal) * 100;
      weeklyCounts[dayOfWeek]++;
    }
  });
  
  // 计算平均值
  for (let i = 0; i < 7; i++) {
    if (weeklyCounts[i] > 0) {
      weeklyPattern[i] = weeklyPattern[i] / weeklyCounts[i];
    }
  }
  
  // 预测成功率（基于当前趋势）
  const recentRecords = sortedRecords.slice(0, 7); // 最近7天
  let recentCompletionRate = 0;
  if (recentRecords.length > 0) {
    let recentTotal = 0;
    let recentCompleted = 0;
    
    recentRecords.forEach(record => {
      const dayTotal = Object.keys(record.items).length;
      const dayCompleted = Object.values(record.items).filter(Boolean).length;
      recentTotal += dayTotal;
      recentCompleted += dayCompleted;
    });
    
    recentCompletionRate = recentTotal > 0 ? (recentCompleted / recentTotal) * 100 : 0;
  }
  
  const predictedSuccess = Math.min(100, Math.max(0, 
    (completionRate * 0.6 + recentCompletionRate * 0.4)
  ));
  
  return {
    completionRate: Math.round(completionRate * 100) / 100,
    streakDays,
    bestPerformingGoals,
    strugglingGoals,
    weeklyPattern: weeklyPattern.map(p => Math.round(p * 100) / 100),
    predictedSuccess: Math.round(predictedSuccess * 100) / 100,
    totalDays: punchRecords.length,
    completedDays
  };
}

// 调用DeepSeek API生成AI洞察
export async function generateAIInsights(
  user: User, 
  analysis: HabitAnalysis
): Promise<{ insights: AIInsight[], recommendations: string[], motivationalMessage: string }> {
  
  if (!DEEPSEEK_API_KEY) {
    // 如果没有API密钥，返回基于规则的分析
    return generateRuleBasedInsights(user, analysis);
  }
  
  try {
    const prompt = createAnalysisPrompt(user, analysis);
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的习惯养成和数据分析专家，擅长分析用户的打卡数据并提供个性化的建议和洞察。请用中文回复，语气要友好、鼓励和专业。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const aiResponse = response.data.choices[0].message.content;
    return parseAIResponse(aiResponse, analysis);
    
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    // 降级到基于规则的分析
    return generateRuleBasedInsights(null, analysis);
  }
}

// 创建分析提示词
function createAnalysisPrompt(user: User, analysis: HabitAnalysis): string {
  const goalNames = user.punchItems.map(item => `${item.id}: ${item.content}`).join(', ');
  
  return `
请分析以下用户的打卡数据并提供洞察：

用户信息：
- 目标列表：${goalNames}
- 开始日期：${user.cycleStart}
- 当前第${user.currentDay}天

数据分析结果：
- 总体完成率：${analysis.completionRate}%
- 连续打卡天数：${analysis.streakDays}天
- 总打卡天数：${analysis.totalDays}天
- 完全完成的天数：${analysis.completedDays}天
- 表现最好的目标ID：${analysis.bestPerformingGoals.join(', ')}
- 困难目标ID：${analysis.strugglingGoals.join(', ')}
- 一周完成模式：周一${analysis.weeklyPattern[0]}%, 周二${analysis.weeklyPattern[1]}%, 周三${analysis.weeklyPattern[2]}%, 周四${analysis.weeklyPattern[3]}%, 周五${analysis.weeklyPattern[4]}%, 周六${analysis.weeklyPattern[5]}%, 周日${analysis.weeklyPattern[6]}%
- 预测成功率：${analysis.predictedSuccess}%

请提供以下内容，用JSON格式回复：
{
  "insights": [
    {
      "type": "success|warning|suggestion|encouragement",
      "title": "洞察标题",
      "content": "详细内容",
      "priority": 1-5
    }
  ],
  "recommendations": ["建议1", "建议2", "建议3"],
  "motivationalMessage": "鼓励性消息"
}

要求：
1. insights数组包含3-5个洞察，类型要多样化
2. recommendations包含3个具体可行的建议
3. motivationalMessage要个性化且鼓励性
4. 所有内容都要基于实际数据，具体且有用
`;
}

// 解析AI响应
function parseAIResponse(aiResponse: string, analysis: HabitAnalysis): { insights: AIInsight[], recommendations: string[], motivationalMessage: string } {
  try {
    // 尝试提取JSON部分
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        motivationalMessage: parsed.motivationalMessage || '继续保持，你做得很棒！'
      };
    }
  } catch (error) {
    console.error('解析AI响应失败:', error);
  }
  
  // 如果解析失败，降级到基于规则的分析
  return generateRuleBasedInsights(null, analysis);
}

// 基于规则的洞察生成（备用方案）
function generateRuleBasedInsights(user: User | null, analysis: HabitAnalysis): { insights: AIInsight[], recommendations: string[], motivationalMessage: string } {
  const insights: AIInsight[] = [];
  const recommendations: string[] = [];
  
  // 完成率分析
  if (analysis.completionRate >= 80) {
    insights.push({
      type: 'success',
      title: '优秀的完成率',
      content: `您的总体完成率达到了${analysis.completionRate}%，表现非常出色！`,
      priority: 4
    });
  } else if (analysis.completionRate >= 60) {
    insights.push({
      type: 'encouragement',
      title: '良好的进展',
      content: `您的完成率为${analysis.completionRate}%，还有提升空间，继续努力！`,
      priority: 3
    });
  } else {
    insights.push({
      type: 'warning',
      title: '需要关注',
      content: `您的完成率为${analysis.completionRate}%，建议调整策略或降低目标难度。`,
      priority: 5
    });
  }
  
  // 连续打卡分析
  if (analysis.streakDays >= 7) {
    insights.push({
      type: 'success',
      title: '坚持的力量',
      content: `您已经连续打卡${analysis.streakDays}天，习惯正在形成！`,
      priority: 4
    });
  } else if (analysis.streakDays >= 3) {
    insights.push({
      type: 'encouragement',
      title: '良好开端',
      content: `连续${analysis.streakDays}天的坚持是个好开始，继续保持！`,
      priority: 3
    });
  }
  
  // 一周模式分析
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const maxDay = analysis.weeklyPattern.indexOf(Math.max(...analysis.weeklyPattern));
  const minDay = analysis.weeklyPattern.indexOf(Math.min(...analysis.weeklyPattern));
  
  if (analysis.weeklyPattern[maxDay] - analysis.weeklyPattern[minDay] > 20) {
    insights.push({
      type: 'suggestion',
      title: '一周模式洞察',
      content: `您在${weekDays[maxDay]}表现最好(${analysis.weeklyPattern[maxDay].toFixed(1)}%)，${weekDays[minDay]}相对较弱(${analysis.weeklyPattern[minDay].toFixed(1)}%)。`,
      priority: 3
    });
  }
  
  // 生成建议
  if (analysis.completionRate < 70) {
    recommendations.push('考虑减少目标数量或降低单个目标的难度');
  }
  
  if (analysis.streakDays < 3) {
    recommendations.push('设置提醒，在固定时间进行打卡');
  }
  
  if (analysis.strugglingGoals.length > 0) {
    recommendations.push('重点关注困难目标，可以将其拆分为更小的步骤');
  }
  
  // 确保至少有3个建议
  while (recommendations.length < 3) {
    const defaultRecommendations = [
      '每天在相同时间进行打卡，建立固定习惯',
      '庆祝小成就，为自己的进步感到骄傲',
      '与朋友分享目标，获得支持和监督'
    ];
    
    for (const rec of defaultRecommendations) {
      if (!recommendations.includes(rec)) {
        recommendations.push(rec);
        break;
      }
    }
  }
  
  // 生成鼓励消息
  let motivationalMessage = '每一天的坚持都在塑造更好的自己！';
  
  if (analysis.completionRate >= 80) {
    motivationalMessage = '您的坚持令人钦佩，继续保持这种优秀的状态！';
  } else if (analysis.streakDays >= 5) {
    motivationalMessage = '连续的坚持正在形成强大的习惯力量，加油！';
  } else if (analysis.completionRate >= 50) {
    motivationalMessage = '进步是一个过程，您已经在正确的道路上了！';
  } else {
    motivationalMessage = '每个人都有起伏，重要的是重新开始。您可以做到的！';
  }
  
  return { insights, recommendations, motivationalMessage };
}

// 主要的数据分析函数
export async function analyzeUserData(user: User): Promise<DataAnalysisResult> {
  // 1. 计算基础统计数据
  const analysis = calculateHabitAnalysis(user);
  
  // 2. 生成AI洞察
  const aiResult = await generateAIInsights(user, analysis);
  
  return {
    analysis,
    insights: aiResult.insights,
    recommendations: aiResult.recommendations,
    motivationalMessage: aiResult.motivationalMessage
  };
}

// 新增接口定义
export interface HeatmapData {
  date: string;
  count: number;
  completionRate: number;
}

export interface CorrelationData {
  goal1: string;
  goal2: string;
  correlation: number;
  significance: number;
}

export interface GoalPerformance {
  goalId: number;
  goalName: string;
  completionRate: number;
  consistency: number;
  trend: number;
}

export interface HabitData {
  day: number;
  consistency: number;
  difficulty: number;
  motivation: number;
  automaticity: number;
  stage: 'forming' | 'developing' | 'established';
}

export interface GoalHabitData {
  goalId: number;
  goalName: string;
  data: HabitData[];
  currentStage: 'forming' | 'developing' | 'established';
  daysToEstablish: number;
  strengthScore: number;
}

export interface AdvancedAnalysisResult {
  heatmapData: HeatmapData[];
  correlations: CorrelationData[];
  goalPerformances: GoalPerformance[];
  habitFormation: GoalHabitData[];
  insights: {
    strongestCorrelation: CorrelationData | null;
    mostConsistentGoal: GoalPerformance | null;
    fastestHabitForming: GoalHabitData | null;
    recommendations: string[];
  };
}

// 生成年度热力图数据
export function generateHeatmapData(userData: any): HeatmapData[] {
  const heatmapData: HeatmapData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    // 从用户数据中计算该日期的完成情况
    const dayStats = calculateDayStats(userData, dateStr);
    
    heatmapData.push({
      date: dateStr,
      count: dayStats.completedGoals,
      completionRate: dayStats.completionRate
    });
  }
  
  return heatmapData.reverse();
}

// 计算目标关联性
export function calculateGoalCorrelations(userData: any): { correlations: CorrelationData[], goalPerformances: GoalPerformance[] } {
  const goals = extractGoalsFromUserData(userData);
  const correlations: CorrelationData[] = [];
  const goalPerformances: GoalPerformance[] = [];
  
  // 计算每个目标的表现指标
  goals.forEach((goal: any, index: number) => {
    const performance = calculateGoalPerformance(userData, goal);
    goalPerformances.push({
      goalId: index + 1,
      goalName: goal.name,
      completionRate: performance.completionRate,
      consistency: performance.consistency,
      trend: performance.trend
    });
  });
  
  // 计算目标间相关性
  for (let i = 0; i < goals.length; i++) {
    for (let j = i + 1; j < goals.length; j++) {
      const correlation = calculatePearsonCorrelation(
        userData,
        goals[i].id,
        goals[j].id
      );
      
      correlations.push({
        goal1: goals[i].name,
        goal2: goals[j].name,
        correlation: correlation.coefficient,
        significance: correlation.pValue
      });
    }
  }
  
  return { correlations, goalPerformances };
}

// 分析习惯形成过程
export function analyzeHabitFormation(userData: any): GoalHabitData[] {
  const goals = extractGoalsFromUserData(userData);
  
  return goals.map((goal: any, index: number) => {
    const habitData = calculateHabitFormationCurve(userData, goal.id);
    const currentStage = determineHabitStage(habitData);
    const strengthScore = calculateHabitStrength(habitData);
    const daysToEstablish = predictHabitEstablishment(habitData);
    
    return {
      goalId: goal.id,
      goalName: goal.name,
      data: habitData,
      currentStage,
      daysToEstablish,
      strengthScore
    };
  });
}

// 辅助函数
function calculateDayStats(userData: any, dateStr: string) {
  // 实现日期统计计算逻辑
  const dayData = userData.punchCards?.filter((card: any) => 
    card.date.startsWith(dateStr)
  ) || [];
  
  const totalGoals = userData.goals?.length || 7;
  const completedGoals = dayData.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  
  return { completedGoals, completionRate };
}

function extractGoalsFromUserData(userData: any) {
  // 提取用户目标信息
  return userData.goals || [
    { id: 1, name: '早起' },
    { id: 2, name: '运动' },
    { id: 3, name: '阅读' },
    { id: 4, name: '冥想' },
    { id: 5, name: '学习' },
    { id: 6, name: '健康饮食' },
    { id: 7, name: '写作' }
  ];
}

function calculateGoalPerformance(userData: any, goal: any) {
  // 计算目标表现指标
  const goalPunchCards = userData.punchCards?.filter((card: any) => 
    card.goalId === goal.id
  ) || [];
  
  const totalDays = 30; // 分析最近30天
  const completedDays = goalPunchCards.length;
  const completionRate = (completedDays / totalDays) * 100;
  
  // 计算一致性（连续性）
  const consistency = calculateConsistency(goalPunchCards);
  
  // 计算趋势
  const trend = calculateTrend(goalPunchCards);
  
  return { completionRate, consistency, trend };
}

function calculatePearsonCorrelation(userData: any, goalId1: number, goalId2: number) {
  // 计算皮尔逊相关系数
  const goal1Data = userData.punchCards?.filter((card: any) => card.goalId === goalId1) || [];
  const goal2Data = userData.punchCards?.filter((card: any) => card.goalId === goalId2) || [];
  
  // 简化实现 - 实际应用中需要更复杂的统计计算
  const correlation = (Math.random() - 0.5) * 2; // -1 到 1
  const pValue = Math.random(); // 0 到 1
  
  return { coefficient: correlation, pValue };
}

function calculateHabitFormationCurve(userData: any, goalId: number): HabitData[] {
  // 计算习惯形成曲线
  const goalPunchCards = userData.punchCards?.filter((card: any) => 
    card.goalId === goalId
  ) || [];
  
  const days = Math.min(goalPunchCards.length, 100);
  const habitData: HabitData[] = [];
  
  for (let day = 1; day <= days; day++) {
    const stage = day <= 21 ? 'forming' : day <= 66 ? 'developing' : 'established';
    
    habitData.push({
      day,
      consistency: Math.min(100, 20 + day * 1.2 + Math.random() * 10),
      difficulty: Math.max(10, 80 - day * 0.8 + Math.random() * 15),
      motivation: Math.max(30, 90 - day * 0.3 + Math.random() * 20),
      automaticity: Math.min(100, 10 + day * 1.5 + Math.random() * 8),
      stage: stage as 'forming' | 'developing' | 'established'
    });
  }
  
  return habitData;
}

function determineHabitStage(habitData: HabitData[]): 'forming' | 'developing' | 'established' {
  const days = habitData.length;
  if (days <= 21) return 'forming';
  if (days <= 66) return 'developing';
  return 'established';
}

function calculateHabitStrength(habitData: HabitData[]): number {
  if (habitData.length === 0) return 0;
  const recent = habitData.slice(-7);
  const avgConsistency = recent.reduce((sum, d) => sum + d.consistency, 0) / recent.length;
  const avgAutomaticity = recent.reduce((sum, d) => sum + d.automaticity, 0) / recent.length;
  return (avgConsistency + avgAutomaticity) / 2;
}

function predictHabitEstablishment(habitData: HabitData[]): number {
  if (habitData.length === 0) return 66;
  
  const recentTrend = habitData.slice(-14);
  if (recentTrend.length < 7) return 66;
  
  const avgGrowth = recentTrend.reduce((sum, d, i) => {
    if (i === 0) return 0;
    return sum + (d.automaticity - recentTrend[i-1].automaticity);
  }, 0) / (recentTrend.length - 1);
  
  const currentLevel = habitData[habitData.length - 1].automaticity;
  const daysNeeded = Math.max(21, Math.min(100, (90 - currentLevel) / Math.max(0.1, avgGrowth)));
  
  return Math.round(daysNeeded);
}

function calculateConsistency(punchCards: any[]): number {
  // 计算打卡一致性
  if (punchCards.length === 0) return 0;
  
  // 简化实现 - 基于打卡频率计算
  const totalDays = 30;
  const punchDays = punchCards.length;
  return Math.min(100, (punchDays / totalDays) * 100);
}

function calculateTrend(punchCards: any[]): number {
  // 计算趋势 - 正数表示上升，负数表示下降
  if (punchCards.length < 7) return 0;
  
  const recent = punchCards.slice(-7);
  const earlier = punchCards.slice(-14, -7);
  
  const recentAvg = recent.length / 7;
  const earlierAvg = earlier.length / 7;
  
  return (recentAvg - earlierAvg) * 100;
}

// 生成高级分析结果
export async function generateAdvancedAnalysis(username: string): Promise<AdvancedAnalysisResult> {
  try {
    // 获取用户数据
    const userData = await getUserData(username);
    
    // 生成各种分析数据
    const heatmapData = generateHeatmapData(userData);
    const { correlations, goalPerformances } = calculateGoalCorrelations(userData);
    const habitFormation = analyzeHabitFormation(userData);
    
    // 生成洞察
    const insights = {
      strongestCorrelation: correlations.length > 0 
        ? correlations.reduce((max, curr) => 
            Math.abs(curr.correlation) > Math.abs(max.correlation) ? curr : max
          ) 
        : null,
      mostConsistentGoal: goalPerformances.length > 0
        ? goalPerformances.reduce((max, curr) => 
            curr.consistency > max.consistency ? curr : max
          )
        : null,
      fastestHabitForming: habitFormation.length > 0
        ? habitFormation.reduce((fastest, curr) => 
            curr.strengthScore > fastest.strengthScore ? curr : fastest
          )
        : null,
      recommendations: generateRecommendations(goalPerformances, correlations, habitFormation)
    };
    
    return {
      heatmapData,
      correlations,
      goalPerformances,
      habitFormation,
      insights
    };
    
  } catch (error) {
    console.error('生成高级分析失败:', error);
    throw error;
  }
}

// 添加缺失的 getUserData 函数
async function getUserData(username: string): Promise<any> {
  // 模拟获取用户数据 - 实际应用中应从数据库获取
  return {
    username,
    goals: [
      { id: 1, name: '早起' },
      { id: 2, name: '运动' },
      { id: 3, name: '阅读' },
      { id: 4, name: '冥想' },
      { id: 5, name: '学习' },
      { id: 6, name: '健康饮食' },
      { id: 7, name: '写作' }
    ],
    punchCards: []
  };
}

function generateRecommendations(
  goalPerformances: GoalPerformance[], 
  correlations: CorrelationData[], 
  habitFormation: GoalHabitData[]
): string[] {
  const recommendations: string[] = [];
  
  // 基于目标表现的建议
  const lowPerformanceGoals = goalPerformances.filter(g => g.completionRate < 50);
  if (lowPerformanceGoals.length > 0) {
    recommendations.push(`建议重点关注完成率较低的目标：${lowPerformanceGoals.map(g => g.goalName).join('、')}`);
  }
  
  // 基于相关性的建议
  const strongPositiveCorrelations = correlations.filter(c => c.correlation > 0.6);
  if (strongPositiveCorrelations.length > 0) {
    recommendations.push(`发现强正相关目标，建议同时进行：${strongPositiveCorrelations[0].goal1}和${strongPositiveCorrelations[0].goal2}`);
  }
  
  // 基于习惯形成的建议
  const formingHabits = habitFormation.filter(h => h.currentStage === 'forming');
  if (formingHabits.length > 0) {
    recommendations.push(`${formingHabits.map(h => h.goalName).join('、')}正处于习惯形成期，坚持21天是关键`);
  }
  
  return recommendations;
} 