export interface Ingredient {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  unit: string;
  defaultServing: number;
}

export interface MealIngredient {
  ingredient: Ingredient;
  serving: number;
}

export type MealName = 'breakfast' | 'lunch' | 'dinner';
