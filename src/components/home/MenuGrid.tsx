import React from 'react';
import MenuCard from './MenuCard';
import './MenuGrid.css';

interface Menu {
    id: string;
    image: string;
    title: string;
    author: string;
    authorAvatar?: string;
    description?: string;
    isUserRecipe?: boolean;
}

interface MenuGridProps {
    menus: Menu[];
    currentUser?: string;
    onDelete?: (recipeId: string, author: string) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ menus, currentUser, onDelete }) => {
    if (menus.length === 0) {
        return (
            <div className="menu-grid-empty">
                <p>ไม่พบเมนูอาหาร</p>
            </div>
        );
    }

    return (
        <div className="menu-grid">
            {menus.map(menu => (
                <MenuCard
                    key={menu.id}
                    id={menu.id}
                    image={menu.image}
                    title={menu.title}
                    author={menu.author}
                    authorAvatar={menu.authorAvatar}
                    description={menu.description}
                    currentUser={currentUser}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default MenuGrid;