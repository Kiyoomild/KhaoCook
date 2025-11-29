// src/pages/MenuDetailPage/MenuDetailPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth'; 
import { recipeService } from '../../services/recipeService';
import type { Recipe } from '../../services/recipeService';
import './MenuDetailPage.css';

interface Comment {
    id: string;
    userId: string;
    username: string;
    userAvatar: string;
    text: string;
    createdAt: Date;
}

// Extends Recipe เพื่อให้ Type เข้ากันได้
interface MenuDetail extends Recipe {
    caption: string;
    ingredients: string[];
    steps: string[];
    likes: number;
    isLiked: boolean;
    comments: Comment[];
}

const MenuDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [ menu, setMenu ] = useState<MenuDetail | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ isFavorite, setIsFavorite ] = useState<boolean>(false);
    const [ newComment, setNewComment ] = useState<string>('');
    const [ comments, setComments ] = useState<Comment[]>([]);

    // โหลดข้อมูลจาก API
    const loadMenuDetail = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            // 1. เรียก API ดึงข้อมูล Recipe
            const recipeData = await recipeService.getRecipeById(id);
            
            // 2. แปลงข้อมูล Description (String) ให้เป็น Array (แบบง่าย)
            const descLines = recipeData.description ? recipeData.description.split('\n') : [];
            
            const mappedMenu: MenuDetail = {
                ...recipeData,
                caption: recipeData.description || '',
                ingredients: descLines.length > 0 ? descLines : ['ดูในวิธีทำ'],
                steps: descLines.length > 0 ? descLines : ['ดูคำอธิบาย'],
                
                likes: 0, 
                isLiked: false,
                comments: [] 
            };

            setMenu(mappedMenu);
            setComments([]); 
        } catch (error) {
            console.error('Failed to load menu detail:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadMenuDetail();
    }, [loadMenuDetail]);

    const handleFavorite = () => {
        if (!isAuthenticated) {
            alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มในรายการโปรด');
            return;
        }
        setIsFavorite(!isFavorite);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            alert('กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น');
            return;
        }

        if (!newComment.trim()) {
            return;
        }

        const comment: Comment = {
            id: Date.now().toString(),
            userId: String(user.id), 
            username: user.username,
            userAvatar: user.avatar_url || 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg',
            text: newComment,
            createdAt: new Date()
        };

        setComments([ comment, ...comments]);
        setNewComment('');
    };

    if (loading) {
        return (
            <div className="menu-detail-loading">
                <div className="loading-spinner"></div>
                <p>กำลังโหลด....</p>
            </div>
        );
    }

    if (!menu) {
        return (
            <div className="menu-detail-error">
                <h2>ไม่พบเมนูนี้</h2>
                <button onClick={() => navigate('/')}>กลับหน้าแรก</button>
            </div>
        );
    }

    return (
    <div className="menu-detail-page">
        <div className="menu-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

            <div className="menu-image-section">
                {/* 🔑 [FIX] ใช้ menu.image ตรงๆ ไม่ต้องใช้ as any */}
                <img 
                    src={menu.image} 
                    alt={menu.title}
                    className="menu-detail-image"
                />
            </div>

            <div className="menu-header">
                <h1 className="menu-title">{menu.title}</h1>
                <div className="menu-author-info">
                    <span>โดย: @{menu.username}</span>
                </div>
                <p className="menu-caption">{menu.caption}</p>
            </div>

            <section className="ingredients-section">
                <h2 className="section-title">รายละเอียด / วัตถุดิบ</h2>
                <ul className="ingredients-list">
                    {menu.ingredients.map((item, index) => (
                        <li key={index} className="ingredient-item">
                            <span className="ingredient-bullet">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <button 
                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                onClick={handleFavorite}
            >
                {/* SVG Icon */}
                <span>{isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}</span>
            </button>

            <section className="comments-section">
                <h2 className="section-title">ความคิดเห็น ({comments.length})</h2>
                
                <form className="comment-form" onSubmit={handleAddComment}>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder={isAuthenticated ? "แสดงความคิดเห็นของคุณ..." : "กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น"}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!isAuthenticated}
                    />
                    <button type="submit" className="comment-submit-btn" disabled={!isAuthenticated || !newComment.trim()}>ส่ง</button>
                </form>

                <div className="comments-list">
                    {comments.length === 0 ? <p className="no-comments">ยังไม่มีความคิดเห็น</p> : 
                        comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <img src={comment.userAvatar} alt={comment.username} className="comment-avatar" />
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="comment-username">{comment.username}</span>
                                        <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString('th-TH')}</span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    </div>
)
}

export default MenuDetailPage;