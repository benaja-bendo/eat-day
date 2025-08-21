import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchRecipes,
  fetchRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleRecipeFavorite,
  fetchRandomRecipe,
  fetchPlaylist,
} from './api';
import type { Recipe } from './types';

/**
 * Hook pour récupérer toutes les recettes
 */
export function useRecipesQuery() {
  return useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes });
}

/**
 * Hook pour récupérer une recette par ID
 */
export function useRecipeQuery(id: number) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id),
    enabled: !!id,
  });
}

/**
 * Hook pour créer une nouvelle recette
 */
export function useCreateRecipeMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      // Invalider le cache des recettes pour refetch
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

/**
 * Hook pour mettre à jour une recette
 */
export function useUpdateRecipeMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, recipe }: { id: number; recipe: Partial<Recipe> }) =>
      updateRecipe(id, recipe),
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', data.id] });
    },
  });
}

/**
 * Hook pour supprimer une recette
 */
export function useDeleteRecipeMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

/**
 * Hook pour toggle le statut favori d'une recette
 */
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, favorite }: { id: number; favorite: boolean }) =>
      toggleRecipeFavorite(id, favorite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', data.id] });
    },
  });
}

/**
 * Hook pour récupérer une recette aléatoire
 */
export function useRandomRecipeQuery() {
  return useQuery({
    queryKey: ['randomRecipe'],
    queryFn: fetchRandomRecipe,
    enabled: false, // Ne pas exécuter automatiquement
  });
}

/**
 * Hook pour récupérer la playlist
 */
export function usePlaylistQuery() {
  return useQuery({
    queryKey: ['playlist'],
    queryFn: fetchPlaylist,
  });
}
