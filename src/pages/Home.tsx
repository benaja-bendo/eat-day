import RecipeCard from '../components/RecipeCard';
import { useRecipesQuery } from '../features/recipes/hooks';
import { useRecipeFilters } from '../features/recipes/store';

export default function Home() {
  const { data: recipes, isLoading, error } = useRecipesQuery();
  const { showFavorites, setShowFavorites } = useRecipeFilters();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load recipes</p>;

  const list = showFavorites ? recipes.filter((r) => r.favorite) : recipes;

  return (
    <div className="p-4">
      <button
        className="mb-4 rounded bg-blue-500 px-2 py-1 text-white"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        {showFavorites ? 'Show All' : 'Show Favorites'}
      </button>
      <div className="grid gap-4">
        {list.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
