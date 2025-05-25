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
    
    // 计算当前是第几天
    const cycleStart = new Date(user.cycleStart);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - cycleStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    user.currentDay = diffDays;
    
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

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 