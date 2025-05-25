import { localAPI } from './localAPI';
import { isNativePlatform } from './capacitor';

// API适配器类
class APIAdapter {
  private useLocalAPI: boolean = false;

  constructor() {
    // 移动端默认使用本地API
    this.useLocalAPI = isNativePlatform();
  }

  // 初始化API
  async initialize(): Promise<void> {
    if (this.useLocalAPI) {
      await localAPI.initialize();
      console.log('Using Local API (Embedded Backend)');
    } else {
      console.log('Using Remote API (External Server)');
    }
  }

  // 设置API模式
  setLocalMode(useLocal: boolean): void {
    this.useLocalAPI = useLocal;
  }

  // 用户认证相关
  async login(username: string, password: string): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.login(username, password);
    } else {
      // 远程API调用
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.login(username, password);
      }
    }
  }

  async register(username: string, password: string): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.register(username, password);
    } else {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.register(username, password);
      }
    }
  }

  async getCurrentUser(): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.getCurrentUser();
    } else {
      try {
        const response = await fetch('/api/auth/me');
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.getCurrentUser();
      }
    }
  }

  async logout(): Promise<void> {
    if (this.useLocalAPI) {
      await localAPI.logout();
    } else {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.warn('Remote logout failed');
      }
      await localAPI.logout(); // 总是清理本地状态
    }
  }

  // 任务管理相关
  async getTodayTodos(): Promise<any[]> {
    if (this.useLocalAPI) {
      return await localAPI.getTodayTodos();
    } else {
      try {
        const response = await fetch('/api/todos/today');
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.getTodayTodos();
      }
    }
  }

  async addTodo(text: string, category?: string, priority?: 'low' | 'medium' | 'high'): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.addTodo(text, category, priority);
    } else {
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, category, priority })
        });
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.addTodo(text, category, priority);
      }
    }
  }

  async updateTodo(todoId: number, updates: any): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.updateTodo(todoId, updates);
    } else {
      try {
        const response = await fetch(`/api/todos/${todoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.updateTodo(todoId, updates);
      }
    }
  }

  async deleteTodo(todoId: number): Promise<boolean> {
    if (this.useLocalAPI) {
      return await localAPI.deleteTodo(todoId);
    } else {
      try {
        const response = await fetch(`/api/todos/${todoId}`, {
          method: 'DELETE'
        });
        return response.ok;
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.deleteTodo(todoId);
      }
    }
  }

  // 打卡记录相关
  async addPunchRecord(completedTodos: number, totalTodos: number, notes?: string): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.addPunchRecord(completedTodos, totalTodos, notes);
    } else {
      try {
        const response = await fetch('/api/punch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedTodos, totalTodos, notes })
        });
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.addPunchRecord(completedTodos, totalTodos, notes);
      }
    }
  }

  async getPunchRecords(): Promise<any[]> {
    if (this.useLocalAPI) {
      return await localAPI.getPunchRecords();
    } else {
      try {
        const response = await fetch('/api/punch');
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.getPunchRecords();
      }
    }
  }

  // 习惯管理相关
  async getHabits(): Promise<any[]> {
    if (this.useLocalAPI) {
      return await localAPI.getHabits();
    } else {
      try {
        const response = await fetch('/api/habits');
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.getHabits();
      }
    }
  }

  async updateHabit(habitId: number, updates: any): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.updateHabit(habitId, updates);
    } else {
      try {
        const response = await fetch(`/api/habits/${habitId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.updateHabit(habitId, updates);
      }
    }
  }

  // 统计数据相关
  async getStatistics(): Promise<any> {
    if (this.useLocalAPI) {
      return await localAPI.getStatistics();
    } else {
      try {
        const response = await fetch('/api/statistics');
        return await response.json();
      } catch (error) {
        console.warn('Remote API failed, falling back to local API');
        this.useLocalAPI = true;
        return await localAPI.getStatistics();
      }
    }
  }

  // 获取当前API模式
  isUsingLocalAPI(): boolean {
    return this.useLocalAPI;
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    if (this.useLocalAPI) {
      return true; // 本地API总是可用
    } else {
      try {
        const response = await fetch('/api/health');
        return response.ok;
      } catch (error) {
        return false;
      }
    }
  }
}

// 导出单例实例
export const apiAdapter = new APIAdapter(); 