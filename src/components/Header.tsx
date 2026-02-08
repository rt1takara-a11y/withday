'use client';

import { formatDateJapanese, getToday, getTomorrow } from '@/utils/storage';
import Logo from './Logo';
import styles from './Header.module.css';

interface HeaderProps {
    selectedDate: string;
    onSelectToday: () => void;
    onSelectTomorrow: () => void;
}

export default function Header({ selectedDate, onSelectToday, onSelectTomorrow }: HeaderProps) {
    const today = getToday();
    const tomorrow = getTomorrow();

    const isToday = selectedDate === today;
    const isTomorrow = selectedDate === tomorrow;
    const isPast = selectedDate < today;

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Logo size={36} progress={5} />
                <h1 className={styles.title}>Withday</h1>
            </div>

            <div className={styles.dateInfo}>
                <span className={styles.currentDate}>{formatDateJapanese(selectedDate)}</span>
                {isPast && <span className={styles.pastBadge}>過去</span>}
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${isToday ? styles.active : ''}`}
                    onClick={onSelectToday}
                >
                    今日
                </button>
                <button
                    className={`${styles.tab} ${isTomorrow ? styles.active : ''}`}
                    onClick={onSelectTomorrow}
                >
                    明日
                </button>
            </div>
        </header>
    );
}
