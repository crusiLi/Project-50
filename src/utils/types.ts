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