import React from 'react'
import './App.css'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx'
import Header from './components/layout/Header/Header.tsx'
import LogInPage from './pages/LogInPage/Login.tsx';
import SignUpPage from './pages/SignUpPage/Signup.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx'
import MenuDetailPage from './pages/MenuDetailPage/MenuDetailPage.tsx';
import AddRecipe from './pages/AddRecipe/AddRecipe.tsx';

const AppContent: React.FC = () => {
    const location = useLocation();

    // ✅ กำหนด path ที่ไม่อยากให้ Header แสดง
    const hideHeaderRoutes = ['/login', '/signup'];

    const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowHeader && <Header />}
            <div className={`main-content ${shouldShowHeader ? 'with-header' : ''}`}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LogInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-menus" element={<div>My Menus Page</div>} />
                    <Route path="/settings" element={<div>Settings Page</div>} />
                    <Route path="/menu/:id" element={<MenuDetailPage />} />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                </Routes>
            </div>
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
