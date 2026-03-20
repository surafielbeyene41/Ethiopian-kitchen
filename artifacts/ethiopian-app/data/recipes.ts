import { Recipe, Ingredient, RecipeStep, UnitSystem } from "./recipe-types";
import { STEW_RECIPES } from "./recipes/stews";
import { TIBS_RECIPES } from "./recipes/tibs";
import { YETSOM_RECIPES } from "./recipes/yetsom";
import { ATKILT_RECIPES } from "./recipes/atkilt";
import { BREAD_RECIPES } from "./recipes/breads";
import { BREAKFAST_RECIPES } from "./recipes/breakfast";
import { DRINK_RECIPES } from "./recipes/drinks";
import { REGIONAL_RECIPES } from "./recipes/regional";

// Re-export types for backward compatibility
export { Recipe, Ingredient, RecipeStep, UnitSystem };

export const RECIPES: Recipe[] = [
  ...STEW_RECIPES,
  ...TIBS_RECIPES,
  ...YETSOM_RECIPES,
  ...ATKILT_RECIPES,
  ...BREAD_RECIPES,
  ...BREAKFAST_RECIPES,
  ...DRINK_RECIPES,
  ...REGIONAL_RECIPES,
];

export const CATEGORIES = [
  { id: "stews-wots", label: "Meat & Poultry Stews (Wots)", icon: "fire", color: "#C8102E" },
  { id: "meat-fried-tibs", label: "Sautéed & Fried Meat (Tibs)", icon: "restaurant", color: "#4E342E" },
  { id: "legumes-yetsom", label: "Legume & Lentil Stews (Yetsom)", icon: "eco", color: "#F57F17" },
  { id: "vegetables-atkilt", label: "Vegetable Dishes (Atkilt)", icon: "leaf", color: "#2E7D32" },
  { id: "cheese-breads", label: "Cheese & Breads", icon: "pizza", color: "#8D6E63" },
  { id: "snacks-breakfast", label: "Snacks & Breakfast", icon: "sunny", color: "#D84315" },
  { id: "drinks", label: "Traditional Drinks", icon: "wine", color: "#3E2723" },
  { id: "regional-specialties", label: "Regional Specialties", icon: "map", color: "#EFEBE9" },
];

export const UNIT_CONVERSIONS = {
  metric: {
    weight: "g",
    volume: "ml",
    temp: "C",
  },
  imperial: {
    weight: "oz",
    volume: "fl oz",
    temp: "F",
  },
};

export const convertIngredient = (
  amount: number,
  unit: string,
  system: UnitSystem,
  baseServings: number,
  targetServings: number
): { value: string; unit: string } => {
  const scaledAmount = (amount * targetServings) / baseServings;
  
  if (system === "metric") {
    return {
      value: scaledAmount % 1 === 0 ? String(scaledAmount) : scaledAmount.toFixed(1),
      unit: unit,
    };
  }

  // Basic conversion to Imperial
  let finalAmount = scaledAmount;
  let finalUnit = unit;

  if (unit.toLowerCase() === "g" || unit.toLowerCase() === "grams") {
    finalAmount = scaledAmount * 0.035274;
    finalUnit = "oz";
  } else if (unit.toLowerCase() === "ml" || unit.toLowerCase() === "milliliters") {
    finalAmount = scaledAmount * 0.033814;
    finalUnit = "fl oz";
  } else if (unit.toLowerCase() === "cups") {
    // Already in a potentially imperial unit, but keep it
    finalUnit = "cups";
  }

  return {
    value: finalAmount % 1 === 0 ? String(finalAmount) : finalAmount.toFixed(1),
    unit: finalUnit,
  };
};
