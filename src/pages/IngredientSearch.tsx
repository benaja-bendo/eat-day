import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useRecipesQuery } from '../features/recipes/hooks';
import type { Recipe } from '../features/recipes/types';

export default function IngredientSearch() {
  const { data: recipes = [] } = useRecipesQuery();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Recipe | null>(null);

  const handleSearch = () => {
    const ingredients = query
      .toLowerCase()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const match = recipes.find((r) =>
      ingredients.every((ing) =>
        r.ingredients.some((i) => i.name.toLowerCase().includes(ing))
      )
    );
    setResult(match || null);
  };

  return (
    <div className="card-cartoon p-8 space-y-4">
      <h2 className="text-3xl font-cartoon font-bold text-gray-800 text-hand">
        Recherche par ingrédients
      </h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex: tomate, fromage"
        className="w-full p-2 border-2 border-cartoon-yellow rounded-hand font-cartoon"
      />
      <button
        onClick={handleSearch}
        className="bg-cartoon-purple text-white px-6 py-3 rounded-hand hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon"
      >
        Chercher
      </button>
      {result ? (
        <RecipeCard recipe={result} />
      ) : (
        <p className="text-gray-600 font-cartoon text-hand">
          Aucune recette trouvée.
        </p>
      )}
    </div>
  );
}
