'use client';

import { useEffect, useState, useCallback } from 'react';
import { Todo } from '@/types';

export interface NotificationSettings {
    enabled: boolean;
    reminderMinutes: number; // 何分前に通知するか
}

const SETTINGS_KEY = 'withday_notification_settings';

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [settings, setSettings] = useState<NotificationSettings>({
        enabled: false,
        reminderMinutes: 10,
    });
    const [isSupported, setIsSupported] = useState(false);

    // 初期化
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);

            // 設定を読み込み
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) {
                try {
                    setSettings(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse notification settings:', e);
                }
            }
        }
    }, []);

    // 設定を保存
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        }
    }, [settings]);

    // 通知許可をリクエスト
    const requestPermission = useCallback(async () => {
        if (!isSupported) return false;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                setSettings(prev => ({ ...prev, enabled: true }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    }, [isSupported]);

    // 通知をスケジュール
    const scheduleNotification = useCallback(async (todo: Todo) => {
        if (!settings.enabled || permission !== 'granted') return;

        const [hours, minutes] = todo.startTime.split(':').map(Number);
        const todoDate = new Date(todo.date);
        todoDate.setHours(hours, minutes, 0, 0);

        // リマインダー時間を引く
        const notificationTime = todoDate.getTime() - (settings.reminderMinutes * 60 * 1000);

        // 過去の時間なら通知しない
        if (notificationTime <= Date.now()) return;

        // Service Workerに通知をスケジュール
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SCHEDULE_NOTIFICATION',
                title: '📋 ' + todo.title,
                body: `${settings.reminderMinutes}分後に開始予定`,
                scheduledTime: notificationTime,
                tag: `todo-${todo.id}`,
            });
        }
    }, [settings, permission]);

    // すぐに通知を送る（テスト用）
    const sendTestNotification = useCallback(() => {
        if (permission !== 'granted') return;

        new Notification('🔔 Withday テスト通知', {
            body: '通知が正常に動作しています！',
            icon: '/icons/icon-192.png',
        });
    }, [permission]);

    // 設定を更新
    const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    return {
        isSupported,
        permission,
        settings,
        requestPermission,
        scheduleNotification,
        sendTestNotification,
        updateSettings,
    };
}
