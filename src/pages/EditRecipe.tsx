import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { RecipeForm } from '../components/RecipeForm';
import { useRecipeQuery, useUpdateRecipeMutation } from '../features/recipes/hooks';
import type { Recipe } from '../features/recipes/types';
import { playSuccess, playError } from '../utils/sound';

/**
 * Page pour éditer une recette existante
 */
export const EditRecipe: React.FC = () => {
  const { id } = useParams();
  const recipeId = Number(id);
  const { data: recipe, isLoading: isLoadingRecipe, error } = useRecipeQuery(recipeId);
  const updateRecipeMutation = useUpdateRecipeMutation();
  const navigate = useNavigate();

  /**
   * Gère la soumission du formulaire de modification de recette
   */
  const handleSubmit = async (recipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
    if (!recipe) return;
    
    try {
      await updateRecipeMutation.mutateAsync({
        id: recipe.id,
        recipe: recipeData,
      });
      playSuccess();
      navigate('/');
    } catch (error) {
      playError();
      console.error('Erreur lors de la modification de la recette:', error);
    }
  };

  /**
   * Gère l'annulation
   */
  const handleCancel = () => {
    navigate('/');
  };

  // Affichage du chargement
  if (isLoadingRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cartoon-yellow via-cartoon-orange to-cartoon-pink paper-texture py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16 card-cartoon">
            <span className="text-6xl animate-spin mb-4">⏳</span>
            <span className="text-xl font-cartoon text-gray-600 text-hand">Chargement de la recette magique...</span>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cartoon-yellow via-cartoon-orange to-cartoon-pink paper-texture py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-6 py-3 bg-cartoon-blue text-white rounded-hand hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon mb-6"
            >
              <span className="text-xl mr-2">🏠</span>
              Retour aux recettes
            </button>

            <div className="card-cartoon bg-cartoon-red bg-opacity-10 p-8">
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl mb-4 animate-wiggle">😵</span>
                <h3 className="text-xl font-cartoon text-red-800 mb-4 text-hand">
                  Erreur de chargement
                </h3>
                <p className="text-lg font-cartoon text-red-700 text-hand">
                  Impossible de charger la recette. Elle n'existe peut-être plus ou une erreur s'est produite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cartoon-yellow via-cartoon-orange to-cartoon-pink paper-texture py-8">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-6 py-3 bg-cartoon-blue text-white rounded-hand hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon mb-4"
          >
            <span className="text-xl mr-2">🏠</span>
            Retour aux recettes
          </button>
          <h1 className="text-4xl font-cartoon text-gray-900 text-hand mb-4">
            <span className="text-3xl mr-3">✏️</span>
            Modifier la recette
          </h1>
          <p className="text-lg font-cartoon text-gray-700 text-hand">
            Modifiez les informations de votre recette "{recipe.name}".
          </p>
        </div>

        {/* Formulaire */}
        <RecipeForm
          recipe={recipe}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateRecipeMutation.isPending}
        />

        {/* Message d'erreur */}
        {updateRecipeMutation.isError && (
          <div className="mt-6 card-cartoon bg-cartoon-red bg-opacity-10 p-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl mb-3 animate-wiggle">😵</span>
              <h3 className="text-lg font-cartoon text-red-800 mb-2 text-hand">
                Erreur lors de la modification
              </h3>
              <p className="font-cartoon text-red-700 text-hand">
                Une erreur s'est produite lors de la modification de la recette. 
                Veuillez réessayer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRecipe;