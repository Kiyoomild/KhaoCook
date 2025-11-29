// src/services/recipeService.ts

import { API_URL } from './api'; 

export type Recipe = {
  id: number; 
  title: string;
  description: string;
  image: string;
  category: string;
  userId: number; 
  username: string; 
  avatar_url: string; 
  created_at: string;
};

export type NewRecipeInput = {
    title: string;
    description: string;
    image: string;
    category: string;
    userId: number;
};

const getAuthToken = () => localStorage.getItem('auth_token');

export const recipeService = {

  // 1. ดึงข้อมูลทั้งหมด (GET)
  getAllRecipes: async (): Promise<Recipe[]> => { 
      const response = await fetch(`${API_URL}/recipes`, {
          headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch recipes');
      return await response.json(); 
  },
  
  // 2. เพิ่มสูตรอาหาร (POST)
  addRecipe: async (recipe: NewRecipeInput): Promise<Recipe> => { 
      const token = getAuthToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/recipes`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(recipe),
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add recipe'); 
      }
      return await response.json(); 
  },
  
  // 3. ลบสูตรอาหาร (DELETE)
  deleteRecipe: async (id: string): Promise<void> => {
    const token = getAuthToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    if (!response.ok) throw new Error(`Failed to delete recipe`);
  },

  // 4. ดึงสูตรอาหารของผู้ใช้ตาม ID (GET /api/users/:userId/recipes)
  getUserRecipes: async (userId: number): Promise<Recipe[]> => {
      const response = await fetch(`${API_URL}/users/${userId}/recipes`, {
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
          console.warn('Failed to fetch user recipes (Route might not exist yet)');
          return []; 
      }
      return await response.json();
  },

  // 🔑 [NEW] 5. ดึงรายละเอียดสูตรอาหารตาม ID (GET /api/recipes/:id)
  getRecipeById: async (id: string): Promise<Recipe> => {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch recipe detail');
      }
      return await response.json();
  },
};