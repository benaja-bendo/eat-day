import { useQuery } from '@tanstack/react-query';
import { fetchRecipes } from './api';

export function useRecipesQuery() {
  return useQuery({ queryKey: ['recipes'], queryFn: fetchRecipes });
}
