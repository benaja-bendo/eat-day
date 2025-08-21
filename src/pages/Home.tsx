import RecipeCard from '../components/RecipeCard';
import { useRecipesQuery } from '../features/recipes/hooks';
import { useRecipeFilters } from '../features/recipes/store';

export default function Home() {
  const { data: recipes, isLoading, error } = useRecipesQuery();
  const { showFavorites, setShowFavorites } = useRecipeFilters();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load recipes</p>;

  const list = showFavorites ? recipes?.filter((r) => r.favorite) : recipes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cartoon-yellow via-cartoon-orange to-cartoon-pink paper-texture">
      {/* Header */}
      <header className="bg-white shadow-cartoon border-b-4 border-cartoon-blue border-hand-drawn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-4xl font-cartoon font-bold text-gray-900 text-hand animate-bounce-gentle">
                <span className="text-5xl mr-3 animate-float">🍽️</span>
                Eat Day
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 card-cartoon p-6">
          <h2 className="text-2xl font-cartoon font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <span className="text-3xl mr-3 animate-bounce-gentle">🔍</span>
            Filtrer vos recettes
          </h2>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <button
              className="px-6 py-3 bg-cartoon-purple text-white rounded-hand hover:bg-purple-600 transition-all duration-300 hover:scale-105 hover:animate-wiggle shadow-hand-drawn border-2 border-white font-cartoon"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <span className="text-lg mr-2">{showFavorites ? '📋' : '❤️'}</span>
              {showFavorites ? 'Toutes les recettes' : 'Mes favoris'}
            </button>
          </div>
        </div>

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
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
