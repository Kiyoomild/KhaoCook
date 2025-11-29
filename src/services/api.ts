// src/services/api.ts

export interface UserData {
    id: number;
    username: string;
    email: string;
    avatar_url: string; // ใช้ avatar_url ตามชื่อฟิลด์ใน DB
    created_at?: string;
    updated_at?: string;
}

// 🔑 [FIX] ใช้ localhost เพื่อให้ Browser มองเห็น Backend
export const API_URL = 'http://localhost:3000/api';

/**
 * ฟังก์ชันสำหรับเรียก API Login จริง
 * @param email อีเมลของผู้ใช้
 * @param password รหัสผ่านแบบข้อความธรรมดา
 * @returns Promise<UserData> ข้อมูลผู้ใช้หาก Login สำเร็จ
 */
export const loginUser = async (email: string, password: string): Promise<UserData> => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // โยน Error หากสถานะไม่ใช่ 200 (เช่น 401 Unauthorized)
            throw new Error(data.error || 'Login failed');
        }

        return data.user as UserData; 

    } catch (error) {
        console.error('Login API Error:', error);
        throw error;
    }
};