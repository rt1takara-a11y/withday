'use client';

import styles from './Logo.module.css';

interface LogoProps {
    size?: number;
    progress?: number; // 0-12 で何個チェックがついているか
}

export default function Logo({ size = 40, progress = 5 }: LogoProps) {
    const checkboxes = 12;
    const radius = size * 0.35;
    const checkboxSize = size * 0.12;
    const center = size / 2;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={styles.logo}
        >
            <defs>
                <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {Array.from({ length: checkboxes }).map((_, i) => {
                // 12時の位置から時計回りに配置
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                const isChecked = i < progress;

                return (
                    <g key={i} transform={`translate(${x}, ${y})`}>
                        {/* チェックボックスの背景 */}
                        <rect
                            x={-checkboxSize / 2}
                            y={-checkboxSize / 2}
                            width={checkboxSize}
                            height={checkboxSize}
                            rx={checkboxSize * 0.2}
                            fill={isChecked ? 'url(#checkGradient)' : 'transparent'}
                            stroke={isChecked ? 'none' : '#404040'}
                            strokeWidth={0.8}
                            filter={isChecked ? 'url(#glow)' : 'none'}
                        />
                        {/* チェックマーク */}
                        {isChecked && (
                            <path
                                d={`M ${-checkboxSize * 0.25} ${0} L ${-checkboxSize * 0.05} ${checkboxSize * 0.2} L ${checkboxSize * 0.25} ${-checkboxSize * 0.15}`}
                                fill="none"
                                stroke="white"
                                strokeWidth={checkboxSize * 0.15}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}
                    </g>
                );
            })}
        </svg>
    );
}
