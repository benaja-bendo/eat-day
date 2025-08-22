import React from 'react';
import { useNavigate } from 'react-router';
import { useRandomRecipeQuery } from '../features/recipes/hooks';
import RecipeCard from './RecipeCard';
import { playWhoosh, playSoundIfEnabled } from '../utils/sound';
import { createParticleEffect, scaleUpElement } from '../utils/animations';
import type { Recipe } from '../features/recipes/types';

interface RandomRecipeProps {
  onEdit?: (recipe: Recipe) => void;
}

/**
 * Composant pour afficher une recette aléatoire
 * Utilise le hook useRandomRecipeQuery pour récupérer une recette au hasard
 */
export const RandomRecipe: React.FC<RandomRecipeProps> = ({ onEdit }) => {
  const navigate = useNavigate();
  const { data: randomRecipe, isLoading, error, refetch } = useRandomRecipeQuery();

  /**
   * Génère une nouvelle recette aléatoire
   */
  const handleNewRandomRecipe = (event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playWhoosh);
    const button = event.currentTarget;
    createParticleEffect(button);
    scaleUpElement(button, 1.2);
    refetch();
  };

  /**
   * Navigue vers la recherche par ingrédients
   */
  const handleIngredientSearch = () => {
    navigate('/ingredients');
  };

  return (
    <div className="card-cartoon p-8 paper-texture">
        {/* En-tête */}
        <div className="mb-8">
          <h2 className="text-3xl font-cartoon font-bold text-gray-800 flex items-center text-hand">
            <span className="text-4xl mr-3 animate-bounce-gentle">🎲</span>
            Recette Surprise Magique
          </h2>
          <p className="text-gray-600 mt-2 font-cartoon text-hand">
            Découvrez une recette au hasard pour vous inspirer !
          </p>
        </div>

      {/* Contenu */}
      {isLoading && !randomRecipe && (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-6xl animate-spin mb-4">🎲</span>
          <span className="text-xl font-cartoon text-gray-600 text-hand">Recherche d'une recette surprise magique...</span>
        </div>
      )}

      {error && (
        <div className="bg-cartoon-red-light border-2 border-cartoon-red rounded-hand p-6 text-center">
          <span className="text-6xl mb-4 animate-wiggle block">😵</span>
          <h3 className="text-xl font-cartoon font-bold text-red-800 text-hand mb-2">
            Oups ! Erreur de chargement
          </h3>
          <p className="font-cartoon text-red-700 text-hand">
            Impossible de charger une recette aléatoire. Veuillez réessayer.
          </p>
        </div>
      )}

      {randomRecipe && (
        <div className="space-y-6">
          {/* Recette aléatoire */}
          <div className="animate-float">
            <RecipeCard 
              recipe={randomRecipe} 
              onEdit={onEdit}
            />
          </div>
          
            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t-2 border-cartoon-yellow border-dashed">
              <button
                onClick={handleNewRandomRecipe}
                disabled={isLoading}
                className="flex-1 bg-cartoon-gray text-white px-6 py-3 rounded-hand hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:animate-wiggle shadow-hand-drawn border-2 border-white font-cartoon flex items-center justify-center"
              >
                <span className="mr-2 text-xl">🎲</span>
                Relance
              </button>
              <button
                onClick={handleIngredientSearch}
                className="flex-1 bg-cartoon-purple text-white px-6 py-3 rounded-hand hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 hover:animate-wiggle shadow-hand-drawn border-2 border-white font-cartoon flex items-center justify-center"
              >
                <span className="mr-2 text-xl">📝</span>
                Liste d'ingrédients
              </button>
            </div>
        </div>
      )}

      {!randomRecipe && !isLoading && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-6 animate-bounce-gentle">🍽️</div>
          <p className="text-gray-500 mb-6 font-cartoon text-xl text-hand">
            Aucune recette disponible pour le moment.
          </p>
          <button
            onClick={handleNewRandomRecipe}
            className="bg-cartoon-purple text-white px-8 py-3 rounded-hand hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 hover:animate-wiggle shadow-hand-drawn border-2 border-white font-cartoon"
          >
              Relancer
          </button>
        </div>
      )}
    </div>
  );
};

export default RandomRecipe;