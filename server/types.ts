export interface PunchItem {
  id: number;
  content: string;
  completed: boolean;
}

export interface PunchRecord {
  date: string;
  items: {
    [id: number]: boolean;
  };
}

export interface TodoItem {
  id: string;
  content: string;
  completed: boolean;
}

export interface TodoList {
  [date: string]: TodoItem[];
}

export interface User {
  username: string;
  password: string;
  punchItems: PunchItem[];
  currentDay: number;
  cycleStart: string;
  todos: TodoList;
  punchRecords: PunchRecord[];
}

// AI数据分析相关接口
export interface HabitAnalysis {
  completionRate: number;           // 总体完成率
  streakDays: number;              // 连续打卡天数
  bestPerformingGoals: number[];   // 表现最好的目标ID
  strugglingGoals: number[];       // 困难目标ID
  weeklyPattern: number[];         // 一周内的完成模式 [周一, 周二, ..., 周日]
  predictedSuccess: number;        // 预测成功率
  totalDays: number;               // 总打卡天数
  completedDays: number;           // 完成打卡的天数
}

export interface AIInsight {
  type: 'success' | 'warning' | 'suggestion' | 'encouragement';
  title: string;
  content: string;
  priority: number; // 1-5, 5最重要
}

export interface DataAnalysisResult {
  analysis: HabitAnalysis;
  insights: AIInsight[];
  recommendations: string[];
  motivationalMessage: string;
} 