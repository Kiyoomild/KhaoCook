import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="profile-not-logged-in">
                <h2>You are not logged in</h2>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <img
                    src={user.avatar || 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg'}
                    alt="Avatar"
                    className="profile-page-avatar"
                />
                <h1>{user.username}</h1>
                <p>{user.email}</p>

                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default ProfilePage;
