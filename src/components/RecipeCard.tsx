import type { Recipe } from '../features/recipes/types';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <div className="rounded border p-4 shadow">
      <h2 className="text-lg font-bold">{recipe.name}</h2>
      <p className="text-sm">{recipe.description}</p>
    </div>
  );
}
