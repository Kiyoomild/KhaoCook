// authHelpers.ts
import type { UserData } from '../services/api';

// ดึงค่าเริ่มต้นจาก LocalStorage
export const getInitialUser = (): UserData | null => {
    const username = localStorage.getItem('username');
    const avatar = localStorage.getItem('userAvatar');

    if (username && avatar) {
        return { 
            username, 
            avatar_url: avatar, 
            id: 0, 
            email: 'N/A', 
            created_at: new Date().toISOString()
        } as UserData;
    }
    return null;
};

// ดึง current user เฉย ๆ
export function getCurrentUser(): UserData | null {
    return getInitialUser();
}

// ดึง auth token
export function getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
}
