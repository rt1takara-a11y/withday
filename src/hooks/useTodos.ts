'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo, SubTask } from '@/types';
import { loadTodos, saveTodos, getToday, getTomorrow } from '@/utils/storage';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(getToday());
    const [isLoaded, setIsLoaded] = useState(false);

    // 初回読み込み
    useEffect(() => {
        const loaded = loadTodos();
        setTodos(loaded);
        setIsLoaded(true);
    }, []);

    // 変更時に保存
    useEffect(() => {
        if (isLoaded) {
            saveTodos(todos);
        }
    }, [todos, isLoaded]);

    // 進捗計算
    const calculateProgress = useCallback((todo: Todo): number => {
        if (todo.subTasks.length === 0) {
            return todo.completed ? 100 : 0;
        }
        const completedCount = todo.subTasks.filter(st => st.completed).length;
        return Math.floor((completedCount / todo.subTasks.length) * 100);
    }, []);

    // 選択日のTodoをフィルタリング
    const filteredTodos = todos
        .filter(todo => todo.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Todo追加
    const addTodo = useCallback((
        title: string,
        startTime: string,
        description: string,
        date: string
    ) => {
        const newTodo: Todo = {
            id: uuidv4(),
            title,
            startTime,
            description,
            completed: false,
            progress: 0,
            subTasks: [],
            date,
            createdAt: new Date().toISOString()
        };
        setTodos(prev => [...prev, newTodo]);
    }, []);

    // Todo削除
    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    }, []);

    // Todo更新
    const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
        setTodos(prev => prev.map(todo => {
            if (todo.id !== id) return todo;
            const updated = { ...todo, ...updates };
            updated.progress = calculateProgress(updated);
            return updated;
        }));
    }, [calculateProgress]);

    // Todo完了トグル
    const toggleTodoCompleted = useCallback((id: string) => {
        setTodos(prev => prev.map(todo => {
            if (todo.id !== id) return todo;
            const newCompleted = !todo.completed;
            // 完了時はサブタスクも全て完了にする
            const newSubTasks = newCompleted
                ? todo.subTasks.map(st => ({ ...st, completed: true }))
                : todo.subTasks;
            const updated = {
                ...todo,
                completed: newCompleted,
                subTasks: newSubTasks
            };
            updated.progress = calculateProgress(updated);
            return updated;
        }));
    }, [calculateProgress]);

    // サブタスク追加
    const addSubTask = useCallback((todoId: string, title: string) => {
        const newSubTask: SubTask = {
            id: uuidv4(),
            title,
            completed: false
        };
        setTodos(prev => prev.map(todo => {
            if (todo.id !== todoId) return todo;
            const updated = {
                ...todo,
                subTasks: [...todo.subTasks, newSubTask]
            };
            updated.progress = calculateProgress(updated);
            return updated;
        }));
    }, [calculateProgress]);

    // サブタスク削除
    const deleteSubTask = useCallback((todoId: string, subTaskId: string) => {
        setTodos(prev => prev.map(todo => {
            if (todo.id !== todoId) return todo;
            const updated = {
                ...todo,
                subTasks: todo.subTasks.filter(st => st.id !== subTaskId)
            };
            updated.progress = calculateProgress(updated);
            return updated;
        }));
    }, [calculateProgress]);

    // サブタスク完了トグル
    const toggleSubTaskCompleted = useCallback((todoId: string, subTaskId: string) => {
        setTodos(prev => prev.map(todo => {
            if (todo.id !== todoId) return todo;
            const newSubTasks = todo.subTasks.map(st =>
                st.id === subTaskId ? { ...st, completed: !st.completed } : st
            );
            const allCompleted = newSubTasks.length > 0 && newSubTasks.every(st => st.completed);
            const updated = {
                ...todo,
                subTasks: newSubTasks,
                completed: allCompleted
            };
            updated.progress = calculateProgress(updated);
            return updated;
        }));
    }, [calculateProgress]);

    // 日付ごとのTodo数を取得
    const getTodoCountByDate = useCallback((date: string): number => {
        return todos.filter(todo => todo.date === date).length;
    }, [todos]);

    return {
        todos: filteredTodos,
        allTodos: todos,
        selectedDate,
        setSelectedDate,
        isLoaded,
        addTodo,
        deleteTodo,
        updateTodo,
        toggleTodoCompleted,
        addSubTask,
        deleteSubTask,
        toggleSubTaskCompleted,
        getTodoCountByDate,
        today: getToday(),
        tomorrow: getTomorrow()
    };
}
