// src/pages/MenuDetailPage/MenuDetailPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth'; 
import { recipeService } from '../../services/recipeService';
import type { Recipe } from '../../services/recipeService';
import './MenuDetailPage.css';

// [1] เพิ่ม Interface สำหรับรับค่าดิบจาก Database (เพื่อแก้ Error "Unexpected any")
interface ApiCommentData {
    id: number;
    comment_text: string;
    created_at: string;
    username: string;
    avatar_url: string | null;
}

// Interface สำหรับใช้ในหน้าเว็บ (Frontend)
interface Comment {
    id: string;
    userId?: string;
    username: string;
    userAvatar: string;
    text: string;
    createdAt: Date;
}

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

    // -------------------------------------------------------------------------
    // ฟังก์ชันสำหรับดึงข้อมูล Comment จาก Server
    // -------------------------------------------------------------------------
    const fetchComments = async (recipeId: string) => {
        try {
            // ยิงไปที่ API Backend ของเรา
            const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}/comments`);
            const data = await response.json();
            
            // [2] แก้ไข: ระบุ Type เป็น ApiCommentData แทน any
            const mappedComments: Comment[] = data.map((c: ApiCommentData) => ({
                id: String(c.id),
                text: c.comment_text,
                username: c.username || 'Unknown',
                userAvatar: c.avatar_url || 'https://placehold.co/100',
                createdAt: new Date(c.created_at)
            }));

            setComments(mappedComments);
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    };

    // โหลดข้อมูลเมนู + คอมเม้นท์
    const loadMenuDetail = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            // 1. เรียก API ดึงข้อมูล Recipe
            const recipeData = await recipeService.getRecipeById(id);
            
            // 2. เรียกฟังก์ชันดึงคอมเม้นท์
            await fetchComments(id);

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

    // -------------------------------------------------------------------------
    // ฟังก์ชันส่ง Comment ไปบันทึกที่ Server
    // -------------------------------------------------------------------------
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            alert('กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น');
            return;
        }

        if (!newComment.trim()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipe_id: id,
                    comment_text: newComment
                })
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            const savedComment = await response.json();

            const commentObj: Comment = {
                id: String(savedComment.id),
                userId: String(user.id),
                username: savedComment.username || user.username,
                userAvatar: savedComment.avatar_url || user.avatar_url || 'https://placehold.co/100',
                text: savedComment.comment_text,
                createdAt: new Date(savedComment.created_at)
            };

            setComments([ commentObj, ...comments]);
            setNewComment('');

        } catch (error) {
            console.error('Error posting comment:', error);
            alert('เกิดข้อผิดพลาดในการส่งความคิดเห็น');
        }
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
                                        <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
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