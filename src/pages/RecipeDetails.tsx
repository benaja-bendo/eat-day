import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router';
import { useRecipeQuery, useToggleFavoriteMutation, useDeleteRecipeMutation } from '../features/recipes/hooks';
import { playClick, playSuccess, playError, playSoundIfEnabled } from '../utils/sound';
import { createConfettiEffect, shakeElement } from '../utils/animations';

/**
 * Page d'affichage détaillé d'une recette
 */
export const RecipeDetails = () => {
  const { id } = useParams();
  const recipeId = Number(id);
  const navigate = useNavigate();

  const { data: recipe, isLoading, error } = useRecipeQuery(recipeId);
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const deleteRecipeMutation = useDeleteRecipeMutation();

  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  /**
   * Gère le toggle du statut favori
   */
  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!recipe) return;
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
  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!recipe) return;
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    deleteRecipeMutation.mutate(recipe.id, {
      onSuccess: () => {
        playSoundIfEnabled(playSuccess);
        createConfettiEffect(button);
        navigate('/');
      },
      onError: () => {
        playSoundIfEnabled(playError);
        shakeElement(button);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-6xl animate-spin mb-4">⏳</span>
        <p className="text-xl font-cartoon text-gray-600 text-hand">Chargement de la recette...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-6xl mb-4 animate-wiggle">😵</span>
        <p className="text-xl font-cartoon text-red-600 text-hand">Recette introuvable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-cartoon-yellow via-cartoon-orange to-cartoon-pink paper-texture py-8"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* En-tête */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => { playSoundIfEnabled(playClick); navigate(-1); }}
            className="px-4 py-2 bg-cartoon-blue text-white rounded-hand hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon flex items-center"
          >
            <span className="mr-2 text-xl">⬅️</span>
            Retour
          </button>
          <div className="flex gap-3">
            <motion.button
              onClick={handleToggleFavorite}
              className={`px-4 py-2 rounded-hand transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon flex items-center ${recipe.favorite ? 'bg-cartoon-red text-white hover:bg-red-600' : 'bg-paper-white text-gray-700 hover:bg-cartoon-pink hover:text-white'}`}
              title={recipe.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                key={recipe.favorite ? 'fav' : 'not'}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {recipe.favorite ? '💖' : '🤍'}
              </motion.span>
            </motion.button>
            <button
              onClick={() => { playSoundIfEnabled(playClick); navigate(`/edit/${recipe.id}`); }}
              className="px-4 py-2 bg-cartoon-purple text-white rounded-hand hover:bg-purple-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon flex items-center"
            >
              <span className="mr-1">✏️</span>
              Éditer
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-cartoon-red text-white rounded-hand hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon flex items-center"
            >
              <span className="mr-1">🗑️</span>
              Supprimer
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="card-cartoon p-6">
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-60 object-cover rounded-hand mb-6"
            />
          )}
          <h1 className="text-3xl font-cartoon font-bold text-gray-800 mb-4 text-hand">{recipe.name}</h1>
          <p className="text-gray-700 mb-6 text-hand">{recipe.description}</p>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-cartoon font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-3xl mr-2 animate-bounce-gentle">🥘</span>
                Ingrédients
              </h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!checkedIngredients[index]}
                      onChange={() =>
                        setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] }))
                      }
                      className="mr-3 h-5 w-5 rounded border-cartoon-yellow text-cartoon-orange focus:ring-cartoon-orange"
                    />
                    <span className="text-gray-700 text-hand">
                      {ing.quantity} {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.occasions && recipe.occasions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-cartoon font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-3xl mr-2">🍽️</span>
                Occasions
              </h2>
              <div className="flex flex-wrap gap-2">
                {recipe.occasions.map((occ, index) => (
                  <span
                    key={index}
                    className="badge-cartoon bg-cartoon-blue text-white border-2 border-white"
                  >
                    {occ}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recipe.preferences && recipe.preferences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-cartoon font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-3xl mr-2">⭐</span>
                Préférences
              </h2>
              <div className="flex flex-wrap gap-2">
                {recipe.preferences.map((pref, index) => (
                  <span
                    key={index}
                    className="badge-cartoon bg-cartoon-purple text-gray-800 border-2 border-white"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDetails;
