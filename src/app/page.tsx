'use client';

import { useState, useEffect } from 'react';
import { Plus, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { usePWA } from '@/hooks/usePWA';
import { useNotifications } from '@/hooks/useNotifications';
import Header from '@/components/Header';
import Calendar from '@/components/Calendar';
import TodoList from '@/components/TodoList';
import AddTodoForm from '@/components/AddTodoForm';
import NotificationSettings from '@/components/NotificationSettings';
import styles from './page.module.css';

export default function Home() {
  const {
    todos,
    selectedDate,
    setSelectedDate,
    today,
    tomorrow,
    addTodo,
    deleteTodo,
    toggleTodoCompleted,
    addSubTask,
    deleteSubTask,
    toggleSubTaskCompleted,
    getTodoCountByDate
  } = useTodos();

  const { scheduleNotification, settings: notificationSettings } = useNotifications();

  // PWA Service Worker登録
  usePWA();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isPastDate = selectedDate < today;
  const canAdd = selectedDate === today || selectedDate === tomorrow;

  // Todo追加時に通知をスケジュール
  const handleAddTodo = (title: string, startTime: string, description: string, date: string) => {
    addTodo(title, startTime, description, date);

    // 通知が有効な場合、追加後にスケジュール
    if (notificationSettings.enabled) {
      const newTodo = {
        id: '', // 実際のIDは useTodos で生成される
        title,
        startTime,
        description,
        date,
        completed: false,
        progress: 0,
        subTasks: [],
        createdAt: new Date().toISOString(),
      };
      scheduleNotification(newTodo);
    }
  };

  return (
    <div className={styles.container}>
      <Header
        selectedDate={selectedDate}
        onSelectToday={() => setSelectedDate(today)}
        onSelectTomorrow={() => setSelectedDate(tomorrow)}
      />

      <main className={styles.main}>
        <div className={styles.todoArea}>
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodoCompleted}
            onDeleteTodo={deleteTodo}
            onToggleSubTask={toggleSubTaskCompleted}
            onAddSubTask={addSubTask}
            onDeleteSubTask={deleteSubTask}
            isPastDate={isPastDate}
          />
        </div>

        {/* カレンダー（下部に折りたたみ式） */}
        <div className={styles.calendarSection}>
          <button
            className={styles.calendarToggle}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <span>📅 カレンダー</span>
            {isCalendarOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>

          {isCalendarOpen && (
            <div className={styles.calendarWrapper}>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                getTodoCount={getTodoCountByDate}
              />
            </div>
          )}
        </div>
      </main>

      {/* 通知設定ボタン */}
      <button
        className={styles.notificationButton}
        onClick={() => setIsNotificationSettingsOpen(true)}
        title="通知設定"
      >
        <Bell size={20} />
      </button>

      {canAdd && (
        <button
          className={styles.fab}
          onClick={() => setIsFormOpen(true)}
          title="予定を追加"
        >
          <Plus size={28} />
        </button>
      )}

      <AddTodoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTodo}
      />

      <NotificationSettings
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
    </div>
  );
}
