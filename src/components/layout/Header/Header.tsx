import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { userService } from '../../../services/userService'
import KhaoCook5 from '../../../assets/images/KhaoCook5.png'
import './Header.css'

const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [userAvatar, setUserAvatar] = useState<string>('');

    useEffect(() => {
        if (user?.username) {
            const avatar = userService.getUserAvatar(user.username);
            setUserAvatar(avatar);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.navbar-profile')) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }  ;
    }, [showDropdown]);

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
                                    <img 
                                        src={userAvatar || user?.avatarURL || user?.avatar || 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg'} 
                                        alt={user?.username || 'User'} 
                                        className="profile-header-avatar"
                                        onError={(e) => {
                                            //ถ้ารูปโหลดไม่ได้ ใช้รูป default
                                            (e.target as HTMLImageElement).src = 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg'
                                        }}
                                    />
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <div className="dropdown-avatar-wrapper">
                                            <img 
                                                src={userAvatar || user?.avatarURL || user?.avatar || 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg'}
                                                alt={user?.username || 'User'}
                                                className="dropdown-avatar"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg';
                                                }}
                                            />
                                        </div>
                                        <p className="dropdown-username">@{user?.username}</p>
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
    );
};

export default Header;