import React, { createContext, useContext, useState } from 'react'; // **[แก้ไข]** ลบ useEffect ออก
import type { ReactNode } from 'react';

// **1. การนำเข้า Type และฟังก์ชัน API**
import { loginUser } from '../services/api'; 
import type { UserData } from '../services/api'; 

// 2. กำหนด Type ของ Context
interface AuthContextType {
    user: UserData | null; 
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<UserData>;
    signup: (username: string, email: string, password: string) => Promise<UserData | null>;
    logout: () => void;
}

// กำหนด Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =======================================================
// 🔑 PERSISTENCE FIX: ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้เริ่มต้นจาก Local Storage
// =======================================================

const getInitialUser = (): UserData | null => {
    const username = localStorage.getItem('username');
    const avatar = localStorage.getItem('userAvatar');
    // **[แก้ไข]** ลบการดึง 'token' ที่ไม่ได้ใช้งานออกก่อน
    // const token = localStorage.getItem('auth_token'); 

    if (username && avatar) {
        // สร้าง UserData object ชั่วคราวเพื่อใช้เป็นค่าเริ่มต้นของ State
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const initialUser = getInitialUser();
    const [user, setUser] = useState<UserData | null>(initialUser); 
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialUser);

    // 3. ฟังก์ชัน Login (เชื่อมต่อ API Backend จริง)
    const login = async (email: string, password: string): Promise<UserData> => {
        try {
            const userDataFromApi = await loginUser(email, password); 
            
            // 🔑 FIX: บันทึกข้อมูลที่สำคัญลง LocalStorage
            localStorage.setItem('username', userDataFromApi.username);
            localStorage.setItem('userAvatar', userDataFromApi.avatar_url);
            // ถ้า Backend ส่ง Token มา (เช่น JWT), ให้บันทึกที่นี่ด้วย
            // localStorage.setItem('auth_token', userDataFromApi.token); 

            setUser(userDataFromApi);
            setIsAuthenticated(true);

            return userDataFromApi;
        }  catch (error) {
            console.error('Login failed: ', error);
            throw error; 
        }
    };

    // 4. ฟังก์ชัน Signup (Mock Data ชั่วคราว)
    const signup = async (username: string, email: string, password: string): Promise<UserData | null> => {
        try {
            const tempMockToken = `mock-token-${username}-${password.length}`; 
            // TODO: เรียก API Signup จริงตรงนี้ (POST /api/users) 

            const mockUser: UserData = {
                id: 999, 
                username,
                email,
                avatar_url: 'https://via.placeholder.com/150',
                created_at: new Date().toISOString(),
            };
            
            // 🔑 FIX: บันทึก MockUser และ MockToken ลง LocalStorage เมื่อ Signup
            localStorage.setItem('username', mockUser.username);
            localStorage.setItem('userAvatar', mockUser.avatar_url);
            localStorage.setItem('auth_token', tempMockToken); // **[แก้ไข]** นำ tempMockToken ไปใช้

            setUser(mockUser);
            setIsAuthenticated(true);

            return mockUser;
        } catch (error) {
            console.error('Signup failed: ', error);
            return null;
        }
    };

    // 5. ฟังก์ชัน Logout 
    const logout = (): void => {
        // 🔑 FIX: ล้างข้อมูลจาก LocalStorage
        localStorage.removeItem('username');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('auth_token'); // ลบ token ด้วย

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 6. Custom hook และ Helper functions
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Helper function สำหรับเข้าถึง current user (สำหรับ service อื่นๆ)
export function getCurrentUser(): UserData | null {
    return getInitialUser(); 
}

// Helper function สำหรับเข้าถึง Auth Token
export function getAuthToken(): string | null {
    return localStorage.getItem('auth_token'); // ดึงจาก localStorage
}