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

  addRecipe: (recipe: Recipe) => {
    const recipes = loadRecipes();
    const newRecipes = [recipe, ...recipes];
    saveRecipes(newRecipes);
  },

  clearAll: () => localStorage.removeItem(STORAGE_KEY),
};
