'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from '@/utils/storage';
import styles from './Calendar.module.css';

interface CalendarProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
    getTodoCount: (date: string) => number;
}

export default function Calendar({ selectedDate, onSelectDate, getTodoCount }: CalendarProps) {
    const [viewDate, setViewDate] = useState(() => {
        const date = new Date(selectedDate);
        return { year: date.getFullYear(), month: date.getMonth() };
    });

    const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
    const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

    const prevMonth = () => {
        setViewDate(prev => {
            if (prev.month === 0) {
                return { year: prev.year - 1, month: 11 };
            }
            return { ...prev, month: prev.month - 1 };
        });
    };

    const nextMonth = () => {
        setViewDate(prev => {
            if (prev.month === 11) {
                return { year: prev.year + 1, month: 0 };
            }
            return { ...prev, month: prev.month + 1 };
        });
    };

    const handleDayClick = (day: number) => {
        const dateString = formatDate(new Date(viewDate.year, viewDate.month, day));
        onSelectDate(dateString);
    };

    const today = formatDate(new Date());
    const selectedDateObj = new Date(selectedDate);
    const isSelectedMonth = selectedDateObj.getFullYear() === viewDate.year && selectedDateObj.getMonth() === viewDate.month;

    // カレンダーの日付配列を作成
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <button className={styles.navButton} onClick={prevMonth}>
                    <ChevronLeft size={18} />
                </button>
                <span className={styles.monthYear}>
                    {viewDate.year}年 {monthNames[viewDate.month]}
                </span>
                <button className={styles.navButton} onClick={nextMonth}>
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className={styles.weekDays}>
                {weekDays.map((day, index) => (
                    <div
                        key={day}
                        className={`${styles.weekDay} ${index === 0 ? styles.sunday : ''} ${index === 6 ? styles.saturday : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className={styles.days}>
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className={styles.empty} />;
                    }

                    const dateString = formatDate(new Date(viewDate.year, viewDate.month, day));
                    const isToday = dateString === today;
                    const isSelected = isSelectedMonth && selectedDateObj.getDate() === day;
                    const todoCount = getTodoCount(dateString);
                    const dayOfWeek = new Date(viewDate.year, viewDate.month, day).getDay();

                    return (
                        <button
                            key={day}
                            className={`${styles.day} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''} ${dayOfWeek === 0 ? styles.sunday : ''} ${dayOfWeek === 6 ? styles.saturday : ''}`}
                            onClick={() => handleDayClick(day)}
                        >
                            <span className={styles.dayNumber}>{day}</span>
                            {todoCount > 0 && (
                                <span className={styles.todoIndicator}>
                                    {todoCount > 3 ? '●●●' : '●'.repeat(todoCount)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
