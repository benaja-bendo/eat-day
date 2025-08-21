import React from 'react';
import { RecipeForm } from '../components/RecipeForm';
import { useCreateRecipeMutation } from '../features/recipes/hooks';
import type { Recipe } from '../features/recipes/types';
import { playSuccess, playError } from '../utils/sound';

interface AddRecipeProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Page pour ajouter une nouvelle recette
 * Utilise le composant RecipeForm et le hook useCreateRecipeMutation
 */
export const AddRecipe: React.FC<AddRecipeProps> = ({ onSuccess, onCancel }) => {
  const createRecipeMutation = useCreateRecipeMutation();

  /**
   * Gère la soumission du formulaire de création de recette
   */
  const handleSubmit = async (recipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
    try {
      await createRecipeMutation.mutateAsync(recipeData);
      playSuccess();
      onSuccess?.();
    } catch (error) {
      playError();
      console.error('Erreur lors de la création de la recette:', error);
    }
  };

  /**
   * Gère l'annulation
   */
  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cartoon-yellow via-cartoon-orange to-cartoon-pink paper-texture py-8">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          {onCancel && (
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-6 py-3 bg-cartoon-blue text-white rounded-hand hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon mb-4"
            >
              <span className="text-xl mr-2">🏠</span>
              Retour aux recettes
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 font-cartoon">
            Ajouter une nouvelle recette
          </h1>
          <p className="text-gray-600 mt-2 font-cartoon">
            Créez une nouvelle recette en remplissant le formulaire ci-dessous.
          </p>
        </div>

        {/* Formulaire */}
        <RecipeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createRecipeMutation.isPending}
        />

        {/* Message d'erreur */}
        {createRecipeMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-hand shadow-hand-drawn">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 font-cartoon">
                  Erreur lors de la création
                </h3>
                <div className="mt-2 text-sm text-red-700 font-cartoon">
                  <p>
                    Une erreur s'est produite lors de la création de la recette. 
                    Veuillez réessayer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRecipe;