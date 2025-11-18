// src/services/recipeService.ts
export type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  userId: string;
  authorAvatar?: string;
  createdAt?: string;
};

let recipesData: Recipe[] = [];

export const recipeService = {
  //ดึงข้อมูลสูตรอาหารทั้งหมด
  getAllRecipes: (): Recipe[] => {
    return [...recipesData]; // return copy
  },

  //ดึงข้อมูลสูตรอาหารของ User คนนั้น
  getUserRecipes: (userId: string): Recipe[] => {
    return recipesData.filter(recipe => recipe.userId === userId);
  },

  //ดึงสูตรอาหารเดียว
  getRecipeById: (id: string): Recipe | undefined => {
    return recipesData.find(recipe => recipe.id === id);
  },

  //เพิ่มสูตรอาหารใหม่
  addRecipe: (recipe: Recipe): Recipe => {
    const newRecipe: Recipe = {
      ...recipe,
      createdAt: new Date().toISOString()
    };
    recipesData.push(newRecipe);
    console.log('Recipe added:', newRecipe);
    console.log('Total recipes:', recipesData.length);
    return newRecipe;
  },

  //Update เมนู
  updateRecipe: (id: string, updates: Partial<Recipe>): boolean => {
    const index = recipesData.findIndex(recipe => recipe.id === id);

    if (index === -1) {
      console.log('Recipe not found:', id);
      return false;
    }

    recipesData[index] = {
      ...recipesData[index],
      ...updates
    };
    console.log('Recipe updated:', recipesData[index]);
    return true;
  },

  //ลบเมนู
  deleteRecipe: (id: string): boolean => {
    const initialLength = recipesData.length;
    recipesData = recipesData.filter(recipe => recipe.id !== id);

    const deleted = recipesData.length !== initialLength;
    if (deleted) {
      console.log('Recipe deleted:', id);
      console.log('Remaining recipes:', recipesData.length);
    }
    return deleted;
  },

  //ค้นหสูตรอาหาร
  searchRecipes: (query: string): Recipe[] => {
    const lowerQuery = query.toLowerCase();
    return recipesData.filter(recipe =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery)
    );
  },

  // Reset ข้อมูลทั้งหมด (สำหรับ testing)
  resetRecipes: (): void => {
    recipesData = [];
    console.log('All recipes cleared');
  },

  // นับจำนวนสูตรอาหาร
  getRecipeCount: (): number => {
    return recipesData.length;
  }
};
