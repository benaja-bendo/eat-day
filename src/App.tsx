import { useState } from 'react';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import type { Recipe } from './features/recipes/types';

type View =
  | { type: 'home' }
  | { type: 'add' }
  | { type: 'edit'; recipe: Recipe };

export default function App() {
  const [view, setView] = useState<View>({ type: 'home' });

  if (view.type === 'add') {
    return (
      <AddRecipe
        onCancel={() => setView({ type: 'home' })}
        onSuccess={() => setView({ type: 'home' })}
      />
    );
  }

  if (view.type === 'edit') {
    return (
      <EditRecipe
        recipeId={view.recipe.id}
        onCancel={() => setView({ type: 'home' })}
        onSuccess={() => setView({ type: 'home' })}
      />
    );
  }

  return (
    <Home
      onAddRecipe={() => setView({ type: 'add' })}
      onEditRecipe={(recipe) => setView({ type: 'edit', recipe })}
    />
  );
}
