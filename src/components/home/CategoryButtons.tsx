import React from 'react';
import './CategoryButtons.css';

interface CategoryButtonsProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const categories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'thai', name: 'Thai', icon: '🍜' },
    { id: 'japanese', name: 'Japanese', icon: '🍣' },
    { id: 'western', name: 'Western', icon: '🍔' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' },
];

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
    activeCategory,
    onCategoryChange
}) => {
    return (
        <div className="category-buttons-container">
            <h2 className="category-title">Categories</h2>
            <div className="category-buttons">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => onCategoryChange(category.id)}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                    </button>
                )
            )}
            </div>
        </div>
    );
};

export default CategoryButtons;