import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { userService } from '../services/userService'; // เพิ่มบรรทัดนี้

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    avatarURL?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    signup: (username: string, email: string, password: string) => Promise<User | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// เก็บข้อมูล auth ใน memory แทน localStorage
let currentAuthUser: User | null = null;
let authToken: string | null = null;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(currentAuthUser);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!currentAuthUser);

    // โหลดข้อมูล user จาก memory เมื่อ component ถูก mount
    useEffect(() => {
        if (currentAuthUser) {
            setUser(currentAuthUser);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email: string, _password: string): Promise<User | null> => {
        try {
            // TODO: เรียก API จริงตรงนี้
            // const response = await authService.login(email, password);
            
            // Mock data สำหรับทดสอบ
            const mockUser: User = {
                id: '1',
                username: 'Kiyoomild',
                email,
                avatarURL: 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg'
            };

            // บันทึกใน Memory
            currentAuthUser = mockUser;
            authToken = 'mock-token-12345';
            
            setUser(mockUser);
            setIsAuthenticated(true);

            return mockUser;
        } catch (error) {
            console.error('Login failed:', error);
            return null;
        }
    };

    const signup = async (username: string, email: string, _password: string): Promise<User | null> => {
        try {
            // TODO: เรียก API จริงตรงนี้
            // const response = await authService.signup(username, email, password);
            
            // ดึง avatar จาก userService หรือใช้ default
            const avatar = userService.getUserAvatar(username);
            
            // Mock data สำหรับทดสอบ
            const mockUser: User = {
                id: Date.now().toString(), // สร้าง id ไม่ซ้ำ
                username,
                email,
                avatar: avatar,
                avatarURL: avatar // ใช้ค่าเดียวกัน
            };

            // บันทึกใน Memory
            currentAuthUser = mockUser;
            authToken = `mock-token-${Date.now()}`;
            
            setUser(mockUser);
            setIsAuthenticated(true);

            // เพิ่ม user เข้า userService
            const existingUser = userService.getUserByUsername(username);
            if (!existingUser) {
                userService.addUser({
                    username: username,
                    avatar: avatar,
                    email: email
                });
            }

            return mockUser;
        } catch (error) {
            console.error('Signup failed:', error);
            return null;
        }
    };

    const logout = (): void => {
        // ลบข้อมูลใน memory
        currentAuthUser = null;
        authToken = null;

        setUser(null);
        setIsAuthenticated(false);
        
        // ลบข้อมูลใน localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('userAvatar');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook สำหรับใช้ Auth Context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Helper function สำหรับเข้าถึง current user (สำหรับ service อื่นๆ)
export const getCurrentUser = (): User | null => currentAuthUser;
export const getAuthToken = (): string | null => authToken;