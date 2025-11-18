import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; //ReactNpde เป็น type ไม่ใช่ value

// import authService from '../services/authService'; // สมมติว่ามีบริการ API สำหรับการยืนยันตัวตน

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

//เก็บข้อมูล auth ใน memory แทน localStorage
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

    //ในฟังก์ชัน login และ signup มีพารามิเตอร์ password แต่ยังไม่ได้ใช้งานจริง (เพราะตอนนี้ใช้ mock data อยู่)
    const login = async (email: string, _password: string): Promise<User | null> => {
        try {
             // TODO: เรียก API จริงตรงนี้
            // const response = await authService.login(email, password);
            
            // Mock data สำหรับทดสอบ
            const mockUser: User = {
                id: '1',
                username: 'Kiyoomild',
                email,
                avatarURL: 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg' // หรือใช้รูปจริง
        };

            //บันทุกใน Memory
            currentAuthUser = mockUser;
            authToken = 'mock-token=12345';
            
            setUser(mockUser);
            setIsAuthenticated(true);

            return mockUser;
        }  catch (error) {
            console.error('Login failed: ', error);
            return null;
        }
    };

    const signup = async (username: string, email: string, _password: string): Promise<User | null> => {
        try {
            // TODO: เรียก API จริงตรงนี้
            // const response = await authService.signup(username, email, password);
            
            // Mock data สำหรับทดสอบ
            const mockUser: User = {
                id: '2',
                username,
                email,
                avatar: 'https://via.placeholder.com/150'
        };

            currentAuthUser = mockUser;
            authToken = 'mock-token-67890';
            setUser(mockUser);
            setIsAuthenticated(true);

            return mockUser;
        } catch (error) {
            console.error('Signup failed: ', error);
            return null;
        }
    };

    const logout = (): void => {
        //ลบข้อมูลใน memory
        currentAuthUser = null;
        authToken = null;

        setUser(null);
        setIsAuthenticated(false);
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

// 🆕 Helper function สำหรับเข้าถึง current user (สำหรับ service อื่นๆ)
export const getCurrentUser = (): User | null => currentAuthUser;
export const getAuthToken = (): string | null => authToken;