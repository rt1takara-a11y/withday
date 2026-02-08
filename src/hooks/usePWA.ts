'use client';

import { useEffect } from 'react';

export function usePWA() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Service Workerを登録
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration.scope);
                })
                .catch((error) => {
                    console.error('SW registration failed:', error);
                });
        }
    }, []);
}
