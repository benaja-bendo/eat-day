import React, { useState, useEffect, useRef } from 'react';
import { useRecipesQuery } from '../features/recipes/hooks';
import type { Recipe } from '../features/recipes/types';
import { playClick, playSoundIfEnabled } from '../utils/sound';

interface RecipeAutocompleteProps {
  onSelect: (recipes: Recipe[]) => void;
  placeholder?: string;
  multiple?: boolean;
  selectedRecipes?: Recipe[];
}

/**
 * Composant d'autocomplétion pour sélectionner des recettes par nom
 * Permet la recherche en temps réel et la sélection multiple
 */
export const RecipeAutocomplete: React.FC<RecipeAutocompleteProps> = ({
  onSelect,
  placeholder = "Rechercher des recettes...",
  multiple = true,
  selectedRecipes = []
}) => {
  const { data: recipes = [] } = useRecipesQuery();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrer les recettes en temps réel
  useEffect(() => {
    if (!query.trim()) {
      setFilteredRecipes([]);
      setIsOpen(false);
      return;
    }

    const filtered = recipes
      .filter(recipe => 
        recipe.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedRecipes.some(selected => selected.id === recipe.id)
      )
      .slice(0, 8); // Limiter à 8 résultats pour les performances

    setFilteredRecipes(filtered);
    setIsOpen(filtered.length > 0);
    setHighlightedIndex(-1);
  }, [query, recipes, selectedRecipes]);

  // Gérer la navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredRecipes.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredRecipes.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredRecipes.length) {
          handleSelectRecipe(filteredRecipes[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Sélectionner une recette
  const handleSelectRecipe = (recipe: Recipe) => {
    playSoundIfEnabled(playClick);
    
    if (multiple) {
      const newSelection = [...selectedRecipes, recipe];
      onSelect(newSelection);
    } else {
      onSelect([recipe]);
    }
    
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Supprimer une recette sélectionnée
  const handleRemoveRecipe = (recipeToRemove: Recipe) => {
    playSoundIfEnabled(playClick);
    const newSelection = selectedRecipes.filter(recipe => recipe.id !== recipeToRemove.id);
    onSelect(newSelection);
  };

  // Fermer la liste quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Recettes sélectionnées */}
      {multiple && selectedRecipes.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="flex items-center bg-cartoon-purple text-white px-3 py-1 rounded-hand text-sm font-cartoon"
            >
              <span>{recipe.name}</span>
              <button
                onClick={() => handleRemoveRecipe(recipe)}
                className="ml-2 text-white hover:text-red-200 focus:outline-none"
                aria-label={`Supprimer ${recipe.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Champ de recherche */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-hand border-2 border-cartoon-purple font-cartoon text-hand focus:outline-none focus:ring-2 focus:ring-cartoon-purple focus:border-transparent"
          autoComplete="off"
        />
        
        {/* Icône de recherche */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Liste des suggestions */}
      {isOpen && filteredRecipes.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-cartoon-purple rounded-hand shadow-hand-drawn max-h-60 overflow-y-auto"
        >
          {filteredRecipes.map((recipe, index) => (
            <li
              key={recipe.id}
              onClick={() => handleSelectRecipe(recipe)}
              className={`px-4 py-3 cursor-pointer font-cartoon text-hand border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex
                  ? 'bg-cartoon-purple text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{recipe.name}</div>
                  {recipe.description && (
                    <div className="text-sm text-gray-500 truncate mt-1">
                      {recipe.description}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  #{recipe.id}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Message si aucun résultat */}
      {isOpen && query.trim() && filteredRecipes.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-cartoon-purple rounded-hand shadow-hand-drawn p-4 text-center">
          <p className="text-gray-500 font-cartoon text-hand">
            Aucune recette trouvée pour "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeAutocomplete;