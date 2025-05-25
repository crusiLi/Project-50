import { User, PunchRecord, TodoItem, TodoList, PunchItem } from './types';
import { startOfWeek, endOfWeek, parseISO } from 'date-fns';

const API_BASE_URL = 'http://localhost:3001/api';

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
}

export async function addUser(username: string, password: string, goals?: string[]): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, goals }),
  });
  if (!response.ok) {
    throw new Error('用户名已存在');
  }
  return response.json();
}

export async function checkUser(username: string, password: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.ok;
}

export function setCurrentUser(username: string) {
  localStorage.setItem('currentUser', username);
}

export function getCurrentUser(): string {
  return localStorage.getItem('currentUser') || '';
}

export function logout() {
  localStorage.removeItem('currentUser');
}

export async function setUserGoals(username: string, goals: string[]): Promise<User> {
  const user = await getUserData(username);
  if (!user) throw new Error('用户不存在');

  const updatedUser = {
    ...user,
    punchItems: goals.map((g, i) => ({ id: i + 1, content: g, completed: false })),
    currentDay: 1,
    cycleStart: new Date().toISOString().slice(0, 10),
  };

  const response = await fetch(`${API_BASE_URL}/users/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });

  return response.json();
}

export async function checkAndUpdateUserDay(username: string): Promise<void> {
  const user = await getUserData(username);
  if (!user) return;

  const today = new Date().toISOString().slice(0, 10);
  const cycleStart = new Date(user.cycleStart);
  const currentDate = new Date(today);
  
  const diffTime = Math.abs(currentDate.getTime() - cycleStart.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > user.currentDay) {
    const updatedUser = {
      ...user,
      currentDay: diffDays,
    };

    await fetch(`${API_BASE_URL}/users/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });
  }
}

export async function getUserData(username: string): Promise<User | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    if (!response.ok) return undefined;
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return undefined;
  }
}

export async function resetUserCycle(username: string): Promise<User> {
  const user = await getUserData(username);
  if (!user) throw new Error('用户不存在');

  const updatedUser = {
    ...user,
    currentDay: 1,
    cycleStart: new Date().toISOString().slice(0, 10),
    punchItems: user.punchItems.map((item: PunchItem) => ({ ...item, completed: false })),
  };

  const response = await fetch(`${API_BASE_URL}/users/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });

  return response.json();
}

export async function updateUserPunchItems(username: string, punchItems: PunchItem[]): Promise<User> {
  const user = await getUserData(username);
  if (!user) throw new Error('用户不存在');

  const today = new Date().toISOString().slice(0, 10);
  const punchRecord: PunchRecord = {
    date: today,
    items: {}
  };

  punchItems.forEach(item => {
    punchRecord.items[item.id] = item.completed;
  });

  const updatedUser = {
    ...user,
    punchItems,
    punchRecords: [
      ...(user.punchRecords || []).filter((r: PunchRecord) => r.date !== today),
      punchRecord
    ],
  };

  const response = await fetch(`${API_BASE_URL}/users/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });

  return response.json();
}

export async function updateUserDay(username: string, day: number): Promise<User> {
  const user = await getUserData(username);
  if (!user) throw new Error('用户不存在');

  const updatedUser = {
    ...user,
    currentDay: day,
  };

  const response = await fetch(`${API_BASE_URL}/users/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });

  return response.json();
}

export async function getUserTodos(username: string, date: string): Promise<TodoItem[]> {
  const user = await getUserData(username);
  return user?.todos[date] || [];
}

export async function updateUserTodos(username: string, date: string, todos: TodoItem[]): Promise<User> {
  const user = await getUserData(username);
  if (!user) throw new Error('用户不存在');

  const updatedUser = {
    ...user,
    todos: {
      ...user.todos,
      [date]: todos,
    },
  };

  const today = new Date().toISOString().slice(0, 10);
  if (date === today) {
    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
    if (allCompleted) {
      const cycleStart = new Date(user.cycleStart);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - cycleStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > user.currentDay) {
        updatedUser.currentDay = diffDays;
      }
    }
  }

  const response = await fetch(`${API_BASE_URL}/users/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });

  return response.json();
}

export async function getUserWeeklyPunchRecords(username: string): Promise<PunchRecord[]> {
  const user = await getUserData(username);
  if (!user || !user.punchRecords) return [];
  
  const today = new Date();
  // 获取当前周的开始和结束日期 (周一到周日)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 从周一开始
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // 到周日结束
  
  return user.punchRecords
    .filter((record: PunchRecord) => {
      const recordDate = parseISO(record.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    })
    .sort((a: PunchRecord, b: PunchRecord) => a.date.localeCompare(b.date));
} 