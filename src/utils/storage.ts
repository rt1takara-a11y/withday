import { Todo } from '@/types';

const STORAGE_KEY = 'withday_todos';

// LocalStorageからTodoを読み込む
export function loadTodos(): Todo[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load todos:', error);
        return [];
    }
}

// LocalStorageにTodoを保存する
export function saveTodos(todos: Todo[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('Failed to save todos:', error);
    }
}

// 日付を "YYYY-MM-DD" 形式にフォーマット
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 今日の日付を取得
export function getToday(): string {
    return formatDate(new Date());
}

// 明日の日付を取得
export function getTomorrow(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
}

// 日付を日本語表示用にフォーマット
export function formatDateJapanese(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 (${weekday})`;
}

// 指定月の日数を取得
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

// 指定月の最初の曜日を取得 (0=日曜日)
export function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}
