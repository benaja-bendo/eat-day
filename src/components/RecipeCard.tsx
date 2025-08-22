import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import type { Recipe } from '../features/recipes/types';
import { useToggleFavoriteMutation, useDeleteRecipeMutation } from '../features/recipes/hooks';
import { getImageUrl } from '../features/recipes/api';
import { playClick, playSuccess, playError, playSoundIfEnabled } from '../utils/sound';
import { createConfettiEffect, shakeElement } from '../utils/animations';

interface Props {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
}

/**
 * Carte de recette compacte avec actions en survol
 */
export default function RecipeCard({ recipe, onEdit }: Props) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const deleteRecipeMutation = useDeleteRecipeMutation();

  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
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

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    deleteRecipeMutation.mutate(recipe.id, {
      onSuccess: () => {
        playSoundIfEnabled(playSuccess);
        createConfettiEffect(button);
        setShowConfirmDelete(false);
      },
      onError: () => {
        playSoundIfEnabled(playError);
        shakeElement(button);
      },
    });
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    playSoundIfEnabled(playClick);
    onEdit?.(recipe);
  };

  const handleView = () => {
    playSoundIfEnabled(playClick);
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div
      onClick={handleView}
      className="relative cursor-pointer card-cartoon overflow-hidden group hover:shadow-cartoon-hover transition-shadow duration-300"
    >
      {/* Image */}
      {recipe.image && (
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.name}
          className="w-full h-40 object-cover"
        />
      )}

      {/* Contenu */}
      <div className="p-4 bg-paper-white">
        <h2 className="text-xl font-cartoon text-hand mb-1 truncate">{recipe.name}</h2>
        <p
          className="text-gray-700 text-sm overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {recipe.description}
        </p>
      </div>

      {/* Bouton favori */}
      <motion.button
        onClick={handleToggleFavorite}
        className={`absolute top-2 right-2 rounded-full p-2 text-2xl shadow-cartoon border-2 border-white transition-all duration-300 hover:scale-125 ${
          recipe.favorite
            ? 'bg-cartoon-red text-white'
            : 'bg-paper-white text-gray-400 hover:bg-cartoon-pink hover:text-white'
        }`}
        title={recipe.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        whileTap={{ scale: 0.9 }}
      >
        {recipe.favorite ? '💖' : '🤍'}
      </motion.button>

      {/* Overlay actions */}
      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="btn-cartoon bg-cartoon-yellow text-gray-800 text-sm font-cartoon"
            title="Éditer la recette"
          >
            ✏️
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playSoundIfEnabled(playClick);
            setShowConfirmDelete(true);
          }}
          className="btn-cartoon bg-cartoon-red text-white text-sm font-cartoon"
          title="Supprimer la recette"
        >
          🗑️
        </button>
      </div>

      {/* Modal confirmation suppression */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfirmDelete(false)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la recette "{recipe.name}" ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
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
