import type { Recipe } from './types';

// URL de base de l'API (JSON Server)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Récupère toutes les recettes depuis l'API
 */
export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des recettes');
  }
  return response.json();
}

/**
 * Récupère une recette spécifique par son ID
 */
export async function fetchRecipeById(id: number): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de la recette ${id}`);
  }
  return response.json();
}

/**
 * Crée une nouvelle recette
 */
export async function createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> {
  const newRecipe = {
    ...recipe,
    createdAt: new Date().toISOString(),
  };
  
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRecipe),
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la recette');
  }
  
  return response.json();
}

/**
 * Met à jour une recette existante
 */
export async function updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  });
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour de la recette ${id}`);
  }
  
  return response.json();
}

/**
 * Supprime une recette
 */
export async function deleteRecipe(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression de la recette ${id}`);
  }
}

/**
 * Toggle le statut favori d'une recette
 */
export async function toggleRecipeFavorite(id: number, favorite: boolean): Promise<Recipe> {
  return updateRecipe(id, { favorite });
}

/**
 * Récupère les recettes favorites uniquement
 */
export async function fetchFavoriteRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/recipes?favorite=true`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des recettes favorites');
  }
  return response.json();
}

/**
 * Récupère une recette aléatoire
 */
export async function fetchRandomRecipe(): Promise<Recipe> {
  const recipes = await fetchRecipes();
  if (recipes.length === 0) {
    throw new Error('Aucune recette disponible');
  }
  const randomIndex = Math.floor(Math.random() * recipes.length);
  return recipes[randomIndex];
}

/**
 * Récupère la playlist (recette du jour et recettes planifiées)
 */
export async function fetchPlaylist(): Promise<{ todayRecipeId: number; plannedIds: number[] }> {
  const response = await fetch(`${API_BASE_URL}/playlist`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la playlist');
  }
  return response.json();
}

/**
 * Met à jour la playlist
 */
export async function updatePlaylist(playlist: { todayRecipeId?: number; plannedIds?: number[] }): Promise<{ todayRecipeId: number; plannedIds: number[] }> {
  const response = await fetch(`${API_BASE_URL}/playlist`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playlist),
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la playlist');
  }
  
  return response.json();
}
