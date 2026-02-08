'use client';

import { Bell, BellOff, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import styles from './NotificationSettings.module.css';

interface NotificationSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
    const {
        isSupported,
        permission,
        settings,
        requestPermission,
        sendTestNotification,
        updateSettings,
    } = useNotifications();

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>🔔 通知設定</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {!isSupported ? (
                        <div className={styles.unsupported}>
                            <BellOff size={32} />
                            <p>このブラウザは通知に対応していません</p>
                        </div>
                    ) : permission === 'denied' ? (
                        <div className={styles.denied}>
                            <BellOff size={32} />
                            <p>通知がブロックされています</p>
                            <p className={styles.hint}>
                                ブラウザの設定から通知を許可してください
                            </p>
                        </div>
                    ) : permission === 'default' ? (
                        <div className={styles.request}>
                            <Bell size={48} className={styles.bellIcon} />
                            <h3>通知を有効にしますか？</h3>
                            <p>予定の開始時間前にリマインダーを受け取れます</p>
                            <button className={styles.enableButton} onClick={requestPermission}>
                                通知を許可する
                            </button>
                        </div>
                    ) : (
                        <div className={styles.settings}>
                            <div className={styles.settingRow}>
                                <label className={styles.label}>
                                    <span>通知を有効にする</span>
                                    <input
                                        type="checkbox"
                                        checked={settings.enabled}
                                        onChange={(e) => updateSettings({ enabled: e.target.checked })}
                                        className={styles.checkbox}
                                    />
                                </label>
                            </div>

                            <div className={styles.settingRow}>
                                <label className={styles.label}>
                                    <span>リマインダー</span>
                                    <select
                                        value={settings.reminderMinutes}
                                        onChange={(e) => updateSettings({ reminderMinutes: Number(e.target.value) })}
                                        className={styles.select}
                                        disabled={!settings.enabled}
                                    >
                                        <option value={5}>5分前</option>
                                        <option value={10}>10分前</option>
                                        <option value={15}>15分前</option>
                                        <option value={30}>30分前</option>
                                        <option value={60}>1時間前</option>
                                    </select>
                                </label>
                            </div>

                            <button
                                className={styles.testButton}
                                onClick={sendTestNotification}
                                disabled={!settings.enabled}
                            >
                                テスト通知を送信
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
