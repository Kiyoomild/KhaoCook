import React from 'react';
import MenuCard from './MenuCard';
import './MenuGrid.css';

// ใช้ชื่อ type ให้ตรงกับ HomePage.tsx
export interface MenuGridItem {
    id: string;
    image: string;
    title: string;
    author: string;
    authorAvatar?: string | null;
    description?: string;
    isUserRecipe?: boolean;
}

interface MenuGridProps {
    menus: MenuGridItem[];  // <-- แก้จาก Menu[] เป็น MenuGridItem[]
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
