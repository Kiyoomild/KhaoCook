// src/pages/HomePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '../../components/home/Hero';
import SearchBar from '../../components/home/SearchBar';
import CategoryButtons from '../../components/home/CategoryButtons';
import MenuGrid from '../../components/home/MenuGrid';
import AboutSection from '../../components/home/AboutSection';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../contexts/useAuth';

import type { Menu } from '../../types/menu.types';
import './HomePage.css';

// Type ที่ใช้เก็บข้อมูลตาม menu.types + metadata ที่ต้องการแสดง
type MenuWithMeta = Menu & {
    author: string;
    authorAvatar?: string | null;
    isUserRecipe: boolean;
    description?: string; // เพิ่มบรรทัดนี้ เพื่อรับค่าจาก Backend
};

// Type ที่ MenuGrid ต้องการ
type MenuGridItem = {
    id: string;
    image: string;
    title: string;
    author: string;
    authorAvatar?: string | null;
    description?: string;
    isUserRecipe?: boolean;
};

const HomePage: React.FC = () => {
    const { user } = useAuth();

    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [menus, setMenus] = useState<MenuWithMeta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
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
                id: String(recipe.id),
                title: recipe.title,
                image: recipe.image,
                // หมายเหตุ: ชื่อ field ตาม menu.types.ts ของคุณ (catagory)
                catagory: 'General', 
                ingredients: [],
                steps: [],
                createdAt: recipe.created_at ? new Date(recipe.created_at) : new Date(),

                // Metadata
                author: recipe.username || 'Unknown',
                authorAvatar: recipe.avatar_url ?? null,
                isUserRecipe: recipe.userId === user?.id,
                description: recipe.description 
            }));

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

    // 🔑 FIX: ฟังก์ชันลบเมนูที่ถูกต้อง (ส่งแค่ recipeId)
    const handleDeleteRecipe = async (recipeId: string, author: string) => {
        console.log(`Attempting to delete recipe: ${recipeId} (author: ${author})`);
        
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?')) {
            try {
                // เรียก API ลบจริง (ไม่ต้องส่ง userID แล้ว)
                await recipeService.deleteRecipe(recipeId); 
                
                alert('ลบเมนูเรียบร้อยแล้ว');
                loadMenus(); // รีโหลดข้อมูล
            } catch (error) {
                console.error('Error deleting recipe:', error);
                alert(`เกิดข้อผิดพลาดในการลบเมนู: ${(error as Error).message}`);
            }
        }
    };

    useEffect(() => {
        loadMenus();
    }, [loadMenus]);

    const handleSearch = (query: string, type: 'menu' | 'account') => {
        setSearchQuery(query);
        setSearchType(type);
    };

    const handleAddRecipe = () => {
        navigate('/add-recipe');
    };

    useEffect(() => {
        if (location.state?.refresh) {
            loadMenus();
        }
    }, [location.state, loadMenus]);

    // แปลงข้อมูลโดยไม่ต้องใช้ as any เพราะ Type ถูกต้องแล้ว
    const menuGridItems: MenuGridItem[] = menus.map(m => ({
        id: m.id,
        image: m.image,
        title: m.title,
        author: m.author,
        authorAvatar: m.authorAvatar ?? null,
        description: m.description, 
        isUserRecipe: m.isUserRecipe,
    }));

    return (
        <div className="home-page">
            <Hero />
            <div className="home-container">
                <div className="home-main">
                    <SearchBar onSearch={handleSearch} />

                    {searchQuery && (
                        <div className="search-result-info">
                            <p>
                                {searchType === 'menu' ? '🍽️' : '👤'} ผลการค้นหา "{searchQuery}"
                                {searchType === 'menu' ? ' ในเมนู' : ' ในบัญชีผู้ใช้'} ({menus.length} รายการ)
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

                    <CategoryButtons activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>กำลังโหลดเมนู...</p>
                        </div>
                    ) : (
                        <MenuGrid 
                            menus={menuGridItems} 
                            currentUser={currentUser} 
                            onDelete={handleDeleteRecipe} 
                        />
                    )}
                </div>

                <button className="add-recipe-btn" onClick={handleAddRecipe}>
                    เพิ่มเมนูอาหาร
                </button>
            </div>
            <AboutSection />
        </div>
    );
};

export default HomePage;