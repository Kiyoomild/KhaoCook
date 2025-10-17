import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx'
import Header from './components/layout/Header/Header.tsx'
import LogInPage from './pages/LogInPage/Login.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx'
import MenuDetailPage from './pages/MenuDetailPage/MenuDetailPage.tsx';

const AppContent: React.FC = () => {
    const location = useLocation();

    // ✅ กำหนด path ที่ไม่อยากให้ Header แสดง
    const hideHeaderRoutes = ['/login', '/signup'];

    const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowHeader && <Header />}
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LogInPage />} />
                    <Route path="/signup" element={<div>Sign Up Page</div>} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-menus" element={<div>My Menus Page</div>} />
                    <Route path="/settings" element={<div>Settings Page</div>} />
                    <Route path="/menu/:id" element={<MenuDetailPage />} />
                </Routes>
            </div>
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
