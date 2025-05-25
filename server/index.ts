import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { User, PunchItem, PunchRecord } from './types';
import { analyzeUserData, generateAdvancedAnalysis } from './aiService';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = 3001;

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../data/users.json');

// 确保数据文件存在
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 中间件
app.use(cors());
app.use(express.json());

// 读取用户数据
function getUsers(): User[] {
  try {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// 保存用户数据
function saveUsers(users: User[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// 每天凌晨重置打卡进度
function resetDailyPunchProgress() {
  const users = getUsers();
  const today = new Date().toISOString().slice(0, 10);
  
  users.forEach(user => {
    // 重置打卡项目状态
    user.punchItems = user.punchItems.map(item => ({
      ...item,
      completed: false
    }));
    
    // 计算当前是第几天（从第1天开始）
    const cycleStart = new Date(user.cycleStart);
    const currentDate = new Date(today);
    const diffTime = currentDate.getTime() - cycleStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 第一天为1
    user.currentDay = Math.max(1, diffDays); // 确保至少是第1天
    
    // 添加今天的打卡记录
    const todayRecord: PunchRecord = {
      date: today,
      items: {}
    };
    
    user.punchItems.forEach(item => {
      todayRecord.items[item.id] = false;
    });
    
    // 更新打卡记录
    user.punchRecords = [
      ...user.punchRecords.filter(r => r.date !== today),
      todayRecord
    ];
  });
  
  saveUsers(users);
}

// 设置定时任务，每天凌晨 00:00 执行
function scheduleDailyReset() {
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // 明天
    0, 0, 0 // 00:00:00
  );
  const msToMidnight = night.getTime() - now.getTime();

  // 设置定时器
  setTimeout(() => {
    resetDailyPunchProgress();
    // 设置下一个定时器
    scheduleDailyReset();
  }, msToMidnight);
}

// 启动定时任务
scheduleDailyReset();

// 获取所有用户
app.get('/api/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});

// 添加用户
app.post('/api/users', (req, res) => {
  const { username, password, goals } = req.body;
  const users = getUsers();
  
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ error: '用户名已存在' });
  }

  const today = new Date().toISOString().slice(0, 10);
  const punchItems = Array.isArray(goals) && goals.length === 7
    ? goals.map((g, i) => ({ id: i + 1, content: g, completed: false }))
    : [];

  const newUser: User = {
    username,
    password,
    punchItems,
    currentDay: 1,
    cycleStart: today,
    todos: {},
    punchRecords: [{
      date: today,
      items: punchItems.reduce((acc, item) => ({
        ...acc,
        [item.id]: false
      }), {})
    }],
  };

  users.push(newUser);
  saveUsers(users);
  res.json(newUser);
});

// 验证用户
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

// 更新用户数据
app.put('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const updatedData = req.body;
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  users[userIndex] = { ...users[userIndex], ...updatedData };
  saveUsers(users);
  res.json(users[userIndex]);
});

// 获取用户数据
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const users = getUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json(user);
});

// 继续当前目标，开启新50天
app.post('/api/users/:username/continue-cycle', (req, res) => {
  const { username } = req.params;
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  users[userIndex].currentDay = 1;
  users[userIndex].cycleStart = new Date().toISOString().slice(0, 10);
  users[userIndex].punchRecords = [];
  // punchItems 不变

  saveUsers(users);
  res.json(users[userIndex]);
});

// 设定新目标，开启新50天
app.post('/api/users/:username/new-cycle', (req, res) => {
  const { username } = req.params;
  const { goals } = req.body; // 新目标数组
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  users[userIndex].currentDay = 1;
  users[userIndex].cycleStart = new Date().toISOString().slice(0, 10);
  users[userIndex].punchRecords = [];
  users[userIndex].punchItems = Array.isArray(goals) && goals.length === 7
    ? goals.map((g, i) => ({ id: i + 1, content: g, completed: false }))
    : [];

  saveUsers(users);
  res.json(users[userIndex]);
});

// AI数据分析API
app.get('/api/users/:username/analysis', async (req, res) => {
  try {
    const { username } = req.params;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查用户是否有足够的数据进行分析
    if (user.punchRecords.length === 0) {
      return res.json({
        analysis: {
          completionRate: 0,
          streakDays: 0,
          bestPerformingGoals: [],
          strugglingGoals: [],
          weeklyPattern: [0, 0, 0, 0, 0, 0, 0],
          predictedSuccess: 0,
          totalDays: 0,
          completedDays: 0
        },
        insights: [{
          type: 'encouragement',
          title: '开始您的旅程',
          content: '欢迎开始您的50天挑战！坚持打卡，我们将为您提供详细的数据分析。',
          priority: 3
        }],
        recommendations: [
          '设定明确且可实现的目标',
          '每天在固定时间进行打卡',
          '记录您的进步和感受'
        ],
        motivationalMessage: '每一个伟大的成就都始于决定尝试的那一刻！'
      });
    }

    const analysisResult = await analyzeUserData(user);
    res.json(analysisResult);

  } catch (error) {
    console.error('AI分析失败:', error);
    res.status(500).json({ 
      error: '分析失败，请稍后重试',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取用户基础统计数据（快速版本，不调用AI）
app.get('/api/users/:username/stats', (req, res) => {
  try {
    const { username } = req.params;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 计算基础统计
    let totalChecks = 0;
    let completedChecks = 0;
    let completedDays = 0;

    user.punchRecords.forEach(record => {
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
    const sortedRecords = [...user.punchRecords].sort((a, b) => 
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

    res.json({
      completionRate: Math.round(completionRate * 100) / 100,
      streakDays,
      totalDays: user.punchRecords.length,
      completedDays,
      currentDay: user.currentDay,
      cycleStart: user.cycleStart
    });

  } catch (error) {
    console.error('统计数据获取失败:', error);
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

// 高级数据分析接口
app.get('/api/users/:username/advanced-analysis', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ error: '用户名不能为空' });
    }

    console.log(`获取用户 ${username} 的高级分析数据`);
    
    const advancedAnalysis = await generateAdvancedAnalysis(username);
    
    res.json({
      success: true,
      data: advancedAnalysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取高级分析数据失败:', error);
    res.status(500).json({ 
      error: '获取高级分析数据失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取用户详细打卡历史数据（用于数据可视化）
app.get('/api/users/:username/punch-history', (req, res) => {
  try {
    const { username } = req.params;
    const { days = 365 } = req.query; // 默认获取365天数据
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 生成详细的打卡历史数据
    const today = new Date();
    const historyData: Array<{
      date: string;
      count: number;
      totalGoals: number;
      completionRate: number;
      hasRecord: boolean;
    }> = [];
    
    for (let i = parseInt(days as string) - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      // 查找该日期的打卡记录
      const dayRecord = user.punchRecords.find(record => record.date === dateStr);
      
      let completionRate = 0;
      let completedGoals = 0;
      let totalGoals = user.punchItems.length;
      
      if (dayRecord) {
        const completedItems = Object.values(dayRecord.items).filter(Boolean).length;
        const totalItems = Object.keys(dayRecord.items).length;
        completedGoals = completedItems;
        totalGoals = totalItems;
        completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
      }
      
      historyData.push({
        date: dateStr,
        count: completedGoals,
        totalGoals,
        completionRate: Math.round(completionRate * 100) / 100,
        hasRecord: !!dayRecord
      });
    }

    res.json({
      username,
      historyData,
      totalDays: historyData.length,
      activeDays: historyData.filter(d => d.hasRecord).length
    });

  } catch (error) {
    console.error('获取打卡历史失败:', error);
    res.status(500).json({ error: '获取打卡历史失败' });
  }
});

// 获取用户目标详细表现数据
app.get('/api/users/:username/goal-performance', (req, res) => {
  try {
    const { username } = req.params;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 计算每个目标的详细表现
    const goalPerformances = user.punchItems.map(item => {
      let totalDays = 0;
      let completedDays = 0;
      let recentDays = 0;
      let recentCompleted = 0;
      const dailyRecords: Array<{
        date: string;
        completed: boolean;
      }> = [];

      // 分析每个目标的打卡记录
      user.punchRecords.forEach(record => {
        if (record.items[item.id] !== undefined) {
          totalDays++;
          const isCompleted = record.items[item.id];
          if (isCompleted) completedDays++;
          
          dailyRecords.push({
            date: record.date,
            completed: isCompleted
          });
          
          // 计算最近7天的表现
          const recordDate = new Date(record.date);
          const daysDiff = Math.floor((new Date().getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 7) {
            recentDays++;
            if (isCompleted) recentCompleted++;
          }
        }
      });

      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
      const recentRate = recentDays > 0 ? (recentCompleted / recentDays) * 100 : 0;
      const trend = recentRate - completionRate; // 趋势：正数表示改善，负数表示下降

      // 计算一致性（连续性）
      let maxStreak = 0;
      let currentStreak = 0;
      const sortedRecords = dailyRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      sortedRecords.forEach(record => {
        if (record.completed) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

      const consistency = totalDays > 0 ? (maxStreak / totalDays) * 100 : 0;

      return {
        goalId: item.id,
        goalName: item.content,
        completionRate: Math.round(completionRate * 100) / 100,
        consistency: Math.round(consistency * 100) / 100,
        trend: Math.round(trend * 100) / 100,
        totalDays,
        completedDays,
        maxStreak,
        recentRate: Math.round(recentRate * 100) / 100,
        dailyRecords
      };
    });

    res.json({
      username,
      goalPerformances,
      totalGoals: user.punchItems.length
    });

  } catch (error) {
    console.error('获取目标表现数据失败:', error);
    res.status(500).json({ error: '获取目标表现数据失败' });
  }
});

// AI建议接口
app.get('/api/users/:username/ai-recommendations', async (req, res) => {
  try {
    const { username } = req.params;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 获取基础分析数据
    const analysisResult = await analyzeUserData(user);
    
    // 生成个性化建议
    const personalizedRecommendations = generatePersonalizedRecommendations(user, analysisResult.analysis);
    const progressPrediction = generateProgressPrediction(user, analysisResult.analysis);
    
    res.json({
      insights: analysisResult.insights,
      recommendations: analysisResult.recommendations,
      motivationalMessage: analysisResult.motivationalMessage,
      personalizedTips: personalizedRecommendations,
      progressPrediction
    });

  } catch (error) {
    console.error('获取AI建议失败:', error);
    res.status(500).json({ error: '获取AI建议失败' });
  }
});

// 智能洞察接口
app.get('/api/users/:username/smart-insights', async (req, res) => {
  try {
    const { username } = req.params;
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 获取基础分析数据
    const analysisResult = await analyzeUserData(user);
    
    // 生成智能洞察
    const smartInsights = generateSmartInsights(user, analysisResult.analysis);
    const habitPatterns = analyzeHabitPatterns(user);
    const performanceMetrics = calculatePerformanceMetrics(user, analysisResult.analysis);
    const predictions = generatePredictions(user, analysisResult.analysis);
    
    res.json({
      insights: smartInsights,
      patterns: habitPatterns,
      metrics: performanceMetrics,
      predictions
    });

  } catch (error) {
    console.error('获取智能洞察失败:', error);
    res.status(500).json({ error: '获取智能洞察失败' });
  }
});

// 辅助函数：生成个性化建议
function generatePersonalizedRecommendations(user: User, analysis: any) {
  const recommendations: any[] = [];
  
  if (analysis.completionRate < 70) {
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
  
  if (analysis.weeklyPattern) {
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const bestDay = analysis.weeklyPattern.indexOf(Math.max(...analysis.weeklyPattern));
    const worstDay = analysis.weeklyPattern.indexOf(Math.min(...analysis.weeklyPattern));
    
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
}

// 辅助函数：生成进度预测
function generateProgressPrediction(user: User, analysis: any) {
  const completionRate = analysis.completionRate || 0;
  const streakDays = analysis.streakDays || 0;
  
  let nextWeekSuccess = completionRate;
  let monthlyTrend: 'improving' | 'stable' | 'declining' = 'stable';
  
  if (streakDays > 7) {
    nextWeekSuccess = Math.min(100, completionRate + 10);
    monthlyTrend = 'improving';
  } else if (streakDays < 3) {
    nextWeekSuccess = Math.max(0, completionRate - 15);
    monthlyTrend = 'declining';
  }
  
  const riskFactors: string[] = [];
  const opportunities: string[] = [];
  
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
}

// 辅助函数：生成智能洞察
function generateSmartInsights(user: User, analysis: any) {
  const insights: any[] = [];
  
  if (analysis.completionRate > 80) {
    insights.push({
      id: 'high-performance',
      type: 'performance',
      title: '优秀表现',
      description: `您的整体完成率达到${analysis.completionRate.toFixed(1)}%，表现非常出色！`,
      severity: 'low',
      confidence: 95,
      actionable: false,
      metrics: {
        current: analysis.completionRate,
        target: 90,
        trend: 'up'
      }
    });
  } else if (analysis.completionRate < 50) {
    insights.push({
      id: 'low-performance',
      type: 'performance',
      title: '需要改进',
      description: `完成率为${analysis.completionRate.toFixed(1)}%，建议调整目标或策略`,
      severity: 'high',
      confidence: 90,
      actionable: true,
      metrics: {
        current: analysis.completionRate,
        target: 70,
        trend: 'down'
      }
    });
  }
  
  if (analysis.streakDays > 14) {
    insights.push({
      id: 'streak-success',
      type: 'pattern',
      title: '习惯形成良好',
      description: `连续打卡${analysis.streakDays}天，习惯正在稳固建立`,
      severity: 'low',
      confidence: 85,
      actionable: false
    });
  } else if (analysis.streakDays < 3) {
    insights.push({
      id: 'streak-warning',
      type: 'recommendation',
      title: '连续性需要加强',
      description: `当前连续打卡${analysis.streakDays}天，建议专注于建立稳定的日常习惯`,
      severity: 'medium',
      confidence: 80,
      actionable: true
    });
  }
  
  return insights;
}

// 辅助函数：分析习惯模式
function analyzeHabitPatterns(user: User) {
  const patterns: any[] = [];
  
  // 分析周内表现差异
  const weeklyStats = new Array(7).fill(0);
  const weeklyCounts = new Array(7).fill(0);
  
  user.punchRecords.forEach(record => {
    const date = new Date(record.date);
    const dayOfWeek = (date.getDay() + 6) % 7; // 转换为周一=0的格式
    
    const dayTotal = Object.keys(record.items).length;
    const dayCompleted = Object.values(record.items).filter(Boolean).length;
    
    if (dayTotal > 0) {
      weeklyStats[dayOfWeek] += (dayCompleted / dayTotal) * 100;
      weeklyCounts[dayOfWeek]++;
    }
  });
  
  // 计算平均值
  for (let i = 0; i < 7; i++) {
    if (weeklyCounts[i] > 0) {
      weeklyStats[i] = weeklyStats[i] / weeklyCounts[i];
    }
  }
  
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const maxDay = weeklyStats.indexOf(Math.max(...weeklyStats));
  const minDay = weeklyStats.indexOf(Math.min(...weeklyStats));
  
  if (Math.max(...weeklyStats) - Math.min(...weeklyStats) > 20) {
    patterns.push({
      pattern: '周内表现差异',
      frequency: 100,
      impact: 'neutral',
      description: `您在${weekDays[maxDay]}表现最佳(${weeklyStats[maxDay].toFixed(1)}%)，在${weekDays[minDay]}表现最差(${weeklyStats[minDay].toFixed(1)}%)`,
      suggestions: [
        `在${weekDays[maxDay]}安排重要目标`,
        `为${weekDays[minDay]}制定特殊策略`,
        '分析高效日的成功因素'
      ]
    });
  }
  
  return patterns;
}

// 辅助函数：计算性能指标
function calculatePerformanceMetrics(user: User, analysis: any) {
  return [
    {
      name: '完成率',
      value: analysis.completionRate,
      unit: '%',
      trend: analysis.completionRate > 70 ? 'up' : analysis.completionRate < 50 ? 'down' : 'stable',
      change: 5.2,
      icon: 'Assessment',
      color: '#4caf50'
    },
    {
      name: '连续天数',
      value: analysis.streakDays,
      unit: '天',
      trend: analysis.streakDays > 7 ? 'up' : 'stable',
      change: 2,
      icon: 'Schedule',
      color: '#2196f3'
    },
    {
      name: '活跃目标',
      value: analysis.bestPerformingGoals?.length || 0,
      unit: '个',
      trend: 'stable',
      change: 0,
      icon: 'TrackChanges',
      color: '#ff9800'
    }
  ];
}

// 辅助函数：生成预测
function generatePredictions(user: User, analysis: any) {
  return {
    weeklySuccess: 75,
    monthlyTrend: 'improving',
    riskLevel: 'low',
    opportunities: [
      '可以考虑增加新的挑战目标',
      '优化时间安排提高效率',
      '建立奖励机制维持动机'
    ]
  };
}

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 