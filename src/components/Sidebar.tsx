'use client';

import Calendar from './Calendar';
import styles from './Sidebar.module.css';

interface SidebarProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
    getTodoCount: (date: string) => number;
}

export default function Sidebar({ selectedDate, onSelectDate, getTodoCount }: SidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>カレンダー</h2>
                <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={onSelectDate}
                    getTodoCount={getTodoCount}
                />
            </div>

            <div className={styles.section}>
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: 'var(--accent)' }}></span>
                        <span>予定あり</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
