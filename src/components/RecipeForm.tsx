import React, { useState } from 'react';
import type { Recipe, Ingredient } from '../features/recipes/types';
import { playClick, playSuccess, playError, playSoundIfEnabled } from '../utils/sound';
import { shakeElement, bounceElement, pulseElement, wiggleElement, createConfettiEffect } from '../utils/animations';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Composant formulaire pour créer ou éditer une recette
 * Gère tous les champs de la recette avec validation
 */
export const RecipeForm: React.FC<RecipeFormProps> = ({
  recipe,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  // États du formulaire
  const [name, setName] = useState(recipe?.name || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients || [{ name: '', quantity: '' }]
  );
  const [occasions, setOccasions] = useState<string[]>(recipe?.occasions || []);
  const [preferences, setPreferences] = useState<string[]>(recipe?.preferences || []);
  const [isFavorite, setIsFavorite] = useState(recipe?.favorite || false);
  
  // Options prédéfinies
  const occasionOptions = [
    'Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation',
    'Apéritif', 'Dessert', 'Brunch', 'Goûter'
  ];
  
  const preferenceOptions = [
    'Végétarien', 'Végétalien', 'Sans gluten', 'Sans lactose',
    'Faible en calories', 'Riche en protéines', 'Rapide', 'Facile'
  ];

  /**
   * Ajoute un nouvel ingrédient vide
   */
  const addIngredient = (event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    bounceElement(button);
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  /**
   * Supprime un ingrédient par index
   */
  const removeIngredient = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    wiggleElement(button);
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  /**
   * Met à jour un ingrédient spécifique
   */
  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updatedIngredients = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updatedIngredients);
  };

  /**
   * Gère la sélection/désélection des occasions
   */
  const toggleOccasion = (occasion: string, event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    pulseElement(button);
    setOccasions(prev => 
      prev.includes(occasion)
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  /**
   * Gère la sélection/désélection des préférences
   */
  const togglePreference = (preference: string, event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    pulseElement(button);
    setPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  /**
   * Valide le formulaire avant soumission
   */
  const validateForm = (formElement?: HTMLFormElement): boolean => {
    if (!name.trim()) {
      playSoundIfEnabled(playError);
      if (formElement) shakeElement(formElement);
      alert('Le nom de la recette est requis');
      return false;
    }
    
    if (!description.trim()) {
      playSoundIfEnabled(playError);
      if (formElement) shakeElement(formElement);
      alert('La description est requise');
      return false;
    }
    
    const validIngredients = ingredients.filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      playSoundIfEnabled(playError);
      if (formElement) shakeElement(formElement);
      alert('Au moins un ingrédient est requis');
      return false;
    }
    
    return true;
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    
    if (!validateForm(form)) return;
    
    playSoundIfEnabled(playSuccess);
    createConfettiEffect(form);
    
    // Filtre les ingrédients vides
    const validIngredients = ingredients.filter(ing => ing.name.trim());
    
    const recipeData = {
      name: name.trim(),
      description: description.trim(),
      ingredients: validIngredients,
      occasions,
      preferences,
      favorite: isFavorite
    };
    
    onSubmit(recipeData);
  };

  /**
   * Gère l'annulation du formulaire
   */
  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    wiggleElement(button);
    onCancel();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {recipe ? 'Modifier la recette' : 'Nouvelle recette'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la recette */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la recette *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Salade César"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Décrivez votre recette..."
            required
          />
        </div>

        {/* Ingrédients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingrédients *
          </label>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="Nom de l'ingrédient 🌿"
                  className="input-cartoon flex-1 text-hand"
                />
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="Quantité ⚖️"
                  className="input-cartoon w-24 text-hand"
                />

                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => removeIngredient(index, e)}
                    className="px-3 py-2 bg-cartoon-red text-white rounded-hand hover:bg-red-600 transition-all duration-300 hover:scale-110 hover:animate-wiggle shadow-hand-drawn border-2 border-white"
                  >
                    <span className="text-lg">🗑️</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-4 px-6 py-3 bg-cartoon-green text-white rounded-hand hover:bg-green-600 transition-all duration-300 hover:scale-105 hover:animate-bounce-gentle shadow-hand-drawn border-2 border-white font-cartoon"
          >
            <span className="text-lg mr-2">➕</span>
            Ajouter un ingrédient
          </button>
        </div>

        {/* Occasions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occasions
          </label>
          <div className="flex flex-wrap gap-2">
            {occasionOptions.map((occasion) => (
              <button
                key={occasion}
                type="button"
                onClick={(e) => toggleOccasion(occasion, e)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  occasions.includes(occasion)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {occasion}
              </button>
            ))}
          </div>
        </div>

        {/* Préférences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Préférences alimentaires
          </label>
          <div className="flex flex-wrap gap-2">
            {preferenceOptions.map((preference) => (
              <button
                key={preference}
                type="button"
                onClick={(e) => togglePreference(preference, e)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  preferences.includes(preference)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
        </div>

        {/* Favori */}
        <div className="flex items-center justify-center p-4 bg-cartoon-yellow bg-opacity-20 rounded-hand border-2 border-cartoon-yellow border-dashed">
          <input
            type="checkbox"
            id="favorite"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
            className="mr-3 h-5 w-5 text-cartoon-red focus:ring-cartoon-red border-gray-300 rounded scale-125"
          />
          <label htmlFor="favorite" className="text-base font-cartoon font-medium text-gray-700 flex items-center cursor-pointer">
            <span className="text-2xl mr-2 animate-bounce-gentle">💖</span>
            Marquer comme favori
          </label>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-center space-x-6 pt-6 border-t-2 border-cartoon-yellow border-dashed">
          <button
            type="button"
            onClick={(e) => handleCancel(e)}
            disabled={isLoading}
            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-hand hover:bg-gray-100 transition-all duration-300 hover:scale-105 font-cartoon shadow-hand-drawn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg mr-2">❌</span>
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-cartoon px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed font-cartoon text-gray-800 hover:animate-bounce-gentle"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enregistrement...
              </>
            ) : (
              <>
                <span className="text-lg mr-2">{recipe ? '✏️' : '🍳'}</span>
                {recipe ? 'Modifier' : 'Créer'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;