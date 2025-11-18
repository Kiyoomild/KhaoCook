import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string, type: 'menu' | 'account') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchType, setSearchType] = useState<'menu' | 'account'>('menu');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery, searchType);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <div className="search-bar-container">
            <form className="search-bar" onSubmit={handleSubmit}>
                {/* Search Type Toggle */}
                <div className="search-type-toggle">
                    <button
                        type="button"
                        className={`toggle-btn ${searchType === 'menu' ? 'active' : ''}`}
                        onClick={() => setSearchType('menu')}
                    >
                        🍽️ Menu
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${searchType === 'account' ? 'active' : ''}`}
                        onClick={() => setSearchType('account')}
                    >
                        👤 Account
                    </button>
                </div>
                    
                {/* Search Input */}
                <div className="search-input-wrapper">
                    <svg 
                        className="search-icon" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    
                    <input
                        type="text"
                        className="search-input"
                        placeholder={
                            searchType === 'menu' 
                                ? 'ค้นหาเมนูอาหาร...' 
                                : 'ค้นหาผู้ใช้...'
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {searchQuery && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={handleClear}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <button type="submit" className="search-submit-btn">
                    ค้นหา
                </button>
            </form>
        </div>
    );
};

export default SearchBar;