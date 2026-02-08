'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Trash2, Check } from 'lucide-react';
import { Todo } from '@/types';
import ProgressBar from './ProgressBar';
import SubTaskList from './SubTaskList';
import styles from './TodoItem.module.css';

interface TodoItemProps {
    todo: Todo;
    onToggle: () => void;
    onDelete: () => void;
    onToggleSubTask: (subTaskId: string) => void;
    onAddSubTask: (title: string) => void;
    onDeleteSubTask: (subTaskId: string) => void;
    disabled?: boolean;
}

export default function TodoItem({
    todo,
    onToggle,
    onDelete,
    onToggleSubTask,
    onAddSubTask,
    onDeleteSubTask,
    disabled = false
}: TodoItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`${styles.container} ${todo.completed ? styles.completed : ''}`}>
            <div className={styles.header}>
                <button
                    className={`${styles.checkbox} ${todo.completed ? styles.checked : ''}`}
                    onClick={onToggle}
                    disabled={disabled}
                >
                    {todo.completed && <Check size={16} />}
                </button>

                <div className={styles.content} onClick={() => setIsExpanded(!isExpanded)}>
                    <div className={styles.titleRow}>
                        <h3 className={styles.title}>{todo.title}</h3>
                        <div className={styles.time}>
                            <Clock size={14} />
                            <span>{todo.startTime}</span>
                        </div>
                    </div>

                    {todo.subTasks.length > 0 && (
                        <div className={styles.progressRow}>
                            <ProgressBar progress={todo.progress} size="small" />
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    {todo.subTasks.length > 0 && (
                        <button
                            className={styles.expandButton}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    )}
                    {!disabled && (
                        <button
                            className={styles.deleteButton}
                            onClick={onDelete}
                            title="削除"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {todo.description && (
                <p className={styles.description}>{todo.description}</p>
            )}

            {(isExpanded || todo.subTasks.length === 0) && (
                <SubTaskList
                    subTasks={todo.subTasks}
                    onToggle={onToggleSubTask}
                    onAdd={onAddSubTask}
                    onDelete={onDeleteSubTask}
                    disabled={disabled}
                />
            )}
        </div>
    );
}
