import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

// 1. Type + API
import { loginUser } from '../services/api';
import type { UserData } from '../services/api';

// NEW: import helpers จากไฟล์ใหม่ — import เฉพาะที่เราใช้จริง
import { getInitialUser } from './authHelpers';

// 🔵 Export Type เพื่อให้ useAuth.ts ใช้ได้
export interface AuthContextType {
    user: UserData | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<UserData>;
    signup: (username: string, email: string, password: string) => Promise<UserData | null>;
    logout: () => void;
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const initialUser = getInitialUser();
    const [user, setUser] = useState<UserData | null>(initialUser);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialUser);

    // Login
    const login = async (email: string, password: string): Promise<UserData> => {
        try {
            const userDataFromApi = await loginUser(email, password);

            localStorage.setItem('username', userDataFromApi.username);
            localStorage.setItem('userAvatar', userDataFromApi.avatar_url);

            setUser(userDataFromApi);
            setIsAuthenticated(true);

            return userDataFromApi;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    // Signup
    const signup = async (username: string, email: string, password: string): Promise<UserData | null> => {
        try {
            const tempMockToken = `mock-token-${username}-${password.length}`;
            const mockUser: UserData = {
                id: 999,
                username,
                email,
                avatar_url: 'https://via.placeholder.com/150',
                created_at: new Date().toISOString(),
            };

            localStorage.setItem('username', mockUser.username);
            localStorage.setItem('userAvatar', mockUser.avatar_url);
            localStorage.setItem('auth_token', tempMockToken);

            setUser(mockUser);
            setIsAuthenticated(true);

            return mockUser;
        } catch (error) {
            console.error('Signup failed:', error);
            return null;
        }
    };

    // Logout
    const logout = (): void => {
        localStorage.removeItem('username');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('auth_token');

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
