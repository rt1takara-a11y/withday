'use client';

import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    progress: number;
    size?: 'small' | 'medium';
}

export default function ProgressBar({ progress, size = 'medium' }: ProgressBarProps) {
    // 進捗に応じた色を決定
    const getColor = () => {
        if (progress < 34) return 'var(--progress-low)';
        if (progress < 67) return 'var(--progress-mid)';
        return 'var(--progress-high)';
    };

    return (
        <div className={`${styles.container} ${styles[size]}`}>
            <div className={styles.bar}>
                <div
                    className={styles.fill}
                    style={{
                        width: `${progress}%`,
                        background: getColor()
                    }}
                />
            </div>
            <span className={styles.label} style={{ color: getColor() }}>
                {progress}%
            </span>
        </div>
    );
}
