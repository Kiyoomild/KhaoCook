import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { recipeService }    from '../../services/recipeService';
import type { Recipe } from '../../services/recipeService';
import './ProfilePage.css';
import AboutSection from '../../components/home/AboutSection';
//import type { Menu } from '../../types/menu.types';

// Mock Data สำหรับเมนูของ User
const mockUserMenus = [
    {
        id: '1',
        image: 'https://i.pinimg.com/1200x/1f/ba/3a/1fba3a44f5f265dbe4510f0b6583be57.jpg',
        title: 'ขนมปังกระเทียม',
        likes: 50,
        isLiked: false
    },
    {
        id: '2',
        image: 'https://i.pinimg.com/1200x/3b/46/90/3b469087a13ab6e5f12491ee67ea3aa1.jpg',
        title: 'อูด้งเทมปุระ',
        likes: 48,
        isLiked: false
    },
    {
        id: '3',
        image: 'https://i.pinimg.com/1200x/f6/28/5a/f6285a09ead0216769e0509dcd3a2323.jpg',
        title: 'ไดฟุกุไส้ถั่วแดง',
        likes: 75,
        isLiked: false
    }
];

interface MenuWithLikes extends Recipe {
    likes: number;
    isLiked: boolean;
}

const ProfilePage: React.FC = () => {
    const { user, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [ activeTab, setActiveTab ] = useState<'recipes' | 'favorite'>('recipes');
    const [ menus, setMenus ] = useState<MenuWithLikes[]>([]);
    const [loading, setLoading] = useState(false);

    //โหลดเมนูของ user คนนี้
    const loadUserRecipes = () => {
        if (!user) return;

        setLoading(true);
        try {
            //ดึงเมนูจริงจาก recipeService
            const userRecipes = recipeService.getUserRecipes(user.username);

            //แปลงรูปแบบที่ี likes และ isLiked
            const recipesWithLikes: MenuWithLikes[] = userRecipes.map(recipe => ({
                ...recipe,
                likes: 0,
                isLiked: false
            }));

            //ถ้าไม่มีเมนูจริง ใช้ mockData
            if (recipesWithLikes.length === 0) {
                setMenus(mockUserMenus as MenuWithLikes[]);
            } else {
                setMenus(recipesWithLikes);
            }

            console.log('User recipes loaded:', recipesWithLikes.length);
        } catch (error) {
            console.log('Error loading user recipes:', error);
            //ถ้า error ใช้ mockdata
            setMenus(mockUserMenus as MenuWithLikes[]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserRecipes();
    }, [user, location.state])

    const handleAddRecipe = () => {
        navigate('/add-recipe');
    };

    const handleLike = (menuId: string) => {
        setMenus(prev => prev.map(menu =>
            menu.id === menuId
                ? {
                    ...menu,
                    isLiked: !menu.isLiked,
                    likes: menu.isLiked ? menu.likes - 1 : menu.likes + 1
                }
                : menu
        ));
    };

    const handleShare = (menuId: string) => {
        // TODO: เพิ่มฟังก์ชัน share
        console.log('Share menu:', menuId);
        alert('คัดลอกลิงก์แล้ว!');
    };

    const handleEdit = (menuId: string) => {
        navigate(`/edit-menu/${menuId}`);
    };

    const handleDelete = (menuId: string) => {
        if (window.confirm('คุณต้องการลบเมนูนี้หรือไม่?')) {
            const success = recipeService.deleteRecipe(menuId);

            if (success) {
                alert('ลบเมนูเรียบร้อยแล้ว');
                loadUserRecipes();
            } else {
                alert('ไม่สามารถลบเมนูได้ กรุณาลองใหม่อีกครั้ง');
            }
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="profile-not-logged-in">
                <div className="not-logged-card">
                    <h2>กรุณาเข้าสู่ระบบ</h2>
                    <p>คุณต้องเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
                    <button className="login-redirect-btn" onClick={() => navigate('/login')}>
                        เข้าสู่ระบบ
                    </button>
                </div>
            </div>
        );
    }

    const displayedMenus = activeTab === 'recipes'
        ? menus
        : menus.filter(menu => menu.isLiked);

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Back Button */}
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar-wrapper">
                        <img
                            src={user.avatar || user.avatarURL || 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg'}
                            alt="Avatar"
                            className="profile-avatar"
                        />
                    </div>
                    <h1 className="profile-username">@{user.username}</h1>
                    <p className="profile-caption">
                        {(user as any).bio || 'รักการทำอาหารและแชร์สูตรอาหารอร่อยๆ 🍳✨'}
                    </p>

                    {/* Stats */}
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">{menus.length}</span>
                            <span className="stat-label">สูตรอาหาร</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{menus.filter(m => m.isLiked).length}</span>
                            <span className="stat-label">ถูกใจ</span>
                        </div>
                    </div>

                    {/* Edit & Share Buttons */}
                    <div className="profile-actions">
                        <button className="edit-profile-btn" onClick={() => handleEdit('/edit-profile')}>
                            Edit
                        </button>
                        <button className="share-profile-btn" onClick={() => handleShare('profile')}>
                            Share
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recipes')}
                    >
                        <span className="tab-icon">📖</span>
                        Recipes
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'favorite' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favorite')}
                    >
                        <span className="tab-icon">❤️</span>
                        Favorite
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>กำลังโหลดเมนู...</p>
                    </div>
                ) : (
                    /* Menu Grid */
                    <div className="profile-menu-grid">
                        {displayedMenus.length === 0 ? (
                            <div className="empty-state">
                                <p>
                                    {activeTab === 'recipes' 
                                        ? '🍽️ ยังไม่มีสูตรอาหาร' 
                                        : '❤️ ยังไม่มีรายการโปรด'}
                                </p>
                                {activeTab === 'recipes' && (
                                    <button 
                                        className="add-first-recipe-btn"
                                        onClick={handleAddRecipe}
                                    >
                                        เพิ่มสูตรแรกของคุณ
                                    </button>
                                )}
                            </div>
                        ) : (
                            displayedMenus.map(menu => (
                                <div key={menu.id} className="profile-menu-card">
                                    <div 
                                        className="menu-image-wrapper"
                                        onClick={() => navigate(`/menu/${menu.id}`)}
                                    >
                                        <img src={menu.image} alt={menu.title} className="menu-image" />
                                        
                                        {/* ปุ่มลบ (แสดงเฉพาะใน Recipes tab) */}
                                        {activeTab === 'recipes' && (
                                            <button 
                                                className="delete-menu-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // ป้องกันไม่ให้คลิกไปที่รูป
                                                    handleDelete(menu.id);
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                    <div className="menu-info">
                                        <h3 className="menu-title-profile">{menu.title}</h3>
                                        <div className="menu-stats">
                                            <span className="menu-username">@{user.username}</span>
                                        </div>
                                        <div className="menu-actions">
                                            <button 
                                                className={`like-btn ${menu.isLiked ? 'liked' : ''}`}
                                                onClick={() => handleLike(menu.id)}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill={menu.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                                <span>{menu.likes}</span>
                                            </button>
                                            <button 
                                                className="share-menu-btn"
                                                onClick={() => handleShare(menu.id)}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="18" cy="5" r="3" />
                                                    <circle cx="6" cy="12" r="3" />
                                                    <circle cx="18" cy="19" r="3" />
                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Add Recipe Button */}
                <button className="add-recipe-btn" onClick={handleAddRecipe}>
                    เพิ่มเมนูอาหาร
                </button>
            </div>
            <AboutSection />
        </div>
    );
};

export default ProfilePage;
