import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuCard.css';

interface MenuCardProps {
    id: string;
    image: string;
    title: string;
    author: string;
    authorAvatar?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
    id,
    image,
    title,
    author,
    authorAvatar
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/menu/${id}`);
    };

    return (
        <div className="menu-card" onClick={handleClick}>
            <div className="menu-card-image-wrapper">
                <img src={image} alt={title} className="menu-card-image" />
            </div>
            <div className="menu-card-content">
                <h3 className="menu-card-title">{title}</h3>
                <div className="menu-card-author">
                    {authorAvatar && (
                        <img 
                            src={authorAvatar} 
                            alt={author} 
                            className="author-avatar" 
                        />
                    )}
                    <span className="author-name">{author}</span>
                </div>
            </div>
        </div>
    );
}

export default MenuCard;