import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import KhaoCook5 from '../../../assets/images/KhaoCook5.png'
import './Header.css'

const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Logo*/}
                <Link to="/" className="navbar-logo">
                    <img src={KhaoCook5} alt="KhaoCook Logo" className="navbar-logo-image" />
                </Link>

                {/* แสดงตามสถานะการล็อกอิน*/}
                <div className="navbar-right">
                    {!isAuthenticated ? (
                        // ถ้ายังไม่ได้ล็อกอิน - แสดงปุ่ม Login & Sign Up
                        <div className="navbar-auth-buttons">
                            <Link to="/login" className="btn-login">
                                LogIn
                            </Link>
                            <Link to="/signup" className="btn-signup">
                                SignUp
                            </Link>
                        </div>
                    ) : (
                        // ถ้าล็อกอินแล้ว - แสดงรูปโปรไฟล์
                        <div className="navbar-profile">
                            <button className="profile-button" onClick={toggleDropdown}>
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.username} 
                                        className="profile-avatar"
                                    />
                                ) : (
                                    <div className="profile-placeholder">
                                        {user?.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <p className="dropdown-username">{user?.username}</p>
                                        <p className="dropdown-email">{user?.email}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        Profile
                                    </Link>

                                    <Link to="/my-menu" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        </svg>
                                        My Menu
                                    </Link>

                                    <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
                                        </svg>
                                        Setting
                                    </Link>

                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-itemlogout">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header