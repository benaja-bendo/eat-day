import { useNavigate } from 'react-router';
import RecipeCard from '../components/RecipeCard';
import { useRecipesQuery } from '../features/recipes/hooks';
import { useRecipeFilters } from '../features/recipes/store';
import type { Recipe } from '../features/recipes/types';

export default function Home() {
  const { data: recipes, isLoading, error } = useRecipesQuery();
  const { showFavorites } = useRecipeFilters();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load recipes</p>;

  const list = showFavorites ? recipes?.filter((r) => r.favorite) : recipes;

  return (
    <div>
      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-cartoon p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <span className="text-4xl animate-bounce-gentle">📊</span>
              </div>
              <div className="ml-4 text-center">
                <p className="text-base font-cartoon font-medium text-gray-600">Total des recettes</p>
                <p className="text-3xl font-cartoon font-bold text-gray-900 text-hand">{(recipes?.length ?? 0)}</p>
              </div>
            </div>
          </div>
          <div className="card-cartoon p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <span className="text-4xl animate-pulse-soft">💖</span>
              </div>
              <div className="ml-4 text-center">
                <p className="text-base font-cartoon font-medium text-gray-600">{showFavorites ? 'Favoris affichés' : 'Toutes affichées'}</p>
                <p className="text-3xl font-cartoon font-bold text-cartoon-red text-hand">{list?.length || 0}</p>
              </div>
            </div>
          </div>
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16 card-cartoon">
            <span className="text-6xl animate-spin mb-4">⏳</span>
            <div className="text-xl font-cartoon text-gray-600 text-hand">Chargement des recettes magiques...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-16 card-cartoon bg-cartoon-red bg-opacity-10">
            <span className="text-6xl mb-4 animate-wiggle">😵</span>
            <div className="text-xl font-cartoon text-red-600 text-hand">Oups ! Erreur lors du chargement</div>
          </div>
        ) : (list?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 card-cartoon">
            <span className="text-8xl mb-6 animate-bounce-gentle">🍽️</span>
            <h3 className="text-2xl font-cartoon font-bold text-gray-900 mb-4 text-hand">
              {showFavorites ? 'Aucun favori trouvé' : 'Aucune recette trouvée'}
            </h3>
            <p className="text-lg font-cartoon text-gray-600 mb-6 text-center">
              {showFavorites ? 'Ajoutez des recettes à vos favoris ! ⭐' : 'Commencez par ajouter votre première recette magique ! ✨'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list?.map((recipe, index) => (
              <div key={recipe.id} className="animate-float" style={{animationDelay: `${index * 0.1}s`}}>
                <RecipeCard
                  recipe={recipe}
                  onEdit={(r: Recipe) => navigate(`/edit/${r.id}`)}
                />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
