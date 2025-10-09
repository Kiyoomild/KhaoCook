import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; //ReactNpde เป็น type ไม่ใช่ value

// import authService from '../services/authService'; // สมมติว่ามีบริการ API สำหรับการยืนยันตัวตน

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // ตรวจสอบว่ามี user ใน localStorage หรือไม่เมื่อ component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    }, []);

    //ในฟังก์ชัน login และ signup มีพารามิเตอร์ password แต่ยังไม่ได้ใช้งานจริง (เพราะตอนนี้ใช้ mock data อยู่)
    const login = async (email: string, _password: string): Promise<void> => {
        try {
             // TODO: เรียก API จริงตรงนี้
            // const response = await authService.login(email, password);
            
            // Mock data สำหรับทดสอบ
            const mockUser: User = {
                id: '1',
                username: 'Kiyoomild',
                email: email,
                avatar: 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg' // หรือใช้รูปจริง
        };

            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', 'mock-token-12345'); // เก็บ token 
        }  catch (error) {
            console.error('Login failed: ', error);
            throw error;
        }
    };

    const signup = async (username: string, email: string, _password: string): Promise<void> => {
        try {
            // TODO: เรียก API จริงตรงนี้
            // const response = await authService.signup(username, email, password);
            
            // Mock data สำหรับทดสอบ
            const mockUser: User = {
                id: '2',
                username: username,
                email: email,
                avatar: 'https://via.placeholder.com/150'
        };

            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', 'mock-token-67890');
        } catch (error) {
            console.error('Signup failed: ', error);
            throw error;
        }
    };

    const logout = (): void => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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