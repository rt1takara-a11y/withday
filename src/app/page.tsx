'use client';

import { useState, useEffect } from 'react';
import { Plus, Bell } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { usePWA } from '@/hooks/usePWA';
import { useNotifications } from '@/hooks/useNotifications';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
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

      <div className={styles.main}>
        <Sidebar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          getTodoCount={getTodoCountByDate}
        />

        <main className={styles.content}>
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodoCompleted}
            onDeleteTodo={deleteTodo}
            onToggleSubTask={toggleSubTaskCompleted}
            onAddSubTask={addSubTask}
            onDeleteSubTask={deleteSubTask}
            isPastDate={isPastDate}
          />
        </main>
      </div>

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
