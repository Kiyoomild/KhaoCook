import { API_URL } from './api'; 

export type Recipe = {
  id: number; 
  title: string;
  description: string;
  image: string; // ใช้ 'image' ตามตาราง recipeservice
  userId: number; 
  username: string; 
  avatar_url: string; 
  created_at: string;
};


export const recipeService = {

  getAllRecipes: async (): Promise<Recipe[]> => { 
      const response = await fetch(`${API_URL}/recipes`, {
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch recipes from API');
      }
      return await response.json(); 
  },
  
  addRecipe: async (recipe: Partial<Recipe>): Promise<Recipe> => { 
      const response = await fetch(`${API_URL}/recipes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipe),
      });

      if (!response.ok) {
  
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add recipe to API'); 
      }
      return await response.json(); 
  },

};