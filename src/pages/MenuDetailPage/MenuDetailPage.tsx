import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './MenuDetailPage.css';

interface Comment {
    id: string;
    userId: string;
    username: string;
    userAvatar: string;
    text: string;
    createdAt: Date;
}

interface MenuDetail {
    id: string;
    title: string;
    image: string;
    caption: string;
    ingredients: string[];
    steps: string[];
    author: {
        id: string;
        username: string;
        avatar: string;
    };
    likes: number;
    isLiked: boolean;
    comments: Comment[];
}

//Mock data
const mockMenuDetail: MenuDetail = {
    id: '1',
    title: 'ข้าวแกงกระหรี่ทงคัตสึไข่ข้น',
    image: 'https://i.pinimg.com/736x/d6/a4/39/d6a43951c931a67ede0cd753322d898e.jpg',
    caption: 'มาทำทงคัตสึแส่บๆ กินกับข้าวแกงกระหรี่ร้อนๆ ไข่ข้นละมุนลิ้นกัน ด้วยวัตถุดิบง่ายๆ ที่หาซื้อได้ในตลาดนัดใกล้บ้านกันครับ',
    ingredients: [
        'ข้าวสวยร้อนๆ 1 จาน',
        'หมูสันนอกสไลซ์ 150 กรัม',
        'เกล็ดขนมปังสำหรับชุบทอด 1 ถ้วย',
        'ไข่ไก่ 2 ฟอง',
        'น้ำมันพืชสำหรับทอด',
        'ซอสแกงกระหรี่สำเร็จรูป 1 กล่อง'
    ],
    steps: [
        'หุงข้าวสวยร้อนๆ เตรียมไว้',
        'ต้มซอสแกงกระหรี่ตามคำแนะนำบนกล่อง',
        'เตรียมหมูสันนอกสำหรับชุบทอด โดยปรุงรสด้วยเกลือและพริกไทย',
        'นำเนื้อหมูไปชุบแป้งสาลี ตอกไข่ลงไปชุบ แล้วนำไปคลุกกับเกล็ดขนมปังให้ทั่ว',
        'ทอหดหมูในน้ำมันร้อนจนสุกเหลืองกรอบ ตักขึ้นพักให้สะเด็ดน้ำมัน',
        'ทำไข่ข้นโดยตอกไข่ใส่ชาม ปรุงรสด้วยเกลือเล็กน้อย แล้วตีให้เข้ากัน นำไปทอดในกระทะจนไข่สุกนุ่ม',
        'จัดเสิร์ฟโดยวางข้าวสวยในจาน ราดด้วยซอสแกงกระหรี่ วางทงคัตสึทอดกรอบและไข่ข้นด้านบน พร้อมเสิร์ฟ'
    ],
    author: {
        id: 'user1',
        username: 'IUMUNYAIYAI',
        avatar: 'https://i.pinimg.com/736x/0d/f2/93/0df293b1ffef115759e721217370db5c.jpg'
    },
    likes: 245,
    isLiked: false,
    comments: [
        {
            id: 'c1',
            userId: 'user5',
            username: 'มาแตลคนดี',
            userAvatar: 'https://i.pinimg.com/736x/ba/d3/0b/bad30b01c693ac003190454526eee4a4.jpg',
            text: 'เริ่ดๆเลยท่านนายกสมาคมคนชอบหอย',
            createdAt: new Date('2024-06-10T10:30:00')
        },
        {
            id: 'c2',
            userId: 'user6',
            username: 'มาร์ชเมลโล่',
            userAvatar: 'https://i.pinimg.com/1200x/c4/78/fc/c478fc33aa2681b3202e369bb46ed814.jpg',
            text: 'พี่เขตเปิดเซิร์ฟให้มาร์ชหน่อย',
            createdAt: new Date('2024-06-10T08:50:00')
        }
    ]
};

const MenuDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [ menu, setMenu ] = useState<MenuDetail | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ isFavorite, setIsFavorite ] = useState<boolean>(false);
    const [ newComment, setNewComment ] = useState<string>('');
    const [ comments, setComments ] = useState<Comment[]>([]);

    useEffect(() => {
        loadMenuDetail();
    }, [ id ]);

    const loadMenuDetail = async () => {
        setLoading(true);
        try {
            // TODO: เรียก API จริง
            // const data = await menuService.getMenuDetail(id);
            
            // Mock data
            await new Promise(resolve => setTimeout(resolve, 500));
            setMenu(mockMenuDetail);
            setIsFavorite(mockMenuDetail.isLiked);
            setComments(mockMenuDetail.comments);
        } catch (error) {
            console.error('Failed to load menu detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = () => {
        if (!isAuthenticated) {
            alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มในรายการโปรด');
            return;
        }
        setIsFavorite(!isFavorite);
        // TODO: เรียก API เพื่อบันทึก favorite
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
            userId: user.id,
            username: user.username,
            userAvatar: user.avatar || 'https://i.pravatar.cc/150?img=1',
            text: newComment,
            createdAt: new Date()
        };

        setComments([ comment, ...comments]);
        setNewComment('');

        // TODO: เรียก API เพื่อบันทึก comment
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
                {/* Back Button*/}
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {/* Author Info */}
                <div className="author-section">
                    <img
                        src={menu.image}
                        alt={menu.title}
                        className="menu-detail-image"
                    />

                {/* Menu Image */}
                <div className="menu-image-section">
                    <img 
                        src={menu.image} 
                        alt={menu.title}
                        className="menu-detail-image"
                    />
                </div>

                {/* Menu Title & Caption */}
                <div className="menu-header">
                    <h1 className="menu-title">{menu.title}</h1>
                    <p className="menu-caption">{menu.caption}</p>
                </div>

                {/* Favorite Button */}
                <button 
                    className={`favorite-button ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavorite}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}</span>
                </button>

                {/* Ingredients Section */}
                <section className="ingredients-section">
                    <h2 className="section-title">วัตถุดิบ</h2>
                    <ul className="ingredients-list">
                        {menu.ingredients.map((ingredient, index) => (
                            <li key={index} className="ingredient-item">
                                <span className="ingredient-bullet">•</span>
                                <span>{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Steps Section */}
                <section className="steps-section">
                    <h2 className="section-title">วิธีทำ</h2>
                    <ol className="steps-list">
                        {menu.steps.map((step, index) => (
                            <li key={index} className="step-item">
                                <span className="step-number">{index + 1}</span>
                                <span className="step-text">{step}</span>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Comments Section */}
                <section className="comments-section">
                    <h2 className="section-title">ความคิดเห็น ({comments.length})</h2>
                    
                    {/* Add Comment Form */}
                    <form className="comment-form" onSubmit={handleAddComment}>
                        <input
                            type="text"
                            className="comment-input"
                            placeholder={isAuthenticated ? "แสดงความคิดเห็นของคุณ..." : "กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น"}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!isAuthenticated}
                        />
                        <button 
                            type="submit" 
                            className="comment-submit-btn"
                            disabled={!isAuthenticated || !newComment.trim()}
                        >
                            ส่ง
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">ยังไม่มีความคิดเห็น</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="comment-item">
                                    <img 
                                        src={comment.userAvatar} 
                                        alt={comment.username}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="comment-username">{comment.username}</span>
                                            <span className="comment-date">
                                                {new Date(comment.createdAt).toLocaleDateString('th-TH')}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>                          
                </div>
            </div>
        </div>
    )
}

export default MenuDetailPage;