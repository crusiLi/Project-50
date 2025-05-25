import { setItem, getItem, removeItem } from './storage';

// 数据结构定义
interface User {
  id: string;
  username: string;
  password: string;
  registrationDate: string;
  currentDay: number;
  totalDays: number;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface PunchRecord {
  id: number;
  date: string;
  completedTodos: number;
  totalTodos: number;
  completionRate: number;
  notes?: string;
  createdAt: string;
}

interface Habit {
  id: number;
  name: string;
  category: string;
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  createdAt: string;
}

// 本地数据库类
class LocalDatabase {
  private async getData<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const data = await getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Failed to get ${key}:`, error);
      return defaultValue;
    }
  }

  private async setData<T>(key: string, data: T): Promise<void> {
    try {
      await setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to set ${key}:`, error);
    }
  }

  // 用户管理
  async getUsers(): Promise<User[]> {
    return this.getData('users', []);
  }

  async saveUser(user: User): Promise<void> {
    const users = await this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    await this.setData('users', users);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.username === username) || null;
  }

  // 任务管理
  async getTodos(username: string): Promise<Todo[]> {
    return this.getData(`todos_${username}`, []);
  }

  async saveTodos(username: string, todos: Todo[]): Promise<void> {
    await this.setData(`todos_${username}`, todos);
  }

  // 打卡记录管理
  async getPunchRecords(username: string): Promise<PunchRecord[]> {
    return this.getData(`punch_${username}`, []);
  }

  async savePunchRecords(username: string, records: PunchRecord[]): Promise<void> {
    await this.setData(`punch_${username}`, records);
  }

  // 习惯管理
  async getHabits(username: string): Promise<Habit[]> {
    return this.getData(`habits_${username}`, []);
  }

  async saveHabits(username: string, habits: Habit[]): Promise<void> {
    await this.setData(`habits_${username}`, habits);
  }
}

// 本地API实现
class LocalAPI {
  private db = new LocalDatabase();
  private currentUser: User | null = null;

  // 初始化默认数据
  async initialize(): Promise<void> {
    try {
      // 检查是否已有用户数据
      const users = await this.db.getUsers();
      if (users.length === 0) {
        // 创建默认用户
        const defaultUser: User = {
          id: 'default_user',
          username: 'user',
          password: '123456',
          registrationDate: new Date().toISOString(),
          currentDay: 1,
          totalDays: 50
        };
        await this.db.saveUser(defaultUser);

        // 创建默认习惯
        const defaultHabits: Habit[] = [
          {
            id: 1,
            name: '早起',
            category: '健康',
            completed: false,
            streak: 0,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: '运动',
            category: '健康',
            completed: false,
            streak: 0,
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            name: '阅读',
            category: '学习',
            completed: false,
            streak: 0,
            createdAt: new Date().toISOString()
          },
          {
            id: 4,
            name: '冥想',
            category: '心理',
            completed: false,
            streak: 0,
            createdAt: new Date().toISOString()
          }
        ];
        await this.db.saveHabits(defaultUser.username, defaultHabits);
      }
      console.log('Local API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize local API:', error);
    }
  }

  // 用户认证
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const user = await this.db.getUserByUsername(username);
      if (!user) {
        return { success: false, message: '用户不存在' };
      }
      if (user.password !== password) {
        return { success: false, message: '密码错误' };
      }
      
      // 更新当前天数
      const registrationDate = new Date(user.registrationDate);
      const today = new Date();
      const diffTime = today.getTime() - registrationDate.getTime();
      const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      user.currentDay = Math.min(currentDay, user.totalDays);
      await this.db.saveUser(user);
      
      this.currentUser = user;
      await setItem('currentUser', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: '登录失败' };
    }
  }

  // 注册用户
  async register(username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const existingUser = await this.db.getUserByUsername(username);
      if (existingUser) {
        return { success: false, message: '用户名已存在' };
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        password,
        registrationDate: new Date().toISOString(),
        currentDay: 1,
        totalDays: 50
      };

      await this.db.saveUser(newUser);
      this.currentUser = newUser;
      await setItem('currentUser', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: '注册失败' };
    }
  }

  // 获取当前用户
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    try {
      const userData = await getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
    
    return null;
  }

  // 退出登录
  async logout(): Promise<void> {
    this.currentUser = null;
    await removeItem('currentUser');
  }

  // 任务管理
  async getTodayTodos(): Promise<Todo[]> {
    if (!this.currentUser) return [];
    
    const todos = await this.db.getTodos(this.currentUser.username);
    const today = new Date().toDateString();
    
    return todos.filter(todo => {
      const todoDate = new Date(todo.date).toDateString();
      return todoDate === today;
    });
  }

  async addTodo(text: string, category: string = '默认', priority: 'low' | 'medium' | 'high' = 'medium'): Promise<Todo> {
    if (!this.currentUser) throw new Error('用户未登录');

    const todos = await this.db.getTodos(this.currentUser.username);
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      date: new Date().toISOString(),
      category,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await this.db.saveTodos(this.currentUser.username, todos);
    
    return newTodo;
  }

  async updateTodo(todoId: number, updates: Partial<Todo>): Promise<Todo | null> {
    if (!this.currentUser) throw new Error('用户未登录');

    const todos = await this.db.getTodos(this.currentUser.username);
    const todoIndex = todos.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) return null;

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.db.saveTodos(this.currentUser.username, todos);
    return todos[todoIndex];
  }

  async deleteTodo(todoId: number): Promise<boolean> {
    if (!this.currentUser) throw new Error('用户未登录');

    const todos = await this.db.getTodos(this.currentUser.username);
    const filteredTodos = todos.filter(t => t.id !== todoId);
    
    if (filteredTodos.length === todos.length) return false;

    await this.db.saveTodos(this.currentUser.username, filteredTodos);
    return true;
  }

  // 打卡记录
  async addPunchRecord(completedTodos: number, totalTodos: number, notes?: string): Promise<PunchRecord> {
    if (!this.currentUser) throw new Error('用户未登录');

    const records = await this.db.getPunchRecords(this.currentUser.username);
    const newRecord: PunchRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      completedTodos,
      totalTodos,
      completionRate: totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0,
      notes,
      createdAt: new Date().toISOString()
    };

    records.push(newRecord);
    await this.db.savePunchRecords(this.currentUser.username, records);
    
    return newRecord;
  }

  async getPunchRecords(): Promise<PunchRecord[]> {
    if (!this.currentUser) return [];
    return this.db.getPunchRecords(this.currentUser.username);
  }

  // 习惯管理
  async getHabits(): Promise<Habit[]> {
    if (!this.currentUser) return [];
    return this.db.getHabits(this.currentUser.username);
  }

  async updateHabit(habitId: number, updates: Partial<Habit>): Promise<Habit | null> {
    if (!this.currentUser) throw new Error('用户未登录');

    const habits = await this.db.getHabits(this.currentUser.username);
    const habitIndex = habits.findIndex(h => h.id === habitId);
    
    if (habitIndex === -1) return null;

    habits[habitIndex] = { ...habits[habitIndex], ...updates };
    await this.db.saveHabits(this.currentUser.username, habits);
    
    return habits[habitIndex];
  }

  // 统计数据
  async getStatistics(): Promise<any> {
    if (!this.currentUser) return null;

    const todos = await this.db.getTodos(this.currentUser.username);
    const records = await this.db.getPunchRecords(this.currentUser.username);
    const habits = await this.db.getHabits(this.currentUser.username);

    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const totalPunchDays = records.length;
    const averageCompletion = records.length > 0 
      ? records.reduce((sum, r) => sum + r.completionRate, 0) / records.length 
      : 0;

    return {
      user: this.currentUser,
      totalTodos,
      completedTodos,
      totalPunchDays,
      averageCompletion,
      habits: habits.length,
      currentStreak: this.calculateCurrentStreak(records)
    };
  }

  private calculateCurrentStreak(records: PunchRecord[]): number {
    if (records.length === 0) return 0;

    const sortedRecords = records
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    const today = new Date();
    
    for (const record of sortedRecords) {
      const recordDate = new Date(record.date);
      const daysDiff = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak && record.completionRate >= 80) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}

// 导出单例实例
export const localAPI = new LocalAPI(); 