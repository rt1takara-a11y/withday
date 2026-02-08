'use client';

import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { SubTask } from '@/types';
import styles from './SubTaskList.module.css';

interface SubTaskListProps {
    subTasks: SubTask[];
    onToggle: (subTaskId: string) => void;
    onAdd: (title: string) => void;
    onDelete: (subTaskId: string) => void;
    disabled?: boolean;
}

export default function SubTaskList({ subTasks, onToggle, onAdd, onDelete, disabled = false }: SubTaskListProps) {
    const [newSubTask, setNewSubTask] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubTask.trim()) {
            onAdd(newSubTask.trim());
            setNewSubTask('');
            setIsAdding(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsAdding(false);
            setNewSubTask('');
        }
    };

    return (
        <div className={styles.container}>
            <ul className={styles.list}>
                {subTasks.map(subTask => (
                    <li key={subTask.id} className={styles.item}>
                        <button
                            className={`${styles.checkbox} ${subTask.completed ? styles.checked : ''}`}
                            onClick={() => onToggle(subTask.id)}
                            disabled={disabled}
                        >
                            {subTask.completed && <Check size={12} />}
                        </button>
                        <span className={`${styles.title} ${subTask.completed ? styles.completed : ''}`}>
                            {subTask.title}
                        </span>
                        {!disabled && (
                            <button
                                className={styles.deleteButton}
                                onClick={() => onDelete(subTask.id)}
                                title="削除"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {!disabled && (
                <>
                    {isAdding ? (
                        <form onSubmit={handleSubmit} className={styles.addForm}>
                            <input
                                type="text"
                                value={newSubTask}
                                onChange={(e) => setNewSubTask(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="サブタスクを入力..."
                                className={styles.input}
                                autoFocus
                                maxLength={30}
                            />
                            <button type="submit" className={styles.submitButton} disabled={!newSubTask.trim()}>
                                追加
                            </button>
                        </form>
                    ) : (
                        <button className={styles.addButton} onClick={() => setIsAdding(true)}>
                            <Plus size={14} />
                            <span>サブタスク追加</span>
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
