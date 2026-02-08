// サブタスク（入れ子構造の子要素）
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

// メインTodo
export interface Todo {
  id: string;
  title: string;
  startTime: string; // "HH:MM" 形式
  description: string;
  completed: boolean;
  progress: number; // 0-100
  subTasks: SubTask[];
  date: string; // "YYYY-MM-DD" 形式
  createdAt: string; // ISO形式
}

// 日付ユーティリティ用の型
export interface DateInfo {
  year: number;
  month: number;
  day: number;
  dateString: string;
}
