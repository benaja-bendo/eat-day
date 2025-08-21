import { create } from 'zustand';

interface FiltersState {
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
}

export const useRecipeFilters = create<FiltersState>((set) => ({
  showFavorites: false,
  setShowFavorites: (v) => set({ showFavorites: v }),
}));
