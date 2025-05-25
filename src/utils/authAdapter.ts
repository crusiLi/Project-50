import { apiAdapter } from './apiAdapter';
import { setItem, getItem, removeItem } from './storage';

// 认证适配器类
class AuthAdapter {
  private currentUser: any = null;

  // 初始化
  async initialize(): Promise<void> {
    await apiAdapter.initialize();
    
    // 尝试恢复用户会话
    try {
      const userData = await getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Failed to restore user session:', error);
    }
  }

  // 登录
  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const result = await apiAdapter.login(username, password);
      
      if (result.success && result.user) {
        this.currentUser = result.user;
        await setItem('currentUser', JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, message: result.message || '登录失败' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: '登录过程中发生错误' };
    }
  }

  // 注册
  async register(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const result = await apiAdapter.register(username, password);
      
      if (result.success && result.user) {
        this.currentUser = result.user;
        await setItem('currentUser', JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, message: result.message || '注册失败' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: '注册过程中发生错误' };
    }
  }

  // 获取当前用户
  getCurrentUser(): any {
    return this.currentUser;
  }

  // 获取当前用户名
  getCurrentUsername(): string {
    return this.currentUser?.username || '';
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // 退出登录
  async logout(): Promise<void> {
    try {
      await apiAdapter.logout();
      this.currentUser = null;
      await removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // 获取用户数据
  async getUserData(): Promise<any> {
    if (!this.currentUser) return null;
    
    try {
      const user = await apiAdapter.getCurrentUser();
      if (user) {
        this.currentUser = user;
        await setItem('currentUser', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return this.currentUser;
    }
  }

  // 更新用户当前天数
  async updateCurrentDay(): Promise<void> {
    if (!this.currentUser) return;

    try {
      const registrationDate = new Date(this.currentUser.registrationDate);
      const today = new Date();
      const diffTime = today.getTime() - registrationDate.getTime();
      const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      this.currentUser.currentDay = Math.min(currentDay, this.currentUser.totalDays || 50);
      await setItem('currentUser', JSON.stringify(this.currentUser));
    } catch (error) {
      console.error('Failed to update current day:', error);
    }
  }

  // 获取今日任务
  async getTodayTodos(): Promise<any[]> {
    try {
      return await apiAdapter.getTodayTodos();
    } catch (error) {
      console.error('Failed to get today todos:', error);
      return [];
    }
  }

  // 添加任务
  async addTodo(text: string, category?: string, priority?: 'low' | 'medium' | 'high'): Promise<any> {
    try {
      return await apiAdapter.addTodo(text, category, priority);
    } catch (error) {
      console.error('Failed to add todo:', error);
      throw error;
    }
  }

  // 更新任务
  async updateTodo(todoId: number, updates: any): Promise<any> {
    try {
      return await apiAdapter.updateTodo(todoId, updates);
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  }

  // 删除任务
  async deleteTodo(todoId: number): Promise<boolean> {
    try {
      return await apiAdapter.deleteTodo(todoId);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      return false;
    }
  }

  // 添加打卡记录
  async addPunchRecord(completedTodos: number, totalTodos: number, notes?: string): Promise<any> {
    try {
      return await apiAdapter.addPunchRecord(completedTodos, totalTodos, notes);
    } catch (error) {
      console.error('Failed to add punch record:', error);
      throw error;
    }
  }

  // 获取打卡记录
  async getPunchRecords(): Promise<any[]> {
    try {
      return await apiAdapter.getPunchRecords();
    } catch (error) {
      console.error('Failed to get punch records:', error);
      return [];
    }
  }

  // 获取习惯列表
  async getHabits(): Promise<any[]> {
    try {
      return await apiAdapter.getHabits();
    } catch (error) {
      console.error('Failed to get habits:', error);
      return [];
    }
  }

  // 更新习惯
  async updateHabit(habitId: number, updates: any): Promise<any> {
    try {
      return await apiAdapter.updateHabit(habitId, updates);
    } catch (error) {
      console.error('Failed to update habit:', error);
      throw error;
    }
  }

  // 获取统计数据
  async getStatistics(): Promise<any> {
    try {
      return await apiAdapter.getStatistics();
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return null;
    }
  }

  // 检查API健康状态
  async checkAPIHealth(): Promise<boolean> {
    try {
      return await apiAdapter.healthCheck();
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  // 获取API模式信息
  getAPIMode(): string {
    return apiAdapter.isUsingLocalAPI() ? 'Local (Embedded)' : 'Remote (External)';
  }
}

// 导出单例实例
export const authAdapter = new AuthAdapter();

// 兼容性函数（保持与原有代码的兼容性）
export const getCurrentUser = () => authAdapter.getCurrentUsername();
export const logout = () => authAdapter.logout();
export const setCurrentUser = (username: string) => {
  // 这个函数在新架构中不再需要，但保留以兼容现有代码
  console.warn('setCurrentUser is deprecated, use authAdapter.login instead');
}; 