import type { Recipe } from './types';

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}
