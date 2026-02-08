'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { getToday, getTomorrow, formatDateJapanese } from '@/utils/storage';
import styles from './AddTodoForm.module.css';

interface AddTodoFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, startTime: string, description: string, date: string) => void;
}

export default function AddTodoForm({ isOpen, onClose, onSubmit }: AddTodoFormProps) {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(getTomorrow());

    const today = getToday();
    const tomorrow = getTomorrow();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSubmit(title.trim(), startTime, description.trim(), date);
            // フォームをリセット
            setTitle('');
            setStartTime('09:00');
            setDescription('');
            setDate(getTomorrow());
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>新しい予定</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>タイトル *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="予定のタイトルを入力"
                            className={styles.input}
                            autoFocus
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>開始時間 *</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>日付 *</label>
                            <div className={styles.dateButtons}>
                                <button
                                    type="button"
                                    className={`${styles.dateButton} ${date === today ? styles.active : ''}`}
                                    onClick={() => setDate(today)}
                                >
                                    今日
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.dateButton} ${date === tomorrow ? styles.active : ''}`}
                                    onClick={() => setDate(tomorrow)}
                                >
                                    明日
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.selectedDate}>
                        📅 {formatDateJapanese(date)}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>詳細（任意）</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="詳細な説明を入力..."
                            className={styles.textarea}
                            rows={3}
                            maxLength={500}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            キャンセル
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={!title.trim()}>
                            <Plus size={18} />
                            <span>作成</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
