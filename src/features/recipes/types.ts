export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  image?: string;
  ingredients: Ingredient[];
  occasions: string[];
  preferences: string[];
  favorite: boolean;
  createdAt: string;
}

export interface MealCalendar {
  todayRecipeId: number | null;
  schedule: Record<string, number[]>;
}
