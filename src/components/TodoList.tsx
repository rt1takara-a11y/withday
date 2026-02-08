'use client';

import { Todo } from '@/types';
import TodoItem from './TodoItem';
import { Calendar } from 'lucide-react';
import styles from './TodoList.module.css';

interface TodoListProps {
    todos: Todo[];
    onToggleTodo: (id: string) => void;
    onDeleteTodo: (id: string) => void;
    onToggleSubTask: (todoId: string, subTaskId: string) => void;
    onAddSubTask: (todoId: string, title: string) => void;
    onDeleteSubTask: (todoId: string, subTaskId: string) => void;
    isPastDate: boolean;
}

export default function TodoList({
    todos,
    onToggleTodo,
    onDeleteTodo,
    onToggleSubTask,
    onAddSubTask,
    onDeleteSubTask,
    isPastDate
}: TodoListProps) {
    if (todos.length === 0) {
        return (
            <div className={styles.empty}>
                <Calendar size={64} className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>予定がありません</h3>
                <p className={styles.emptyText}>
                    {isPastDate
                        ? 'この日には予定がありませんでした'
                        : '右下の「+」ボタンから予定を追加しましょう'}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => onToggleTodo(todo.id)}
                    onDelete={() => onDeleteTodo(todo.id)}
                    onToggleSubTask={(subTaskId) => onToggleSubTask(todo.id, subTaskId)}
                    onAddSubTask={(title) => onAddSubTask(todo.id, title)}
                    onDeleteSubTask={(subTaskId) => onDeleteSubTask(todo.id, subTaskId)}
                    disabled={isPastDate}
                />
            ))}
        </div>
    );
}
