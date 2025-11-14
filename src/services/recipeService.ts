// src/services/recipeService.ts
export type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
  userId: string;
  createdAt?: string;
};

const STORAGE_KEY = "recipes";

function loadRecipes(): Recipe[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveRecipes(recipes: Recipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export const recipeService = {
  getAllRecipes: (): Recipe[] => loadRecipes(),

  getUserRecipes: (username: string): Recipe[] =>
    loadRecipes().filter(r => r.userId === username),

  getRecipeById: (recipeId: string): Recipe | undefined => {
    const recipes = loadRecipes();
    return recipes.find(r => r.id === recipeId);
  },

  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>): Recipe => {
    const recipes = loadRecipes();
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const newRecipes = [newRecipe, ...recipes];
    saveRecipes(newRecipes);
    return newRecipe;
  },

  //แก้ไขเมนู
  updateRecipe: (recipeId: string, updates: Partial<Recipe>): Recipe | null => {
    const recipes = loadRecipes();
    const index = recipes.findIndex(r => r.id === recipeId)

    if (index === -1) return null;

    recipes[index] = { ...recipes[index], ...updates };
    saveRecipes(recipes);
    return recipes[index];
  },

  //ลบเมนู
  deleteRecipe: (recipeId: string): boolean => {
    const recipes = loadRecipes();
    const filteredRecipes = recipes.filter(r => r.id !== recipeId);

    if (filteredRecipes.length === recipes.length) return false;

    saveRecipes(filteredRecipes);
    return true;
  },

  //ลบเมนูของ User คนนั้น (เผื่อใช้ตอนลบ account)
  deleteUserRecipes: (username: string): number => {
    const recipes = loadRecipes();
    const filteredRecipes = recipes.filter(r => r.userId !== username);
    const deletedCount = recipes.length - filteredRecipes.length;

    saveRecipes(filteredRecipes);
    return deletedCount;
  },

  clearAll: () => localStorage.removeItem(STORAGE_KEY),
};
