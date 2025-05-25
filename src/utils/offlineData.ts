import { setItem, getItem } from './storage';

// 离线模式的默认数据
const defaultOfflineData = {
  user: {
    username: 'offline_user',
    registrationDate: new Date().toISOString(),
    currentDay: 1
  },
  todos: [],
  punchRecords: [],
  habits: [
    { id: 1, name: '早起', completed: false, category: '健康' },
    { id: 2, name: '运动', completed: false, category: '健康' },
    { id: 3, name: '阅读', completed: false, category: '学习' },
    { id: 4, name: '冥想', completed: false, category: '心理' }
  ]
};

// 初始化离线数据
export const initializeOfflineData = async () => {
  try {
    const existingData = await getItem('offlineData');
    if (!existingData) {
      await setItem('offlineData', JSON.stringify(defaultOfflineData));
      console.log('Offline data initialized');
    }
  } catch (error) {
    console.error('Failed to initialize offline data:', error);
  }
};

// 获取离线数据
export const getOfflineData = async () => {
  try {
    const data = await getItem('offlineData');
    return data ? JSON.parse(data) : defaultOfflineData;
  } catch (error) {
    console.error('Failed to get offline data:', error);
    return defaultOfflineData;
  }
};

// 保存离线数据
export const saveOfflineData = async (data: any) => {
  try {
    await setItem('offlineData', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save offline data:', error);
  }
};

// 离线模式的API模拟
export const offlineAPI = {
  // 获取用户信息
  getCurrentUser: async () => {
    const data = await getOfflineData();
    return data.user;
  },

  // 获取今日任务
  getTodayTodos: async () => {
    const data = await getOfflineData();
    return data.todos.filter((todo: any) => {
      const today = new Date().toDateString();
      const todoDate = new Date(todo.date).toDateString();
      return today === todoDate;
    });
  },

  // 添加任务
  addTodo: async (todo: any) => {
    const data = await getOfflineData();
    const newTodo = {
      ...todo,
      id: Date.now(),
      date: new Date().toISOString(),
      completed: false
    };
    data.todos.push(newTodo);
    await saveOfflineData(data);
    return newTodo;
  },

  // 更新任务状态
  updateTodo: async (todoId: number, updates: any) => {
    const data = await getOfflineData();
    const todoIndex = data.todos.findIndex((t: any) => t.id === todoId);
    if (todoIndex !== -1) {
      data.todos[todoIndex] = { ...data.todos[todoIndex], ...updates };
      await saveOfflineData(data);
    }
    return data.todos[todoIndex];
  },

  // 获取打卡记录
  getPunchRecords: async () => {
    const data = await getOfflineData();
    return data.punchRecords;
  },

  // 添加打卡记录
  addPunchRecord: async (record: any) => {
    const data = await getOfflineData();
    const newRecord = {
      ...record,
      id: Date.now(),
      date: new Date().toISOString()
    };
    data.punchRecords.push(newRecord);
    await saveOfflineData(data);
    return newRecord;
  },

  // 获取习惯列表
  getHabits: async () => {
    const data = await getOfflineData();
    return data.habits;
  }
}; 