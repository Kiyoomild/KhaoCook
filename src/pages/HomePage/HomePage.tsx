// src/pages/HomePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '../../components/home/Hero';
import SearchBar from '../../components/home/SearchBar';
import CategoryButtons from '../../components/home/CategoryButtons';
import MenuGrid from '../../components/home/MenuGrid';
import AboutSection from '../../components/home/AboutSection';
import { recipeService } from '../../services/recipeService';
import type { Recipe } from '../../services/recipeService'; 
import { useAuth } from '../../contexts/AuthContext';

import type { Menu } from '../../types/menu.types'; 
import './HomePage.css';

type MenuWithMeta = Menu & {
    author: string;
    authorAvatar: string;
    isUserRecipe: boolean;
};

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [ activeCategory, setActiveCategory ] = useState<string>('all');
    const [ menus, setMenus ] = useState<MenuWithMeta[]>([]); /
    const [ loading, setLoading ] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchType, setSearchType] = useState<'menu' | 'account'>('menu');
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = user?.username || 'Guest';


    const loadMenus = useCallback(async () => {
        setLoading(true);
        try {
            const allRecipesFromApi = await recipeService.getAllRecipes();

          
            const menusData: MenuWithMeta[] = allRecipesFromApi.map(recipe => ({
                // ฟิลด์หลักจาก menu.types.ts
                id: String(recipe.id), 
                title: recipe.title,
                image: recipe.image,
                category: 'General', // Placeholder
                ingredients: ['See description'], // Placeholder
                steps: ['See description'], // Placeholder
                createdAt: new Date(recipe.created_at || '').toISOString() as unknown as Date, // **[FIX] Cast Date**
                
                // ฟิลด์เพิ่มเติมสำหรับ MenuGrid
                author: recipe.username || 'Unknown', 
                authorAvatar: recipe.avatar_url, 
                isUserRecipe: recipe.userId === user?.id, 
            }));

            // Logic การค้นหา
            if (searchQuery.trim() !== '') {
                const lowerQuery = searchQuery.toLowerCase();
                const filtered = menusData.filter(menu => 
                    searchType === 'menu' 
                        ? menu.title.toLowerCase().includes(lowerQuery)
                        : menu.author.toLowerCase().includes(lowerQuery)
                );
                setMenus(filtered);
            } else {
                setMenus(menusData);
            }
        } catch (error) {
            console.error('Error loading menus:', error);
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id, searchQuery, searchType]);

    // [FIX 3] ฟังก์ชันลบเมนู
    const handleDeleteRecipe = (_recipeId: string, _author: string) => { // **[FIX] ใช้ _author**
        console.log('Attempting to delete recipe:', _recipeId); 
        alert('ฟังก์ชันลบยังไม่เชื่อมต่อ API');
        // TODO: เชื่อมต่อ API ลบสูตรอาหารจริง
    };

    // [FIX] useEffect 1 (ดึงข้อมูล)
    useEffect(() => {
        loadMenus();
    }, [loadMenus]); 

    const handleSearch = (query: string, type: 'menu' | 'account') => {
        setSearchQuery(query);
        setSearchType(type);
        console.log(`Searching for "${query}" in ${type}`);
    };

    const handleAddRecipe = () => {
        navigate('/add-recipe');
    };

    // [FIX] useEffect 2 (Refresh State)
    useEffect(() => {
        if (location.state?.refresh) {
            loadMenus();
        }
    }, [location.state, loadMenus])

    return (
        <div className="home-page">
            <Hero />
            <div className="home-container">
                <div className="home-main">
                    {/* Search Bar */}
                    <SearchBar onSearch={handleSearch} />
                        
                    {/* แสดงผลการค้นหา */}
                    {searchQuery && (
                        <div className="search-result-info">
                            <p>
                                {searchType === 'menu' ? '🍽️' : '👤'} 
                                {' '}ผลการค้นหา "{searchQuery}" 
                                {searchType === 'menu' ? ' ในเมนู' : ' ในบัญชีผู้ใช้'}
                                {' '}({menus.length} รายการ)
                            </p>
                            <button 
                                className="clear-search-btn"
                                onClick={() => {
                                setSearchQuery('');
                                setSearchType('menu');
                                }}
                            >
                                ✕ ล้างการค้นหา
                            </button>
                        </div>
                    )}
                        
                    {/* Category Buttons */}
                    <CategoryButtons 
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />

                    {/* Menu Grid */}
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>กำลังโหลดเมนู...</p>
                        </div>
                    ) : (
                        <MenuGrid 
                            menus={menus as Menu[]} // **[FIX] Cast เป็น Menu[] ให้ MenuGrid ยอมรับ**
                            currentUser={currentUser}
                            onDelete={handleDeleteRecipe}
                        />
                    )}
                </div>

                {/* Add Recipe Button */}
                <button className="add-recipe-btn" onClick={handleAddRecipe}>
                    เพิ่มเมนูอาหาร
                </button>
                    
            </div>
            <AboutSection />
        </div>
    );
};

export default HomePage;