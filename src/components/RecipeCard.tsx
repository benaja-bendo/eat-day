import { useState } from 'react';
import type { Recipe } from '../features/recipes/types';
import { useToggleFavoriteMutation, useDeleteRecipeMutation } from '../features/recipes/hooks';
import { playClick, playSuccess, playError, playSoundIfEnabled } from '../utils/sound';
import { useAnimations, createConfettiEffect, shakeElement } from '../utils/animations';

interface Props {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
}

/**
 * Composant carte de recette avec toutes les fonctionnalités
 */
export default function RecipeCard({ recipe, onEdit }: Props) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const deleteRecipeMutation = useDeleteRecipeMutation();

  /**
   * Gère le toggle du statut favori
   */
  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    
    toggleFavoriteMutation.mutate(
      { id: recipe.id, favorite: !recipe.favorite },
      {
        onSuccess: () => {
          playSoundIfEnabled(playSuccess);
          createConfettiEffect(button);
        },
        onError: () => {
          playSoundIfEnabled(playError);
          shakeElement(button);
        },
      }
    );
  };

  /**
   * Gère la suppression de la recette
   */
  const handleDelete = (event?: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event?.currentTarget;
    
    deleteRecipeMutation.mutate(recipe.id, {
      onSuccess: () => {
        playSoundIfEnabled(playSuccess);
        if (button) createConfettiEffect(button);
        setShowConfirmDelete(false);
      },
      onError: () => {
        playSoundIfEnabled(playError);
        if (button) shakeElement(button);
      },
    });
  };

  /**
   * Gère l'édition de la recette
   */
  const handleEdit = () => {
    playSoundIfEnabled(playClick);
    onEdit?.(recipe);
  };

  return (
    <div className="card-cartoon group relative p-6 transition-all duration-300 hover:rotate-1 animate-float">
      {/* Badge favori */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute -top-3 -right-3 rounded-full p-3 text-3xl transition-all duration-300 hover:scale-125 hover:animate-bounce-gentle shadow-cartoon ${
          recipe.favorite
            ? 'bg-cartoon-red text-white border-2 border-white'
            : 'bg-paper-white text-gray-400 hover:bg-cartoon-pink hover:text-white border-2 border-cartoon-pink'
        }`}
        title={recipe.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        {recipe.favorite ? '💖' : '🤍'}
      </button>

      {/* Contenu principal */}
      <div className="mb-6">
        <h2 className="text-2xl font-cartoon font-bold text-gray-800 mb-3 text-hand">{recipe.name}</h2>
        <p className="text-gray-700 text-base leading-relaxed text-hand">{recipe.description}</p>
      </div>

      {/* Ingrédients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mb-5">
          <h3 className="font-cartoon font-semibold text-gray-700 mb-3 text-base flex items-center">
            <span className="text-2xl mr-2 animate-bounce-gentle">🥘</span>
            Ingrédients
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <span
                key={index}
                className="badge-cartoon bg-cartoon-green text-white border-2 border-white"
              >
                {ingredient.name}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="badge-cartoon bg-cartoon-mint text-gray-700 border-2 border-cartoon-green">
                +{recipe.ingredients.length - 3} autres
              </span>
            )}
          </div>
        </div>
      )}

      {/* Occasions et préférences */}
      <div className="mb-5 space-y-4">
        {recipe.occasions && recipe.occasions.length > 0 && (
          <div>
            <h4 className="text-sm font-cartoon font-medium text-gray-600 mb-2 flex items-center">
              <span className="text-lg mr-2">🍽️</span>
              Occasions
            </h4>
            <div className="flex flex-wrap gap-2">
              {recipe.occasions.map((occasion, index) => (
                <span
                  key={index}
                  className="badge-cartoon bg-cartoon-blue text-white border-2 border-white"
                >
                  {occasion}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {recipe.preferences && recipe.preferences.length > 0 && (
          <div>
            <h4 className="text-sm font-cartoon font-medium text-gray-600 mb-2 flex items-center">
              <span className="text-lg mr-2">⭐</span>
              Préférences
            </h4>
            <div className="flex flex-wrap gap-2">
              {recipe.preferences.map((preference, index) => (
                <span
                  key={index}
                  className="badge-cartoon bg-cartoon-purple text-gray-800 border-2 border-white"
                >
                  {preference}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-5 border-t-2 border-cartoon-yellow border-dashed">
        <div className="text-sm text-gray-600 font-hand">
          <span className="text-base mr-1">📅</span>
          {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
        </div>
        
        <div className="flex gap-3">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="btn-cartoon text-gray-800 text-sm font-cartoon hover:animate-wiggle"
              title="Éditer la recette"
            >
              <span className="text-lg mr-1">✏️</span>
              Éditer
            </button>
          )}
          
          <button
            onClick={() => {
              playSoundIfEnabled(playClick);
              setShowConfirmDelete(true);
            }}
            className="px-4 py-2 bg-cartoon-red hover:bg-red-600 text-white rounded-hand text-sm font-cartoon transition-all duration-300 hover:scale-105 hover:animate-wiggle shadow-hand-drawn border-2 border-white"
            title="Supprimer la recette"
          >
            <span className="text-lg mr-1">🗑️</span>
            Supprimer
          </button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la recette "{recipe.name}" ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  playSoundIfEnabled(playClick);
                  setShowConfirmDelete(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={(e) => handleDelete(e)}
                disabled={deleteRecipeMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {deleteRecipeMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
