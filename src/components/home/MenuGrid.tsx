import React from 'react';
import MenuCard from './MenuCard';
import './MenuGrid.css';

interface Menu {
    id: string;
    image: string;
    title: string;
    author: string;
    authorAvatar?: string;
}

interface MenuGridProps {
    menus: Menu[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ menus }) => {
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
                />
            ))}
        </div>
    );
};

export default MenuGrid;