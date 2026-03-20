export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  amharic: string;
  imageUri: any;
  category:
    | "stews-wots"
    | "meat-fried-tibs"
    | "legumes-yetsom"
    | "vegetables-atkilt"
    | "cheese-breads"
    | "snacks-breakfast"
    | "drinks"
    | "regional-specialties";
  difficulty: "easy" | "medium" | "hard";
  time: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  culturalInsight: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: string[];
  color: string;
  pairsWith?: string[];
}

export type UnitSystem = "metric" | "imperial";
